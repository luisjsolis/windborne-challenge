#!/bin/bash

# GitHub Pages Setup Script for WindBorne Challenge
echo "🚀 Setting up GitHub Pages for WindBorne Balloon Constellation Tracker..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Run 'git init' first."
    exit 1
fi

# Get repository name from user
echo ""
echo "📝 GitHub Repository Setup:"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named 'windborne-challenge' (or your preferred name)"
echo "3. Make it PUBLIC (required for GitHub Pages)"
echo "4. Don't initialize with README, .gitignore, or license (we already have files)"
echo ""
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your repository name (default: windborne-challenge): " REPO_NAME

# Use default if empty
if [ -z "$REPO_NAME" ]; then
    REPO_NAME="windborne-challenge"
fi

echo ""
echo "🔗 Setting up remote repository..."

# Add remote origin with SSH
git remote add origin git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git

echo "✅ Remote added: git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git"

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "🌐 Setting up GitHub Pages:"
echo "1. Go to https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings/pages"
echo "2. Under 'Source', select 'Deploy from a branch'"
echo "3. Select 'main' branch and '/ (root)' folder"
echo "4. Click 'Save'"
echo ""
echo "⏳ Your site will be available at:"
echo "https://${GITHUB_USERNAME}.github.io/${REPO_NAME}"
echo ""
echo "🎉 Once GitHub Pages is enabled, your WindBorne challenge will be live!"
echo ""
echo "📝 Next steps:"
echo "1. Wait 5-10 minutes for GitHub Pages to deploy"
echo "2. Update application-data.json with your GitHub Pages URL"
echo "3. Run ./submit-application.sh to submit to WindBorne Systems"
