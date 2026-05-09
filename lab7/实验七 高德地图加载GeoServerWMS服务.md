实验十 高德地图加载 GeoServer WMS 服务

### 实验十 高德地图加载 GeoServer WMS 服务

实验学时：2 实验类型：（演示、验证、综合、设计、研究）

实验要求：（必修、选修）

一、实验目的

通过本实验的学习，使学生了解或掌握基于高德地图 Android SDK 加载 GeoServer

WMS 服务的基本知识，训练和培养在高德地图 Android 客户端上加载 和显示服务端地图

数据服务的使用技能，为今后继续对移动 GIS 实验的学习奠定 基础。

二、实验内容

1. 掌握服务器端的 GeoServer WMS 网络地图服务的创建与发布；

2.理解和掌握高德地图 Android 客户端加载 WMS 数据。

三、实验原理、方法和手段

Web 地图服务（WMS）利用具有地理空间位置信息的数据制作地图，其中将 地图定

义为地理数据可视的表现，地图本身并不是数据。地图通常以图像格式表达，例如 PNG，

GIF 或是 JPEG，有时候也表达为基于矢量图形，如可缩放矢量图形（SVG）或是网络电脑

图形元文件等格式（WebCGM）。根据 OGC 规范，地图服务是专门提供共享地图数据的服

务，负责根据客户程序的请求，提供地图图像、指定坐标点的要素信息、以及地图服务的功

能说明信息。为此，WMS 能够作为移动 GIS 的空间数据源，提升移动 GIS 的服务能力。

WMS 规范定义了三个接口（操作）：GetCapabilities（获取服务能力）、GetMap（获

取地图）和 GetFeatureInfo（获取对象信息），其中 GetMap 为核心操作。GetCapabitities 返

回服务级元数据，它是对服务信息内容和要求参数的一种描述；GetMap 返回一个地图影

像 ，其地理空间参考和大小参数是明确定义了的；

GetFeatureInfo（可选）返回显示在地图上的某些特殊要素的信息。这个规范还定义了

一个用于调用上述操作的万维网统一资源定位器（URL）语法和服务级元数据的 XML（可

扩展标记语言）表达法。

高德地图 Android SDK 提供了丰富的地图应用开发接口，其中 UrlTileProvider 类提供

了网络数据连接与访问的功能，为 WMS 加载的实现提供了基础。本实验 WMS 数据加载的

基本思路：（1）在墨卡托投影系中先根据行列号求出瓦片的范围（米）；（2）将瓦片范围

转换为经纬度；（3）利用高德坐标转换工具求出该坐 标和高德坐标的差；（4）在（2）的

实验十 高德地图加载 GeoServer WMS 服务

坐标加上差值得到正确坐标，即可获取到正确的瓦片。

四、实验组织运行要求

本实验需要电脑操作使用，所以实验组织采用集中在计算机与信息工程学院机房的授

课形式。

五、实验条件

仪器：电脑； 软件：Java JDK，GeoServer，Android Studio； 实验场地：遥感与地理信息系统实

验室实验楼 1-216。

六、实验步骤

1. 本实验开发包括的流程主要有：制作室内空间的 shp 地图图层（投影为

EPSG3857）、以该 shp 图层为数据源在 GeoServer 中创建和发布 WMS 地图服

务、高德地图 Android SDK 加载 WMS 数据、Android Studio 将 WMS 地图以覆盖

物的形式展现在高德地图；

在国际上，每个坐标系统都会被分配一个 EPSG 代码，EPSG:4326 就是 WGS84

的代码；常见的几个坐标系代码如下：

EPSG:4326 (WGS84) 和 EPSG:3857(Pseudo-Mercator)

EPSG4326：基于 WGS84 椭球的经纬度坐标系（大地坐标系）。

EPSG3857：基于球体的、web 墨卡托投影（伪墨卡托投影 Pseudo-Mercator）的投

影坐标系，范围为纬度 85 度以下，由于 google 地图最先使用而成为事实标准。至

今，大多互联网地图都使用 EPSG3857，主要是因为该投影是等角投影，适合地图

定向及导航，但是纬度越高，面积变形越大。

EPSG4490：基于 CGCS2000 椭球的经纬度坐标系（地理坐标系）

[Source]

2. 在 GIS 桌面软件新建 shp 图层（或 以实验场景所在地已有的投影为 EPSG3857 的

shp 图层为基础进行创建），对已有的室内空间平面图进行矢量化，得到室内空间

的 shp 地图图层，除此之外，还有多种 shp 图层创建方式，比如运用 GIS 软件下载

高德在线地图；

实验十 高德地图加载 GeoServer WMS 服务

在 ArcGIS 查找投影 EPSG3857

3. GeoServer 软件下载与安装（http://geoserver.org/），然后，选择 GeoServer-- > Start GeoServer 启动，使用用户: admin,密码：geoserver，登录系统；

4. 接下来，创建工作区（workspace）-- >添加数据存储并发布层-- >Layer Preiew 地图

层浏览 参考[网站]

此处以 chinamap 为例

这里的数据存储名称代表一个分层 layer，在同一个工作区不允许重复分层名称存 在。

实验十 高德地图加载 GeoServer WMS 服务

添加数据存储并选择数据类型，选择对应类型的数据，这里我们选择 shp 类型 的。

若上面“数据源名称”填写的是poi,那么得到的新建图层就是poi。 创建一个图层

实验十 高德地图加载 GeoServer WMS 服务

点击“发布”此图层，设置如下发布参数： 新建数据存储后，默认会停留在新建图层的界面，我们直接在此开始建立图层。因为只有一个 图层Chinamap，点击发布进入图层编辑界面。图层编辑界面定义了图层的数据和发布参数。填 入了名称、标题、摘要等基本信息后，我们需要定义重要的 SRS 信息和边框信息；点击”从数 据中计算”，确保范围正确；

实验十 高德地图加载 GeoServer WMS 服务

定义 SRS 选择数据的 EPSG 投影类型，并搜索和选择 EPSG:3857，点击保存" 数据存储"层（layer）发布成功。

实验十 高德地图加载 GeoServer WMS 服务

最终加入的数据层可以在 Layer Preview 看到，这里都是添加后的数据层。选 择“Select one”下的 jpeg，若能在新打开的浏览器中看到地图，则说明 WMS 发布成功，此时，可记录下浏览器的 http 地址。 到此为止 wms 服务地址已经准备好了，接下来只需要调用高德地图 SDK 中加 载瓦片地图的方法即可，其中涉及到投影坐标的范围即 bbox 计算。 对 于 坐 标 系 及 瓦 片 地 图 加 载 原 理 可 以 参 考 网 址 ： http://weilin.me/ol3- primer/ch05/05-03.html，bbox 覆盖范围求解。

5. 调用高德地图 sdk 加载 WMS 服务地址核心片段，红颜色部分需根据实际情况调

整。

TileOverlay scopeTileOverlay; int titleSize = 256;

double initialResolution = 156543.03392804062;//2*Math.PI*6378137/titleSize;// double originShift = 20037508.342789244;//2*Math.PI*6378137/2.0;// String url = ""; /** *添加 wms图层

*/

protected void addScope() {

实验十 高德地图加载 GeoServer WMS 服务

url="http://10.0.2.2:8080/geoserver/worksapce/wms?&layers=worksapce%3Axiangzhen3857&format=i mage%2Fjpeg&TRANSPARENT=TRUE&service=WMS&version=1.1.0&request=GetMap&STYLES=&s rs=EPSG%3A3857&WIDTH=256&HEIGHT=256&bbox="; TileProvider tileProvider = new UrlTileProvider (256, 256) { @Override public URL getTileUrl(int x, int y, int zoom) { try { System.out.println(x + "/" + y + "/" + zoom + "=====>" + url + TitleBounds(x, y, zoom));

return new URL(url + TitleBounds(x, y, zoom)); } catch (MalformedURLException e) {

e.printStackTrace ();

}

return null; } }; if (tileProvider!= null) { scopeTileOverlay = aMap.addTileOverlay (new TileOverlayOptions ().tileProvider(tileProvider) } }

/** *根据像素、等级算出坐标 *
* @param p
* @param zoom
* @return */ private double Pixels2Meters(int p, int zoom) {

return p * Resolution(zoom) - originShift; }

/** *根据瓦片的 x/y等级返回瓦片范围 *

* @param tx
* @param ty
* @param zoom
* @return */ private String TitleBounds(int tx, int ty, int zoom) {

double minX = Pixels2Meters(tx * titleSize, zoom);

double maxY = -Pixels2Meters(ty * titleSize, zoom); double maxX = Pixels2Meters((tx + 1) * titleSize, zoom);

实验十 高德地图加载 GeoServer WMS 服务

double minY = -Pixels2Meters((ty + 1) * titleSize, zoom); //转换成经纬度 minX = Meters2Lon(minX); minY = Meters2Lat(minY);

maxX = Meters2Lon(maxX); maxY = Meters2Lat(maxY); //坐标转换工具类构造方法 GPS( WGS-84)转为高德地图需要的坐标

//注意这里需要 import com.amap.api.location.CoordinateConverter;

CoordinateConverter converter = new CoordinateConverter(this); converter.from(CoordinateConverter.CoordType.GPS); try { converter.coord(new DPoint(minY,minX)); DPoint min = converter.convert(); converter.coord(new DPoint(maxY,maxX)); DPoint max = converter.convert();

minX=Lon2Meter(-min.getLongitude() + 2 * minX); minY=Lat2Meter(-min.getLatitude()+2*minY); maxX=Lon2Meter(-max.getLongitude()+2*maxX); maxY=Lat2Meter(-max.getLatitude()+2*maxY); } catch (Exception e) { e.printStackTrace(); } //注意下面的四个参数不要写错，否则显示地图 return minX + "," + minY + "," + maxX + "," +maxY; } 某个瓦片的地址 //http://10.0.2.2:8080/geoserver/worksapce/wms?&layers=worksapce%3Axiangzhen3857&format=image%2Fjpeg &TRANSPARENT=TRUE&service=WMS&version=1.1.0&request=GetMap&STYLES=&srs=EPSG%3A3857& WIDTH=256&HEIGHT=256&bbox=1.2948511050980909E7,2989361.3712081937,1.2953394172320304E7,299 4247.4388453127 //http://localhost:8080/geoserver/worksapce/wms?&layers=worksapce%3Axiangzhen3857&format=image%2Fjpe g&TRANSPARENT=TRUE&service=WMS&version=1.1.0&request=GetMap&STYLES=&srs=EPSG%3A3857& WIDTH=256&HEIGHT=256&bbox=1.2948511050980909E7,2989361.3712081937,1.2953394172320304E7,299 4247.4388453127

/***计算分辨率*
* @param zoom
* @return*/ private double Resolution(int zoom) { return initialResolution / (Math. Pow (2, zoom)); }

/*** X米转经纬度*/

private double Meters2Lon (double mx) { double lon = (mx / originShift) * 180.0;

return lon; }

/*** Y米转经纬度*/ private double Meters2Lat(double my) {

double lat = (my / originShift) *

实验十 高德地图加载 GeoServer WMS 服务

180.0; lat = 180.0 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180.0)) - Math.PI / 2.0); return lat; }

/***X经纬度转米*/ private double Lon2Meter(double lon) {

double mx = lon * originShift / 180.0;

return mx; }

/*** Y经纬度转米*/

private double Lat2Meter(double lat) { double my = Math.log(Math.tan((90 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0); my = my * originShift / 180.0;

return my; }
6. 修改高德地图项目的 BasicMapActivity.java 类，将第 5 步中的代码放置到与

protected void onCreate(Bundle savedInstanceState){ }方法并列，同时，在方法

private void init() { }中的 aMap = mapView.getMap();语句后添加代码 addScope();然

后，应用 CameraUpdate 类方法将高德地图的显示中心设置为 WMS 地图所在的地

理位置；

7. 运行该高德地图项目测试，在下课前提交加载 GeoServer WMS 的成果截图，并把

截图文件命名为 KJ-MGIS-EXPE10-学号+名字（比如：KJ-MGIS-EXPE10-

1320012142 张泓）。

8. 实验注意事项：（1）高德地图 SDK 仅支持 EPSG3857 坐标系统的 WMS 图层，所

以，GeoServer 发布的地图投影也必须为 EPSG3857，转换数据投影可以采用 GIS

软件（ArcGIS、QGIS 等）或 GeoServer 的 Demo 工具；（2）WMS 的 URL 地址必

须经过本机器的浏览器地址核实。

七、思考题

尝试读取 GeoServer WMS 中的地图要素信息，并显示。

参考： https://blog.csdn.net/zkjthinking/article/details/77278838 Android 中使用地图加载 wms 服务(高德地图，谷歌地图，天地图)

本机地址：http://localhost:8080 虚拟机地址：http://10.0.2.2:8080/geoserver 真机地址：真机测试 url用自己的 ipconfig中查询的地址