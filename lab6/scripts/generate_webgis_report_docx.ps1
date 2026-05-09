$ErrorActionPreference = "Stop"

$root = "D:\code Project\SpatialImformationMobileService\lab6"
$outDir = Join-Path $root "output"
$tmpDir = Join-Path $outDir "webgis_report_docx_tmp"
$docxPath = Join-Path $outDir "WebGIS开发环境搭建_GeoServer_PostGIS实验报告.docx"
$zipPath = Join-Path $outDir "WebGIS开发环境搭建_GeoServer_PostGIS实验报告.zip"

function Escape-Xml([string]$text) {
    if ($null -eq $text) { return "" }
    return $text.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace('"', "&quot;").Replace("'", "&apos;")
}

function New-ParagraphXml {
    param(
        [string]$Text,
        [string]$Style = "Normal",
        [string]$Align = "left",
        [switch]$Bold,
        [switch]$BlankAfter
    )

    $escaped = Escape-Xml $Text
    $boldXml = if ($Bold) { "<w:b/><w:bCs/>" } else { "" }
    $spacing = if ($BlankAfter) { '<w:spacing w:after="220" w:line="360" w:lineRule="auto"/>' } else { '<w:spacing w:after="120" w:line="360" w:lineRule="auto"/>' }
    return @"
<w:p>
  <w:pPr>
    <w:pStyle w:val="$Style"/>
    <w:jc w:val="$Align"/>
    $spacing
    <w:ind w:firstLine="420"/>
  </w:pPr>
  <w:r>
    <w:rPr>$boldXml<w:sz w:val="24"/><w:szCs w:val="24"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="等线"/></w:rPr>
    <w:t xml:space="preserve">$escaped</w:t>
  </w:r>
</w:p>
"@
}

$paras = @()
$paras += New-ParagraphXml -Text "WebGIS开发环境搭建、GeoServer/PostGIS安装实验报告" -Style "Title" -Align "center" -Bold -BlankAfter
$paras += New-ParagraphXml -Text "课程名称：GIS原理与开发" -Align "center"
$paras += New-ParagraphXml -Text "实验主题：基于 Docker 的 GeoServer 与 PostGIS 安装部署" -Align "center"
$paras += New-ParagraphXml -Text "学生姓名：______________" -Align "center"
$paras += New-ParagraphXml -Text "学号：______________    班级：______________" -Align "center"
$paras += New-ParagraphXml -Text "实验日期：2026 年 4 月 28 日" -Align "center" -BlankAfter
$paras += New-ParagraphXml -Text "摘要：本实验围绕 WebGIS 开发环境搭建展开，采用 Docker 容器方式完成 PostGIS 空间数据库和 GeoServer 地图服务器的安装部署，并验证 GeoServer 与 PostGIS 的连通性与数据发布能力。实验结果表明，容器化方式能够有效降低环境配置复杂度，提高部署效率，为后续基于 OpenLayers、Leaflet 或 WebGL 的 WebGIS 应用开发提供稳定基础。"

$paras += New-ParagraphXml -Text "一、实验目的" -Style "Heading1" -Bold
$paras += New-ParagraphXml -Text "1. 掌握 WebGIS 系统的基本组成，理解空间数据库、地图服务器与前端应用三者之间的关系。"
$paras += New-ParagraphXml -Text "2. 掌握使用 Docker 部署 PostGIS 与 GeoServer 的基本流程，熟悉容器化环境搭建方法。"
$paras += New-ParagraphXml -Text "3. 掌握 GeoServer 连接 PostGIS 数据库并发布地图服务的核心步骤。"
$paras += New-ParagraphXml -Text "4. 为后续开展 WebGIS 地图服务调用、空间查询与可视化开发打下基础。"

$paras += New-ParagraphXml -Text "二、实验环境" -Style "Heading1" -Bold
$paras += New-ParagraphXml -Text "1. 操作系统：Windows 环境（具体版本以实验机实际配置为准）。"
$paras += New-ParagraphXml -Text "2. 容器平台：Docker Desktop 或 Docker Engine。"
$paras += New-ParagraphXml -Text "3. 空间数据库：PostGIS 容器，用户名 postgres，密码 123456。"
$paras += New-ParagraphXml -Text "4. 地图服务器：GeoServer 容器，用户名 admin，密码 123456。"
$paras += New-ParagraphXml -Text "5. 访问方式：浏览器访问 GeoServer 管理页面，命令行管理 Docker 容器。"

$paras += New-ParagraphXml -Text "三、实验原理" -Style "Heading1" -Bold
$paras += New-ParagraphXml -Text "WebGIS 一般由前端表现层、地图服务层和空间数据层组成。前端页面负责地图显示与交互，GeoServer 负责把空间数据发布成标准地图服务，PostGIS 负责空间数据的存储、管理和查询。三者协同后，浏览器端即可通过标准接口访问底层空间数据。"
$paras += New-ParagraphXml -Text "PostGIS 是 PostgreSQL 的空间扩展，它为关系数据库增加了空间对象类型、空间索引以及空间分析函数，能够高效管理点、线、面等几何对象。GeoServer 是开源地图服务器，可从 PostGIS 中读取空间数据，并发布为 WMS、WFS、WMTS 等服务，供 WebGIS 前端调用。"
$paras += New-ParagraphXml -Text "采用 Docker 部署上述服务，可以有效隔离运行环境，减少版本冲突和手动配置成本，同时便于项目迁移、复现和维护。"

$paras += New-ParagraphXml -Text "四、实验内容与步骤" -Style "Heading1" -Bold
$paras += New-ParagraphXml -Text "4.1 Docker 环境准备" -Style "Heading2" -Bold
$paras += New-ParagraphXml -Text "首先启动 Docker Desktop，确认 Docker 服务处于正常运行状态。随后检查本机端口占用情况，确保 5432 端口可供 PostGIS 使用，8080 端口可供 GeoServer 使用。此步骤的目的是为后续容器部署提供稳定运行基础。"
$paras += New-ParagraphXml -Text "常用检查命令如下：docker --version；docker ps -a。"

$paras += New-ParagraphXml -Text "4.2 PostGIS 容器部署" -Style "Heading2" -Bold
$paras += New-ParagraphXml -Text "本实验使用 Docker 容器部署 PostGIS。首先拉取 PostGIS 镜像，然后创建并启动数据库容器，将本地 5432 端口映射到容器内部服务端口。数据库登录用户设置为 postgres，密码设置为 123456。"
$paras += New-ParagraphXml -Text "示例命令为：docker pull postgis/postgis。"
$paras += New-ParagraphXml -Text "启动命令示例为：docker run -d --name postgis -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123456 postgis/postgis。"
$paras += New-ParagraphXml -Text "容器启动后，可进入数据库执行 CREATE EXTENSION IF NOT EXISTS postgis; 以确认空间扩展可正常使用。至此，空间数据库环境搭建完成。"

$paras += New-ParagraphXml -Text "4.3 GeoServer 容器部署" -Style "Heading2" -Bold
$paras += New-ParagraphXml -Text "GeoServer 同样采用 Docker 容器方式部署。首先拉取 GeoServer 镜像，然后映射本地 8080 端口用于浏览器访问。服务启动成功后，可通过浏览器访问 http://localhost:8080/geoserver 进入后台管理页面。"
$paras += New-ParagraphXml -Text "本实验中 GeoServer 登录账号为 admin，密码为 123456。成功登录后，说明地图服务器部署完成，可以继续进行数据源连接与图层发布。"
$paras += New-ParagraphXml -Text "由于不同实验环境中所选 GeoServer 镜像可能有所不同，实验报告中镜像名可按照个人实际使用情况补充完善。"

$paras += New-ParagraphXml -Text "4.4 GeoServer 连接 PostGIS" -Style "Heading2" -Bold
$paras += New-ParagraphXml -Text "在 GeoServer 后台中，首先新建 Workspace，然后新建 Store，并选择 PostGIS 作为数据源类型。接着填写数据库连接参数，包括主机地址、端口、数据库名、Schema、用户名和密码。"
$paras += New-ParagraphXml -Text "本实验推荐的关键参数为：Host 为 PostGIS 容器地址或容器网络名，Port 为 5432，Schema 为 public，User 为 postgres，Password 为 123456。"
$paras += New-ParagraphXml -Text "若 GeoServer 与 PostGIS 处于同一 Docker 网络中，通常可以直接通过容器名访问数据库。点击保存并测试连接，如果状态正常，则说明地图服务层与空间数据层已成功打通。"

$paras += New-ParagraphXml -Text "4.5 图层发布与基础验证" -Style "Heading2" -Bold
$paras += New-ParagraphXml -Text "在数据源连接成功后，可选择数据库中的目标空间表进行 Publish 操作。发布时需要设置图层名称、坐标参考系统、边界范围等参数。保存后进入 Layer Preview 页面，即可预览图层是否能够正常显示。"
$paras += New-ParagraphXml -Text "若图层能够在预览页正确显示，说明 PostGIS 中的数据已被 GeoServer 正常读取并发布。此时系统已经具备向前端提供 WMS 或 WFS 服务的能力，为后续 WebGIS 开发提供接口支持。"
$paras += New-ParagraphXml -Text "常见服务地址示例包括：http://localhost:8080/geoserver/<workspace>/wms 和 http://localhost:8080/geoserver/<workspace>/ows。"

$paras += New-ParagraphXml -Text "五、实验结果" -Style "Heading1" -Bold
$paras += New-ParagraphXml -Text "1. 成功完成 Docker 环境下 PostGIS 与 GeoServer 的容器化部署。"
$paras += New-ParagraphXml -Text "2. PostGIS 数据库能够正常启动，并具备空间扩展能力。"
$paras += New-ParagraphXml -Text "3. GeoServer 后台可以通过 admin / 123456 成功登录。"
$paras += New-ParagraphXml -Text "4. GeoServer 能够成功连接 PostGIS 数据源。"
$paras += New-ParagraphXml -Text "5. 实验环境已经具备发布地图服务和进行后续 WebGIS 开发的基本条件。"

$paras += New-ParagraphXml -Text "六、实验中遇到的问题及解决办法" -Style "Heading1" -Bold
$paras += New-ParagraphXml -Text "1. 问题：容器启动后端口冲突，服务无法访问。解决办法：检查本机端口占用情况，更换映射端口或关闭冲突进程。"
$paras += New-ParagraphXml -Text "2. 问题：GeoServer 无法连接 PostGIS。解决办法：核对数据库用户密码、数据库名、主机名和端口，确认容器网络互通。"
$paras += New-ParagraphXml -Text "3. 问题：图层发布后不能正常预览。解决办法：检查数据表是否存在几何字段，确认坐标参考系统设置正确，并重新计算边界范围。"

$paras += New-ParagraphXml -Text "七、实验总结" -Style "Heading1" -Bold
$paras += New-ParagraphXml -Text "通过本次实验，我掌握了基于 Docker 的 WebGIS 开发环境搭建方法，能够独立完成 PostGIS 空间数据库和 GeoServer 地图服务器的安装部署，并实现二者之间的数据连接与图层发布。与传统安装方式相比，容器化部署具有配置简洁、复现方便、维护成本低等优点。"
$paras += New-ParagraphXml -Text "本实验为后续的 WebGIS 应用开发提供了稳定的服务环境。下一步可以在前端引入 OpenLayers、Leaflet 或基于 WebGL 的可视化框架，通过调用 GeoServer 发布的 WMS/WFS 服务，实现地图浏览、图层叠加、空间查询和专题可视化等功能。"
$paras += New-ParagraphXml -Text "注：若后续需要提交更完整的实验材料，可在本报告中补充 Docker 容器运行截图、GeoServer 登录截图、数据源配置截图及图层预览结果截图。"

$contentTypes = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
'@

$rels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
'@

$documentRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>
'@

$core = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>WebGIS开发环境搭建、GeoServer/PostGIS安装实验报告</dc:title>
  <dc:creator>OpenAI Codex</dc:creator>
  <cp:lastModifiedBy>OpenAI Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-04-28T00:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">2026-04-28T00:00:00Z</dcterms:modified>
</cp:coreProperties>
'@

$app = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Office Word</Application>
</Properties>
'@

$styles = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="等线"/>
        <w:sz w:val="24"/>
        <w:szCs w:val="24"/>
        <w:lang w:eastAsia="zh-CN"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:before="240" w:after="240"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:bCs/>
      <w:sz w:val="36"/>
      <w:szCs w:val="36"/>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="微软雅黑"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="220" w:after="160"/>
      <w:outlineLvl w:val="0"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:bCs/>
      <w:sz w:val="30"/>
      <w:szCs w:val="30"/>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="微软雅黑"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="160" w:after="120"/>
      <w:outlineLvl w:val="1"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:bCs/>
      <w:sz w:val="26"/>
      <w:szCs w:val="26"/>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="微软雅黑"/>
    </w:rPr>
  </w:style>
</w:styles>
'@

$document = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">
  <w:body>
    $($paras -join "`n")
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>
      <w:cols w:space="708"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>
"@

if (Test-Path $tmpDir) {
    Remove-Item -LiteralPath $tmpDir -Recurse -Force
}
if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}
if (Test-Path $docxPath) {
    Remove-Item -LiteralPath $docxPath -Force
}

New-Item -ItemType Directory -Path $tmpDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tmpDir "_rels") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tmpDir "docProps") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tmpDir "word") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tmpDir "word\_rels") | Out-Null

Set-Content -LiteralPath (Join-Path $tmpDir "[Content_Types].xml") -Value $contentTypes -Encoding utf8
Set-Content -LiteralPath (Join-Path $tmpDir "_rels\.rels") -Value $rels -Encoding utf8
Set-Content -LiteralPath (Join-Path $tmpDir "docProps\core.xml") -Value $core -Encoding utf8
Set-Content -LiteralPath (Join-Path $tmpDir "docProps\app.xml") -Value $app -Encoding utf8
Set-Content -LiteralPath (Join-Path $tmpDir "word\document.xml") -Value $document -Encoding utf8
Set-Content -LiteralPath (Join-Path $tmpDir "word\styles.xml") -Value $styles -Encoding utf8
Set-Content -LiteralPath (Join-Path $tmpDir "word\_rels\document.xml.rels") -Value $documentRels -Encoding utf8

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($tmpDir, $zipPath)
Move-Item -LiteralPath $zipPath -Destination $docxPath
Remove-Item -LiteralPath $tmpDir -Recurse -Force

Write-Output $docxPath
