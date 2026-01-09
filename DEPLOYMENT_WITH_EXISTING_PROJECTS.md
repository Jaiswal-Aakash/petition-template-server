# Deploying Template Server with Existing Node.js Projects

This guide is for adding the template-server to a server that already has Node.js projects running with PM2.

## Step 1: Check Your Existing Setup

### 1.1 Check existing PM2 processes
```bash
pm2 list
```

You should see your existing projects. Note their names and ports.

### 1.2 Check what ports are in use
```bash
sudo netstat -tlnp | grep node
# or
sudo ss -tlnp | grep node
```

This shows all ports used by Node.js processes. Look for ports like 3000, 5000, 8000, etc.

### 1.3 Verify Node.js and PM2 are installed
```bash
node --version
npm --version
pm2 --version
```

If these work, you can skip installation steps!

---

## Step 2: Check Port Availability

The template-server uses port **6000** by default. Let's check if it's available:

```bash
# Check if port 6000 is in use
sudo lsof -i :6000
# or
sudo netstat -tlnp | grep 6000
```

### If port 6000 is FREE:
✅ You can use the default port. Continue to Step 3.

### If port 6000 is ALREADY IN USE:
You need to change the port. See **Step 2A** below.

---

## Step 2A: Change Port (If 6000 is Taken)

### Option 1: Change in ecosystem.config.js

Edit the ecosystem config:
```bash
nano ecosystem.config.js
```

Change the PORT value:
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 6001  // Change to an available port
}
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### Option 2: Use environment variable

Create/edit `.env` file:
```bash
nano .env
```

Add:
```
PORT=6001
NODE_ENV=production
```

Save: `Ctrl+X`, then `Y`, then `Enter`

**Note:** Make sure to use a port that's not in use. Common alternatives: 6001, 6002, 7000, 8001, etc.

---

## Step 3: Transfer Files to Server

Transfer the `template-server` folder to your Ubuntu server:

```bash
# From your local machine (Windows)
scp -r template-server username@your-server-ip:/home/username/
```

Or use WinSCP, or Git if your code is in a repository.

---

## Step 4: SSH into Your Server

```bash
ssh username@your-server-ip
```

Navigate to the uploaded directory:
```bash
cd ~/template-server
# or wherever you uploaded it
```

---

## Step 5: Install System Dependencies (If Needed)

Since you already have Node.js projects, you might already have Puppeteer dependencies. But let's install them to be safe:

```bash
sudo apt update
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

---

## Step 6: Install Project Dependencies

```bash
cd ~/template-server
npm install --production
```

This will install:
- express
- cors
- dotenv
- handlebars
- puppeteer

**Note:** Puppeteer may take a few minutes to download Chromium.

---

## Step 7: Create Logs Directory

```bash
mkdir -p logs
```

---

## Step 8: Create Environment File (Optional but Recommended)

```bash
nano .env
```

Add:
```
PORT=6000
NODE_ENV=production
```

(Or use the port you chose in Step 2A)

Save: `Ctrl+X`, then `Y`, then `Enter`

---

## Step 9: Start Template Server with PM2

### 9.1 Start the server
```bash
pm2 start ecosystem.config.js
```

### 9.2 Verify it's running
```bash
pm2 list
```

You should now see **three** processes:
- Your existing project 1
- Your existing project 2
- **template-server** (new!)

Example output:
```
┌─────┬──────────────────┬─────────┬─────────┬──────────┐
│ id  │ name             │ status  │ restart │ uptime   │
├─────┼──────────────────┼─────────┼─────────┼──────────┤
│ 0   │ backend-api      │ online  │ 0       │ 5d       │
│ 1   │ frontend-api     │ online  │ 0       │ 5d       │
│ 2   │ template-server  │ online  │ 0       │ 5s       │
└─────┴──────────────────┴─────────┴─────────┴──────────┘
```

### 9.3 Check logs
```bash
pm2 logs template-server
```

You should see:
```
Template Server running on port 6000
Templates API: http://localhost:6000/api/templates
Health check: http://localhost:6000/health
```

Press `Ctrl+C` to exit logs.

---

## Step 10: Save PM2 Configuration

This saves all your PM2 processes (including the new one):

```bash
pm2 save
```

**Important:** This ensures all three projects will restart after server reboot.

---

## Step 11: Test the Template Server

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

## Step 12: Configure Firewall (If Needed)

If you want external access to the template-server:

```bash
# Check current firewall status
sudo ufw status

# Allow your template-server port (replace 6000 with your port if different)
sudo ufw allow 6000/tcp

# Reload firewall
sudo ufw reload
```

---

## Managing Multiple PM2 Processes

### View all processes
```bash
pm2 list
```

### View logs for specific process
```bash
pm2 logs template-server
pm2 logs backend-api      # Your other project
pm2 logs frontend-api     # Your other project
```

### View logs for all processes
```bash
pm2 logs
```

### Restart specific process
```bash
pm2 restart template-server
pm2 restart backend-api
```

### Restart all processes
```bash
pm2 restart all
```

### Stop specific process
```bash
pm2 stop template-server
```

### Start specific process
```bash
pm2 start template-server
```

### Monitor all processes
```bash
pm2 monit
```

This shows a real-time dashboard of all your PM2 processes.

---

## Verify Everything is Working

### Check all processes are running
```bash
pm2 status
```

All should show status: **online**

### Test each service
```bash
# Test your existing projects (adjust ports as needed)
curl http://localhost:3000/health  # Example
curl http://localhost:5000/health  # Example

# Test template-server
curl http://localhost:6000/health
```

---

## Port Summary

After deployment, you should have:

| Service | Port | PM2 Name |
|---------|------|----------|
| Your Project 1 | ? | ? |
| Your Project 2 | ? | ? |
| Template Server | 6000 (or custom) | template-server |

**Note:** Replace `?` with your actual values.

---

## Troubleshooting

### Problem: "Port already in use" error
**Solution:**
```bash
# Find what's using the port
sudo lsof -i :6000

# Change port in ecosystem.config.js or .env
nano ecosystem.config.js
# Change PORT to an available port
```

### Problem: Template server not starting
**Solution:**
```bash
# Check logs for errors
pm2 logs template-server --err

# Check if dependencies are installed
cd ~/template-server
npm list
```

### Problem: Other projects stopped working
**Solution:**
```bash
# Check all processes
pm2 list

# Restart all if needed
pm2 restart all

# Check if PM2 startup is configured
pm2 startup
```

### Problem: Can't access template-server from outside
**Solution:**
```bash
# Check firewall
sudo ufw status

# Allow the port
sudo ufw allow 6000/tcp

# Check if server is listening
sudo netstat -tlnp | grep 6000
```

---

## Quick Reference Commands

```bash
# View all PM2 processes
pm2 list

# View logs for template-server
pm2 logs template-server

# Restart template-server
pm2 restart template-server

# Stop template-server
pm2 stop template-server

# Start template-server
pm2 start template-server

# Monitor all processes
pm2 monit

# Save PM2 configuration
pm2 save

# View process info
pm2 show template-server
```

---

## Success Checklist

- [ ] Checked existing PM2 processes
- [ ] Verified port 6000 is available (or changed to available port)
- [ ] Transferred files to server
- [ ] Installed system dependencies
- [ ] Installed project dependencies
- [ ] Started template-server with PM2
- [ ] Verified all three processes are running
- [ ] Tested template-server health endpoint
- [ ] Saved PM2 configuration
- [ ] Configured firewall (if needed)

---

**Congratulations! You now have three Node.js projects running on your server! 🎉**

All three projects will:
- Start automatically on server reboot
- Restart automatically if they crash
- Be managed together with PM2

