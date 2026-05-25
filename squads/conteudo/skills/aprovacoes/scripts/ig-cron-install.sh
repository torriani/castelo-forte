#!/bin/bash
# Instala LaunchAgent que roda o coletor IG da Castelo Forte às 04h e 18h
set -e
PLIST=~/Library/LaunchAgents/com.castelo-forte.ig-coletor.plist
SCRIPT="$HOME/claude/squads/conteudo/skills/aprovacoes/scripts/ig-coletor.mjs"
LOGDIR="$HOME/claude/squads/conteudo/skills/aprovacoes/logs"
mkdir -p "$LOGDIR"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.castelo-forte.ig-coletor</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>$SCRIPT</string>
    <string>castelo-forte</string>
  </array>
  <key>StartCalendarInterval</key>
  <array>
    <dict><key>Hour</key><integer>4</integer><key>Minute</key><integer>0</integer></dict>
    <dict><key>Hour</key><integer>18</integer><key>Minute</key><integer>0</integer></dict>
  </array>
  <key>StandardOutPath</key><string>$LOGDIR/ig-coletor.out.log</string>
  <key>StandardErrorPath</key><string>$LOGDIR/ig-coletor.err.log</string>
  <key>RunAtLoad</key><false/>
</dict>
</plist>
EOF

launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"
echo "[ig] LaunchAgent instalado (roda 04h e 18h)."
echo "logs: $LOGDIR/ig-coletor.{out,err}.log"
