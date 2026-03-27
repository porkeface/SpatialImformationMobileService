package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity2 extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);

        Button button2 = findViewById(R.id.button2);
        TextView textView1 = findViewById(R.id.textView1);

        // 获取从MainActivity传递过来的数据
        Intent i = getIntent();
        String data = i.getStringExtra("data");
        textView1.setText(data);

        button2.setOnClickListener(v -> finish());
    }
}
