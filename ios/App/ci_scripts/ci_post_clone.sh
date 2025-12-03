#!/bin/sh

#  ci_post_clone.sh
#  Xcode Cloud Post-Clone Script
#
#  This script runs after Xcode Cloud clones your repository
#  Use it to install dependencies like CocoaPods

set -e

# Setup Node.js environment for Xcode Cloud
export PATH="$PATH"

# Verify Node.js is available
echo "🔍 Node.js version: $(node --version)"
echo "🔍 npm version: $(npm --version)"

# IMPORTANT: Install npm dependencies FIRST
# The Podfile requires @capacitor/ios scripts from node_modules
cd $CI_PRIMARY_REPOSITORY_PATH
echo "📦 Installing npm dependencies..."

# Try npm ci first (faster), fallback to npm install if lock file has issues
npm install

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
