package com.example.lab8;

import android.database.Cursor;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

    private EditText etStudentId, etName, etHeight, etWeight;
    private TextView tvResult;
    private DB db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        etStudentId = findViewById(R.id.etStudentId);
        etName = findViewById(R.id.etName);
        etHeight = findViewById(R.id.etHeight);
        etWeight = findViewById(R.id.etWeight);
        tvResult = findViewById(R.id.tvResult);

        Button btnInsert = findViewById(R.id.btnInsert);
        Button btnQuery = findViewById(R.id.btnQuery);
        Button btnDelete = findViewById(R.id.btnDelete);
        Button btnCalcBMI = findViewById(R.id.btnCalcBMI);

        db = new DB(this);
        db.open();

        // 插入数据
        btnInsert.setOnClickListener(v -> {
            String studentId = etStudentId.getText().toString().trim();
            String name = etName.getText().toString().trim();
            String heightStr = etHeight.getText().toString().trim();
            String weightStr = etWeight.getText().toString().trim();

            if (studentId.isEmpty() || name.isEmpty() || heightStr.isEmpty() || weightStr.isEmpty()) {
                Toast.makeText(this, "请填写完整信息", Toast.LENGTH_SHORT).show();
                return;
            }

            int height = Integer.parseInt(heightStr);
            int weight = (int) Float.parseFloat(weightStr);

            long result = db.insertInfo(studentId, name, height, weight);
            if (result != -1) {
                Toast.makeText(this, "插入成功，学号=" + studentId, Toast.LENGTH_SHORT).show();
                showRecord(studentId);
            } else {
                Toast.makeText(this, "插入失败，学号可能已存在", Toast.LENGTH_SHORT).show();
            }
        });

        // 查询数据
        btnQuery.setOnClickListener(v -> {
            String studentId = etStudentId.getText().toString().trim();
            if (studentId.isEmpty()) {
                showAllRecords();
            } else {
                showRecord(studentId);
            }
        });

        // 删除数据
        btnDelete.setOnClickListener(v -> {
            String studentId = etStudentId.getText().toString().trim();
            if (studentId.isEmpty()) {
                Toast.makeText(this, "请输入要删除的学号", Toast.LENGTH_SHORT).show();
                return;
            }
            boolean success = db.deleteInfo(studentId);
            if (success) {
                Toast.makeText(this, "删除成功", Toast.LENGTH_SHORT).show();
                tvResult.setText("学号 " + studentId + " 的记录已删除");
            } else {
                Toast.makeText(this, "删除失败，学号不存在", Toast.LENGTH_SHORT).show();
            }
        });

        // 计算 BMI（直接用输入框数据）
        btnCalcBMI.setOnClickListener(v -> {
            String name = etName.getText().toString().trim();
            String heightStr = etHeight.getText().toString().trim();
            String weightStr = etWeight.getText().toString().trim();

            if (heightStr.isEmpty() || weightStr.isEmpty()) {
                Toast.makeText(this, "请输入身高和体重", Toast.LENGTH_SHORT).show();
                return;
            }

            int height = Integer.parseInt(heightStr);
            int weight = (int) Float.parseFloat(weightStr);

            float heightM = height / 100.0f;
            float bmi = weight / (heightM * heightM);

            String level;
            if (bmi < 18.5f) {
                level = "偏瘦";
            } else if (bmi < 24.0f) {
                level = "正常";
            } else if (bmi < 28.0f) {
                level = "偏胖";
            } else {
                level = "肥胖";
            }

            String displayName = name.isEmpty() ? "未知" : name;
            String result = "===== BMI 计算结果 =====\n"
                    + "姓名: " + displayName + "\n"
                    + "身高: " + height + " cm\n"
                    + "体重: " + weight + " kg\n"
                    + "BMI: " + String.format("%.2f", bmi) + "\n"
                    + "判定: " + level;
            tvResult.setText(result);
        });
    }

    private void showRecord(String studentId) {
        Cursor cursor = db.get(studentId);
        if (cursor != null && cursor.moveToFirst()) {
            String name = cursor.getString(cursor.getColumnIndexOrThrow(DB.KEY_NAME));
            int height = cursor.getInt(cursor.getColumnIndexOrThrow(DB.KEY_HEIGHT));
            int weight = cursor.getInt(cursor.getColumnIndexOrThrow(DB.KEY_WEIGHT));
            cursor.close();

            String result = "学号: " + studentId + "\n"
                    + "姓名: " + name + "\n"
                    + "身高: " + height + " cm\n"
                    + "体重: " + weight + " kg";
            tvResult.setText(result);
        } else {
            tvResult.setText("未找到学号 " + studentId + " 的记录");
            if (cursor != null) cursor.close();
        }
    }

    private void showAllRecords() {
        Cursor cursor = db.getAll();
        if (cursor != null && cursor.moveToFirst()) {
            StringBuilder sb = new StringBuilder();
            sb.append("===== 所有记录 =====\n");
            do {
                String studentId = cursor.getString(cursor.getColumnIndexOrThrow(DB.KEY_STUDENT_ID));
                String name = cursor.getString(cursor.getColumnIndexOrThrow(DB.KEY_NAME));
                int height = cursor.getInt(cursor.getColumnIndexOrThrow(DB.KEY_HEIGHT));
                int weight = cursor.getInt(cursor.getColumnIndexOrThrow(DB.KEY_WEIGHT));
                sb.append("学号:").append(studentId)
                        .append(" | 姓名:").append(name)
                        .append(" | 身高:").append(height).append("cm")
                        .append(" | 体重:").append(weight).append("kg\n");
            } while (cursor.moveToNext());
            cursor.close();
            tvResult.setText(sb.toString());
        } else {
            tvResult.setText("数据库中暂无记录");
            if (cursor != null) cursor.close();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (db != null) {
            db.close();
        }
    }
}
