#!/bin/bash

set -e

BASE_DIR="./src/components/global"

# List of global components to create
components=(
  Button
  TextInput
  Typography
  Icon
  Card
  Modal
  Loader
  Divider
  Avatar
  Snackbar
  Switch
  Checkbox
  RadioButton
)

echo "Creating global components folder structure under $BASE_DIR..."

for comp in "${components[@]}"; do
  # Convert component name to lowercase for folder name
  folder="$BASE_DIR/$(echo "$comp" | tr '[:upper:]' '[:lower:]')"
  file="$folder/$comp.tsx"

  echo "Creating folder: $folder"
  mkdir -p "$folder"

  if [[ ! -f "$file" ]]; then
    echo "Creating file: $file"
    cat > "$file" << EOF
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const $comp = () => {
  return (
    <View style={styles.container}>
      <Text>$comp component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default $comp;
EOF
  fi
done

echo "Global components folder structure creation completed!"
