#!/bin/sh

#  ci_post_clone.sh
#  Xcode Cloud Post-Clone Script
#
#  This script runs after Xcode Cloud clones your repository
#  Use it to install dependencies like CocoaPods

set -e

# Export Node.js and npm to PATH (Xcode Cloud specific)
export PATH="$CI_NODE_PATH:$PATH"

# Verify Node.js is available
echo "🔍 Checking Node.js version..."
node --version || echo "⚠️  Node.js not found in PATH"
npm --version || echo "⚠️  npm not found in PATH"

# IMPORTANT: Install npm dependencies FIRST
# The Podfile requires @capacitor/ios scripts from node_modules
cd $CI_PRIMARY_REPOSITORY_PATH
echo "📦 Installing npm dependencies..."
npm ci

echo "✅ npm installation complete!"

# Now install CocoaPods dependencies
echo "🔧 Installing CocoaPods dependencies..."
cd $CI_PRIMARY_REPOSITORY_PATH/ios/App
pod install --repo-update

echo "✅ CocoaPods installation complete!"

# Sync Capacitor (optional, but ensures everything is current)
echo "⚡ Syncing Capacitor..."
cd $CI_PRIMARY_REPOSITORY_PATH
npx cap sync ios

echo "✅ Build preparation complete!"
