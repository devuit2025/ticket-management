#!/bin/bash

set -e

FONT_NAME="$1"

if [ -z "$FONT_NAME" ]; then
  echo "❌ Please provide a Google Font name."
  echo "Usage: ./install-font.sh \"Font Name\""
  exit 1
fi

# Normalize for folder path
FONT_KEY=$(echo "$FONT_NAME" | tr '[:upper:]' '[:lower:]')
FONT_DIR="./assets/fonts"

# Known font paths on Google Fonts GitHub
declare -A FONT_PATHS
FONT_PATHS["inter"]="ofl/inter"
FONT_PATHS["be vietnam pro"]="ofl/bevietnampro"

if [[ -z "${FONT_PATHS[$FONT_KEY]}" ]]; then
  echo "❌ Unsupported font: $FONT_NAME"
  echo "Supported fonts:"
  for key in "${!FONT_PATHS[@]}"; do echo " - $key"; done
  exit 1
fi

echo "📥 Downloading $FONT_NAME from Google Fonts GitHub..."

mkdir -p "$FONT_DIR"

# Define weights
WEIGHTS=("Regular" "Medium" "Bold")

# PascalCase font prefix (e.g., Inter, BeVietnamPro)
FONT_PREFIX=$(echo "$FONT_NAME" | sed 's/ //g')

for weight in "${WEIGHTS[@]}"; do
  FILE_NAME="${FONT_PREFIX}-${weight}.ttf"
  URL="https://github.com/google/fonts/raw/main/${FONT_PATHS[$FONT_KEY]}/static/${FILE_NAME}"

  DEST="$FONT_DIR/$FILE_NAME"
  echo "  ➤ $weight → $DEST"

  curl -sSfL "$URL" -o "$DEST" || echo "⚠️  Failed to download: $FILE_NAME"
done

# Generate font config
CONFIG_FILE="./src/theme/fonts.d.ts"
cat > "$CONFIG_FILE" << EOF
// Auto-generated font map
export const fonts = {
  regular: '${FONT_PREFIX}-Regular',
  medium: '${FONT_PREFIX}-Medium',
  bold: '${FONT_PREFIX}-Bold',
  sizes: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
};
EOF

echo "✅ Fonts installed in: $FONT_DIR"
echo "🔧 Font config created: $CONFIG_FILE"
