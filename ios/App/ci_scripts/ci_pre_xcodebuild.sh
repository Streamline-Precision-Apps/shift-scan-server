#!/bin/sh

#  ci_pre_xcodebuild.sh
#  Xcode Cloud Pre-Build Script (Optional)
#
#  This script runs right before the xcodebuild command

set -e

echo "🔍 Pre-build checks..."

# Print environment info for debugging
echo "📍 Working directory: $(pwd)"
echo "🌳 Git branch: $CI_BRANCH"
echo "📦 Xcode version: $(xcodebuild -version)"

# Verify CocoaPods installation
if [ -d "$CI_PRIMARY_REPOSITORY_PATH/ios/App/Pods" ]; then
    echo "✅ Pods directory exists"
else
    echo "❌ ERROR: Pods directory not found!"
    exit 1
fi

# Verify workspace exists
if [ -f "$CI_PRIMARY_REPOSITORY_PATH/ios/App/App.xcworkspace/contents.xcworkspacedata" ]; then
    echo "✅ Workspace file exists"
else
    echo "❌ ERROR: Workspace not found!"
    exit 1
fi

echo "✅ Pre-build checks passed!"
