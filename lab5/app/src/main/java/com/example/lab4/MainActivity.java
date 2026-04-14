package com.example.lab4;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.amap.api.maps2d.AMap;
import com.amap.api.maps2d.CameraUpdateFactory;
import com.amap.api.maps2d.MapView;
import com.amap.api.maps2d.model.LatLng;
import com.amap.api.maps2d.model.Marker;
import com.amap.api.maps2d.model.MarkerOptions;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private static final LatLng TARGET_SITE = new LatLng(26.575811,114.164421);

    private MapView mapView;
    private AMap aMap;
    private Marker targetMarker;
    private View btnGoSite;
    private View btnShowHistory;
    private View fabMapType;
    private View fabMyLocation;
    private View cardLocationInfo;
    private View btnCloseLocation;
    private TextView tvLocationResult;
    private Marker currentMarker;
    private AMapLocationClient locationClient;
    private AMapLocationClientOption locationOption;
    private ActivityResultLauncher<String[]> permissionLauncher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 仅为底部和顶部的悬浮内容处理系统栏间距，让地图全屏
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            return insets;
        });

        mapView = findViewById(R.id.map_view);
        mapView.onCreate(savedInstanceState);
        tvLocationResult = findViewById(R.id.tv_location_result);
        cardLocationInfo = findViewById(R.id.card_location_info);
        btnCloseLocation = findViewById(R.id.btn_close_location);

        // 默认隐藏定位信息窗
        if (cardLocationInfo != null) {
            cardLocationInfo.setVisibility(View.GONE);
        }

        registerPermissionLauncher();
        initMap();
        initLocationClient();
    }

    private void initMap() {
        if (aMap != null) {
            return;
        }

        aMap = mapView.getMap();
        if (aMap == null) {
            Toast.makeText(this, "地图初始化失败，请检查高德 Key 是否配置正确", Toast.LENGTH_LONG).show();
            return;
        }

        aMap.setMapLanguage(AMap.CHINESE);
        aMap.setMapType(AMap.MAP_TYPE_NORMAL);

        btnGoSite = findViewById(R.id.btn_go_site);
        btnShowHistory = findViewById(R.id.btn_show_history);
        fabMapType = findViewById(R.id.fab_map_type);
        fabMyLocation = findViewById(R.id.fab_my_location);

        btnGoSite.setOnClickListener(this);
        btnShowHistory.setOnClickListener(this);
        fabMapType.setOnClickListener(this);
        fabMyLocation.setOnClickListener(this);
        if (btnCloseLocation != null) {
            btnCloseLocation.setOnClickListener(this);
        }

        showTargetSite();
    }

    private void registerPermissionLauncher() {
        permissionLauncher = registerForActivityResult(
                new ActivityResultContracts.RequestMultiplePermissions(),
                result -> {
                    Boolean fineGranted = result.getOrDefault(Manifest.permission.ACCESS_FINE_LOCATION, false);
                    Boolean coarseGranted = result.getOrDefault(Manifest.permission.ACCESS_COARSE_LOCATION, false);
                    if (Boolean.TRUE.equals(fineGranted) || Boolean.TRUE.equals(coarseGranted)) {
                        startLocation();
                    } else {
                        tvLocationResult.setText(getString(R.string.location_permission_denied));
                    }
                }
        );
    }

    private void initLocationClient() {
        try {
            AMapLocationClient.updatePrivacyShow(this, true, true);
            AMapLocationClient.updatePrivacyAgree(this, true);

            locationClient = new AMapLocationClient(getApplicationContext());
            locationOption = new AMapLocationClientOption();
            locationOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);
            locationOption.setOnceLocation(true);
            locationOption.setNeedAddress(true);
            locationOption.setMockEnable(false);
            locationOption.setHttpTimeOut(20000);
            locationOption.setLocationCacheEnable(false);
            locationClient.setLocationOption(locationOption);
            locationClient.setLocationListener(locationListener);
        } catch (Exception e) {
            tvLocationResult.setText("定位客户端初始化失败：\n" + e.getMessage());
        }
    }

    private void checkPermissionAndLocate() {
        boolean fineGranted = ContextCompat.checkSelfPermission(
                this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        boolean coarseGranted = ContextCompat.checkSelfPermission(
                this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;

        if (fineGranted || coarseGranted) {
            startLocation();
        } else {
            permissionLauncher.launch(new String[] {
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
            });
        }
    }

    private void startLocation() {
        if (locationClient == null) {
            tvLocationResult.setText("定位客户端未初始化。");
            return;
        }
        tvLocationResult.setText(getString(R.string.location_in_progress));
        locationClient.stopLocation();
        locationClient.startLocation();
    }

    private void showTargetSite() {
        if (aMap == null) {
            return;
        }

        aMap.clear();
        targetMarker = aMap.addMarker(new MarkerOptions()
                .position(TARGET_SITE)
                .title(getString(R.string.site_name))
                .snippet(getString(R.string.site_snippet)));
        aMap.moveCamera(CameraUpdateFactory.newLatLngZoom(TARGET_SITE, 13.5f));
        if (targetMarker != null) {
            targetMarker.showInfoWindow();
        }
    }

    private void showHistoryDialog() {
        new AlertDialog.Builder(this)
                .setTitle(R.string.history_title)
                .setMessage(R.string.site_history)
                .setPositiveButton(android.R.string.ok, null)
                .show();
    }

    @Override
    public void onClick(View v) {
        int id = v.getId();
        if (id == R.id.btn_go_site) {
            showTargetSite();
        } else if (id == R.id.btn_show_history) {
            showHistoryDialog();
        } else if (id == R.id.fab_map_type) {
            toggleMapType();
        } else if (id == R.id.fab_my_location) {
            // 点击定位时显示中央卡片
            if (cardLocationInfo != null) {
                cardLocationInfo.setVisibility(View.VISIBLE);
            }
            checkPermissionAndLocate();
        } else if (id == R.id.btn_close_location) {
            // 点击关闭按钮隐藏卡片
            if (cardLocationInfo != null) {
                cardLocationInfo.setVisibility(View.GONE);
            }
        }
    }

    private void toggleMapType() {
        if (aMap == null) return;
        if (aMap.getMapType() == AMap.MAP_TYPE_NORMAL) {
            aMap.setMapType(AMap.MAP_TYPE_SATELLITE);
            Toast.makeText(this, "切换至：卫星地图", Toast.LENGTH_SHORT).show();
        } else {
            aMap.setMapType(AMap.MAP_TYPE_NORMAL);
            Toast.makeText(this, "切换至：普通地图", Toast.LENGTH_SHORT).show();
        }
    }

    private final AMapLocationListener locationListener = new AMapLocationListener() {
        @Override
        public void onLocationChanged(AMapLocation aMapLocation) {
            if (aMapLocation == null) {
                tvLocationResult.setText("定位失败：返回结果为空。");
                return;
            }

            if (aMapLocation.getErrorCode() == 0) {
                updateCurrentLocationMarker(aMapLocation);
                tvLocationResult.setText(buildLocationResult(aMapLocation));
            } else {
                String result = "定位失败\n"
                        + "错误码：" + aMapLocation.getErrorCode() + "\n"
                        + "错误信息：" + aMapLocation.getErrorInfo() + "\n"
                        + "错误描述：" + aMapLocation.getLocationDetail();
                tvLocationResult.setText(result);
            }
        }
    };

    private void updateCurrentLocationMarker(AMapLocation location) {
        if (aMap == null) {
            return;
        }

        LatLng currentLatLng = new LatLng(location.getLatitude(), location.getLongitude());
        if (currentMarker != null) {
            currentMarker.remove();
        }
        currentMarker = aMap.addMarker(new MarkerOptions()
                .position(currentLatLng)
                .title(getString(R.string.my_location_title))
                .snippet(buildAddress(location).isEmpty() ? getString(R.string.my_location_snippet) : buildAddress(location)));
        aMap.animateCamera(CameraUpdateFactory.newLatLngZoom(currentLatLng, 16f));
        if (currentMarker != null) {
            currentMarker.showInfoWindow();
        }
    }

    private String buildLocationResult(AMapLocation location) {
        return "定位成功\n"
                + "经度：" + location.getLongitude() + "\n"
                + "纬度：" + location.getLatitude() + "\n"
                + "精度：" + location.getAccuracy() + " 米\n"
                + "地址：" + buildAddress(location) + "\n"
                + "国家：" + safe(location.getCountry()) + "\n"
                + "省份：" + safe(location.getProvince()) + "\n"
                + "城市：" + safe(location.getCity()) + "\n"
                + "区县：" + safe(location.getDistrict()) + "\n"
                + "街道：" + safe(location.getStreet()) + "\n"
                + "门牌号：" + safe(location.getStreetNum()) + "\n"
                + "定位类型：" + location.getLocationType() + "\n"
                + "时间：" + location.getTime();
    }

    private String buildAddress(AMapLocation location) {
        String address = safe(location.getAddress());
        if (!address.isEmpty()) {
            return address;
        }

        StringBuilder builder = new StringBuilder();
        appendPart(builder, location.getProvince());
        appendPart(builder, location.getCity());
        appendPart(builder, location.getDistrict());
        appendPart(builder, location.getStreet());
        appendPart(builder, location.getStreetNum());
        return builder.length() == 0 ? "暂无地址信息" : builder.toString();
    }

    private void appendPart(StringBuilder builder, String value) {
        String safeValue = safe(value);
        if (!safeValue.isEmpty()) {
            builder.append(safeValue);
        }
    }

    private String safe(String value) {
        return value == null ? "" : value;
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
        if (locationClient != null) {
            locationClient.stopLocation();
            locationClient.onDestroy();
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
