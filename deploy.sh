#!/bin/bash

# WindBorne Challenge Deployment Script
echo "🚀 Deploying WindBorne Balloon Constellation Tracker..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the windborne-challenge directory."
    exit 1
fi

# Create a simple deployment package
echo "📦 Creating deployment package..."
tar -czf windborne-challenge.tar.gz index.html styles.css app.js README.md

echo "✅ Deployment package created: windborne-challenge.tar.gz"
echo ""
echo "🌐 To deploy:"
echo "1. Upload windborne-challenge.tar.gz to your hosting service"
echo "2. Extract the files in your web root directory"
echo "3. Ensure index.html is accessible at your domain root"
echo ""
echo "📋 Recommended hosting services:"
echo "- Netlify: Drag and drop the tar.gz file"
echo "- Vercel: Connect your GitHub repo or upload files"
echo "- GitHub Pages: Push to a repository and enable Pages"
echo "- Surge.sh: Run 'surge' command in the directory"
echo ""
echo "🔗 Your application will be available at your hosting URL"
