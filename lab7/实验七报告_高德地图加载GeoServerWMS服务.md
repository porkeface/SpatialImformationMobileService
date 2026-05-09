# 实验七 高德地图加载 GeoServer WMS 服务

## 一、实验目的及要求

### 实验目的

通过本实验的学习，了解和掌握基于高德地图 Android SDK 加载 GeoServer WMS 服务的基本知识，训练和培养在高德地图 Android 客户端上加载和显示服务端地图数据服务的技能。

### 实验要求

1. 掌握服务器端 GeoServer WMS 网络地图服务的创建与发布；
2. 理解和掌握高德地图 Android 客户端加载 WMS 数据的方法；
3. 能够将 WMS 地图以覆盖物的形式叠加展示在高德地图上。

## 二、实验设备（环境）及要求

| 类别 | 名称/版本 |
|------|-----------|
| 操作系统 | Windows 11 |
| 开发工具 | Android Studio |
| 编程语言 | Java (JDK 11) |
| 地图 SDK | 高德地图 2D SDK 6.0.0、高德定位 SDK 6.4.9 |
| GIS 服务 | GeoServer（Docker 容器，kartoza/geoserver:latest，端口 7080） |
| 浏览器 | Chrome（用于验证 GeoServer WMS 服务） |
| 测试设备 | Android 模拟器 / 真机 |

## 三、实验内容与步骤

### 3.1 GeoServer WMS 服务发布

#### 步骤一：启动 GeoServer

本实验使用 Docker 部署 GeoServer，执行以下命令启动容器：

```bash
docker run -d --name geoserver -p 7080:8080 kartoza/geoserver:latest
```

启动完成后，在浏览器中访问 `http://localhost:7080/geoserver`，使用管理员账号（admin）登录 GeoServer 管理界面。

#### 步骤二：创建工作区与发布图层

1. 在 GeoServer 管理界面中，进入 **工作区（Workspaces）** 页面，创建工作区 `lab2`；
2. 进入 **数据存储（Data Stores）** 页面，添加数据存储，类型选择 **Shapefile**，指向已有的厦门区域 SHP 文件（坐标系为 EPSG:4326）；
3. 进入 **图层（Layers）** 页面，找到已添加的图层 `xiamen`，点击 **发布（Publish）**；
4. 在图层编辑界面中，设置 SRS 信息：
   - **定义的 SRS**：`EPSG:4326`
   - **请求的 SRS**：`EPSG:3857`（允许 GeoServer 动态重投影）
5. 点击"从数据中计算"获取经纬度边框范围，保存发布。

#### 步骤三：验证 WMS 服务

进入 **Layer Preview** 页面，选择 `lab2:xiamen` 图层，格式选择 `jpeg` 或 `png`，在浏览器中确认地图能正常显示。同时记录 WMS 服务地址备用：

```
http://localhost:7080/geoserver/lab2/wms
```

### 3.2 Android 项目开发

#### 步骤四：创建 Android 项目并配置依赖

在 Android Studio 中创建新项目 `lab7`，修改 `app/build.gradle.kts` 添加高德地图 SDK 依赖：

```kotlin
dependencies {
    implementation("com.amap.api:map2d:6.0.0")
    implementation("com.amap.api:location:6.4.9")
    // ... 其他依赖
}
```

#### 步骤五：配置 AndroidManifest.xml

添加网络权限和高德 API Key：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

<application android:usesCleartextTraffic="true">
    <meta-data
        android:name="com.amap.api.v2.apikey"
        android:value="19ddcdf9012ddb44dcaf64625685bca6" />
</application>
```

#### 步骤六：编写布局文件

在 `activity_main.xml` 中添加高德地图 MapView 控件：

```xml
<com.amap.api.maps2d.MapView
    android:id="@+id/map_view"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

#### 步骤七：实现 WMS 瓦片加载核心代码

在 `MainActivity.java` 中实现地图初始化与 WMS 瓦片加载。核心思路为：

1. 根据瓦片的行列号（x, y）和缩放级别（zoom），在墨卡托投影系中计算瓦片的地理范围（bbox）；
2. 将瓦片范围从米转换为经纬度；
3. 利用高德坐标转换工具计算 WGS84 与高德坐标之间的偏移差；
4. 修正坐标后拼接 WMS GetMap 请求 URL，获取瓦片图片。

**WMS 图层加载核心代码：**

```java
private void addWmsLayer() {
    wmsUrl = "http://192.168.50.31:7080/geoserver/lab2/wms"
            + "?&layers=lab2%3Axiamen"
            + "&format=image%2Fpng"
            + "&TRANSPARENT=TRUE"
            + "&service=WMS"
            + "&version=1.1.0"
            + "&request=GetMap"
            + "&STYLES="
            + "&srs=EPSG%3A3857"
            + "&WIDTH=256"
            + "&HEIGHT=256"
            + "&bbox=";

    UrlTileProvider tileProvider = new UrlTileProvider(tileSize, tileSize) {
        @Override
        public URL getTileUrl(int x, int y, int zoom) {
            try {
                String url = wmsUrl + tileBounds(x, y, zoom);
                return new URL(url);
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
            return null;
        }
    };

    scopeTileOverlay = aMap.addTileOverlay(
            new TileOverlayOptions().tileProvider(tileProvider)
    );
}
```

**瓦片范围计算与坐标转换代码：**

```java
private String tileBounds(int tx, int ty, int zoom) {
    double minX = pixelsToMeters(tx * tileSize, zoom);
    double maxY = -pixelsToMeters(ty * tileSize, zoom);
    double maxX = pixelsToMeters((tx + 1) * tileSize, zoom);
    double minY = -pixelsToMeters((ty + 1) * tileSize, zoom);

    // 转换成经纬度
    minX = metersToLon(minX);
    minY = metersToLat(minY);
    maxX = metersToLon(maxX);
    maxY = metersToLat(maxY);

    // 坐标转换：WGS84 转高德坐标，计算偏移差
    CoordinateConverter converter = new CoordinateConverter(this);
    converter.from(CoordinateConverter.CoordType.GPS);
    try {
        converter.coord(new DPoint(minY, minX));
        DPoint min = converter.convert();
        converter.coord(new DPoint(maxY, maxX));
        DPoint max = converter.convert();

        minX = lonToMeters(-min.getLongitude() + 2 * minX);
        minY = latToMeters(-min.getLatitude() + 2 * minY);
        maxX = lonToMeters(-max.getLongitude() + 2 * maxX);
        maxY = latToMeters(-max.getLatitude() + 2 * maxY);
    } catch (Exception e) {
        e.printStackTrace();
    }

    return minX + "," + minY + "," + maxX + "," + maxY;
}
```

**坐标转换辅助方法：**

```java
// 像素转墨卡托坐标（米）
private double pixelsToMeters(int p, int zoom) {
    return p * resolution(zoom) - originShift;
}

// 计算某缩放级别的分辨率
private double resolution(int zoom) {
    return initialResolution / (Math.pow(2, zoom));
}

// 墨卡托米 → 经度
private double metersToLon(double mx) {
    return (mx / originShift) * 180.0;
}

// 墨卡托米 → 纬度
private double metersToLat(double my) {
    double lat = (my / originShift) * 180.0;
    lat = 180.0 / Math.PI *
          (2 * Math.atan(Math.exp(lat * Math.PI / 180.0)) - Math.PI / 2.0);
    return lat;
}

// 经度 → 墨卡托米
private double lonToMeters(double lon) {
    return lon * originShift / 180.0;
}

// 纬度 → 墨卡托米
private double latToMeters(double lat) {
    double my = Math.log(Math.tan((90 + lat) * Math.PI / 360.0))
                / (Math.PI / 180.0);
    return my * originShift / 180.0;
}
```

#### 步骤八：运行与测试

将项目编译运行到 Android 模拟器或真机上，观察地图显示效果。地图中心设置在厦门区域（纬度 24.65，经度 118.10），缩放级别为 10。

## 四、实验结果

应用运行后，高德地图正常加载显示，GeoServer 发布的 `lab2:xiamen` WMS 图层以半透明覆盖物的形式叠加在高德底图上。厦门区域的多边形图层数据清晰可见，图层以外的区域保持透明，不影响底图的正常浏览。地图支持缩放和平移操作，WMS 瓦片会随地图操作动态加载更新。

**运行效果说明：**
- 高德底图正常显示中国地图
- 厦门区域叠加了 GeoServer 发布的 xiamen 矢量图层
- 图层使用 PNG 格式 + 透明背景，未覆盖区域底图正常可见
- 缩放和拖动地图时，WMS 瓦片实时请求加载

## 五、分析与讨论

### 5.1 WMS 加载原理分析

本实验的核心是利用高德地图 SDK 提供的 `UrlTileProvider` 接口加载 WMS 服务。高德地图以 256×256 像素的瓦片为单位渲染地图，每个瓦片根据其行列号（x, y）和缩放级别（zoom）可以计算出对应的地理范围（bbox）。将 bbox 作为参数拼接到 WMS GetMap 请求中，即可获取该区域的地图图片。

坐标转换流程如下：
1. 根据瓦片的像素坐标计算其在 Web 墨卡托投影（EPSG:3857）下的范围（单位：米）；
2. 将墨卡托坐标转换为 WGS84 经纬度（EPSG:4326）；
3. 利用高德的 `CoordinateConverter` 计算 WGS84 坐标与高德坐标之间的偏移量；
4. 在原始坐标基础上叠加偏移量，修正为高德地图实际使用的坐标。

### 5.2 坐标系问题

高德地图使用的是 GCJ-02 坐标系（火星坐标系），与 WGS84 存在偏移。如果不进行坐标修正，WMS 图层会与底图产生几百米的错位。本实验通过 `CoordinateConverter` 工具类动态计算偏移差，实现了 WMS 图层与高德底图的精确对齐。

### 5.3 图片格式选择

实验中发现使用 JPEG 格式（`image/jpeg`）时，WMS 图层没有数据的区域会显示为白色，完全遮挡了底层的高德地图。这是因为 JPEG 格式不支持透明通道。改用 PNG 格式（`image/png`）并设置 `TRANSPARENT=TRUE` 参数后，无数据区域变为透明，底图得以正常显示。

### 5.4 GeoServer 动态重投影

本实验中 SHP 数据源的原始坐标系为 EPSG:4326，但 WMS 请求指定 `srs=EPSG:3857`。GeoServer 支持在服务端进行动态重投影，客户端无需关心数据源的原始坐标系，只需在请求中指定目标 SRS 即可。这大大简化了客户端的开发工作。

### 5.5 注意事项

1. **网络权限**：AndroidManifest 中必须声明 `INTERNET` 权限，否则无法访问 GeoServer；
2. **明文 HTTP**：由于 GeoServer 使用 HTTP 协议，需要在 `<application>` 标签中设置 `android:usesCleartextTraffic="true"`，否则 Android 9+ 会阻止请求；
3. **模拟器地址**：Android 模拟器中访问宿主机应使用 `10.0.2.2`，真机测试时需替换为本机实际 IP 地址；
4. **EPSG:3857 限制**：高德地图 SDK 仅支持 EPSG:3857 坐标系的 WMS 图层，GeoServer 发布时需确保支持该投影。
