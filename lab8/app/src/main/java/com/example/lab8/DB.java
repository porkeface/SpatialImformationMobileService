package com.example.lab8;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DB {

    private static final String DATABASE_NAME = "bmidata.db";
    private static final int DATABASE_VERSION = 1;
    private static final String DATABASE_TABLE = "bmidatatable";
    private static final String DATABASE_CREATE =
            "create table " + DATABASE_TABLE + "("
                    + "student_id text primary key,"
                    + "name text,"
                    + "height integer,"
                    + "weight integer"
                    + ");";

    public static final String KEY_STUDENT_ID = "student_id";
    public static final String KEY_NAME = "name";
    public static final String KEY_HEIGHT = "height";
    public static final String KEY_WEIGHT = "weight";

    private final Context mCtx;
    private DatabaseHelper dbHelper;
    private SQLiteDatabase db;

    private static class DatabaseHelper extends SQLiteOpenHelper {

        public DatabaseHelper(Context context) {
            super(context, DATABASE_NAME, null, DATABASE_VERSION);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {
            db.execSQL(DATABASE_CREATE);
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
            db.execSQL("DROP TABLE IF EXISTS " + DATABASE_TABLE);
            onCreate(db);
        }
    }

    public DB(Context ctx) {
        this.mCtx = ctx;
    }

    public DB open() throws SQLException {
        dbHelper = new DatabaseHelper(mCtx);
        db = dbHelper.getWritableDatabase();
        return this;
    }

    public void close() {
        dbHelper.close();
    }

    // 插入数据
    public long insertInfo(String studentId, String name, int height, int weight) {
        ContentValues initialValues = new ContentValues();
        initialValues.put(KEY_STUDENT_ID, studentId);
        initialValues.put(KEY_NAME, name);
        initialValues.put(KEY_HEIGHT, height);
        initialValues.put(KEY_WEIGHT, weight);
        return db.insert(DATABASE_TABLE, null, initialValues);
    }

    // 删除数据
    public boolean deleteInfo(String studentId) {
        return db.delete(DATABASE_TABLE, KEY_STUDENT_ID + "=?", new String[]{studentId}) > 0;
    }

    // 更新数据
    public boolean updateInfo(String studentId, String name, int height, int weight) {
        ContentValues args = new ContentValues();
        args.put(KEY_NAME, name);
        args.put(KEY_HEIGHT, height);
        args.put(KEY_WEIGHT, weight);
        return db.update(DATABASE_TABLE, args, KEY_STUDENT_ID + "=?", new String[]{studentId}) > 0;
    }

    // 查询所有数据
    public Cursor getAll() {
        return db.rawQuery("SELECT * FROM " + DATABASE_TABLE, null);
    }

    // 根据学号查询单行数据
    public Cursor get(String studentId) throws SQLException {
        Cursor mCursor = db.query(
                DATABASE_TABLE,
                new String[]{KEY_STUDENT_ID, KEY_NAME, KEY_HEIGHT, KEY_WEIGHT},
                KEY_STUDENT_ID + "=?",
                new String[]{studentId},
                null, null, null
        );
        if (mCursor != null) {
            mCursor.moveToFirst();
        }
        return mCursor;
    }
}
