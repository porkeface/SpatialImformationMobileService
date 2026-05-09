const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} = require("docx");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "output");
const outputFile = path.join(
  outputDir,
  "WebGIS开发环境搭建_GeoServer_PostGIS实验报告.docx"
);

fs.mkdirSync(outputDir, { recursive: true });

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" };
const cellBorders = {
  top: tableBorder,
  bottom: tableBorder,
  left: tableBorder,
  right: tableBorder,
};

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    ...opts,
    children: [
      new TextRun({
        text,
        size: opts.size || 24,
        bold: opts.bold || false,
        font: opts.font || "Microsoft YaHei",
      }),
    ],
  });
}

function codeLine(text) {
  return new Paragraph({
    spacing: { after: 40, line: 300 },
    indent: { left: 240 },
    shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
    border: {
      left: { style: BorderStyle.SINGLE, size: 6, color: "D9D9D9" },
    },
    children: [
      new TextRun({
        text,
        size: 21,
        font: "Consolas",
      }),
    ],
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { after: 80, line: 320 },
    numbering: { reference: "bullet-list", level: 0 },
    children: [new TextRun({ text, size: 24, font: "Microsoft YaHei" })],
  });
}

function step(text) {
  return new Paragraph({
    spacing: { after: 80, line: 320 },
    numbering: { reference: "step-list", level: 0 },
    children: [new TextRun({ text, size: 24, font: "Microsoft YaHei" })],
  });
}

const doc = new Document({
  creator: "OpenAI Codex",
  title: "WebGIS开发环境搭建、GeoServer/PostGIS安装实验报告",
  description: "GIS原理与开发课程实验报告",
  styles: {
    default: {
      document: {
        run: {
          font: "Microsoft YaHei",
          size: 24,
        },
      },
    },
    paragraphStyles: [
      {
        id: "Title",
        name: "Title",
        basedOn: "Normal",
        run: { font: "Microsoft YaHei", size: 36, bold: true, color: "1F1F1F" },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 240, after: 240 } },
      },
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "Microsoft YaHei", size: 30, bold: true, color: "1F1F1F" },
        paragraph: { spacing: { before: 220, after: 160 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "Microsoft YaHei", size: 26, bold: true, color: "1F1F1F" },
        paragraph: { spacing: { before: 180, after: 140 }, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullet-list",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "step-list",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "第 ", size: 20, font: "Microsoft YaHei" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 20, font: "Microsoft YaHei" }),
                new TextRun({ text: " 页", size: 20, font: "Microsoft YaHei" }),
              ],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({
          heading: HeadingLevel.TITLE,
          children: [
            new TextRun({
              text: "WebGIS开发环境搭建、GeoServer/PostGIS安装实验报告",
              bold: true,
              size: 36,
              font: "Microsoft YaHei",
            }),
          ],
        }),
        p("课程名称：GIS原理与开发", { alignment: AlignmentType.CENTER }),
        p("实验主题：基于 Docker 的 GeoServer 与 PostGIS 安装部署", {
          alignment: AlignmentType.CENTER,
        }),
        p("学生姓名：______________", { alignment: AlignmentType.CENTER }),
        p("学号：______________    班级：______________", {
          alignment: AlignmentType.CENTER,
        }),
        p("实验日期：2026 年 4 月 28 日", { alignment: AlignmentType.CENTER }),
        p(
          "摘要：本实验以 WebGIS 开发环境搭建为目标，采用 Docker 容器方式完成 PostGIS 数据库与 GeoServer 服务的安装部署，并完成两者之间的数据连接与图层发布。实验过程中重点验证了容器化部署的便捷性、服务连通性以及空间数据发布流程。最终实现了 PostGIS 空间数据库正常运行、GeoServer 后台成功登录、数据源连接正常建立，并具备后续 Web 地图服务发布与调用的基础条件。"
        ),

        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("一、实验目的")] }),
        bullet("掌握 WebGIS 开发环境的基本组成，理解空间数据库、地图服务器与前端应用之间的关系。"),
        bullet("掌握使用 Docker 部署 PostGIS 与 GeoServer 的基本流程，降低本地安装配置复杂度。"),
        bullet("掌握 GeoServer 连接 PostGIS 数据库、发布空间数据图层的关键步骤。"),
        bullet("为后续基于 OpenLayers、Leaflet 或 WebGL 的 WebGIS 开发打下运行环境基础。"),

        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("二、实验环境")] }),
        new Table({
          columnWidths: [2400, 6960],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 2400, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: { fill: "DDEBF7", type: ShadingType.CLEAR },
                  children: [p("项目", { bold: true, alignment: AlignmentType.CENTER })],
                }),
                new TableCell({
                  width: { size: 6960, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: { fill: "DDEBF7", type: ShadingType.CLEAR },
                  children: [p("内容", { bold: true, alignment: AlignmentType.CENTER })],
                }),
              ],
            }),
            ...[
              ["操作系统", "Windows 环境（具体版本以实验机实际配置为准）"],
              ["容器平台", "Docker Desktop / Docker Engine"],
              ["空间数据库", "PostGIS 容器，数据库用户 postgres，密码 123456"],
              ["地图服务器", "GeoServer 容器，管理员账号 admin，密码 123456"],
              ["访问工具", "浏览器、Docker 命令行、GeoServer Web 管理界面"],
              ["实验目标", "完成 GeoServer 与 PostGIS 的部署、连接和基础发布验证"],
            ].map(
              ([left, right]) =>
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 2400, type: WidthType.DXA },
                      borders: cellBorders,
                      children: [p(left)],
                    }),
                    new TableCell({
                      width: { size: 6960, type: WidthType.DXA },
                      borders: cellBorders,
                      children: [p(right)],
                    }),
                  ],
                })
            ),
          ],
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("三、实验原理")] }),
        p(
          "WebGIS 系统一般由前端表现层、地图服务层和空间数据层构成。前端页面负责地图展示与交互，GeoServer 负责将空间数据发布为标准地图服务，PostGIS 则负责对矢量空间数据进行存储、查询和管理。通过 Docker 将 GeoServer 与 PostGIS 运行在彼此独立的容器中，可以避免传统安装方式中依赖复杂、环境污染和版本冲突等问题。"
        ),
        p(
          "PostGIS 是 PostgreSQL 的空间扩展，它在关系数据库基础上增加了几何对象类型、空间索引和空间分析函数，使数据库能够直接管理点、线、面等空间对象。GeoServer 则是常用的开源地图服务器，可读取 PostGIS 中的数据，并发布为 WMS、WFS、WMTS 等服务，以便浏览器端 WebGIS 应用进行加载和展示。"
        ),

        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("四、实验内容与步骤")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Docker 环境准备")] }),
        step("启动 Docker Desktop，确认 Docker 服务正常运行。"),
        step("检查本机端口占用情况，确保 5432 端口可供 PostGIS 使用，8080 端口可供 GeoServer 使用。"),
        step("准备实验所需的空间数据文件，后续导入 PostGIS 或通过 GeoServer 直接读取。"),
        codeLine("docker --version"),
        codeLine("docker ps -a"),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 PostGIS 容器部署")] }),
        p("本实验中，PostGIS 采用 Docker 容器方式运行，数据库账户信息为：用户名 postgres，密码 123456。"),
        step("拉取 PostGIS 镜像。"),
        step("创建并启动 PostGIS 容器，映射本地 5432 端口。"),
        step("进入数据库后检查 PostGIS 扩展是否可用，并在目标数据库中启用空间扩展。"),
        codeLine("docker pull postgis/postgis"),
        codeLine("docker run -d --name postgis -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123456 postgis/postgis"),
        codeLine("docker exec -it postgis psql -U postgres"),
        codeLine("CREATE EXTENSION IF NOT EXISTS postgis;"),
        p(
          "完成上述步骤后，PostGIS 容器即可提供标准 PostgreSQL 数据库服务，同时具备空间数据存储与空间 SQL 查询能力。若后续需要导入 shp、geojson 或其他矢量数据，可借助 ogr2ogr、shp2pgsql 或图形化数据库工具完成。"
        ),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 GeoServer 容器部署")] }),
        p("GeoServer 同样采用 Docker 容器方式部署，实验登录账户为：admin，密码为：123456。"),
        step("拉取 GeoServer 镜像并启动容器，映射本地 8080 端口。"),
        step("在浏览器中访问 GeoServer 管理界面，确认服务启动成功。"),
        step("使用管理员账户登录后台，检查服务状态与工作区配置。"),
        codeLine("docker pull <geoserver-image>"),
        codeLine("docker run -d --name geoserver -p 8080:8080 <geoserver-image>"),
        codeLine("浏览器访问：http://localhost:8080/geoserver"),
        p(
          "由于 GeoServer 镜像来源可能因课程环境不同而略有差异，实际实验中只需保证容器能够正常启动，并对外提供 8080 端口访问即可。登录成功后，说明 GeoServer 服务端部署完成。"
        ),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.4 GeoServer 连接 PostGIS")] }),
        step("在 GeoServer 后台新建 Workspace，用于管理本次实验发布的数据。"),
        step("新建 Store，选择 PostGIS 作为数据源类型。"),
        step("填写数据库连接参数，包括主机、端口、数据库名、用户名和密码。"),
        step("测试连接成功后保存，并在 Store 中选择需要发布的数据表或视图。"),
        new Table({
          columnWidths: [2880, 5040],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 2880, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: { fill: "DDEBF7", type: ShadingType.CLEAR },
                  children: [p("连接项", { bold: true, alignment: AlignmentType.CENTER })],
                }),
                new TableCell({
                  width: { size: 5040, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: { fill: "DDEBF7", type: ShadingType.CLEAR },
                  children: [p("实验配置", { bold: true, alignment: AlignmentType.CENTER })],
                }),
              ],
            }),
            ...[
              ["Host", "PostGIS 容器地址或容器网络名"],
              ["Port", "5432"],
              ["Database", "postgres 或实验创建的业务库"],
              ["Schema", "public"],
              ["User", "postgres"],
              ["Password", "123456"],
            ].map(
              ([left, right]) =>
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 2880, type: WidthType.DXA },
                      borders: cellBorders,
                      children: [p(left)],
                    }),
                    new TableCell({
                      width: { size: 5040, type: WidthType.DXA },
                      borders: cellBorders,
                      children: [p(right)],
                    }),
                  ],
                })
            ),
          ],
        }),
        p(
          "如果 GeoServer 与 PostGIS 分别运行在不同容器中，则需要保证二者处于可通信的 Docker 网络中。若直接使用默认桥接网络或自定义网络，通常可以通过容器名进行访问。连接测试成功即说明地图服务层与空间数据层已打通。"
        ),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.5 图层发布与基础验证")] }),
        step("在 GeoServer 中选择目标数据表，点击 Publish 发布图层。"),
        step("配置图层名称、坐标参考系统、边界范围等信息。"),
        step("保存后进入 Layer Preview，验证图层是否能够正常显示。"),
        step("记录服务地址，供后续 WebGIS 前端加载调用。"),
        codeLine("WMS 示例：http://localhost:8080/geoserver/<workspace>/wms"),
        codeLine("WFS 示例：http://localhost:8080/geoserver/<workspace>/ows"),
        p(
          "通过图层预览可以直观判断数据是否成功发布。若预览页面能够显示空间对象，说明 PostGIS 数据读取正常、GeoServer 服务发布正常，实验环境已经具备后续 WebGIS 二次开发条件。"
        ),

        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("五、实验结果")] }),
        bullet("成功完成 Docker 环境下 PostGIS 与 GeoServer 的容器化部署。"),
        bullet("PostGIS 数据库服务可以正常启动并支持空间扩展。"),
        bullet("GeoServer 后台可以通过 admin / 123456 成功登录。"),
        bullet("GeoServer 能够连接 PostGIS 数据源，数据存储配置有效。"),
        bullet("实验环境已经具备发布地图服务和进行 WebGIS 前端开发的基础条件。"),

        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("六、实验中遇到的问题及解决办法")] }),
        bullet("问题一：容器启动后端口被占用，导致服务无法访问。解决办法：检查本机已有服务并更换映射端口或关闭冲突进程。"),
        bullet("问题二：GeoServer 无法连接 PostGIS。解决办法：确认数据库用户密码是否正确，检查容器网络是否互通，并核对主机名、端口和数据库名。"),
        bullet("问题三：发布图层后无法预览。解决办法：检查数据表是否包含几何字段，确认坐标参考系统设置正确，并重新计算图层边界范围。"),

        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("七、实验总结")] }),
        p(
          "通过本次实验，我掌握了基于 Docker 的 WebGIS 开发基础环境搭建方法，能够独立完成 PostGIS 空间数据库和 GeoServer 地图服务器的安装部署，并完成两者的连接与数据发布。与传统本地安装相比，容器化部署方式更轻量、更灵活，也更便于后续环境迁移和项目复现。"
        ),
        p(
          "本实验为后续开展 WebGIS 应用开发提供了稳定的服务基础。下一步可在前端引入 OpenLayers、Leaflet 或基于 WebGL 的可视化框架，通过调用 GeoServer 发布的 WMS/WFS 服务，实现地图浏览、空间查询和专题可视化等功能。"
        ),
        p("注：文中镜像名、数据库名和部分界面截图位置可依据个人实验过程进一步补充或替换。"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputFile, buffer);
  console.log(outputFile);
});
