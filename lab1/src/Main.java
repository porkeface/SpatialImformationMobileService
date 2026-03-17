import java.sql.*;

public class Main {
    public static void main(String[] args) {
        // 连接参数
        String url = "jdbc:postgresql://localhost:2345/postgresql";
        String user = "postgres";
        String password = "123456";

        Connection conn = null;
        PreparedStatement pstmt = null;


        try {


            // 直接测试驱动类是否存在
            Class.forName("org.postgresql.Driver");
            System.out.println("✅ 驱动类存在");

            // 测试连接
            conn = DriverManager.getConnection(url, user, password);
            System.out.println("✅ 数据库连接成功");

            // SQL 插入语句
            String sql = "INSERT INTO classlist (stuno, name, classname) VALUES (?, ?, ?)";

            // 创建预编译语句
            pstmt = conn.prepareStatement(sql);

            // 5. 设置参数
            pstmt.setString(1, "2312001101");  // 学号
            pstmt.setString(2, "陈立彬");      // 姓名
            pstmt.setString(3, "空间信息与数字技术");  // 班级

            // 6. 执行插入
            int rows = pstmt.executeUpdate();
            System.out.println("✅ 成功插入 " + rows + " 条记录");


        } catch (ClassNotFoundException e) {
            System.out.println("❌ 驱动类找不到: " + e.getMessage());
            System.out.println("请检查 JAR 是否正确添加");
        } catch (SQLException e) {
            System.out.println("❌ 数据库错误: " + e.getMessage());
        }finally {
            // 关闭资源
            try { if (pstmt != null) pstmt.close(); } catch (SQLException e) {}
            try { if (conn != null) conn.close(); } catch (SQLException e) {}
        }
    }
}