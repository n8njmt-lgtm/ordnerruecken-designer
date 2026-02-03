#!/bin/bash
# Ordnerrücken-Designer - Startet im Hintergrund
# Doppelklick zum Starten!

cd "$(dirname "$0")"

# Prüfen ob Server bereits läuft
if lsof -i:5173 > /dev/null 2>&1; then
    echo "Server läuft bereits!"
    open http://localhost:5173
    osascript -e 'tell application "Terminal" to close first window' &
    exit 0
fi

# Server im Hintergrund starten
nohup npm run dev > /tmp/ordnerruecken-server.log 2>&1 &
SERVER_PID=$!

# Warten bis Server bereit ist
echo "⏳ Starte Server..."
for i in {1..30}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        break
    fi
    sleep 0.5
done

# Browser öffnen
open http://localhost:5173

echo "✅ App gestartet!"
echo ""
echo "📍 URL: http://localhost:5173"
echo "🛑 Server beenden: Führe 'pkill -f vite' im Terminal aus"

# Terminal-Fenster nach 2 Sekunden schließen
sleep 2
osascript -e 'tell application "Terminal" to close first window' &

exit 0
