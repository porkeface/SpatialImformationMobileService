# PPT详细大纲：基于高德SDK的Android空间信息服务APP实现

## 项目基本信息
- **项目路径**：`D:/code Project/SpatialImformationMobileService/lab5`
- **包名**：`com.example.spatial`
- **主Activity**：`MainActivity.java`（372行）
- **布局文件**：`activity_main.xml`
- **核心SDK**：`com.amap.api.maps2d`（高德2D地图）、`com.amap.api.location`（高德定位）
- **Git提交历史**：
  - `cce69e5` 重新上传lab4
  - `919e119` 修改了包名
  - `36de893` 修改了包名，重新使用了合适的高德Android服务key
  - `4114407` 优化了一下地址获取
  - `94ca64b` 完成lab5

---

## 配色与字体规范
### 配色方案（Ocean Gradient）
| 用途 | 颜色值 | 说明 |
|------|--------|------|
| 主色 | `#065A82` | 深蓝，用于标题栏、重点数字 |
| 辅色 | `#1C7293` | 青色，用于副标题、装饰线 |
| 强调色 | `#21295C` | 午夜蓝，用于封面/总结页背景 |
| 白色 | `#FFFFFF` | 文字、卡片背景 |
| 浅灰 | `#F2F2F2` | 页面背景、卡片背景 |
| 深色文字 | `#1E293B` | 正文文字 |
| 浅色文字 | `#64748B` | 次要说明文字 |
| 警告色 | `#E53935` | 踩坑经验卡片边框 |
| 成功色 | `#2E7D32` | 解决方案文字 |

### 字体规范
| 用途 | 字体 | 大小 |
|------|------|------|
| 封面主标题 | Arial Black | 44pt |
| 封面副标题 | Arial Black | 36pt |
| 页面标题 | Arial Black | 24-28pt |
| 卡片标题 | Arial Black | 14-16pt |
| 正文 | Calibri | 12-14pt |
| 代码 | Consolas | 9pt |
| 说明文字 | Calibri 斜体 | 11-13pt |

---

## 第1页：封面
**布局**：深色背景（`#21295C`），左侧细竖线装饰（`#1C7293`，宽0.15英寸），右上角半透明圆形装饰，左下角半透明圆形装饰

**内容**：
- 主标题（44pt，白色，加粗）：`实验四 & 实验五`
- 副标题（36pt，白色，加粗）：`整合实现分享`
- 说明文字（18pt，`#1C7293`，斜体）：`基于高德SDK的Android空间信息服务APP`
- 分割线（`#1C7293`，宽1.5pt，居中，长度5英寸）
- 个人信息区（14pt，`#F2F2F2`，居中）：
  - 姓名：porkeface
  - 学号：（请自行填写）
  - 日期：2026/04/27

---

## 第2页：项目整体架构
**目标**：让听众一眼看懂lab5是怎么把实验四和实验五整合的

**布局**：白色背景，左侧`#1C7293`竖线装饰

### 项目结构
```
lab5/
├── app/
│   ├── src/main/
│   │   ├── java/com/example/spatial/
│   │   │   └── MainActivity.java    ← 唯一Activity，整合所有功能（372行）
│   │   ├── res/layout/
│   │   │   └── activity_main.xml   ← 全屏地图+悬浮UI布局
│   │   ├── AndroidManifest.xml      ← 权限声明+Key配置
│   │   └── res/values/strings.xml  ← 字符串资源
│   └── build.gradle                 ← 高德SDK依赖
```

### 功能模块划分
```
┌─────────────────────────────────────┐
│           MainActivity (整合容器)          │
├─────────────┬───────────────┬──────────────┤
│  地图模块   │  定位模块      │  UI交互模块   │
│ (高德2D SDK)│(高德定位SDK)  │(Material Design)│
└─────────────┴───────────────┴──────────────┘
```

### 实验四 vs 实验五的整合点
- **实验四提供**：地图显示能力、定位能力、地址解析能力
- **实验五提供**：空间信息展示（站点卡片）、交互设计（对话框、按钮）
- **整合方式**：所有功能在同一个MainActivity中通过按钮触发，共享地图实例和定位客户端

---

## 第3页：实验四实现详解——SDK集成与配置
**目标**：讲清楚高德SDK是怎么集成进来的

**布局**：白色背景，左侧`#065A82`竖线装饰，三栏布局

### 3.1 高德SDK依赖配置
**文件**：`app/build.gradle`

```gradle
dependencies {
    // 高德2D地图SDK
    implementation 'com.amap.api:2dmap:latest.release'
    // 高德定位SDK
    implementation 'com.amap.api:location:latest.release'
    // Material Design 3组件
    implementation 'com.google.android.material:material:1.11.0'
}
```

### 3.2 AndroidManifest权限与配置
**文件**：`AndroidManifest.xml`（第6-15行）

```xml
<!-- 地图SDK基础权限 -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
```

**关键配置**（第27-29行）：
```xml
<!-- 高德Key配置 —— 包名必须与此Key匹配！ -->
<meta-data
    android:name="com.amap.api.v2.apikey"
    android:value="@string/amap_key" />

<!-- 定位服务声明 —— 必须！否则定位失败 -->
<service android:name="com.amap.api.location.APSService" />
```

### 3.3 踩坑经验（对应git提交）
```
Git提交：36de893 "修改了包名，重新使用了合适的高德Android服务key"

踩坑原因：
  1. 最初包名为 com.example.lab4
  2. 在高德控制台申请Key时填写的package是 com.example.lab4
  3. 后来修改包名为 com.example.spatial（第31行 package声明）
  4. 导致Key与包名不匹配 → 地图空白、定位返回Error 7（Key错误）

解决方案：
  1. 登录高德控制台
  2. 修改应用包名为 com.example.spatial
  3. 或重新申请新Key并替换 strings.xml 中的 amap_key
```

---

## 第4页：实验四实现详解——地图初始化全流程
**目标**：从onCreate开始，逐行讲地图是怎么显示出来的

**布局**：白色背景，左侧`#1C7293`竖线装饰，带序号的流程说明

### 4.1 onCreate() 方法完整流程分析
**代码位置**：`MainActivity.java` 第51-75行

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);  // ① 加载布局（含MapView）

    // ② 处理系统栏（让地图全屏显示）
    ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
        Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
        return insets;  // 不消费insets，让地图延伸到系统栏下方
    });

    // ③ 获取MapView引用并创建地图
    mapView = findViewById(R.id.map_view);  // activity_main.xml第10行定义的MapView
    mapView.onCreate(savedInstanceState);        // 必须调用，触发地图生命周期

    // ④ 获取UI控件引用
    tvLocationResult = findViewById(R.id.tv_location_result);  // 定位结果文本框
    cardLocationInfo = findViewById(R.id.card_location_info);    // 定位信息卡片
    btnCloseLocation = findViewById(R.id.btn_close_location);    // 关闭按钮

    // ⑤ 默认隐藏定位信息卡片（只有定位后才显示）
    if (cardLocationInfo != null) {
        cardLocationInfo.setVisibility(View.GONE);
    }

    // ⑥ 注册权限申请器（提前准备好，用户点击时才不会卡顿）
    registerPermissionLauncher();

    // ⑦ 初始化地图（设置语言、类型、监听器）
    initMap();

    // ⑧ 初始化定位客户端（配置参数、设置回调）
    initLocationClient();
}
```

### 4.2 initMap() 方法详解
**代码位置**：第77-114行

```java
private void initMap() {
    if (aMap != null) return;  // 防止重复初始化

    aMap = mapView.getMap();  // 获取AMap实例（高德地图的核心控制类）

    // 地图基础配置
    aMap.setMapLanguage(AMap.CHINESE);      // 中文标注
    aMap.setMapType(AMap.MAP_TYPE_NORMAL);   // 默认普通地图（可切换卫星）

    // 设置Marker点击监听器
    aMap.setOnMarkerClickListener(marker -> {
        if (marker != null && marker.equals(currentMarker)) {
            cardLocationInfo.setVisibility(View.VISIBLE);  // 点击当前位置Marker → 显示信息卡片
            return false;
        }
        return false;
    });

    // 获取所有交互按钮
    btnGoSite = findViewById(R.id.btn_go_site);        // "去这里"按钮
    btnShowHistory = findViewById(R.id.btn_show_history); // "查看历史"按钮
    fabMapType = findViewById(R.id.fab_map_type);       // 地图类型切换FAB
    fabMyLocation = findViewById(R.id.fab_my_location);   // 我的位置FAB

    // 设置点击监听器（MainActivity实现View.OnClickListener接口）
    btnGoSite.setOnClickListener(this);
    btnShowHistory.setOnClickListener(this);
    fabMapType.setOnClickListener(this);
    fabMyLocation.setOnClickListener(this);
    btnCloseLocation.setOnClickListener(this);

    showTargetSite();  // 启动时直接显示目标站点
}
```

### 4.3 布局文件中的MapView定义
**文件**：`activity_main.xml` 第10-17行

```xml
<com.amap.api.maps2d.MapView
    android:id="@+id/map_view"
    android:layout_width="0dp"
    android:layout_height="0dp"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent" />
<!-- 约束布局使其充满整个屏幕 -->
```

---

## 第5页：实验四实现详解——定位功能完整实现
**目标**：讲清楚从"点击定位按钮"到"显示地址"的完整调用链

**布局**：白色背景，左侧`#065A82`竖线装饰，左中右三栏

### 5.1 定位完整调用链（流程图）
```
用户点击FAB（我的位置）
    ↓
onClick() 收到 R.id.fab_my_location
    ↓
checkPermissionAndLocate() 检查权限
    ↓
[有权限] → startLocation()
[无权限] → permissionLauncher.launch() 弹出系统权限对话框
    ↓
用户点击"允许"
    ↓
ActivityResultLauncher 回调 → startLocation()
    ↓
locationClient.startLocation() 发起定位请求
    ↓
20秒超时或定位完成
    ↓
locationListener.onLocationChanged(aMapLocation) 回调
    ↓
[成功] → updateCurrentLocationMarker() + 显示地址信息
[失败] → 显示错误码和错误信息
```

### 5.2 动态权限申请实现
**代码位置**：第116-129行 `registerPermissionLauncher()`

```java
private void registerPermissionLauncher() {
    // 使用新的Activity Result API（替代已废弃的requestPermissions）
    permissionLauncher = registerForActivityResult(
        new ActivityResultContracts.RequestMultiplePermissions(),  // 同时申请多个权限
        result -> {
            // 权限申请结果回调
            Boolean fineGranted = result.getOrDefault(Manifest.permission.ACCESS_FINE_LOCATION, false);
            Boolean coarseGranted = result.getOrDefault(Manifest.permission.ACCESS_COARSE_LOCATION, false);

            if (Boolean.TRUE.equals(fineGranted) || Boolean.TRUE.equals(coarseGranted)) {
                startLocation();  // 任一权限被授予 → 开始定位
            } else {
                tvLocationResult.setText(getString(R.string.location_permission_denied));
            }
        }
    );
}
```

**代码位置**：第151-165行 `checkPermissionAndLocate()`

```java
private void checkPermissionAndLocate() {
    // 检查当前是否已有权限
    boolean fineGranted = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) 
                            == PackageManager.PERMISSION_GRANTED;
    boolean coarseGranted = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) 
                            == PackageManager.PERMISSION_GRANTED;

    if (fineGranted || coarseGranted) {
        startLocation();  // 已有权限，直接定位
    } else {
        // 没有权限，弹出系统对话框申请
        permissionLauncher.launch(new String[] {
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        });
    }
}
```

### 5.3 定位客户端初始化
**代码位置**：第131-149行 `initLocationClient()`

```java
private void initLocationClient() {
    try {
        // 必须：高德隐私协议合规（首次调用需同意）
        AMapLocationClient.updatePrivacyShow(this, true, true);
        AMapLocationClient.updatePrivacyAgree(this, true);

        // 创建定位客户端（传入ApplicationContext，避免Activity泄漏）
        locationClient = new AMapLocationClient(getApplicationContext());

        // 配置定位参数
        locationOption = new AMapLocationClientOption();
        locationOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy); // 高精度模式
        locationOption.setOnceLocation(true);       // 单次定位（定位一次就停）
        locationOption.setNeedAddress(true);         // 需要地址信息（关键！）
        locationOption.setMockEnable(false);        // 禁用模拟定位
        locationOption.setHttpTimeOut(20000);      // 20秒超时
        locationOption.setLocationCacheEnable(false); // 禁用缓存，每次都是真实定位

        locationClient.setLocationOption(locationOption);
        locationClient.setLocationListener(locationListener); // 设置回调监听器
    } catch (Exception e) {
        tvLocationResult.setText("定位客户端初始化失败：\n" + e.getMessage());
    }
}
```

### 5.4 定位结果回调处理
**代码位置**：第231-250行 `locationListener`

```java
private final AMapLocationListener locationListener = new AMapLocationListener() {
    @Override
    public void onLocationChanged(AMapLocation aMapLocation) {
        if (aMapLocation == null) {
            tvLocationResult.setText("定位失败：返回结果为空。");
            return;
        }

        if (aMapLocation.getErrorCode() == 0) {
            // ✅ 定位成功
            updateCurrentLocationMarker(aMapLocation);              // 在地图上标记当前位置
            tvLocationResult.setText(buildLocationResult(aMapLocation)); // 构建并显示地址信息
        } else {
            // ❌ 定位失败 - 显示详细错误信息（方便调试）
            String result = "定位失败\n"
                + "错误码：" + aMapLocation.getErrorCode() + "\n"    // 如：7=Key错误
                + "错误信息：" + aMapLocation.getErrorInfo() + "\n"   // 如："Key验证失败"
                + "错误描述：" + aMapLocation.getLocationDetail();  // 更详细的错误原因
            tvLocationResult.setText(result);
        }
    }
};
```

### 5.5 地址信息构建（含空值保护）
**代码位置**：第271-284行 `buildLocationResult()`

```java
private String buildLocationResult(AMapLocation location) {
    return "定位成功\n"
        + "经度：" + location.getLongitude() + "\n"    // 如：114.164421
        + "纬度：" + location.getLatitude() + "\n"     // 如：26.575811
        + "精度：" + location.getAccuracy() + " 米\n"  // 如：15.0
        + "地址：" + buildDisplayAddress(location) + "\n" // 拼接完整地址
        + "国家：" + safe(location.getCountry()) + "\n"   // 空值保护
        + "省份：" + safe(location.getProvince()) + "\n"
        + "城市：" + safe(location.getCity()) + "\n"
        + "区县：" + safe(location.getDistrict()) + "\n"
        + "街道：" + safe(location.getStreet()) + "\n"
        + "门牌号：" + safe(location.getStreetNum()) + "\n"
        + "定位类型：" + location.getLocationType() + "\n" // 1=GPS 2=WiFi 4=基站
        + "时间：" + location.getTime();                     // 定位时间戳
}
```

**空值保护方法**（第332-334行）：
```java
private String safe(String value) {
    return value == null ? "" : value;  // null → 空字符串，避免NullPointerException
}
```

**POI/AOI智能选择**（第306-318行）：
```java
private String buildPoiOrAoi(AMapLocation location) {
    String poiName = safe(location.getPoiName());  // 优先取POI（如"xx大厦"）
    if (!poiName.isEmpty()) return poiName;

    String aoiName = safe(location.getAoiName());  // 其次取AOI（如"xx小区"）
    if (!aoiName.isEmpty()) return aoiName;

    return "";  // 都没有则返回空
}
```

---

## 第6页：实验五实现详解——空间信息展示
**目标**：讲清楚目标站点是怎么标记、信息是怎么展示的

**布局**：白色背景，左侧`#1C7293`竖线装饰，双栏代码块

### 6.1 目标站点定义与显示
**代码位置**：第33行，第177-191行

```java
// 预设目标站点坐标（这是实验五的核心数据）
private static final LatLng TARGET_SITE = new LatLng(26.575811, 114.164421);

private void showTargetSite() {
    if (aMap == null) return;

    aMap.clear();  // 清除之前的所有Marker（避免重复标记）

    // 在目标位置添加Marker
    targetMarker = aMap.addMarker(new MarkerOptions()
        .position(TARGET_SITE)                          // 设置坐标
        .title(getString(R.string.site_name))            // 如："鹅湖亭"
        .snippet(getString(R.string.site_snippet)));    // 如："江西省赣州市信丰县"

    // 移动地图视角到目标站点，缩放级别13.5（适中）
    aMap.moveCamera(CameraUpdateFactory.newLatLngZoom(TARGET_SITE, 13.5f));

    if (targetMarker != null) {
        targetMarker.showInfoWindow();  // 自动弹出信息窗口
    }
}
```

### 6.2 当前位置标记更新
**代码位置**：第252-269行

```java
private void updateCurrentLocationMarker(AMapLocation location) {
    if (aMap == null) return;

    LatLng currentLatLng = new LatLng(location.getLatitude(), location.getLongitude());

    // 移除旧的当前位置Marker（避免地图上出现多个蓝点）
    if (currentMarker != null) {
        currentMarker.remove();
    }

    // 添加新的当前位置Marker
    currentMarker = aMap.addMarker(new MarkerOptions()
        .position(currentLatLng)
        .title(getString(R.string.btn_my_location))  // "我的位置"
        .snippet(buildMarkerSnippet(location)));        // POI或AOI名称

    // 动画移动到当前位置，缩放级别16（更近）
    aMap.animateCamera(CameraUpdateFactory.newLatLngZoom(currentLatLng, 16f));

    if (currentMarker != null) {
        currentMarker.showInfoWindow();
    }
}
```

### 6.3 历史信息查询（AlertDialog）
**代码位置**：第193-199行

```java
private void showHistoryDialog() {
    new AlertDialog.Builder(this)
        .setTitle(R.string.history_title)        // 如："站点历史"
        .setMessage(R.string.site_history)        // 如："该站点建于..."（从strings.xml读取）
        .setPositiveButton(android.R.string.ok, null)  // "确定"按钮
        .show();
}
```

---

## 第7页：实验五实现详解——UI布局设计
**目标**：分析布局文件，讲解全屏地图+悬浮操作层的设计思路

**布局**：白色背景，左侧`#065A82`竖线装饰，分层框图

### 7.1 整体布局结构
**文件**：`activity_main.xml`（202行）

```
ConstraintLayout (根容器，match_parent × match_parent)
├── MapView (充满整个屏幕，作为背景层)
├── LinearLayout (右上角，垂直排列的两个FAB)
│   ├── fab_map_type (地图类型切换按钮)
│   └── fab_my_location (我的位置按钮)
├── MaterialCardView (屏幕中央，定位信息卡片)
│   └── 内部：LinearLayout → TextView显示地址信息
└── MaterialCardView (屏幕底部，站点信息卡片)
    └── 内部：站点名称 + 地址 + "去这里"按钮 + "查看历史"按钮
```

### 7.2 全屏地图实现
```xml
<!-- activity_main.xml 第10-17行 -->
<com.amap.api.maps2d.MapView
    android:id="@+id/map_view"
    android:layout_width="0dp"
    android:layout_height="0dp"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent" />
<!-- 四个约束使其充满整个父容器 → 全屏地图 -->
```

**为什么要让地图全屏？**
- 空间信息服务需要最大化地图可视区域
- 系统状态栏通过`WindowInsets`处理，地图延伸到状态栏下方
- 操作按钮和卡片用"悬浮"方式叠在地图上方

### 7.3 定位信息卡片（屏幕中央）
```xml
<!-- activity_main.xml 第51-123行 -->
<com.google.android.material.card.MaterialCardView
    android:id="@+id/card_location_info"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:layout_margin="40dp"
    app:cardCornerRadius="24dp"      <!-- 大圆角，现代感 -->
    app:cardElevation="12dp"          <!-- 高阴影，悬浮感 -->
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent"  <!-- 居中 -->
    app:layout_constraintWidth_max="320dp"    <!-- 限制最大宽度 -->
    style="@style/Widget.Material3.CardView.Elevated">

    <!-- 内部：图标 + 标题 + 关闭按钮 + 可滚动地址文本 -->
</MaterialCardView>
```

### 7.4 站点信息卡片（屏幕底部）
```xml
<!-- activity_main.xml 第126-199行 -->
<com.google.android.material.card.MaterialCardView
    android:id="@+id/card_site_info"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:layout_margin="16dp"
    app:cardCornerRadius="24dp"
    app:cardElevation="8dp"
    app:layout_constraintBottom_toBottomOf="parent"  <!-- 贴底 -->
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintStart_toStartOf="parent">

    <!-- 内部：站点名称(22sp) + 地址(14sp) + "去这里"按钮 + "查看历史"按钮 -->
</MaterialCardView>
```

### 7.5 右上角悬浮操作按钮
```xml
<!-- activity_main.xml 第20-48行 -->
<LinearLayout
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginTop="60dp"        <!-- 避开状态栏 -->
    android:layout_marginEnd="16dp"
    android:orientation="vertical"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintTop_toTopOf="parent">

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fab_map_type"       ← 切换地图类型
        app:srcCompat="@android:drawable/ic_menu_mapmode" />

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fab_my_location"     ← 触发定位
        app:srcCompat="@android:drawable/ic_menu_mylocation" />
</LinearLayout>
```

---

## 第8页：生命周期管理与难点解决
**目标**：讲清楚资源管理、内存泄漏防护、踩过的坑

**布局**：白色背景，左侧`#1C7293`竖线装饰，代码块+表格

### 8.1 生命周期管理（防止内存泄漏）
**为什么重要**：MapView和定位客户端持有Context引用，不释放会导致Activity泄漏

**代码位置**：第336-370行

```java
@Override
protected void onResume() {
    super.onResume();
    if (mapView != null) mapView.onResume();   // 地图恢复
}

@Override
protected void onPause() {
    if (mapView != null) mapView.onPause();    // 地图暂停（省电）
    super.onPause();                              // ← 先处理地图，再调super
}

@Override
protected void onDestroy() {
    if (mapView != null) {
        mapView.onDestroy();                       // 销毁地图（释放GL资源）
    }
    if (locationClient != null) {
        locationClient.stopLocation();              // 停止定位
        locationClient.onDestroy();               // 销毁定位客户端（释放资源）
    }
    super.onDestroy();
}

@Override
protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);
    if (mapView != null) {
        mapView.onSaveInstanceState(outState);      // 保存地图状态（旋转屏幕时恢复）
    }
}
```

### 8.2 地图类型切换实现
**代码位置**：第220-229行

```java
private void toggleMapType() {
    if (aMap == null) return;

    if (aMap.getMapType() == AMap.MAP_TYPE_NORMAL) {
        aMap.setMapType(AMap.MAP_TYPE_SATELLITE);  // 切换到卫星地图
        Toast.makeText(this, "切换至：卫星地图", Toast.LENGTH_SHORT).show();
    } else {
        aMap.setMapType(AMap.MAP_TYPE_NORMAL);     // 切回普通地图
        Toast.makeText(this, "切换至：普通地图", Toast.LENGTH_SHORT).show();
    }
}
```

### 8.3 难点汇总表

| 难点 | 问题现象 | 解决方案 | 代码位置 |
|------|----------|----------|------------|
| **MapView生命周期** | 不调用对应方法会导致GL资源泄漏 | 在onResume/onPause/onDestroy中分别调用对应方法 | 第336-370行 |
| **定位客户端泄漏** | 不销毁会导致后台持续定位耗电 | onDestroy中stopLocation() + onDestroy() | 第353-362行 |
| **地址空值崩溃** | getPoiName()可能返回null | safe()方法返回空字符串代替null | 第332-334行 |
| **权限被永久拒绝** | 用户勾选"不再询问"后无法定位 | 需引导用户去系统设置页（当前版本未实现，待优化） | - |
| **Key与包名不匹配** | 地图空白、定位错误码7 | 修改包名后必须重新申请Key | git提交36de893 |

---

## 第9页：结果展示
**布局**：白色背景，左侧`#065A82`竖线装饰，2×2网格

**4个截图位**（每个含标签+说明）：

| 位置 | 标签 | 说明 | 建议截图内容 |
|------|------|------|--------------|
| 左上 | 普通地图 | 标准地图视图，显示道路与地标 | 全屏地图，显示道路、建筑 |
| 右上 | 卫星地图 | 卫星影像视图，切换展示 | 卫星模式下的同一区域 |
| 左下 | 定位后界面 | 显示当前位置与详细地址信息 | 定位后蓝色圆点+地址卡片 |
| 右下 | 站点信息卡片 | 目标站点信息与操作按钮 | 底部MaterialCardView展示站点信息 |

**每个占位框标注**：`[此处插入APP截图，建议用真机运行后截图]`

---

## 第10页：总结与完整代码清单
**目标**：总结实验完成度，列出所有关键文件

**布局**：深色背景`#21295C`，左侧`#1C7293`竖线，右上角半透明圆形装饰

### 实验完成度检查表

| 实验要求 | 实现方式 | 状态 |
|----------|----------|--------|
| 集成高德SDK | build.gradle添加依赖，Manifest配置Key | ✅ |
| 显示地图（普通/卫星） | aMap.setMapType()，FAB触发切换 | ✅ |
| 定位功能 | 高精度模式，20s超时，单次定位 | ✅ |
| 地址解析 | setNeedAddress(true)，自动返回详细地址 | ✅ |
| 空间信息展示 | 目标站点Marker + 底部信息卡片 | ✅ |
| 交互设计 | Material Design 3组件（FAB/Card/Button/Dialog） | ✅ |
| 历史查询 | AlertDialog展示strings.xml中的历史信息 | ✅ |

### 关键文件清单
```
✅ MainActivity.java      372行  核心逻辑（地图+定位+UI）
✅ activity_main.xml     202行  全屏地图+悬浮UI布局
✅ AndroidManifest.xml    41行   权限+Key+服务声明
✅ strings.xml                 字符串资源（站点名、历史信息等）
✅ colors.xml                  Material Design 3颜色定义
✅ themes.xml                 App主题配置
```

### 不足与展望

**当前不足**：
- 无POI周边搜索功能
- 无路径规划（步行/驾车导航）
- 无定位历史记录持久化

**未来扩展**：
- 集成高德POI搜索API，实现周边搜索
- 集成路径规划API，实现导航功能
- 使用Room数据库持久化定位历史
- 增加收藏夹功能

### 结束语
**感谢聆听！**（18pt，白色，居中）

代码仓库：`SpatialImformationMobileService/lab5`  
Git提交：`94ca64b` 完成lab5

---

## 附录：给AI的完整提示词（可直接复制）

```
请生成一个10页的PPT，主题为「实验四&实验五整合实现分享——基于高德SDK的Android空间信息服务APP」。

【配色】
- 主色：#065A82（深蓝）
- 辅色：#1C7293（青色）
- 强调色：#21295C（午夜蓝）
- 浅色：#F2F2F2（浅灰）
- 警告色：#E53935（红色）
- 成功色：#2E7D32（绿色）

【字体】标题Arial Black，正文Calibri，代码Consolas。

【第1页-封面】
深色背景#21295C，左侧#1C7293竖线装饰（宽0.15英寸），右上角半透明圆形装饰（#1C7293，transparency 80），左下角半透明圆形装饰（#065A82，transparency 85）。
- 主标题44pt白字："实验四 & 实验五"
- 副标题36pt白字："整合实现分享"
- 说明18pt青色斜体："基于高德SDK的Android空间信息服务APP"
- 分割线#1C7293，宽1.5pt，居中
- 个人信息14pt浅灰色：porkeface / 学号待填 / 2026/04/27

【第2页-项目整体架构】
白色背景，左侧#1C7293竖线（宽0.08英寸）。
- 标题："项目整体架构"（26pt深蓝）
- 树形结构展示文件目录（MainActivity.java 372行，activity_main.xml 202行）
- 框图展示功能模块划分：MainActivity作为整合容器，包含地图模块、定位模块、UI交互模块
- 说明实验四提供能力、实验五提供能力、整合方式

【第3页-实验四：SDK集成与配置】
白色背景，左侧#065A82竖线。
- 左栏标题："build.gradle依赖配置"，展示高德2D地图SDK、定位SDK、Material Design依赖代码（深色背景代码块）
- 中栏标题："AndroidManifest权限与配置"，展示7个权限声明、meta-data的Key配置、APSService服务声明
- 右栏红色边框警告卡片（#E53935边框）："⚠️ 踩坑经验"，展示git提交36de893"修改了包名，重新使用了合适的高德Android服务key"，说明包名与Key必须匹配的问题和解决方案

【第4页-实验四：地图初始化全流程】
白色背景，左侧#1C7293竖线。
- 标题："onCreate()方法完整流程"（24pt深蓝）
- 用带序号的流程图展示8个步骤（加载布局→处理系统栏→获取MapView→初始化地图→获取UI控件→默认隐藏卡片→注册权限器→初始化地图→初始化定位）
- 子标题："initMap()方法详解"，展示关键代码（获取AMap实例、设置中文、设置地图类型、设置Marker点击监听器、绑定按钮事件、调用showTargetSite）
- 底部小字注明代码行号：第51-75行onCreate，第77-114行initMap

【第5页-实验四：定位功能完整实现】
白色背景，左侧#065A82竖线。
- 用纵向流程图展示完整调用链（用户点击FAB→onClick→checkPermissionAndLocate→[有权限]startLocation / [无权限]permissionLauncher.launch→用户允许→startLocation→locationClient.startLocation→20秒后→onLocationChanged回调→[成功]更新Marker+显示地址 / [失败]显示错误码）
- 右栏深色背景（#1E1E1E）代码块，展示registerPermissionLauncher()代码（使用ActivityResultLauncher新API）
- 再下方展示initLocationClient()代码（updatePrivacyShow、创建客户端、配置高精度模式、单次定位、需要地址、20s超时、禁用缓存）
- 底部展示locationListener回调代码（错误码判断、updateCurrentLocationMarker、buildLocationResult）

【第6页-实验五：空间信息展示】
白色背景，左侧#1C7293竖线。
- 左栏："目标站点定义与显示"，展示TARGET_SITE常量（26.575811, 114.164421）、showTargetSite()代码（clear、addMarker、moveCamera、showInfoWindow）
- 右栏："历史信息查询"，展示showHistoryDialog()代码（AlertDialog.Builder、setTitle、setMessage、setPositiveButton）
- 底部："当前位置标记更新"，展示updateCurrentLocationMarker()代码（remove旧Marker、add新Marker、animateCamera）

【第7页-实验五：UI布局设计】
白色背景，左侧#065A82竖线。
- 用分层框图展示布局结构（ConstraintLayout根容器 → MapView全屏背景 → 右上角FAB垂直排列 → 中央定位信息卡片 → 底部站点信息卡片）
- 左栏："全屏地图实现"，展示MapView的4个Constraint约束，说明为什么让地图全屏（最大化可视区域）
- 右栏："Material Design 3组件"，分别说明：
  - MaterialCardView（圆角24dp，阴影12dp，居中/底部约束）
  - FloatingActionButton（右上角，mapmode和mylocation图标）
  - MaterialButton（底部卡片中的"去这里"和"查看历史"）

【第8页-生命周期管理与难点解决】
白色背景，左侧#1C7293竖线。
- 标题："生命周期管理（防止内存泄漏）"（24pt深蓝）
- 用4个代码块展示onResume/onPause/onDestroy/onSaveInstanceState的实现（MapView和locationClient的资源释放）
- 标题："难点汇总表"，用表格展示5个难点（MapView生命周期、定位客户端泄漏、地址空值崩溃、权限永久拒绝、Key与包名不匹配），每个含问题现象、解决方案、代码位置
- 特别标注safe()方法（第332-334行）和buildPoiOrAoi()方法（第306-318行）

【第9页-结果展示】
白色背景，左侧#065A82竖线。
- 2×2网格，4个截图占位框，每个框：
  - 虚线边框#065A82，圆角
  - 内部居中显示📱图标（32pt）
  - 标注"[此处插入APP截图]"
  - 下方说明文字（13pt加粗深蓝）：
    - 左上："普通地图" - 标准地图视图，显示道路与地标
    - 右上："卫星地图" - 卫星影像视图
    - 左下："定位后界面" - 蓝色当前位置Marker + 中央定位信息卡片
    - 右下："站点信息卡片" - 底部MaterialCardView展示站点信息

【第10页-总结与完整代码清单】
深色背景#21295C，左侧#1C7293竖线，右上角半透明圆形装饰（#065A82，transparency 80）。
- 标题："总结与完整代码清单"（26pt白色）
- 半透明深蓝框（#065A82，transparency 30）："✅ 已完成全部实验要求"，内部用表格展示7项实验要求的实现方式和状态
- 左栏："关键文件清单"（14pt青色加粗），列出6个文件的名称和行数
- 右栏："不足与展望"（14pt青色加粗）
  - 当前不足：无POI搜索、无路径规划
  - 未来扩展：周边搜索、导航功能、Room数据库、收藏夹
- 底部居中："感谢聆听！"（18pt白字）
- 底部小字："代码仓库：SpatialImformationMobileService/lab5 | Git提交：94ca64b 完成lab5"

请使用Ocean Gradient配色方案，每页左侧保持#1C7293细竖线装饰，技术代码用深色背景#1E1E1E+Consolas字体展示。
```

---

*大纲编写完成，可直接复制附录提示词给AI生成PPT。*
