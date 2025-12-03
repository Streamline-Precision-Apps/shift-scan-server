# Xcode Cloud Setup Guide

## ✅ What's Configured

- Post-clone script to install CocoaPods dependencies
- Automatic Capacitor sync
- npm dependency installation

## 🚀 Next Steps

### 1. Enable Xcode Cloud in Xcode
1. Open the workspace: `open ios/App/App.xcworkspace`
2. Go to **Report Navigator** (Cmd+9) → **Cloud** tab
3. Click **"Create Workflow"** or **Product → Xcode Cloud → Create Workflow**

### 2. Configure the Workflow
1. Select the **"App"** scheme
2. Choose branch: `devun-branch-v1` or `main`
3. Set build triggers:
   - ✅ On every push to branch
   - ✅ On pull request
   - ⚠️ On schedule (optional)

### 3. Set Environment Variables (in App Store Connect)
Navigate to: **App Store Connect → Your App → Xcode Cloud → Settings → Environment**

Add:
```
DEVELOPMENT_TEAM = XSKZMV6LQV
```

### 4. Configure Code Signing
Choose one:
- **Automatic Signing**: Xcode Cloud manages certificates
- **Manual Signing**: Upload certificates to App Store Connect

### 5. Commit the ci_scripts
```bash
git add ios/App/ci_scripts/
git commit -m "Add Xcode Cloud build scripts"
git push
```

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

### "Scheme not found"
- Make sure your scheme is marked as "Shared"
- Check ios/App/App.xcworkspace/xcshareddata/xcschemes/

### CocoaPods installation fails
- Check the build logs in Xcode Cloud
- Verify Podfile is committed to repository

### Node/npm issues  
- Xcode Cloud uses Node 18 by default
- Set `NODE_VERSION` environment variable if you need different version

## 💰 Pricing
- **Free tier**: 25 compute hours/month
- Check current pricing: https://developer.apple.com/xcode-cloud/

## 📚 Resources
- [Xcode Cloud Documentation](https://developer.apple.com/documentation/xcode/xcode-cloud)
- [Configuring Workflows](https://developer.apple.com/documentation/xcode/configuring-your-first-xcode-cloud-workflow)
