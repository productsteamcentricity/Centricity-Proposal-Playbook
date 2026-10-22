param([Parameter(Mandatory = $true)][string]$Deck, [Parameter(Mandatory = $true)][string]$OutDir, [int]$Width = 1600, [int]$Height = 900)
# Renders every slide of a deck to PNG with PowerPoint (COM) and writes bounds.jsonl: every shape's
# laid-out box in inches, tables with PowerPoint's own row heights, text boxes with the height their
# text needs. Check the result with:  node tools/dev/check_pptx_bounds.js <OutDir>\bounds.jsonl
# Windows + PowerPoint only. PowerPoint opens files only on paths under 255 characters: copy the deck
# to a short folder (e.g. %TEMP%\x\) first. Read-only on the deck; writes only into OutDir.
#   powershell -File tools\dev\render_pptx.ps1 -Deck $env:TEMP\x\deck.pptx -OutDir $env:TEMP\x\deck
# The images and bounds.jsonl carry slide text, so a client deck's renders must never land in a
# tracked folder: OutDir may sit inside the repository only under _testdata\ (gitignored).
$ErrorActionPreference = 'Stop'
if (-not (Test-Path $Deck)) { [Console]::Error.WriteLine("deck not found: $Deck"); exit 2 }
if ($Deck.Length -ge 255) { [Console]::Error.WriteLine("path too long for PowerPoint ($($Deck.Length) chars): copy the deck to a short folder"); exit 2 }
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path.TrimEnd('\') + '\'
$outFull = [System.IO.Path]::GetFullPath($OutDir).TrimEnd('\') + '\'
if ($outFull.StartsWith($repo, [System.StringComparison]::OrdinalIgnoreCase) -and -not $outFull.StartsWith($repo + '_testdata\', [System.StringComparison]::OrdinalIgnoreCase)) {
  [Console]::Error.WriteLine("OutDir is inside the repository: use %TEMP% or _testdata\ (gitignored)"); exit 2
}
New-Item -ItemType Directory -Force $OutDir | Out-Null
# leave a PowerPoint the user already has open running
$wasRunning = [bool](Get-Process POWERPNT -ErrorAction SilentlyContinue)
$app = New-Object -ComObject PowerPoint.Application
$lines = New-Object System.Collections.Generic.List[string]
try {
  $p = $app.Presentations.Open((Resolve-Path $Deck).Path, -1, 0, 0)
  $lines.Add(('{"slides":' + $p.Slides.Count + ',"w":' + ($p.PageSetup.SlideWidth / 72) + ',"h":' + ($p.PageSetup.SlideHeight / 72) + '}'))
  for ($i = 1; $i -le $p.Slides.Count; $i++) {
    $s = $p.Slides.Item($i)
    $s.Export((Join-Path $OutDir ("s{0:D2}.png" -f $i)), "PNG", $Width, $Height)
    for ($j = 1; $j -le $s.Shapes.Count; $j++) {
      $sh = $s.Shapes.Item($j)
      $extra = ''
      if ($sh.HasTable) {
        $hs = @()
        for ($r = 1; $r -le $sh.Table.Rows.Count; $r++) { $hs += [math]::Round($sh.Table.Rows.Item($r).Height / 72, 4) }
        $extra = ',"rows":[' + ($hs -join ',') + ']'
      } elseif ($sh.HasTextFrame -and $sh.TextFrame.HasText) {
        $t = $sh.TextFrame.TextRange.Text
        if ($t.Length -gt 40) { $t = $t.Substring(0, 40) }
        $t = $t -replace '[\\"]', '' -replace '[\r\n\t]', ' '
        $extra = ',"text":"' + $t + '","textH":' + [math]::Round($sh.TextFrame.TextRange.BoundHeight / 72, 4)
      }
      $lines.Add('{"slide":' + $i + ',"shape":' + $j + ',"type":' + $sh.Type + ',"x":' + [math]::Round($sh.Left / 72, 4) + ',"y":' + [math]::Round($sh.Top / 72, 4) + ',"w":' + [math]::Round($sh.Width / 72, 4) + ',"h":' + [math]::Round($sh.Height / 72, 4) + $extra + '}')
    }
  }
  $p.Close()
} finally {
  if (-not $wasRunning) { $app.Quit() }
  [System.Runtime.Interopservices.Marshal]::ReleaseComObject($app) | Out-Null
}
[System.IO.File]::WriteAllLines((Join-Path $OutDir 'bounds.jsonl'), $lines)
Write-Output ("rendered " + ($lines.Count - 1) + " shapes; " + (Join-Path $OutDir 'bounds.jsonl'))
