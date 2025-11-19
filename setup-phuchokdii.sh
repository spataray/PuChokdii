#!/bin/bash
# PhuChokDii Setup Script
# Downloads all files from the phuchokdii-standalone directory

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎰 PhuChokDii Setup Script${NC}"
echo "This will download all files to your current directory"
echo ""

# GitHub raw content base URL
BASE_URL="https://raw.githubusercontent.com/spataray/PuChokdii/claude/session-011CUYq7tnoTdFig3WW32bS6/phuchokdii-standalone"

# Create directory structure
echo -e "${GREEN}Creating directories...${NC}"
mkdir -p assets/css assets/js docs .github/workflows

# Download files
echo -e "${GREEN}Downloading files...${NC}"

curl -sS "$BASE_URL/index.html" -o index.html
curl -sS "$BASE_URL/.gitignore" -o .gitignore
curl -sS "$BASE_URL/.gitlab-ci.yml" -o .gitlab-ci.yml
curl -sS "$BASE_URL/LICENSE" -o LICENSE
curl -sS "$BASE_URL/README.md" -o README.md

curl -sS "$BASE_URL/assets/css/style.css" -o assets/css/style.css
curl -sS "$BASE_URL/assets/js/app.js" -o assets/js/app.js
curl -sS "$BASE_URL/assets/js/translations.js" -o assets/js/translations.js

curl -sS "$BASE_URL/docs/CLOUD_WORKFLOW.md" -o docs/CLOUD_WORKFLOW.md
curl -sS "$BASE_URL/docs/GITLAB_SETUP.md" -o docs/GITLAB_SETUP.md
curl -sS "$BASE_URL/docs/MIGRATION.md" -o docs/MIGRATION.md
curl -sS "$BASE_URL/docs/SECURITY_AUDIT.md" -o docs/SECURITY_AUDIT.md

curl -sS "$BASE_URL/.github/workflows/deploy.yml" -o .github/workflows/deploy.yml

echo ""
echo -e "${GREEN}✅ All files downloaded!${NC}"
echo ""
echo "Next steps:"
echo "1. git init"
echo "2. git add ."
echo "3. git commit -m 'Initial commit: PhuChokDii standalone'"
echo "4. git branch -M main"
echo "5. git remote add origin https://gitlab.com/spataray/phuchokdii.git"
echo "6. git push -u origin main"
echo ""
echo -e "${BLUE}🎉 Your PhuChokDii site will be live at: https://spataray.gitlab.io/phuchokdii/${NC}"
