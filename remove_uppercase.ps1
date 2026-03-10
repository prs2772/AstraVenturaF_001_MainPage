$files = @(
  'src\app\layout\sidebar\sidebar.component.scss',
  'src\app\layout\navbar\navbar.component.scss',
  'src\app\features\vehiculos\vehiculos-shared.scss',
  'src\app\features\vehiculos\vehiculos-extra.scss',
  'src\app\features\notebook\pages\notebook.component.scss',
  'src\app\features\home\pages\home.component.scss',
  'src\app\features\auth\pages\register.component.scss',
  'src\app\features\auth\pages\login.component.scss'
)
foreach ($f in $files) {
  $content = Get-Content $f -Raw -Encoding UTF8
  $replaced = $content -replace '\s*text-transform:\s*uppercase;', ''
  [System.IO.File]::WriteAllText((Resolve-Path $f), $replaced, [System.Text.Encoding]::UTF8)
  Write-Host "Done: $f"
}
Write-Host "All files processed."
