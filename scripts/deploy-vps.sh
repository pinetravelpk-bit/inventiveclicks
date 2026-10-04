#!/usr/bin/env bash
# Build the static site and publish it to the VPS as a new release.
# Usage: bash scripts/deploy-vps.sh [ssh-host]   (default: inventiveclicks-vps)
# nginx serves /var/www/inventiveclicks/current; the last 5 releases are kept.
set -euo pipefail

HOST="${1:-inventiveclicks-vps}"
cd "$(dirname "$0")/.."

npm run build

tar -czf - -C out . | ssh "$HOST" 'set -e
  base=/var/www/inventiveclicks
  rel=$base/releases/$(date +%Y%m%d%H%M%S)
  mkdir -p "$rel"
  tar -xzf - -C "$rel"
  chown -R www-data:www-data "$base"
  ln -sfn "$rel" "$base/current"
  ls -1dt "$base"/releases/* | tail -n +6 | xargs -r rm -rf
  echo "Deployed $rel"'
