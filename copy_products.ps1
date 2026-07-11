$artifacts = Join-Path $env:USERPROFILE ".gemini\antigravity-ide\brain\8a438209-e3ba-491b-8124-5ca535d4feaa"
$dest = "public\products"

New-Item -ItemType Directory -Force -Path $dest | Out-Null

Copy-Item "$artifacts\panini_prizm_wc_1783754804652.png"    "$dest\panini_prizm_wc.png"
Copy-Item "$artifacts\mega_greninja_ex_1783754812628.png"   "$dest\mega_greninja_ex.png"
Copy-Item "$artifacts\perfect_order_box_1783754824354.png"  "$dest\perfect_order_box.png"
Copy-Item "$artifacts\trainers_toolkit_1783754833334.png"   "$dest\trainers_toolkit.png"

Write-Host "Copied OK"
