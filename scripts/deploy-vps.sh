#!/usr/bin/env bash
# Deploy the latest main branch to the VPS: pull from GitHub, build and restart the
# Next.js server (systemd unit "inventiveclicks", 127.0.0.1:3110 behind nginx).
# Usage: bash scripts/deploy-vps.sh [ssh-host]   (default: inventiveclicks-vps)
set -euo pipefail
HOST="${1:-inventiveclicks-vps}"

ssh "$HOST" 'set -e
  cd /var/www/inventiveclicks/app
  export npm_config_cache=/var/lib/inventiveclicks/npm-cache
  sudo -u inventiveclicks git fetch -q origin main
  sudo -u inventiveclicks git reset -q --hard origin/main
  sudo -u inventiveclicks --preserve-env=npm_config_cache npm ci --no-audit --no-fund --loglevel=error
  sudo -u inventiveclicks --preserve-env=npm_config_cache npm run build >/tmp/inventiveclicks-build.log 2>&1 || { tail -30 /tmp/inventiveclicks-build.log; exit 1; }
  systemctl restart inventiveclicks
  for i in $(seq 1 30); do curl -sf -o /dev/null http://127.0.0.1:3110/ && { echo "Deployed $(git rev-parse --short HEAD)"; exit 0; }; sleep 1; done
  echo "Service did not come up"; journalctl -u inventiveclicks -n 30 --no-pager; exit 1'
