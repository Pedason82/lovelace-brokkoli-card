#!/bin/bash
# Build and commit script for reliable workflow

set -e  # Exit on any error

COMMIT_MSG="$1"

if [ -z "$COMMIT_MSG" ]; then
    echo "Usage: $0 'commit message'"
    exit 1
fi

echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Aborting commit."
    exit 1
fi

echo "✅ Build successful!"

echo "📝 Staging changes..."
git add .

echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

echo "🚀 Pushing to remote..."
git push

echo "✅ All done! Changes pushed successfully."
