$docPath = "c:\Users\admin\IWE\DS-strategy\inbox\Еже ИФ текст лекций (2025).doc"
$txtPath = "c:\Users\admin\IWE\DS-strategy\inbox\Еже-лекции.txt"

$word = New-Object -ComObject Word.Application
$word.Visible = $false

$doc = $word.Documents.Open($docPath)
$content = $doc.Content.Text

$doc.Close($false)
$word.Quit()

$content | Out-File -Encoding UTF8 -FilePath $txtPath

Write-Host "Converted to: $txtPath"
