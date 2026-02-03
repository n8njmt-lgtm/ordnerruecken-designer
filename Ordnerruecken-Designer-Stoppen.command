#!/bin/bash
# Ordnerrücken-Designer - Server stoppen
# Doppelklick zum Beenden!

echo "🛑 Beende Ordnerrücken-Designer Server..."

pkill -f "vite" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null

echo "✅ Server beendet!"

sleep 1
osascript -e 'tell application "Terminal" to close first window' &

exit 0
