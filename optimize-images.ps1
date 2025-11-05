# Install ImageMagick if not already installed
# Run in PowerShell as Administrator:
# winget install ImageMagick.ImageMagick

$sourceDir = ".\assets\images"
$sizes = @(
    @{ width = 1200; suffix = "large" },
    @{ width = 800; suffix = "medium" },
    @{ width = 400; suffix = "small" }
)

Get-ChildItem -Recurse -Path $sourceDir -Include *.jpg,*.jpeg,*.png | ForEach-Object {
    $directory = $_.DirectoryName
    $filename = $_.BaseName
    $extension = $_.Extension
    
    foreach ($size in $sizes) {
        $newName = "${filename}-${($size.suffix)}${extension}"
        $outputPath = Join-Path $directory $newName
        
        # Skip if optimized version already exists
        if (-not (Test-Path $outputPath)) {
            magick $_.FullName -strip -quality 85 -resize "$($size.width)x>" $outputPath
            Write-Host "Created $outputPath"
        }
    }
}

Write-Host "Image optimization complete!"