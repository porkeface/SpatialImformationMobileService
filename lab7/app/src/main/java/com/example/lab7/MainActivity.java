package com.example.lab7;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.amap.api.location.CoordinateConverter;
import com.amap.api.location.DPoint;
import com.amap.api.maps2d.AMap;
import com.amap.api.maps2d.CameraUpdateFactory;
import com.amap.api.maps2d.MapView;
import com.amap.api.maps2d.model.LatLng;
import com.amap.api.maps2d.model.TileOverlay;
import com.amap.api.maps2d.model.TileOverlayOptions;
import com.amap.api.maps2d.model.UrlTileProvider;

import java.net.MalformedURLException;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

    private MapView mapView;
    private AMap aMap;

    private TileOverlay scopeTileOverlay;
    private final int tileSize = 256;
    private final double initialResolution = 156543.03392804062;
    private final double originShift = 20037508.342789244;

    // GeoServer WMS 地址 - 模拟器用 10.0.2.2 访问宿主机
    // 如用真机测试，改为本机 ipconfig 查到的 IP 地址
    private String wmsUrl = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mapView = findViewById(R.id.map_view);
        mapView.onCreate(savedInstanceState);
        initMap();
    }

    private void initMap() {
        aMap = mapView.getMap();
        if (aMap == null) {
            return;
        }

        // 将地图中心移到厦门（lab2:xiamen 图层所在区域）
        aMap.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(24.65, 118.10), 10f));

        addWmsLayer();
    }

    /**
     * 添加 WMS 图层
     */
    private void addWmsLayer() {
        // GeoServer WMS 地址，工作区: lab2，图层: xiamen
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
                    System.out.println(x + "/" + y + "/" + zoom + "=====>" + url);
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

    /**
     * 根据像素、等级算出坐标（米）
     */
    private double pixelsToMeters(int p, int zoom) {
        return p * resolution(zoom) - originShift;
    }

    /**
     * 根据瓦片的 x/y/zoom 返回 bbox 字符串
     */
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

    /**
     * 计算分辨率
     */
    private double resolution(int zoom) {
        return initialResolution / (Math.pow(2, zoom));
    }

    /**
     * X 米转经纬度
     */
    private double metersToLon(double mx) {
        return (mx / originShift) * 180.0;
    }

    /**
     * Y 米转经纬度
     */
    private double metersToLat(double my) {
        double lat = (my / originShift) * 180.0;
        lat = 180.0 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180.0)) - Math.PI / 2.0);
        return lat;
    }

    /**
     * X 经纬度转米
     */
    private double lonToMeters(double lon) {
        return lon * originShift / 180.0;
    }

    /**
     * Y 经纬度转米
     */
    private double latToMeters(double lat) {
        double my = Math.log(Math.tan((90 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0);
        return my * originShift / 180.0;
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mapView != null) {
            mapView.onResume();
        }
    }

    @Override
    protected void onPause() {
        if (mapView != null) {
            mapView.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (mapView != null) {
            mapView.onDestroy();
        }
        super.onDestroy();
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        if (mapView != null) {
            mapView.onSaveInstanceState(outState);
        }
    }
}
