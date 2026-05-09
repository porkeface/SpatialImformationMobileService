const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'porkeface';
pres.title = '实验四&实验五整合实现分享';

// Color palette: Ocean Gradient
const COLOR_PRIMARY = "065A82";    // deep blue
const COLOR_SECONDARY = "1C7293";  // teal
const COLOR_ACCENT = "21295C";      // midnight
const COLOR_WHITE = "FFFFFF";
const COLOR_LIGHT = "F2F2F2";
const COLOR_DARK = "1E293B";
const COLOR_MUTED = "64748B";

// ─── Slide 1: Cover ──────────────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: COLOR_ACCENT };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 5.625,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });

  slide.addShape(pres.shapes.OVAL, {
    x: 7.5, y: -0.8, w: 3.5, h: 3.5,
    fill: { color: COLOR_SECONDARY, transparency: 80 }, line: { color: COLOR_SECONDARY, transparency: 80 }
  });

  slide.addShape(pres.shapes.OVAL, {
    x: -1, y: 3.5, w: 2.5, h: 2.5,
    fill: { color: COLOR_PRIMARY, transparency: 85 }, line: { color: COLOR_PRIMARY, transparency: 85 }
  });

  slide.addText("实验四 & 实验五", {
    x: 0.5, y: 1.2, w: 9, h: 0.8,
    fontSize: 44, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, align: "center"
  });

  slide.addText("整合实现分享", {
    x: 0.5, y: 2.0, w: 9, h: 0.7,
    fontSize: 36, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, align: "center"
  });

  slide.addText("基于高德SDK的Android空间信息服务APP", {
    x: 0.5, y: 2.9, w: 9, h: 0.5,
    fontSize: 18, fontFace: "Calibri", color: COLOR_SECONDARY,
    align: "center", italic: true
  });

  slide.addShape(pres.shapes.LINE, {
    x: 2.5, y: 3.6, w: 5, h: 0,
    line: { color: COLOR_SECONDARY, width: 1.5 }
  });

  slide.addText([
    { text: "姓名：porkeface", options: { breakLine: true } },
    { text: "学号：（请自行填写）", options: { breakLine: true } },
    { text: "日期：2026/04/27" }
  ], {
    x: 3, y: 3.8, w: 4, h: 1.2,
    fontSize: 14, fontFace: "Calibri", color: COLOR_LIGHT,
    align: "center", valign: "middle"
  });
}

// ─── Slide 2: Table of Contents ────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: COLOR_WHITE };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: COLOR_ACCENT }, line: { color: COLOR_ACCENT }
  });
  slide.addText("目录 / Contents", {
    x: 0.5, y: 0.2, w: 9, h: 0.7,
    fontSize: 28, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 1.1, w: 0.08, h: 4.525,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });

  const sections = [
    { num: "01", title: "实验背景与目标", desc: "实验四 & 实验五要求说明" },
    { num: "02", title: "高德SDK集成与Key配置", desc: "SDK集成流程与踩坑经验" },
    { num: "03", title: "动态权限申请实现", desc: "Android 6.0+ 运行时权限" },
    { num: "04", title: "定位与地址解析", desc: "高精度定位与地址信息获取" },
    { num: "05", title: "功能整合与UI设计", desc: "Material Design 3 组件应用" },
    { num: "06", title: "难点与解决方案", desc: "核心技术难点与应对策略" },
    { num: "07", title: "结果展示", desc: "APP运行效果展示" },
    { num: "08", title: "总结与展望", desc: "完成情况与未来扩展" },
  ];

  const col1Items = sections.slice(0, 4);
  const col2Items = sections.slice(4, 8);

  let yPos = 1.3;
  for (let i = 0; i < col1Items.length; i++) {
    const item = col1Items[i];
    slide.addShape(pres.shapes.OVAL, {
      x: 0.3, y: yPos, w: 0.4, h: 0.4,
      fill: { color: COLOR_PRIMARY }, line: { color: COLOR_PRIMARY }
    });
    slide.addText(item.num, {
      x: 0.3, y: yPos, w: 0.4, h: 0.4,
      fontSize: 12, fontFace: "Arial Black", color: COLOR_WHITE,
      bold: true, align: "center", valign: "middle", margin: 0
    });
    slide.addText(item.title, {
      x: 0.8, y: yPos, w: 3.8, h: 0.22,
      fontSize: 14, fontFace: "Arial Black", color: COLOR_DARK,
      bold: true, margin: 0
    });
    slide.addText(item.desc, {
      x: 0.8, y: yPos + 0.22, w: 3.8, h: 0.18,
      fontSize: 11, fontFace: "Calibri", color: COLOR_MUTED, margin: 0
    });
    yPos += 0.55;
  }

  yPos = 1.3;
  for (let i = 0; i < col2Items.length; i++) {
    const item = col2Items[i];
    slide.addShape(pres.shapes.OVAL, {
      x: 5.3, y: yPos, w: 0.4, h: 0.4,
      fill: { color: COLOR_PRIMARY }, line: { color: COLOR_PRIMARY }
    });
    slide.addText(item.num, {
      x: 5.3, y: yPos, w: 0.4, h: 0.4,
      fontSize: 12, fontFace: "Arial Black", color: COLOR_WHITE,
      bold: true, align: "center", valign: "middle", margin: 0
    });
    slide.addText(item.title, {
      x: 5.8, y: yPos, w: 3.8, h: 0.22,
      fontSize: 14, fontFace: "Arial Black", color: COLOR_DARK,
      bold: true, margin: 0
    });
    slide.addText(item.desc, {
      x: 5.8, y: yPos + 0.22, w: 3.8, h: 0.18,
      fontSize: 11, fontFace: "Calibri", color: COLOR_MUTED, margin: 0
    });
    yPos += 0.55;
  }
}

// ─── Slide 3: 实验背景与目标 ─────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: COLOR_WHITE };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: COLOR_ACCENT }, line: { color: COLOR_ACCENT }
  });
  slide.addText("01 / 实验背景与目标", {
    x: 0.5, y: 0.2, w: 9, h: 0.7,
    fontSize: 26, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 1.1, w: 0.08, h: 4.525,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });

  // Lab 4 card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.3, w: 4.3, h: 2.0,
    fill: { color: COLOR_LIGHT }, line: { color: COLOR_PRIMARY, width: 1.5 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.3, w: 4.3, h: 0.45,
    fill: { color: COLOR_PRIMARY }, line: { color: COLOR_PRIMARY }
  });
  slide.addText("实验四", {
    x: 0.4, y: 1.3, w: 4.3, h: 0.45,
    fontSize: 16, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, align: "center", valign: "middle", margin: 0
  });
  slide.addText([
    { text: "高德SDK集成（build.gradle依赖）", options: { bullet: true, breakLine: true } },
    { text: "地图显示（普通/卫星切换）", options: { bullet: true, breakLine: true } },
    { text: "定位功能实现（高精度）", options: { bullet: true, breakLine: true } },
    { text: "地址解析（定位结果自动返回）", options: { bullet: true } }
  ], {
    x: 0.55, y: 1.85, w: 4.0, h: 1.35,
    fontSize: 13, fontFace: "Calibri", color: COLOR_DARK
  });

  // Lab 5 card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.3, w: 4.3, h: 2.0,
    fill: { color: COLOR_LIGHT }, line: { color: COLOR_SECONDARY, width: 1.5 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.3, w: 4.3, h: 0.45,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });
  slide.addText("实验五", {
    x: 5.3, y: 1.3, w: 4.3, h: 0.45,
    fontSize: 16, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, align: "center", valign: "middle", margin: 0
  });
  slide.addText([
    { text: "空间信息展示（卡片式UI）", options: { bullet: true, breakLine: true } },
    { text: "交互设计（FAB/按钮/对话框）", options: { bullet: true, breakLine: true } },
    { text: "目标站点标记与一键跳转", options: { bullet: true, breakLine: true } },
    { text: "历史信息查询（AlertDialog）", options: { bullet: true } }
  ], {
    x: 5.45, y: 1.85, w: 4.0, h: 1.35,
    fontSize: 13, fontFace: "Calibri", color: COLOR_DARK
  });

  // Integration note
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.5, w: 9.2, h: 1.2,
    fill: { color: "FFF3CD" }, line: { color: "FFC107", width: 1 }
  });
  slide.addText("lab5 = 实验四 + 实验五 整合", {
    x: 0.6, y: 3.6, w: 9, h: 0.3,
    fontSize: 16, fontFace: "Arial Black", color: COLOR_PRIMARY,
    bold: true, margin: 0
  });
  slide.addText("一个MainActivity整合所有核心功能，实现完整的Android空间信息服务APP", {
    x: 0.6, y: 3.95, w: 9, h: 0.6,
    fontSize: 13, fontFace: "Calibri", color: COLOR_DARK, margin: 0
  });

  slide.addShape(pres.shapes.LINE, {
    x: 4.7, y: 2.3, w: 0.6, h: 0,
    line: { color: COLOR_ACCENT, width: 2 }
  });
}

// ─── Slide 4: 高德SDK集成与Key配置 ──────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: COLOR_WHITE };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: COLOR_ACCENT }, line: { color: COLOR_ACCENT }
  });
  slide.addText("02 / 高德SDK集成与Key配置", {
    x: 0.5, y: 0.2, w: 9, h: 0.7,
    fontSize: 24, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 1.1, w: 0.08, h: 4.525,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });

  // Flow chart
  const flowSteps = [
    { text: "1. 在 build.gradle 添加高德地图/定位 SDK 依赖", icon: "📦" },
    { text: "2. 注册高德开发者账号并申请 Key", icon: "🔑" },
    { text: "3. 包名必须与申请 Key 时填写的一致", icon: "📦" },
    { text: "4. AndroidManifest 配置 meta-data 和权限", icon: "⚙️" },
    { text: "5. 初始化 MapView 与定位客户端", icon: "🗺️" },
  ];

  let fy = 1.3;
  for (let i = 0; i < flowSteps.length; i++) {
    const step = flowSteps[i];
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y: fy, w: 5.5, h: 0.45,
      fill: { color: i % 2 === 0 ? COLOR_LIGHT : COLOR_WHITE },
      line: { color: COLOR_PRIMARY, width: 1 }
    });
    slide.addText(step.icon + "  " + step.text, {
      x: 0.5, y: fy, w: 5.3, h: 0.45,
      fontSize: 11, fontFace: "Calibri", color: COLOR_DARK,
      valign: "middle", margin: 0
    });
    if (i < flowSteps.length - 1) {
      slide.addShape(pres.shapes.LINE, {
        x: 2.95, y: fy + 0.45, w: 0, h: 0.15,
        line: { color: COLOR_PRIMARY, width: 1.5 }
      });
    }
    fy += 0.6;
  }

  // Right side: Pit note
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 6.2, y: 1.3, w: 3.4, h: 3.5,
    fill: { color: "FFEBEE" }, line: { color: "E53935", width: 1.5 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 6.2, y: 1.3, w: 3.4, h: 0.5,
    fill: { color: "E53935" }, line: { color: "E53935" }
  });
  slide.addText("⚠️ 踩坑经验", {
    x: 6.2, y: 1.3, w: 3.4, h: 0.5,
    fontSize: 15, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, align: "center", valign: "middle", margin: 0
  });
  slide.addText([
    { text: "修改包名导致 Key 失效！", options: { bold: true, breakLine: true, fontSize: 13, color: "B71C1C" } },
    { text: "Git 提交记录：", options: { breakLine: true, fontSize: 12, color: COLOR_DARK } },
    { text: "\"修改了包名，重新使用了合适的高德Android服务key\"", options: { breakLine: true, italic: true, fontSize: 11, color: "C62828" } },
    { text: "", options: { breakLine: true } },
    { text: "解决方案：", options: { bold: true, breakLine: true, fontSize: 12, color: COLOR_DARK } },
    { text: "• 包名变更后必须重新申请 Key", options: { breakLine: true, fontSize: 11, color: COLOR_DARK } },
    { text: "• 确保 Manifest 中的 package 与申请 Key 时一致", options: { breakLine: true, fontSize: 11, color: COLOR_DARK } },
    { text: "• Key 配置在 AndroidManifest 的 meta-data 中", options: { fontSize: 11, color: COLOR_DARK } }
  ], {
    x: 6.35, y: 1.9, w: 3.1, h: 2.8,
    fontFace: "Calibri", margin: 0
  });
}

// ─── Slide 5: 动态权限申请 ───────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: COLOR_WHITE };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: COLOR_ACCENT }, line: { color: COLOR_ACCENT }
  });
  slide.addText("03 / 动态权限申请实现", {
    x: 0.5, y: 0.2, w: 9, h: 0.7,
    fontSize: 24, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 1.1, w: 0.08, h: 4.525,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });

  slide.addText("Android 6.0+ 运行时权限要求", {
    x: 0.3, y: 1.25, w: 5.5, h: 0.35,
    fontSize: 15, fontFace: "Arial Black", color: COLOR_PRIMARY, bold: true, margin: 0
  });

  slide.addText([
    { text: "定位权限属于危险权限，不能仅声明在 Manifest 中", options: { bullet: true, breakLine: true } },
    { text: "需要在运行时动态申请：", options: { bullet: true, breakLine: true } },
    { text: "ACCESS_FINE_LOCATION（精确位置）", options: { bullet: true, indentLevel: 1, breakLine: true } },
    { text: "ACCESS_COARSE_LOCATION（粗略位置）", options: { bullet: true, indentLevel: 1, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "本项目方案：ActivityResultLauncher", options: { bold: true, breakLine: true } },
    { text: "使用新的 API 替代旧的 requestPermissions", options: { bullet: true, breakLine: true } },
    { text: "处理用户「同意」和「拒绝」两种场景", options: { bullet: true, breakLine: true } },
    { text: "拒绝时显示友好提示，引导去设置页", options: { bullet: true } }
  ], {
    x: 0.3, y: 1.7, w: 5.5, h: 3.5,
    fontSize: 12.5, fontFace: "Calibri", color: COLOR_DARK
  });

  // Right: Code preview
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 6.0, y: 1.25, w: 3.6, h: 3.9,
    fill: { color: "1E1E1E" }, line: { color: COLOR_PRIMARY, width: 1 }
  });
  slide.addText("代码片段", {
    x: 6.0, y: 1.25, w: 3.6, h: 0.35,
    fontSize: 11, fontFace: "Calibri", color: "CCCCCC",
    italic: true, align: "center", valign: "middle", margin: 0
  });
  slide.addText([
    { text: "permissionLauncher = ", options: { fontSize: 9, color: "9CDCFE", breakLine: true } },
    { text: "  registerForActivityResult(", options: { fontSize: 9, color: "D4D4D4", breakLine: true } },
    { text: "    new ActivityResultContracts.", options: { fontSize: 9, color: "D4D4D4", breakLine: true } },
    { text: "      RequestMultiplePermissions(),", options: { fontSize: 9, color: "D4D4D4", breakLine: true } },
    { text: "    result -> {", options: { fontSize: 9, color: "D4D4D4", breakLine: true } },
    { text: "      if (fineGranted || coarseGranted)", options: { fontSize: 9, color: "6A9955", breakLine: true } },
    { text: "        startLocation();  // 同意", options: { fontSize: 9, color: "D4D4D4", breakLine: true } },
    { text: "      else", options: { fontSize: 9, color: "D4D4D4", breakLine: true } },
    { text: "        showDenied();    // 拒绝", options: { fontSize: 9, color: "D4D4D4", breakLine: true } },
    { text: "    });", options: { fontSize: 9, color: "D4D4D4" } }
  ], {
    x: 6.1, y: 1.65, w: 3.4, h: 2.5,
    fontFace: "Consolas", margin: 0
  });
}

// ─── Slide 6: 定位与地址解析 ──────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: COLOR_WHITE };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: COLOR_ACCENT }, line: { color: COLOR_ACCENT }
  });
  slide.addText("04 / 定位与地址解析", {
    x: 0.5, y: 0.2, w: 9, h: 0.7,
    fontSize: 24, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 1.1, w: 0.08, h: 4.525,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });

  // Left column: Init params
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 1.25, w: 4.5, h: 0.38,
    fill: { color: COLOR_PRIMARY }, line: { color: COLOR_PRIMARY }
  });
  slide.addText("定位客户端初始化参数", {
    x: 0.3, y: 1.25, w: 4.5, h: 0.38,
    fontSize: 13, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, align: "center", valign: "middle", margin: 0
  });
  slide.addText([
    { text: "定位模式：Hight_Accuracy（高精度）", options: { bullet: true, breakLine: true } },
    { text: "是否单次定位：true", options: { bullet: true, breakLine: true } },
    { text: "超时时间：20000ms（20秒）", options: { bullet: true, breakLine: true } },
    { text: "需要地址信息：true（setNeedAddress）", options: { bullet: true, breakLine: true } },
    { text: "是否使用缓存：false", options: { bullet: true, breakLine: true } },
    { text: "Mock定位：false（禁用模拟）", options: { bullet: true } }
  ], {
    x: 0.3, y: 1.7, w: 4.5, h: 2.2,
    fontSize: 12, fontFace: "Calibri", color: COLOR_DARK
  });

  // Right column: Address parsing + safe method
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.25, w: 4.5, h: 0.38,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });
  slide.addText("地址解析 & 空值处理", {
    x: 5.2, y: 1.25, w: 4.5, h: 0.38,
    fontSize: 13, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, align: "center", valign: "middle", margin: 0
  });

  slide.addText("setNeedAddress(true) 后自动返回：", {
    x: 5.2, y: 1.7, w: 4.5, h: 0.25,
    fontSize: 12, fontFace: "Arial Black", color: COLOR_DARK, bold: true, margin: 0
  });
  slide.addText([
    { text: "国家 / 省份 / 城市 / 区县", options: { bullet: true, breakLine: true } },
    { text: "街道 / 门牌号", options: { bullet: true, breakLine: true } },
    { text: "POI名称（兴趣点）", options: { bullet: true, breakLine: true } },
    { text: "AOI名称（区域兴趣点）", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "空值保护：safe() 方法", options: { bold: true, breakLine: true, color: COLOR_PRIMARY } },
    { text: "对 null 值返回空字符串，避免 APP 崩溃", options: { fontSize: 11, color: COLOR_MUTED } }
  ], {
    x: 5.2, y: 2.0, w: 4.5, h: 2.5,
    fontSize: 12, fontFace: "Calibri", color: COLOR_DARK
  });
}

// ─── Slide 7: 功能整合与UI设计 ──────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: COLOR_WHITE };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: COLOR_ACCENT }, line: { color: COLOR_ACCENT }
  });
  slide.addText("05 / 功能整合与UI设计", {
    x: 0.5, y: 0.2, w: 9, h: 0.7,
    fontSize: 24, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 1.1, w: 0.08, h: 4.525,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });

  // Left: Features
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 1.25, w: 4.5, h: 0.38,
    fill: { color: COLOR_PRIMARY }, line: { color: COLOR_PRIMARY }
  });
  slide.addText("MainActivity 整合功能", {
    x: 0.3, y: 1.25, w: 4.5, h: 0.38,
    fontSize: 13, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, align: "center", valign: "middle", margin: 0
  });
  slide.addText([
    { text: "🗺️ 地图显示与类型切换", options: { breakLine: true } },
    { text: "   普通地图 ↔ 卫星地图（setMapType）", options: { fontSize: 11, color: COLOR_MUTED, breakLine: true } },
    { text: "📍 定位功能（FloatingActionButton触发）", options: { breakLine: true } },
    { text: "   ActivityResultLauncher 动态申请权限", options: { fontSize: 11, color: COLOR_MUTED, breakLine: true } },
    { text: "📌 目标站点标记与一键跳转", options: { breakLine: true } },
    { text: "   预设坐标 TARGET_SITE + Marker + 移动视角", options: { fontSize: 11, color: COLOR_MUTED, breakLine: true } },
    { text: "📖 历史信息查询（AlertDialog）", options: { breakLine: true } },
    { text: "   展示站点历史介绍信息", options: { fontSize: 11, color: COLOR_MUTED } }
  ], {
    x: 0.3, y: 1.7, w: 4.5, h: 3.0,
    fontSize: 12, fontFace: "Calibri", color: COLOR_DARK
  });

  // Right: UI Design
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.25, w: 4.5, h: 0.38,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });
  slide.addText("Material Design 3 组件", {
    x: 5.2, y: 1.25, w: 4.5, h: 0.38,
    fontSize: 13, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, align: "center", valign: "middle", margin: 0
  });
  slide.addText([
    { text: "FloatingActionButton", options: { bold: true, breakLine: true } },
    { text: "   地图类型切换 + 我的位置", options: { fontSize: 11, color: COLOR_MUTED, breakLine: true } },
    { text: "MaterialCardView", options: { bold: true, breakLine: true } },
    { text: "   定位信息卡片（全屏居中）+ 站点信息卡片（底部）", options: { fontSize: 11, color: COLOR_MUTED, breakLine: true } },
    { text: "MaterialButton", options: { bold: true, breakLine: true } },
    { text: "   \"去这里\" + \"查看历史\"", options: { fontSize: 11, color: COLOR_MUTED, breakLine: true } },
    { text: "AlertDialog", options: { bold: true, breakLine: true } },
    { text: "   历史信息弹窗展示", options: { fontSize: 11, color: COLOR_MUTED, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "布局设计：全屏地图 + 悬浮操作层", options: { italic: true, color: COLOR_PRIMARY } }
  ], {
    x: 5.2, y: 1.7, w: 4.5, h: 3.0,
    fontSize: 12, fontFace: "Calibri", color: COLOR_DARK
  });
}

// ─── Slide 8: 难点与解决方案 ─────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: COLOR_WHITE };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: COLOR_ACCENT }, line: { color: COLOR_ACCENT }
  });
  slide.addText("06 / 难点与解决方案", {
    x: 0.5, y: 0.2, w: 9, h: 0.7,
    fontSize: 24, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 1.1, w: 0.08, h: 4.525,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });

  const difficulties = [
    {
      num: "1",
      title: "生命周期管理",
      problem: "MapView 与定位客户端需要跟随 Activity 生命周期",
      solution: "在 onCreate/onResume/onPause/onDestroy 中分别调用对应方法，避免内存泄漏"
    },
    {
      num: "2",
      title: "地址拼接逻辑",
      problem: "POI/AOI 可能为空，直接拼接会导致显示不完整",
      solution: "使用 buildPoiOrAoi() 方法优先取 POI，其次 AOI，为空时不影响其他地址信息显示"
    },
    {
      num: "3",
      title: "定位失败处理",
      problem: "定位可能失败（网络、GPS、Key 等问题）",
      solution: "展示错误码 getErrorCode、错误信息 getErrorInfo 和详细描述 getLocationDetail，方便排查"
    }
  ];

  let dy = 1.25;
  for (let i = 0; i < difficulties.length; i++) {
    const d = difficulties[i];
    slide.addShape(pres.shapes.OVAL, {
      x: 0.3, y: dy, w: 0.45, h: 0.45,
      fill: { color: COLOR_PRIMARY }, line: { color: COLOR_PRIMARY }
    });
    slide.addText(d.num, {
      x: 0.3, y: dy, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: "Arial Black", color: COLOR_WHITE,
      bold: true, align: "center", valign: "middle", margin: 0
    });

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.85, y: dy, w: 8.85, h: 1.05,
      fill: { color: COLOR_LIGHT }, line: { color: COLOR_PRIMARY, width: 1 }
    });
    slide.addText(d.title, {
      x: 0.95, y: dy + 0.05, w: 8.6, h: 0.25,
      fontSize: 14, fontFace: "Arial Black", color: COLOR_PRIMARY,
      bold: true, margin: 0
    });
    slide.addText("问题：" + d.problem, {
      x: 0.95, y: dy + 0.32, w: 8.6, h: 0.22,
      fontSize: 11, fontFace: "Calibri", color: COLOR_DARK, margin: 0
    });
    slide.addText("解决：" + d.solution, {
      x: 0.95, y: dy + 0.58, w: 8.6, h: 0.4,
      fontSize: 11, fontFace: "Calibri", color: "2E7D32", margin: 0
    });

    dy += 1.2;
  }
}

// ─── Slide 9: 结果展示 ───────────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: COLOR_WHITE };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: COLOR_ACCENT }, line: { color: COLOR_ACCENT }
  });
  slide.addText("07 / 结果展示", {
    x: 0.5, y: 0.2, w: 9, h: 0.7,
    fontSize: 24, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 1.1, w: 0.08, h: 4.525,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });

  const screenshots = [
    { label: "普通地图", desc: "标准地图视图，显示道路与地标" },
    { label: "卫星地图", desc: "卫星影像视图，切换展示" },
    { label: "定位后界面", desc: "显示当前位置与详细地址信息" },
    { label: "站点信息卡片", desc: "目标站点信息与操作按钮" }
  ];

  const positions = [
    { x: 0.4, y: 1.3 }, { x: 5.2, y: 1.3 },
    { x: 0.4, y: 3.5 }, { x: 5.2, y: 3.5 }
  ];

  for (let i = 0; i < 4; i++) {
    const pos = positions[i];
    const shot = screenshots[i];

    slide.addShape(pres.shapes.RECTANGLE, {
      x: pos.x, y: pos.y, w: 4.4, h: 2.0,
      fill: { color: COLOR_LIGHT }, line: { color: COLOR_PRIMARY, width: 1.5, dashType: "dash" }
    });
    slide.addText("📱", {
      x: pos.x, y: pos.y + 0.5, w: 4.4, h: 0.6,
      fontSize: 32, align: "center", valign: "middle", margin: 0
    });
    slide.addText("[此处插入APP截图]", {
      x: pos.x, y: pos.y + 1.1, w: 4.4, h: 0.3,
      fontSize: 11, fontFace: "Calibri", color: COLOR_MUTED,
      align: "center", italic: true, margin: 0
    });

    slide.addText(shot.label, {
      x: pos.x, y: pos.y + 2.05, w: 4.4, h: 0.25,
      fontSize: 13, fontFace: "Arial Black", color: COLOR_PRIMARY,
      bold: true, align: "center", margin: 0
    });
    slide.addText(shot.desc, {
      x: pos.x, y: pos.y + 2.3, w: 4.4, h: 0.3,
      fontSize: 10, fontFace: "Calibri", color: COLOR_MUTED,
      align: "center", margin: 0
    });
  }
}

// ─── Slide 10: 总结与展望 ───────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: COLOR_ACCENT };

  slide.addShape(pres.shapes.OVAL, {
    x: 7.8, y: -0.5, w: 3, h: 3,
    fill: { color: COLOR_PRIMARY, transparency: 80 }, line: { color: COLOR_PRIMARY, transparency: 80 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 5.625,
    fill: { color: COLOR_SECONDARY }, line: { color: COLOR_SECONDARY }
  });

  slide.addText("08 / 总结与展望", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 26, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, margin: 0
  });

  // Summary box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.1, w: 9, h: 1.3,
    fill: { color: COLOR_PRIMARY, transparency: 30 },
    line: { color: COLOR_SECONDARY, width: 1 }
  });
  slide.addText("✅ 已完成全部实验要求", {
    x: 0.6, y: 1.2, w: 8.6, h: 0.35,
    fontSize: 16, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, margin: 0
  });
  slide.addText([
    { text: "实验四：高德SDK集成、地图显示、定位、地址解析  ✓", options: { breakLine: true } },
    { text: "实验五：空间信息展示、交互设计、目标站点、历史查询  ✓", options: { breakLine: true } },
    { text: "lab5：两者整合，形成完整APP  ✓", options: {} }
  ], {
    x: 0.6, y: 1.6, w: 8.6, h: 0.75,
    fontSize: 12, fontFace: "Calibri", color: COLOR_LIGHT, margin: 0
  });

  // Limitations
  slide.addText("当前不足", {
    x: 0.4, y: 2.6, w: 4, h: 0.3,
    fontSize: 14, fontFace: "Arial Black", color: COLOR_SECONDARY,
    bold: true, margin: 0
  });
  slide.addText([
    { text: "暂无 POI 搜索功能", options: { bullet: true, breakLine: true } },
    { text: "暂无路径规划功能", options: { bullet: true } }
  ], {
    x: 0.4, y: 2.95, w: 4, h: 0.7,
    fontSize: 12, fontFace: "Calibri", color: COLOR_LIGHT, margin: 0
  });

  // Future
  slide.addText("未来扩展", {
    x: 5.2, y: 2.6, w: 4, h: 0.3,
    fontSize: 14, fontFace: "Arial Black", color: COLOR_SECONDARY,
    bold: true, margin: 0
  });
  slide.addText([
    { text: "周边搜索（加油站、餐厅等）", options: { bullet: true, breakLine: true } },
    { text: "导航功能（步行/驾车路线）", options: { bullet: true, breakLine: true } },
    { text: "收藏夹与历史记录持久化", options: { bullet: true, breakLine: true } },
    { text: "POI 详情页与用户评价", options: { bullet: true } }
  ], {
    x: 5.2, y: 2.95, w: 4.2, h: 1.4,
    fontSize: 12, fontFace: "Calibri", color: COLOR_LIGHT, margin: 0
  });

  slide.addText("感谢聆听！", {
    x: 0.5, y: 4.9, w: 9, h: 0.5,
    fontSize: 18, fontFace: "Arial Black", color: COLOR_WHITE,
    bold: true, align: "center", margin: 0
  });
}

// Save
const outputPath = "D:/code Project/SpatialImformationMobileService/lab5/lab5分享.pptx";
pres.writeFile({ fileName: outputPath })
  .then(() => {
    console.log("PPT生成成功：" + outputPath);
  })
  .catch(err => {
    console.error("生成失败：" + err.message);
    process.exit(1);
  });
