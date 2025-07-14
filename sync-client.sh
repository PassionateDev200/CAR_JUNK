#!/bin/bash

# â›” Safety check
if [[ "$PWD" == *"Car-Junk-Base"* ]]; then
  echo "íº« ERROR: Do not push directly from Car-Junk-Base!"
  echo "Please run this script only to build a clean version."
  echo ""
fi

# 1. Set up temporary clean folder
CLIENT_DIR=../Car-Junk-Client
SOURCE_DIR=$(pwd)

# 2. Delete any old version
rm -rf "$CLIENT_DIR"
mkdir "$CLIENT_DIR"

# 3. Copy safe files only
rsync -av --exclude-from="$SOURCE_DIR/.clientignore" "$SOURCE_DIR/" "$CLIENT_DIR/"

# 4. Move to clean folder
cd "$CLIENT_DIR"

# 5. Initialize Git (first time only)
if [ ! -d ".git" ]; then
  git init
  git remote add origin https://github.com/PassionateDev200/Car-Junk.git
  git checkout -b main
fi

# 6. Commit and push to client
git add .
git commit -m "Client update: $(date)"
git push origin main --force

