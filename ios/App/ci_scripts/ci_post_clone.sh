#!/bin/sh

#  ci_post_clone.sh
#  Xcode Cloud Post-Clone Script
#
#  This script runs after Xcode Cloud clones your repository
#  Use it to install dependencies like CocoaPods

set -e

# Setup Node.js environment for Xcode Cloud
# Xcode Cloud uses Homebrew, so we need to add it to PATH
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

# Check if Node.js is installed, if not install it
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    brew install node
fi

# Verify Node.js is available
echo "🔍 Node.js version: $(node --version)"
echo "🔍 npm version: $(npm --version)"

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
