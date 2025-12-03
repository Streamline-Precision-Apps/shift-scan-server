#!/bin/sh

set -e

echo "📦 Installing dependencies for Xcode Cloud build..."

# Install Node.js using Homebrew (Xcode Cloud has Homebrew pre-installed)
echo "🔧 Installing Node.js..."
brew install node

# Navigate to project root (2 levels up from ios/App)
cd ../..

echo "Current directory: $(pwd)"

# Install Node.js dependencies
echo "📥 Installing npm packages..."
npm ci || npm install --include=dev

# Build the Next.js web application (CRITICAL STEP - matches Appflow)
echo "🏗️ Building Next.js web application..."
npm run static

# Verify build output exists
if [ ! -d "out" ]; then
  echo "❌ ERROR: Next.js build failed - 'out' directory not found"
  exit 1
fi
echo "✅ Web build completed - 'out' directory created"

# Navigate to iOS app directory
echo "🔧 Installing CocoaPods..."
cd ios/App
pod install

# Sync Capacitor (from project root)
echo "⚡ Syncing Capacitor..."
cd ../..
npx cap sync ios

echo "✅ Dependencies installed successfully!"
