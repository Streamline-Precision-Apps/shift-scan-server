#!/bin/sh

#  ci_post_clone.sh
#  Xcode Cloud Post-Clone Script
#
#  This script runs after Xcode Cloud clones your repository
#  Use it to install dependencies like CocoaPods

set -e

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
