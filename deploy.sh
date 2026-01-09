#!/bin/bash

# Template Server Deployment Script for Ubuntu
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting Template Server Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run as root. Use a regular user with sudo privileges.${NC}"
   exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
fi

# Check PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 not found. Installing PM2...${NC}"
    sudo npm install -g pm2
else
    echo -e "${GREEN}✓ PM2 found: $(pm2 --version)${NC}"
fi

# Install system dependencies for Puppeteer
echo -e "${YELLOW}Installing system dependencies for Puppeteer...${NC}"
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

# Install project dependencies
echo -e "${YELLOW}Installing project dependencies...${NC}"
npm install --production

# Create logs directory
echo -e "${YELLOW}Creating logs directory...${NC}"
mkdir -p logs

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        echo "PORT=6000" > .env
        echo "NODE_ENV=production" >> .env
    fi
fi

# Stop existing PM2 process if running
if pm2 list | grep -q "template-server"; then
    echo -e "${YELLOW}Stopping existing template-server process...${NC}"
    pm2 delete template-server || true
fi

# Start with PM2
echo -e "${YELLOW}Starting template-server with PM2...${NC}"
if [ -f ecosystem.config.cjs ]; then
    pm2 start ecosystem.config.cjs
elif [ -f ecosystem.config.js ]; then
    pm2 start ecosystem.config.js
else
    pm2 start server.js --name template-server --env production
fi

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
echo -e "${YELLOW}Setting up PM2 startup script...${NC}"
echo -e "${GREEN}Run the following command (shown by PM2) to enable startup on boot:${NC}"
pm2 startup

echo -e "${GREEN}✓ Deployment completed!${NC}"
echo -e "${GREEN}✓ Server should be running on port 6000${NC}"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check server status"
echo "  pm2 logs template-server - View logs"
echo "  pm2 restart template-server - Restart server"
echo "  curl http://localhost:6000/health - Test health endpoint"

