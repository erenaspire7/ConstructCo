Steps to Run Locally

- Provision DB Locally


- Create env file
New-Item .env
Export env to run locally
PowerShell Users
Get-Content .env | ForEach-Object { $key, $value = $_.split('='); Set-Item -Path "env:$key" -Value $value }

Bash Users
export $(grep -v '^#' .env | xargs -d '\n')


- Run Docker Compose Up
