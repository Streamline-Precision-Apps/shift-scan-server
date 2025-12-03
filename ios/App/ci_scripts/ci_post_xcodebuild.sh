#!/bin/sh

# Xcode Cloud Post-Xcodebuild Script
# Runs after the build completes

set -e

echo "🎉 Build completed successfully!"

# You can add post-build steps here, such as:
# - Uploading artifacts to external services
# - Sending notifications
# - Running additional validation

# Example: Display build information
echo "Build scheme: $CI_XCODE_SCHEME"
echo "Build number: $CI_BUILD_NUMBER"
echo "Product: $CI_PRODUCT"

exit 0
