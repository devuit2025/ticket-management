#!/bin/bash

# Base directory
BASE_DIR="src"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="$ROOT_DIR/templates"

mkdir -p $BASE_DIR/api
mkdir -p $BASE_DIR/components/Button
mkdir -p $BASE_DIR/components/TextInput
mkdir -p $BASE_DIR/config
mkdir -p $BASE_DIR/hooks
mkdir -p $BASE_DIR/navigation
mkdir -p $BASE_DIR/screens/Home
mkdir -p $BASE_DIR/screens/Profile
mkdir -p $BASE_DIR/store
mkdir -p $BASE_DIR/utils
mkdir -p $BASE_DIR/types

# Helper function to create file from template
create_file() {
  local target_path=$1
  local template_file=$2
  if [ -f "$TEMPLATE_DIR/$template_file" ]; then
    cat "$TEMPLATE_DIR/$template_file" > "$target_path"
    echo "Created $target_path"
  else
    touch "$target_path"
    echo "Created empty $target_path (template missing: $template_file)"
  fi
}

# Create files with content from templates
create_file "$BASE_DIR/api/index.ts" "index_api.ts"
create_file "$BASE_DIR/components/Button/Button.tsx" "Button.tsx"
create_file "$BASE_DIR/components/Button/Button.styles.ts" "Button.styles.ts"
create_file "$BASE_DIR/components/TextInput/TextInput.tsx" "TextInput.tsx"
create_file "$BASE_DIR/components/TextInput/TextInput.styles.ts" "TextInput.styles.ts"
create_file "$BASE_DIR/config/colors.ts" "colors.ts"
create_file "$BASE_DIR/config/env.ts" "env.ts"
create_file "$BASE_DIR/config/theme.ts" "theme.ts"
create_file "$BASE_DIR/hooks/useAuth.ts" "useAuth.ts"
create_file "$BASE_DIR/navigation/AppNavigator.tsx" "AppNavigator.tsx"
create_file "$BASE_DIR/navigation/navigationTypes.ts" "navigationTypes.ts"
create_file "$BASE_DIR/screens/Home/HomeScreen.tsx" "HomeScreen.tsx"
create_file "$BASE_DIR/screens/Home/HomeScreen.styles.ts" "HomeScreen.styles.ts"
create_file "$BASE_DIR/screens/Profile/ProfileScreen.tsx" "ProfileScreen.tsx"
create_file "$BASE_DIR/screens/Profile/ProfileScreen.styles.ts" "ProfileScreen.styles.ts"
create_file "$BASE_DIR/store/index.ts" "index_store.ts"
create_file "$BASE_DIR/store/userSlice.ts" "userSlice.ts"
create_file "$BASE_DIR/utils/formatDate.ts" "formatDate.ts"
create_file "$BASE_DIR/types/index.ts" "index_types.ts"
create_file "$BASE_DIR/App.tsx" "App.tsx"
create_file "$BASE_DIR/index.ts" "index_root.ts"

echo "Project src folder with templates created."