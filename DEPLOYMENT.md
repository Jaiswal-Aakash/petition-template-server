# Template Server - Ubuntu Deployment Guide

This guide will help you deploy the template-server on your Ubuntu server using PM2.

## Prerequisites

1. Ubuntu server (18.04 or later)
2. Node.js (v18 or later)
3. npm or yarn
4. PM2 installed globally

## Step 1: Install Node.js and npm

```bash
# Update package list
sudo apt update

# Install Node.js (using NodeSource repository for latest LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 2: Install PM2

```bash
sudo npm install -g pm2
```

## Step 3: Install System Dependencies for Puppeteer

Puppeteer requires some system libraries to run Chromium:

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

## Step 4: Transfer Files to Server

Upload the `template-server` directory to your Ubuntu server. You can use:

- **SCP:**
  ```bash
  scp -r template-server user@your-server-ip:/path/to/destination/
  ```

- **SFTP:** Use FileZilla or similar
- **Git:** Clone your repository if it's in version control

## Step 5: Install Project Dependencies

On your Ubuntu server:

```bash
cd /path/to/template-server
npm install --production
```

## Step 6: Configure Environment Variables (Optional)

Create a `.env` file if you need to customize settings:

```bash
nano .env
```

Add:
```
PORT=6000
NODE_ENV=production
```

## Step 7: Create Logs Directory

```bash
mkdir -p logs
```

## Step 8: Start with PM2

### Option A: Using ecosystem.config.js (Recommended)

```bash
pm2 start ecosystem.config.js
```

### Option B: Direct start

```bash
pm2 start server.js --name template-server --env production
```

## Step 9: Configure PM2 to Start on Boot

```bash
# Generate startup script
pm2 startup

# Follow the instructions shown (usually involves running a sudo command)
# Then save the PM2 process list
pm2 save
```

## Step 10: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs template-server

# Test the server
curl http://localhost:6000/health
```

## PM2 Management Commands

```bash
# View status
pm2 status

# View logs
pm2 logs template-server

# Restart
pm2 restart template-server

# Stop
pm2 stop template-server

# Delete from PM2
pm2 delete template-server

# Monitor (real-time)
pm2 monit

# Reload (zero-downtime restart)
pm2 reload template-server
```

## Firewall Configuration

If you need to expose the server externally:

```bash
# Allow port 6000 (or your custom port)
sudo ufw allow 6000/tcp

# Or if using iptables
sudo iptables -A INPUT -p tcp --dport 6000 -j ACCEPT
```

## Nginx Reverse Proxy (Optional)

If you want to use a domain name and SSL:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:6000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Troubleshooting

### Puppeteer Issues

If Puppeteer fails to launch:

```bash
# Install missing dependencies
sudo apt-get install -y chromium-browser

# Or set Puppeteer to use system Chromium
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### Port Already in Use

```bash
# Find process using port 6000
sudo lsof -i :6000

# Kill the process
sudo kill -9 <PID>
```

### Check PM2 Logs

```bash
pm2 logs template-server --lines 100
```

### Memory Issues

If you encounter memory issues, adjust the `max_memory_restart` in `ecosystem.config.js`.

## Health Check

The server provides a health check endpoint:

```bash
curl http://localhost:6000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Template server is running",
  "templatesCount": 2
}
```

## Updating the Server

When you need to update:

```bash
# Pull latest changes (if using git)
git pull

# Install new dependencies
npm install --production

# Restart PM2
pm2 restart template-server
```

## Security Considerations

1. **Firewall:** Only expose necessary ports
2. **Environment Variables:** Keep sensitive data in `.env` file
3. **User Permissions:** Run PM2 as a non-root user
4. **SSL:** Use HTTPS in production (via Nginx reverse proxy with Let's Encrypt)

