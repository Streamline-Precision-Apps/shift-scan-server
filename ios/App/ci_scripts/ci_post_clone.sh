#!/bin/sh

set -e

echo "📦 Installing dependencies for Xcode Cloud build..."

# Navigate to project root (2 levels up from ios/App)
cd ../..

echo "Current directory: $(pwd)"

# Install Node.js dependencies
echo "📥 Installing npm packages..."
npm ci || npm install

# Navigate to iOS app directory
cd ios/App

# Install CocoaPods dependencies
echo "🔧 Installing CocoaPods..."
pod install

# Sync Capacitor
echo "⚡ Syncing Capacitor..."
cd ../..
npx cap sync ios

echo "✅ Dependencies installed successfully!"
