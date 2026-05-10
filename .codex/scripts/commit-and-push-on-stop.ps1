$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $repoRoot

$branch = (git branch --show-current).Trim()
if (-not $branch) {
  Write-Host "codex-stop: detached HEAD; skip commit/push."
  exit 0
}

$status = git status --porcelain
if (-not $status) {
  Write-Host "codex-stop: clean worktree; skip commit/push."
  exit 0
}

git add -A -- .

$staged = git diff --cached --name-only
if (-not $staged) {
  Write-Host "codex-stop: no staged changes after ignore rules; skip commit/push."
  exit 0
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
$message = "codex: auto-save on stop ($timestamp)"

git commit -m $message
git push origin $branch

Write-Host "codex-stop: committed and pushed $branch. Vercel should deploy from Git integration."
