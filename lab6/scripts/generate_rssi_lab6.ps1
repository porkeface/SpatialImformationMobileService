$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$dataDir = Join-Path $root '实验六Data'
$outDir = Join-Path $root 'output'
$csvDir = Join-Path $outDir 'csv'

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
New-Item -ItemType Directory -Force -Path $csvDir | Out-Null

$records = foreach ($file in Get-ChildItem $dataDir -Filter '*.txt' | Sort-Object Name) {
    $point = $file.BaseName
    if ($point -notmatch '^(\d+)_(\d+)$') {
        continue
    }

    $row = [int]$Matches[1]
    $col = [int]$Matches[2]

    foreach ($line in Get-Content $file.FullName) {
        $parts = $line -split '#'
        if ($parts.Length -lt 6) {
            continue
        }

        [pscustomobject]@{
            Point = $point
            Row   = $row
            Col   = $col
            Id    = $parts[0]
            Mac   = $parts[1]
            Ssid  = $parts[2]
            Freq  = [int]$parts[3]
            Rssi  = [int]$parts[4]
            Ts    = $parts[5]
        }
    }
}

$selectedAps = $records |
    Group-Object Mac, Ssid |
    ForEach-Object {
        $group = $_.Group
        [pscustomobject]@{
            Mac      = $group[0].Mac
            Ssid     = $group[0].Ssid
            Points   = ($group.Point | Sort-Object -Unique).Count
            Samples  = $group.Count
            AvgRssi  = [math]::Round(($group | Measure-Object Rssi -Average).Average, 2)
            TableName = ($group[0].Mac -replace ':', '')
        }
    } |
    Sort-Object Points, Samples, AvgRssi -Descending |
    Select-Object -First 5

$selectedAps | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $outDir 'selected_aps.csv')

foreach ($ap in $selectedAps) {
    $group = $records | Where-Object { $_.Mac -eq $ap.Mac }
    $rows = foreach ($rowIndex in 1..4) {
        $ordered = [ordered]@{}
        foreach ($colIndex in 1..4) {
            $value = ($group | Where-Object { $_.Row -eq $rowIndex -and $_.Col -eq $colIndex } | Select-Object -First 1).Rssi
            $ordered["c$colIndex"] = $value
        }
        [pscustomobject]$ordered
    }

    $csvPath = Join-Path $csvDir ($ap.TableName + '.csv')
    $rows | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $csvPath
}

$sqlLines = New-Object System.Collections.Generic.List[string]
$sqlLines.Add('-- Lab 6 RSSI fingerprint tables')
$sqlLines.Add('')

foreach ($ap in $selectedAps) {
    $table = $ap.TableName
    $sqlLines.Add("DROP TABLE IF EXISTS public.$table;")
    $sqlLines.Add("CREATE TABLE public.$table (")
    $sqlLines.Add('    c1 integer,')
    $sqlLines.Add('    c2 integer,')
    $sqlLines.Add('    c3 integer,')
    $sqlLines.Add('    c4 integer')
    $sqlLines.Add(');')
    $sqlLines.Add('')
}

[System.IO.File]::WriteAllLines((Join-Path $outDir 'create_tables.sql'), $sqlLines)

$importLines = New-Object System.Collections.Generic.List[string]
$importLines.Add('-- Run inside the postgres container with psql')
$importLines.Add('\i /tmp/lab6_rssi/create_tables.sql')
$importLines.Add('')

foreach ($ap in $selectedAps) {
    $table = $ap.TableName
    $importLines.Add("\copy public.$table FROM '/tmp/lab6_rssi/csv/$table.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8')")
}

[System.IO.File]::WriteAllLines((Join-Path $outDir 'import_tables.sql'), $importLines)

$report = New-Object System.Collections.Generic.List[string]
$report.Add('# Lab 6 RSSI Summary')
$report.Add('')
$report.Add('Selected 5 APs:')
$report.Add('')
foreach ($ap in $selectedAps) {
    $report.Add("- $($ap.Mac) | $($ap.Ssid) | points=$($ap.Points) | avg_rssi=$($ap.AvgRssi)")
}

[System.IO.File]::WriteAllLines((Join-Path $outDir 'README.md'), $report)
