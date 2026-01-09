# Quick Deploy - You're Almost There! 🚀

Based on your server check, you have:
- ✅ Node.js v18.20.8 installed
- ✅ npm 10.8.2 installed  
- ✅ PM2 5.4.3 installed
- ✅ Port 6000 is FREE
- ✅ You're in the template-server directory

## Next Steps (Run These Commands):

### Step 1: Install System Dependencies for Puppeteer
```bash
sudo apt update
sudo apt install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
```

### Step 2: Install Project Dependencies
```bash
npm install --production
```

### Step 3: Create Logs Directory
```bash
mkdir -p logs
```

### Step 4: Start with PM2
```bash
pm2 start ecosystem.config.js
```

### Step 5: Verify It's Running
```bash
pm2 list
```

You should see your template-server in the list!

### Step 6: Test the Server
```bash
curl http://localhost:6000/health
```

Expected response:
```json
{"status":"ok","message":"Template server is running","templatesCount":2}
```

### Step 7: Save PM2 Configuration
```bash
pm2 save
```

This ensures template-server starts automatically on reboot along with your other projects.

### Step 8: View Logs (Optional)
```bash
pm2 logs template-server
```

Press `Ctrl+C` to exit.

---

## Done! 🎉

Your template-server should now be running on port 6000 alongside your other projects!

## Quick Commands Reference:

```bash
pm2 list                    # See all projects (including template-server)
pm2 logs template-server     # View template-server logs
pm2 restart template-server  # Restart template-server
pm2 stop template-server     # Stop template-server
pm2 start template-server    # Start template-server
pm2 monit                   # Monitor all processes
```

## Your Current Setup:

| Service | Port | Status |
|---------|------|--------|
| Project 1 | 5173 | Running |
| Project 2 | 5000 | Running |
| Project 3 | 5001 | Running |
| Project 4 | 3003 | Running |
| **Template Server** | **6000** | **Starting...** |

