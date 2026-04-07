package com.example.lab4;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

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
    private Button btnGoSite;
    private Button btnShowHistory;
    private Button btnBasicMap;
    private Button btnRsMap;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        View root = findViewById(R.id.main);
        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        mapView = findViewById(R.id.map_view);
        mapView.onCreate(savedInstanceState);
        initMap();
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
        btnBasicMap = findViewById(R.id.btn_basicmap);
        btnRsMap = findViewById(R.id.btn_rsmap);
        btnGoSite.setOnClickListener(this);
        btnShowHistory.setOnClickListener(this);
        btnBasicMap.setOnClickListener(this);
        btnRsMap.setOnClickListener(this);

        showTargetSite();
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
        } else if (id == R.id.btn_basicmap) {
            if (aMap != null) {
                aMap.setMapType(AMap.MAP_TYPE_NORMAL);
            }
        } else if (id == R.id.btn_rsmap) {
            if (aMap != null) {
                aMap.setMapType(AMap.MAP_TYPE_SATELLITE);
            }
        }
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
