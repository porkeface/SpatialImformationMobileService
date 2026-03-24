package com.example.lab2

import android.graphics.Color
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val txtResults = findViewById<TextView>(R.id.txt_results)
        val buttonOk = findViewById<Button>(R.id.bnt_ok)
        val editPassword = findViewById<EditText>(R.id.edit_Password)

        buttonOk.setOnClickListener {
            val pwd = editPassword.text.toString().trim()
            if (pwd == "abc") {
                txtResults.text = "202105132 \u738B\u5C0F\u660E!"
                txtResults.setTextColor(Color.BLACK)
                txtResults.textSize = 20f
            } else {
                txtResults.text = "\u975E\u6CD5\u7528\u6237\uFF0C\u8BF7\u79BB\u5F00\uFF01"
                txtResults.setTextColor(Color.rgb(55, 0, 150))
                txtResults.textSize = 30f
            }
        }
    }
}
