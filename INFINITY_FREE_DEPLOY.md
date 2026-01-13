# Deploying to InfinityFree

This guide will help you upload your 3D Portfolio to InfinityFree.

## Prerequisites
1. An account on [InfinityFree](https://www.infinityfree.com/)
2. A created hosting account (domain name set up in InfinityFree dashboard)

## Step-by-Step Deployment

### 1. Prepare Your Files
Ensure you have the following files ready in your project folder:
- `index.html`
- `styles.css`
- `script.js`
- `apache-bike-model.glb` (The 3D bike model)
- Any other images/assets (e.g. `logo.png` if you have one)

### 2. Access the File Manager
1. Login to the [InfinityFree Client Area](https://app.infinityfree.com/).
2. Click **"Manage"** next to your hosting account.
3. Click the **"File Manager"** button (this usually opens a tool called "Monsta FTP").

### 3. Upload Files
1. In the File Manager, double-click on the **`htdocs`** folder to open it.
   - *Important:* Your website files MUST go inside `htdocs`. Files outside this folder won't be visible.
2. Delete the default files (`index2.html` or `default.php`) if they exist.
3. **Upload all your project files**:
   - Click the **Upload** icon (usually an arrow pointing up).
   - Select **Upload File**.
   - Select all your project files (`index.html`, `styles.css`, `script.js`, `apache-bike-model.glb`, etc.).
   - Wait for the upload to complete.

### 4. Verify Upload
Ensure your file structure in `htdocs` looks like this:
```
/htdocs
  ├── index.html
  ├── styles.css
  ├── script.js
  └── apache-bike-model.glb
```

### 5. Check Your Website
1. Go back to the InfinityFree Client Area.
2. Click your website link (e.g., `http://your-site.rf.gd`).
3. Your 3D Portfolio should now load!

## Troubleshooting

- **3D Bike Not Loading?** 
  - Make sure `apache-bike-model.glb` was uploaded correctly.
  - Sometimes changes take a few minutes to propagate. Try clearing your browser cache.
- **Message "Directory Listing" or "403 Forbidden"?**
  - This means `index.html` is missing from `htdocs` or is named incorrectly. Ensure it's exactly `index.html`.

Enjoy your new 3D website! 🚀
