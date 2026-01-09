# Step-by-Step Deployment Guide for Template Server on Ubuntu

Follow these steps carefully to deploy your template-server on Ubuntu using PM2.

## Prerequisites Checklist

- [ ] Ubuntu server (18.04 or later) with SSH access
- [ ] Your server's IP address or domain name
- [ ] SSH credentials (username and password/key)
- [ ] Basic terminal/command line knowledge

---

## Step 1: Prepare Your Local Machine

### 1.1 Navigate to the template-server directory
```bash
cd C:\Users\RIO\Desktop\law\template-server
```

### 1.2 Verify files are present
You should see:
- `server.js`
- `package.json`
- `ecosystem.config.cjs` (we just created this)
- `deploy.sh` (we just created this)

---

## Step 2: Transfer Files to Ubuntu Server

You have several options:

### Option A: Using SCP (from Windows PowerShell or Git Bash)

```bash
# Replace 'username' with your Ubuntu username
# Replace 'your-server-ip' with your actual server IP
scp -r template-server username@your-server-ip:/home/username/
```

**Example:**
```bash
scp -r template-server ubuntu@192.168.1.100:/home/ubuntu/
```

### Option B: Using WinSCP (Windows GUI tool)
1. Download and install WinSCP
2. Connect to your Ubuntu server
3. Navigate to `/home/your-username/`
4. Upload the entire `template-server` folder

### Option C: Using Git (if your code is in a repository)
```bash
# On Ubuntu server
git clone your-repository-url
cd your-repository/template-server
```

---

## Step 3: Connect to Your Ubuntu Server

### 3.1 Open SSH connection
```bash
ssh username@your-server-ip
```

**Example:**
```bash
ssh ubuntu@192.168.1.100
```

### 3.2 Navigate to the uploaded directory
```bash
cd ~/template-server
# or
cd /home/username/template-server
```

### 3.3 Verify files are there
```bash
ls -la
```

You should see all the files including `server.js`, `package.json`, `ecosystem.config.cjs`, etc.

---

## Step 4: Install Node.js

### 4.1 Update package list
```bash
sudo apt update
```

### 4.2 Install Node.js (v18 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 4.3 Verify installation
```bash
node --version
npm --version
```

You should see:
- Node.js version: v18.x.x or higher
- npm version: 9.x.x or higher

---

## Step 5: Install PM2

### 5.1 Install PM2 globally
```bash
sudo npm install -g pm2
```

### 5.2 Verify PM2 installation
```bash
pm2 --version
```

You should see a version number like `5.x.x`

---

## Step 6: Install System Dependencies for Puppeteer

Puppeteer (used for PDF generation) needs system libraries:

```bash
sudo apt install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

This may take a few minutes. Wait for it to complete.

---

## Step 7: Install Project Dependencies

### 7.1 Make sure you're in the template-server directory
```bash
cd ~/template-server
# or wherever you uploaded it
```

### 7.2 Install npm packages
```bash
npm install --production
```

This will install:
- express
- cors
- dotenv
- handlebars
- puppeteer

**Note:** This may take 5-10 minutes as Puppeteer downloads Chromium.

---

## Step 8: Create Logs Directory

```bash
mkdir -p logs
```

---

## Step 9: Create Environment File (Optional)

### 9.1 Create .env file
```bash
nano .env
```

### 9.2 Add these lines:
```
PORT=6000
NODE_ENV=production
```

### 9.3 Save and exit
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

---

## Step 10: Start Server with PM2

### 10.1 Start using ecosystem config (Recommended)
```bash
pm2 start ecosystem.config.cjs
```

### 10.2 Verify it's running
```bash
pm2 status
```

You should see:
```
┌─────┬──────────────────┬─────────┬─────────┬──────────┐
│ id  │ name             │ status  │ restart │ uptime   │
├─────┼──────────────────┼─────────┼─────────┼──────────┤
│ 0   │ template-server  │ online  │ 0       │ 5s       │
└─────┴──────────────────┴─────────┴─────────┴──────────┘
```

### 10.3 Check logs
```bash
pm2 logs template-server
```

You should see:
```
Template Server running on port 6000
Templates API: http://localhost:6000/api/templates
Health check: http://localhost:6000/health
```

Press `Ctrl + C` to exit logs view.

---

## Step 11: Test the Server

### 11.1 Test health endpoint
```bash
curl http://localhost:6000/health
```

Expected response:
```json
{"status":"ok","message":"Template server is running","templatesCount":2}
```

### 11.2 Test templates endpoint
```bash
curl http://localhost:6000/api/templates
```

You should see JSON with template data.

---

## Step 12: Configure PM2 to Start on Boot

### 12.1 Generate startup script
```bash
pm2 startup
```

**Important:** This will show you a command like:
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-username --hp /home/your-username
```

### 12.2 Copy and run that exact command
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-username --hp /home/your-username
```

Replace `your-username` with your actual Ubuntu username.

### 12.3 Save PM2 process list
```bash
pm2 save
```

Now your server will automatically start when Ubuntu reboots!

---

## Step 13: Configure Firewall (If Needed)

### 13.1 Check if firewall is active
```bash
sudo ufw status
```

### 13.2 Allow port 6000 (if you want external access)
```bash
sudo ufw allow 6000/tcp
sudo ufw reload
```

### 13.3 Verify
```bash
sudo ufw status
```

---

## Step 14: Test from External Machine (Optional)

If you opened the firewall, test from your local machine:

```bash
curl http://your-server-ip:6000/health
```

Replace `your-server-ip` with your actual server IP address.

---

## Step 15: Verify Everything is Working

### 15.1 Check PM2 status
```bash
pm2 status
```

### 15.2 Check server is responding
```bash
curl http://localhost:6000/health
```

### 15.3 View recent logs
```bash
pm2 logs template-server --lines 50
```

---

## Common PM2 Commands You'll Need

```bash
# View status
pm2 status

# View logs (real-time)
pm2 logs template-server

# View logs (last 100 lines)
pm2 logs template-server --lines 100

# Restart server
pm2 restart template-server

# Stop server
pm2 stop template-server

# Start server
pm2 start template-server

# Delete from PM2
pm2 delete template-server

# Monitor (real-time dashboard)
pm2 monit

# Reload (zero-downtime restart)
pm2 reload template-server
```

---

## Troubleshooting

### Problem: "Port 6000 already in use"
**Solution:**
```bash
# Find what's using the port
sudo lsof -i :6000

# Kill the process (replace PID with actual process ID)
sudo kill -9 PID

# Or change port in .env file
nano .env
# Change PORT=6000 to PORT=6001
```

### Problem: "Puppeteer fails to launch"
**Solution:**
```bash
# Install Chromium
sudo apt install -y chromium-browser

# Set environment variable
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Restart PM2
pm2 restart template-server
```

### Problem: "PM2 process keeps restarting"
**Solution:**
```bash
# Check logs for errors
pm2 logs template-server --err

# Check memory usage
pm2 monit
```

### Problem: "Cannot connect to server"
**Solution:**
```bash
# Check if server is running
pm2 status

# Check if port is listening
sudo netstat -tlnp | grep 6000

# Check firewall
sudo ufw status
```

---

## Success Checklist

- [ ] Node.js installed and verified
- [ ] PM2 installed and verified
- [ ] System dependencies installed
- [ ] Project dependencies installed (npm install completed)
- [ ] Server started with PM2
- [ ] Health endpoint responds correctly
- [ ] PM2 startup configured
- [ ] Firewall configured (if needed)
- [ ] Server accessible (locally or externally)

---

## Next Steps

1. **Monitor your server:**
   ```bash
   pm2 monit
   ```

2. **Set up Nginx reverse proxy** (optional, for domain name and SSL):
   - See DEPLOYMENT.md for Nginx configuration

3. **Set up SSL certificate** (optional, for HTTPS):
   - Use Let's Encrypt with Certbot

4. **Configure monitoring** (optional):
   - Set up PM2 monitoring
   - Configure log rotation

---

## Need Help?

If you encounter any issues:
1. Check PM2 logs: `pm2 logs template-server`
2. Check system logs: `journalctl -u pm2-your-username`
3. Verify all dependencies are installed
4. Check firewall settings
5. Review the DEPLOYMENT.md file for more details

---

**Congratulations! Your template-server should now be running on your Ubuntu server! 🎉**

