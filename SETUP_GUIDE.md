# 🚀 Mancinza Upholstery - VS Code Setup Guide

## 📋 Prerequisites

Before starting, ensure you have the following installed on your system:

### 1. Node.js (Required)
- **Download**: [https://nodejs.org/](https://nodejs.org/)
- **Recommended Version**: Node.js 18.x or higher
- **Verify Installation**: Open terminal/command prompt and run:
  ```bash
  node --version
  npm --version
  ```

### 2. Visual Studio Code
- **Download**: [https://code.visualstudio.com/](https://code.visualstudio.com/)
- **Recommended Extensions** (install these from VS Code Extensions marketplace):
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint
  - Auto Rename Tag
  - Bracket Pair Colorizer

### 3. Git (Optional but recommended)
- **Download**: [https://git-scm.com/](https://git-scm.com/)

## 🗂️ Project Setup

### Step 1: Extract the Project
1. Download the project zip file
2. Extract/unzip the file to your desired location
3. Rename the extracted folder to `mancinza-upholstery` (if not already named)

### Step 2: Open in VS Code
1. Open Visual Studio Code
2. Go to `File` → `Open Folder`
3. Navigate to and select the `mancinza-upholstery` folder
4. Click "Open"

### Step 3: Open Terminal in VS Code
1. In VS Code, go to `Terminal` → `New Terminal` (or press `Ctrl+`` / `Cmd+``)
2. Ensure you're in the project root directory (you should see files like `package.json`, `vite.config.ts`)

### Step 4: Install Dependencies
```bash
npm install
```

**⚠️ If you encounter errors during installation:**

#### Error: Node version compatibility
```bash
# Check your Node version
node --version

# If below 18.x, update Node.js from nodejs.org
```

#### Error: Permission issues (Mac/Linux)
```bash
# Try with sudo (not recommended for production)
sudo npm install

# Or fix npm permissions:
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

#### Error: Network/proxy issues
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Step 5: Handle Tailwind CSS v4 Alpha
Since this project uses Tailwind CSS v4 (alpha), you might need to handle compatibility issues:

#### Option A: If installation works perfectly
```bash
# Skip to Step 6
```

#### Option B: If Tailwind v4 causes issues
Update the package.json dependencies:

```json
{
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0-alpha.20"
  }
}
```

If still having issues, temporarily downgrade to Tailwind v3:
```bash
npm uninstall @tailwindcss/vite
npm install -D tailwindcss@latest postcss autoprefixer
npx tailwindcss init -p
```

Then create a `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Step 6: Start Development Server
```bash
npm run dev
```

You should see output similar to:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help, q to quit
```

### Step 7: Open in Browser
1. Hold `Ctrl` (or `Cmd` on Mac) and click the local URL (usually `http://localhost:5173/`)
2. Or manually open your browser and navigate to `http://localhost:5173/`

## 🔧 Troubleshooting Common Issues

### Issue 1: Port Already in Use
```bash
# Error: Port 5173 is already in use
# Solution: Use a different port
npm run dev -- --port 3000
```

### Issue 2: Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: TypeScript Errors
```bash
# Check TypeScript version
npx tsc --version

# If errors persist, try:
npm run build
```

### Issue 4: Tailwind Classes Not Working
1. Check if `styles/globals.css` is properly imported in `main.tsx`
2. Restart the development server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### Issue 5: Component Import Errors
- Ensure all component files exist in the `components` folder
- Check file extensions are `.tsx` not `.jsx`
- Verify import paths are correct

### Issue 6: Missing UI Components
If any UI components are missing, install them:
```bash
# For missing shadcn/ui components, you can manually install:
npm install @radix-ui/react-dialog @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

## 🏗️ Build for Production

When ready to build for production:

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

The built files will be in the `dist` folder.

## 📁 Project Structure Overview

```
mancinza-upholstery/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── figma/          # Figma-specific components
├── styles/             # Global CSS and styles
├── public/             # Static assets
├── App.tsx             # Main app component
├── main.tsx            # React entry point
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## 🎯 Development Tips

### VS Code Settings
Create `.vscode/settings.json` in your project root:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Useful VS Code Shortcuts
- `Ctrl+Shift+P` (Cmd+Shift+P) - Command Palette
- `Ctrl+`` (Cmd+`) - Toggle Terminal
- `Ctrl+B` (Cmd+B) - Toggle Sidebar
- `F5` - Start Debugging
- `Ctrl+Shift+F` (Cmd+Shift+F) - Search in Files

### Hot Reload
The development server supports hot reload. Changes to your code will automatically refresh the browser.

## 🆘 Getting Help

If you encounter issues not covered here:

1. **Check the terminal** for specific error messages
2. **Restart VS Code** and try again
3. **Clear browser cache** and refresh
4. **Check Node.js version** compatibility
5. **Review the console** in browser developer tools (F12)

## ✅ Success Checklist

- [ ] Node.js 18+ installed
- [ ] VS Code with recommended extensions
- [ ] Project extracted and opened in VS Code
- [ ] Dependencies installed successfully (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Website loads at `http://localhost:5173/`
- [ ] No console errors in browser
- [ ] Hot reload working (make a small change and see it update)

## 🎉 You're Ready!

Your Mancinza Upholstery website should now be running locally. You can:
- Edit components in the `components/` folder
- Modify styles in `styles/globals.css`
- Add new features and functionality
- Test responsiveness using browser dev tools
- Build for production when ready

---

**Need additional help?** Check the main `README.md` for more project-specific information.