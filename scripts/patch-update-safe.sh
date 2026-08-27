#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
U="$SCRIPT_DIR/update.sh"

python3 - "$U" <<'PY'
import sys
from pathlib import Path

p = Path(sys.argv[1])
text = p.read_text(encoding="utf-8")

step0_old = '''# === Step 0: Self-update (bootstrap) ===
echo "[0] Проверка update.sh..."
# Capture hash before any network activity — used for --check integrity guard below (fix #205)
SELF_HASH_BEFORE=$(hash_file "$SCRIPT_DIR/update.sh")'''

step0_new = '''# === Step 0: Self-update (bootstrap) ===
echo "[0] Проверка update.sh..."
if [ -f "$SCRIPT_DIR/.iwe-skip-update-sh-bootstrap" ]; then
    echo "  ○ Step 0 пропущен (.iwe-skip-update-sh-bootstrap — локальный update.sh сохранён)."
    SELF_HASH_BEFORE=$(hash_file "$SCRIPT_DIR/update.sh")
else
# Capture hash before any network activity — used for --check integrity guard below (fix #205)
SELF_HASH_BEFORE=$(hash_file "$SCRIPT_DIR/update.sh")'''

if step0_old not in text:
    raise SystemExit("step0 anchor not found")
text = text.replace(step0_old, step0_new, 1)

close_step0 = '''    fi
fi
echo "  update.sh актуален."
echo ""

# === Step 1: Fetch manifest ==='''
insert_close = '''    fi
fi
fi
echo "  update.sh актуален."
echo ""

# === Step 1: Fetch manifest ==='''
if close_step0 not in text:
    raise SystemExit("step0 close anchor not found")
text = text.replace(close_step0, insert_close, 1)

new_skip = '''    if author_diverged "$f"; then
        echo "  ⚠ $f — author_mode: локально изменён/удалён, не восстанавливаю. Сверь: git -C \\"$SCRIPT_DIR\\" status -- \\"$f\\""
        AUTHOR_SKIPPED=$((AUTHOR_SKIPPED + 1))
        continue
    fi
    if [ "$f" = "update.sh" ]; then
        echo "  ~ update.sh (Step 0 / локальная копия — in-place apply из манифеста пропущен)"
        continue
    fi
    mkdir -p "$SCRIPT_DIR/$(dirname "$f")"'''

new_anchor = '''    if author_diverged "$f"; then
        echo "  ⚠ $f — author_mode: локально изменён/удалён, не восстанавливаю. Сверь: git -C \\"$SCRIPT_DIR\\" status -- \\"$f\\""
        AUTHOR_SKIPPED=$((AUTHOR_SKIPPED + 1))
        continue
    fi
    mkdir -p "$SCRIPT_DIR/$(dirname "$f")"'''

if new_anchor not in text:
    raise SystemExit("new loop anchor not found")
text = text.replace(new_anchor, new_skip, 1)

upd_skip = '''    if author_diverged "$f"; then
        echo "  ⚠ $f — author_mode: несмёрженные правки, файл не тронут."
        echo "    Сверь: diff \\"$TMPDIR_UPDATE/files/$f\\" \\"$SCRIPT_DIR/$f\\""
        AUTHOR_SKIPPED=$((AUTHOR_SKIPPED + 1))
        continue
    fi
    if [ "$f" = "update.sh" ]; then
        echo "  ~ update.sh (Step 0 / локальная копия — in-place apply из манифеста пропущен)"
        continue
    fi
    APPLIED_PATHS+=("$f")'''

upd_anchor = '''    if author_diverged "$f"; then
        echo "  ⚠ $f — author_mode: несмёрженные правки, файл не тронут."
        echo "    Сверь: diff \\"$TMPDIR_UPDATE/files/$f\\" \\"$SCRIPT_DIR/$f\\""
        AUTHOR_SKIPPED=$((AUTHOR_SKIPPED + 1))
        continue
    fi
    APPLIED_PATHS+=("$f")'''

if upd_anchor not in text:
    raise SystemExit("updated loop anchor not found")
text = text.replace(upd_anchor, upd_skip, 1)

p.write_text(text, encoding="utf-8")
print("patched ok", p.stat().st_size)
PY

bash -n "$U"
rm -f "$SCRIPT_DIR/.update-incomplete"
test -f "$SCRIPT_DIR/.iwe-skip-update-sh-bootstrap" && echo skip_marker=present
