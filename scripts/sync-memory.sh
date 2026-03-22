#!/bin/bash
# Sync memory files from DS-exocortex to workspace memory dir
SRC="/mnt/c/Users/admin/IWE/DS-exocortex/memory"
DST="/mnt/c/Users/admin/IWE/memory"

for f in "$SRC"/*.md "$SRC"/*.yaml; do
    [ -f "$f" ] || continue
    fname=$(basename "$f")
    if [ "$fname" != "MEMORY.md" ]; then
        cp "$f" "$DST/$fname"
        echo "OK $fname"
    fi
done
echo "Готово"
