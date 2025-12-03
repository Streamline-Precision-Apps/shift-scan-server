# Xcode Cloud Quick Start

## ✅ Ready to Deploy

Your project is configured for Xcode Cloud! Follow these steps:

### 1️⃣ Commit Build Scripts
```bash
cd /Users/devunfox/shift-scan-app
git add ios/App/ci_scripts/
git add ios/XCODE_CLOUD_SETUP.md
git commit -m "Configure Xcode Cloud build scripts"
git push origin devun-branch-v1
```

### 2️⃣ Open Xcode and Create Workflow
```bash
open ios/App/App.xcworkspace
```

In Xcode:
1. **Product** → **Xcode Cloud** → **Create Workflow**
2. Select scheme: **"Shift Scan"**
3. Select branch: **devun-branch-v1**
4. Click **Next** → **Create**

### 3️⃣ Configure Code Signing (in App Store Connect)

1. Sign in to [App Store Connect](https://appstoreconnect.apple.com)
2. Go to your app
3. Navigate to: **Xcode Cloud** → **Settings** → **Code Signing**
4. Select: **"Automatically manage signing"**
5. Confirm team: **XSKZMV6LQV**

### 4️⃣ Start First Build

Option A - In Xcode:
- **Report Navigator** (⌘+9) → **Cloud** → **Start Build**

Option B - Push a commit:
```bash
git commit --allow-empty -m "Trigger Xcode Cloud build"
git push origin devun-branch-v1
```

### 5️⃣ Monitor Build Progress

In Xcode:
- **Report Navigator** (⌘+9) → **Cloud** tab
- Watch real-time build logs
- First build: ~10-15 minutes

---

## 🔧 What Was Configured

✅ **ci_post_clone.sh** - Installs dependencies after git clone:
   - npm packages
   - CocoaPods
   - Capacitor sync

✅ **ci_post_xcodebuild.sh** - Post-build cleanup/notifications

✅ **Project Settings:**
   - Bundle ID: `com.shiftscanapp`
   - Team: `XSKZMV6LQV`
   - Code Sign: Automatic
   - Shared Scheme: "Shift Scan"

---

## 📚 Need Help?

See full documentation: `ios/XCODE_CLOUD_SETUP.md`

Common issues:
- **Scheme not found** → Verify "Shift Scan" is marked as Shared
- **Code signing error** → Enable automatic signing in App Store Connect
- **Dependencies fail** → Check ci_post_clone.sh logs

---

## 🎯 Expected Results

After successful build:
- ✅ Archive created: `build.xcarchive`
- ✅ IPA file generated (for distribution builds)
- ✅ Available in TestFlight (if configured)

**Free tier includes:** 25 compute hours/month
