## 具体项目指导书格式与基本内容要求

## 实验十二 Android SQLite 移动数据管理

### 实验学时：2

### 实验类型：（演示、验证、综合、设计、研究）

### 实验要求：（必修、选修）

### 一、实验目的

### 通过本实验的学习，使学生了解或掌握 Android 开发的基础知识，训练和培养

### Android SQLite 移动数据管理的使用技能，为今后继续对移动 GIS 实验系统和原理

### 的学习奠定基础。

### 二、实验内容

### 1. 掌握 Android SQLite 数据库的数据增删改查操作开发

### 2. 理解和掌握 Android SQLite 数据的可视化管理

### 三、实验原理、方法和手段

### SQLite 是一款轻型的数据库，是遵守 ACID 的关系型数据库管理系统，它包

### 含在一个相对小的 C 库中。它是 D. Richard Hipp 建立的公有领域项目。它的设计

### 目标是嵌入式的，而且目前已经在很多嵌入式产品中使用了它，它占用资源非常的

### 低 ， 在 嵌 入 式 设 备 中 ， 可 能 只 需 要 几 百 K 的 内 存 就 够 了 。 它 能 够 支 持

### Windows/Linux/Unix 等主流的操作系统，同时能够跟很多程序语言相结合，比如

### TCL、C#、PHP、Java 等，还有 ODBC 接口，同样比起 MySQL、PostgreSQL 这两

### 款开源的世界著名数据库管理系统，它的处理速度比他们都快。SQLite 第一个

### Alpha 版本诞生于 2000 年 5 月。

### ACID，是用来声明数据库事务的四大特性，即原子性 (Atomicity)、 一致性

### (Consistency)、独立性或隔离性(Isolation) 和 可持久性(Durability)。

### 四、实验组织运行要求

### 本实验需要电脑操作使用，所以实验组织采用集中在计算机与信息工程学院

### 机房的授课形式。

### 五、实验条件

### 仪器：电脑；

### 软件：Java JDK，Android Studio；

### 实验场地：遥感与地理信息系统实验室 实验楼 1-216。

### 六、实验步骤

### 1. 本次课的任务是把身高和体重数据存入 SQLite 数据库，然后从 SQLite 数

### 据库中读取身高和体重，计算 BMI（英文为 Body Mass Index，身体质量指数，

### 是用体重公斤数除以身高米数平方得出的数字，是目前国际上常用的衡量人

### 体胖瘦程度以及是否健康的一个标准。）值，并在程序界面中显示；

### 2. Android Studio 中新建项目名称-学生英文名，并建立 DB 类用于 SQLite 数

### 据库管理；

### 参看 SQLite 数据库的使用方法

//DB 类的代码如下（这里只列出了查询的方法，其它增删改的方法也可以类似地编写）： package com.demo.android.bmi;

import android.content.Context; import android.database.Cursor; import android.database.SQLException; import android.database.sqlite.SQLiteDatabase; import android.database.sqlite.SQLiteOpenHelper;

public class DB { //定义静态变量； private static final String DATABASE_NAME="bmidata.db"; private static final int DATABASE_VERSION=1; private static final String DATABASE_TABLE="bmidatatable"; private static final String DATABASE_CREATE="create table bmidatatable("+"id integer,"+"name text,"+"height integer,"+"weight integer"+");";

private static class DatabaseHelper extends SQLiteOpenHelper{ public DatabaseHelper(Context context) { super(context, DATABASE_NAME, null, DATABASE_VERSION); // TODO Auto-generated constructor stub }

@Override public void onCreate(SQLiteDatabase db) { // TODO Auto-generated method stub db.execSQL(DATABASE_CREATE); }

@Override public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) { // TODO Auto-generated method stub db.execSQL("drop table if exists"+DATABASE_TABLE); onCreate(db); } }

private Context mCtx=null; private DatabaseHelper dbHelper; private SQLiteDatabase db;

public DB(Context ctx){ this.mCtx=ctx; }

public DB open() throws SQLException{ dbHelper=new DatabaseHelper(mCtx); db=dbHelper.getWritableDatabase(); return this; }

public void close(){ dbHelper.close(); }

public static final String KEY_ROWID="id"; public static final String KEY_NAME="name"; public static final String KEY_HEIGHT="height"; public static final String KEY_WEIGHT="weight";

//将查询到的数据库数据赋给指针Cursor； public Cursor getAll(){ return db.rawQuery("select * from bmidatatable", null);

}

//根据数据表的行id查询数据表的单行数据赋给指针Cursor； public Cursor get(long rowID) throws SQLException{ Cursor mCursor=db.query(DATABASE_TABLE, new String[]{KEY_ROWID, KEY_NAME, KEY_HEIGHT,KEY_WEIGHT}, KEY_ROWID+"="+rowID, null, null, null, null); if(mCursor!=null){ mCursor.moveToFirst(); }

return mCursor; }

//添加字段 public long insertInfo(int id, String name, int height,int weight) { /* ContentValues */

} }

### 3. Android Studio 中修改 Activity 程序界面

### 在 Activity 界面中，一个 Button 按钮和一个 TextView 文本框，Button 按钮添

### 加监听动作用于触发计算 BMI 的动作，TextView 文本框用于显示计算得到的 BMI

### 值。这部分内容若有不清楚可参见实验四（Button 按钮的使用）和实验五（各类界

### 面控件设计）。

### 4. Android Studio 中的 BMI 类对 DB 类的调用实现查询和调用 SQLite 数据表

### 中的数据；

//在 Bmi 类中添加如下代码

### 5. 运行程序查看效果运行程序，程序运行起来后，点击计算按钮，查看是否

### 有 计 算 BMI 值 。 然 后 ， 可 以 改 变 数 据 表 的 数 据 ， 并 更 改 Bmi 类 中

### mBodyCursor=mDbHelper.get(1)指定的 id 值，查看计算的 BMI 值是否有变化。

### 并在下课前提交程序运行结果的截图到指定的链接。

### 七、实验报告

### 在进行实验之前，要求学生参照已提供的参考文献查阅相关资料进行预习，在

### 实验过程做好相应的记录。

### 八、知识点补充

https://www.cnblogs.com/rayray/p/3410204.html 【Android】ContentValues的用法 ContentValues一种存储的机制，可以存储基本类型的数据，string, int, double等；在数据库 中插入数据的时候，首先创建ContentValues的对象

ContentValues initialValues = new ContentValues();

//ContentValues的 put()方法输入健值对

initialValues.put(key,values);

SQLiteDataBase sdb ;

//利用数据库的 insert方法把数据记录插入数据库；

sdb.insert(database_name, null, initialValues);

插入成功就返回记录的 id 否则返回-1；

### https://cn.onlinebmicalculator.com/

### 计算你的身体质量指数 (BMI)

### https://blog.csdn.net/ezconn/article/details/108655624

### SQLite 简介和创建 SQLiteOpenHelper

通过 Android Studio 的 Tools--Android--Profilter 工具下的 Device File Explorer--data--data-- com.example.lab12--databases--bmidata.db 文件导出到 PC，然后，在 PC 中双击打开 DB Browser for SQLite，从而打开 bmidata 数据文件，查看 BMI 数据库和数据表。

### https://baijiahao.baidu.com/s?id=1706336909281153777&wfr=spider&for=pc