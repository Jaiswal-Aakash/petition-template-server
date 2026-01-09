# Quick Start - Ubuntu Deployment

## Fastest Way to Deploy

1. **Transfer files to your Ubuntu server:**
   ```bash
   scp -r template-server user@your-server:/opt/
   ```

2. **SSH into your server:**
   ```bash
   ssh user@your-server
   ```

3. **Run the deployment script:**
   ```bash
   cd /opt/template-server
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Follow the PM2 startup instructions** (the script will show you a command to run)

## Manual Deployment (Step by Step)

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Install PM2
sudo npm install -g pm2

# 3. Install Puppeteer dependencies
sudo apt install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils

# 4. Install project dependencies
cd /path/to/template-server
npm install --production

# 5. Create logs directory
mkdir -p logs

# 6. Start with PM2
pm2 start ecosystem.config.js

# 7. Save PM2 configuration
pm2 save

# 8. Setup startup on boot
pm2 startup
# (Follow the command shown)

# 9. Test
curl http://localhost:6000/health
```

## Essential PM2 Commands

```bash
pm2 status                    # Check status
pm2 logs template-server      # View logs
pm2 restart template-server   # Restart
pm2 stop template-server      # Stop
pm2 delete template-server    # Remove from PM2
pm2 monit                     # Monitor (real-time)
```

## Verify It's Working

```bash
# Health check
curl http://localhost:6000/health

# Should return:
# {"status":"ok","message":"Template server is running","templatesCount":2}
```

## Expose to Internet (Optional)

```bash
# Allow port 6000 through firewall
sudo ufw allow 6000/tcp

# Test from external machine
curl http://your-server-ip:6000/health
```

