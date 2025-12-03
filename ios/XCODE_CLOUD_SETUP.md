# Xcode Cloud Setup Guide for Shift Scan

## ✅ What's Already Configured

✓ **Project Settings:**

- Bundle ID: `com.shiftscanapp`
- Development Team: `XSKZMV6LQV`
- Code Sign Style: Automatic
- Scheme: "Shift Scan" (Shared)

✓ **CI Scripts:**

- `ci_post_clone.sh` - Installs dependencies, CocoaPods, and syncs Capacitor

## 🚀 Setup Instructions

### Step 1: Open Xcode Cloud

1. Open the workspace in Xcode:

   ```bash
   open ios/App/App.xcworkspace
   ```

2. Enable Xcode Cloud:
   - **Product** → **Xcode Cloud** → **Create Workflow**
   - OR: **Report Navigator** (⌘+9) → **Cloud** tab → **Create Workflow**

### Step 2: Configure Workflow

#### Workflow Settings:

- **Name:** "Shift Scan - Production" (or "Development")
- **Scheme:** Select **"Shift Scan"** (NOT "App")
- **Branch:** `devun-branch-v1` or `main`

#### Build Actions:

1. **Archive** - for App Store builds
   - Platform: iOS
   - Archive scheme: "Shift Scan"
2. **Test** (optional)
   - Skip if you don't have tests yet

#### Start Conditions (Triggers):

- ✅ **Branch Changes**: Builds on every push to `devun-branch-v1`
- ✅ **Pull Request**: Builds PRs targeting main branch
- ⚠️ **Schedule** (optional): Daily/weekly builds

### Step 3: Configure Code Signing

**Recommended: Automatic Signing** ✅

Xcode Cloud will automatically:

- Generate certificates for your team (`XSKZMV6LQV`)
- Create provisioning profiles for `com.shiftscanapp`
- Manage certificate renewal

**In App Store Connect:**

1. Navigate to your app
2. Go to **Xcode Cloud** → **Settings** → **Code Signing**
3. Select: **"Automatically manage signing"**
4. Choose: **Development Team: XSKZMV6LQV**

**Alternative: Manual Signing** (Not recommended unless required)

- Upload your `.p12` certificate
- Upload provisioning profiles
- Select them in workflow settings

### Step 4: Set Environment Variables (Optional)

If your build needs environment variables:

**In App Store Connect:**

1. **Xcode Cloud** → **Settings** → **Environment**
2. Add variables:
   ```
   DEVELOPMENT_TEAM = XSKZMV6LQV
   NODE_VERSION = 20  (if you need specific Node version)
   ```

### Step 5: Commit and Push

```bash
cd /Users/devunfox/shift-scan-app

# Add ci_scripts
git add ios/App/ci_scripts/

# Commit
git commit -m "Add Xcode Cloud build configuration"

# Push to trigger first build
git push origin devun-branch-v1
```

### Step 6: Monitor First Build

1. In Xcode: **Report Navigator** (⌘+9) → **Cloud** tab
2. Watch build progress in real-time
3. Check logs if build fails

**Expected build time:** 5-15 minutes

## 📝 Build Script Details

### ci_post_clone.sh

This script runs after Xcode Cloud clones your repository:

1. **Navigate to project root** - Goes up 2 directories from `ios/App`
2. **Install npm packages** - Runs `npm ci` to install Node.js dependencies
3. **Install CocoaPods** - Runs `pod install` for native iOS dependencies
4. **Sync Capacitor** - Runs `npx cap sync ios` to update native code

**Location:** `ios/App/ci_scripts/ci_post_clone.sh`

## 🎯 What Happens During Cloud Build

1. **Clone repository** from GitHub
2. **Run ci_post_clone.sh**:
   - Install npm packages
   - Install CocoaPods
   - Sync Capacitor
3. **Resolve code signing**:
   - Generate/download certificates
   - Download provisioning profiles
4. **Build archive**:
   ```bash
   xcodebuild archive \
     -workspace App.xcworkspace \
     -scheme "Shift Scan" \
     -destination generic/platform=iOS \
     -archivePath build.xcarchive
   ```
5. **Export IPA** (if archiving for distribution)
6. **Upload to TestFlight** (if configured)

## 📝 Important Notes

### CocoaPods

The `ci_post_clone.sh` script automatically runs `pod install` after cloning.

### Capacitor

The script also runs `npx cap sync ios` to ensure native dependencies are current.

### Build Scheme

Make sure "Shift Scan" or "App" scheme is **Shared** in Xcode:

1. Product → Scheme → Manage Schemes
2. Check "Shared" for your app scheme

## 🔍 Troubleshooting

### Build Fails: "Scheme not found"

**Solution:**

- Verify scheme "Shift Scan" is **Shared**
- In Xcode: **Product** → **Scheme** → **Manage Schemes**
- Check "Shared" for "Shift Scan"

### Build Fails: "No provisioning profile"

**Solution:**

- Ensure automatic signing is enabled in workflow
- Verify Development Team `XSKZMV6LQV` is correct
- Check App Store Connect → Xcode Cloud → Code Signing

### CocoaPods Installation Fails

**Solution:**

- Verify `Podfile` is committed to git
- Check Xcode Cloud logs for specific pod errors
- Ensure all pod dependencies are available

### Node/npm Issues

**Solution:**

- Xcode Cloud uses Node 18 by default
- Set `NODE_VERSION=20` in environment variables if needed
- Verify `package.json` and `package-lock.json` are committed

### Build Succeeds Locally But Fails in Cloud

**Common causes:**

1. Missing files in git (check `.gitignore`)
2. Different Node versions (set NODE_VERSION env var)
3. Local cache vs clean build (cloud always clean)
4. Hardcoded local paths in scripts

## 🔐 Security Notes

**DO NOT commit:**

- `.p12` certificate files
- Provisioning profiles (`.mobileprovision`)
- Private keys
- Passwords or secrets

**Xcode Cloud handles these securely in App Store Connect.**

## 💰 Pricing

- **Free tier**: 25 compute hours/month
- Check current pricing: https://developer.apple.com/xcode-cloud/

## 📚 Resources

- [Xcode Cloud Documentation](https://developer.apple.com/documentation/xcode/xcode-cloud)
- [Configuring Workflows](https://developer.apple.com/documentation/xcode/configuring-your-first-xcode-cloud-workflow)
