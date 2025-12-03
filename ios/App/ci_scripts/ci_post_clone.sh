#!/bin/sh

#  ci_post_clone.sh
#  Xcode Cloud Post-Clone Script
#
#  This script runs after Xcode Cloud clones your repository
#  Use it to install dependencies like CocoaPods

set -e

echo "🔧 Installing CocoaPods dependencies..."

# Navigate to the iOS app directory
cd $CI_PRIMARY_REPOSITORY_PATH/ios/App

# Install CocoaPods dependencies
pod install --repo-update

echo "✅ CocoaPods installation complete!"

# Optional: Install npm dependencies if needed for Capacitor sync
cd $CI_PRIMARY_REPOSITORY_PATH
echo "📦 Installing npm dependencies..."
npm ci

# Sync Capacitor
echo "⚡ Syncing Capacitor..."
npx cap sync ios

echo "✅ Build preparation complete!"
