#!/usr/bin/env bash
set -euo pipefail

# SHONGJOG — Clean Source Packaging Script
# Packages the entire repository into a lightweight submission zip excluding heavy caches.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_ZIP="$DIR/shongjog-submission.zip"

echo "=========================================================="
echo " Packaging SHONGJOG Clean Source Distribution..."
echo " Root directory: $DIR"
echo "=========================================================="

# Optimize screenshots if Pillow is present
if python3 -c "import PIL" 2>/dev/null; then
  python3 -c "
import os
from PIL import Image

dir_path = '$DIR/docs/screenshots'
if os.path.exists(dir_path):
    for f in os.listdir(dir_path):
        if f.endswith('.png'):
            p = os.path.join(dir_path, f)
            img = Image.open(p)
            if img.mode != 'P':
                img_q = img.convert('P', palette=Image.ADAPTIVE, colors=256)
                out_p = p + '.tmp'
                img_q.save(out_p, 'PNG', optimize=True)
                os.replace(out_p, p)
"
fi

rm -f "$OUTPUT_ZIP"

cd "$DIR"

# Zip required files while excluding dependencies, compiled builds, git history, secrets, and test caches
zip -r -q "$OUTPUT_ZIP" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x ".vercel/*" \
  -x "test-results/*" \
  -x "playwright-report/*" \
  -x "*.log" \
  -x ".env" \
  -x ".env.local" \
  -x ".env.production*" \
  -x ".env.development*" \
  -x ".env.test*" \
  -x ".env.staging*" \
  -x ".env.*.local" \
  -x "*.pem" \
  -x "*.key" \
  -x "*.cert" \
  -x "*.db" \
  -x "*.db-journal" \
  -x "*.tsbuildinfo" \
  -x "*/__pycache__/*" \
  -x "**/.DS_Store" \
  -x "shongjog-submission.zip"

# Integrity verification
echo " Verifying ZIP archive integrity..."
unzip -tq "$OUTPUT_ZIP"
echo " [OK] ZIP integrity check passed."

ZIP_SIZE_BYTES=$(stat -c%s "$OUTPUT_ZIP" 2>/dev/null || stat -f%z "$OUTPUT_ZIP")
ZIP_SIZE_MB=$(echo "scale=2; $ZIP_SIZE_BYTES / 1048576" | bc)

echo " Created package: $OUTPUT_ZIP"
echo " Package size: $ZIP_SIZE_MB MB ($ZIP_SIZE_BYTES bytes)"

if (( $(echo "$ZIP_SIZE_MB < 5.0" | bc -l) )); then
  echo " [SUCCESS] Package size is strictly below the 5.0 MB target limit!"
else
  echo " [WARNING] Package size exceeds 5.0 MB limit. Please audit assets."
fi
echo "=========================================================="

