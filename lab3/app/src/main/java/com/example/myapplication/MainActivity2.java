package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity2 extends AppCompatActivity {

    public static final String EXTRA_RESULT = "result_data";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);

        EditText editTextStudentId = findViewById(R.id.editTextStudentId);
        EditText editTextName = findViewById(R.id.editTextName);
        Spinner spinnerMajorClass = findViewById(R.id.spinnerMajorClass);
        Spinner spinnerCollege = findViewById(R.id.spinnerCollege);
        Button button2 = findViewById(R.id.button2);

        ArrayAdapter<CharSequence> majorClassAdapter = ArrayAdapter.createFromResource(
                this,
                R.array.major_class_options,
                android.R.layout.simple_spinner_item
        );
        majorClassAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerMajorClass.setAdapter(majorClassAdapter);

        ArrayAdapter<CharSequence> collegeAdapter = ArrayAdapter.createFromResource(
                this,
                R.array.college_options,
                android.R.layout.simple_spinner_item
        );
        collegeAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerCollege.setAdapter(collegeAdapter);

        button2.setOnClickListener(v -> {
            String studentId = editTextStudentId.getText().toString().trim();
            String name = editTextName.getText().toString().trim();
            String majorClass = spinnerMajorClass.getSelectedItem().toString();
            String college = spinnerCollege.getSelectedItem().toString();

            if (studentId.isEmpty() || name.isEmpty()) {
                Toast.makeText(this, "请输入学号和姓名", Toast.LENGTH_SHORT).show();
                return;
            }

            String resultText = college + "\n" + majorClass + "\n" + name + "\n" + studentId;
            Intent data = new Intent();
            data.putExtra(EXTRA_RESULT, resultText);
            setResult(RESULT_OK, data);
            finish();
        });
    }
}
