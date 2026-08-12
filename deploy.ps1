param (
    [Parameter(Mandatory=$false)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "radhe-investments"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Deploying Radhe Investments to Cloud Run " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Google Cloud SDK (gcloud) is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Ensure Project ID is provided
if ([string]::IsNullOrWhiteSpace($ProjectId)) {
    Write-Host "Please provide your GCP Project ID." -ForegroundColor Yellow
    $ProjectId = Read-Host "Enter Project ID"
    
    if ([string]::IsNullOrWhiteSpace($ProjectId)) {
        Write-Host "ERROR: Project ID is required." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n[1/2] Setting GCP Project to $ProjectId..." -ForegroundColor Green
gcloud config set project $ProjectId

Write-Host "`n[2/2] Deploying directly from source to Cloud Run..." -ForegroundColor Green
Write-Host "This will automatically handle Cloud Build and Artifact Registry behind the scenes!" -ForegroundColor Yellow

gcloud run deploy $ServiceName `
    --source . `
    --platform managed `
    --region $Region `
    --allow-unauthenticated `
    --port 8080

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==========================================" -ForegroundColor Cyan
    Write-Host " Deployment Successful! " -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Cyan
} else {
    Write-Host "`nERROR: Deployment failed." -ForegroundColor Red
}
