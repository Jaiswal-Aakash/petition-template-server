#!/bin/bash

# Script to check if port 6000 is available and suggest alternatives

echo "🔍 Checking port availability for template-server..."
echo ""

# Check if port 6000 is in use
if sudo lsof -i :6000 > /dev/null 2>&1 || sudo netstat -tlnp 2>/dev/null | grep -q ":6000 "; then
    echo "❌ Port 6000 is already in use!"
    echo ""
    echo "Processes using port 6000:"
    sudo lsof -i :6000 2>/dev/null || sudo netstat -tlnp 2>/dev/null | grep ":6000 "
    echo ""
    echo "💡 Suggested alternative ports:"
    echo "   - 6001"
    echo "   - 6002"
    echo "   - 7000"
    echo "   - 8001"
    echo ""
    echo "To change the port:"
    echo "  1. Edit ecosystem.config.js and change PORT value"
    echo "  2. Or create .env file with PORT=6001"
else
    echo "✅ Port 6000 is available!"
    echo ""
    echo "You can use the default port 6000."
fi

echo ""
echo "All Node.js processes and their ports:"
echo "--------------------------------------"
sudo netstat -tlnp 2>/dev/null | grep node | awk '{print $4}' | sed 's/.*://' | sort -u
echo ""
echo "PM2 processes:"
pm2 list 2>/dev/null || echo "PM2 not running or not installed"

