#!/bin/bash

# Usage: ./tree.sh /path/to/folder
# Optionally edit the IGNORE_DIRS variable to add directory names to ignore

TARGET_DIR="$1"
IGNORE_DIRS=("node_modules" ".git" "vendor" ".expo" "scripts")  # Add directories you want to ignore here

if [[ -z "$TARGET_DIR" ]]; then
  echo "Usage: $0 /path/to/target-folder"
  exit 1
fi

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Error: '$TARGET_DIR' is not a directory."
  exit 1
fi

# Check if a directory name is in IGNORE_DIRS
should_ignore() {
  local dir_name="$1"
  for ignore in "${IGNORE_DIRS[@]}"; do
    if [[ "$dir_name" == "$ignore" ]]; then
      return 0  # true, should ignore
    fi
  done
  return 1  # false, should NOT ignore
}

print_tree() {
  local dir="$1"
  local prefix="$2"

  # List all entries (files and dirs) sorted
  local entries=()
  while IFS= read -r -d $'\0' entry; do
    entries+=("$entry")
  done < <(find "$dir" -maxdepth 1 -mindepth 1 -print0 | sort -z)

  # Filter out ignored directories for counting & processing
  local filtered=()
  for entry in "${entries[@]}"; do
    base_entry="$(basename "$entry")"
    if [[ -d "$entry" ]]; then
      if should_ignore "$base_entry"; then
        continue
      fi
    fi
    filtered+=("$entry")
  done

  local count=${#filtered[@]}
  local i=0

  for entry in "${filtered[@]}"; do
    i=$((i + 1))
    local base_entry="$(basename "$entry")"

    if [[ -d "$entry" ]]; then
      # Folder
      if [[ $i -eq $count ]]; then
        echo "${prefix}└── $base_entry/"
        print_tree "$entry" "${prefix}    "
      else
        echo "${prefix}├── $base_entry/"
        print_tree "$entry" "${prefix}│   "
      fi
    else
      # File
      if [[ $i -eq $count ]]; then
        echo "${prefix}└── $base_entry"
      else
        echo "${prefix}├── $base_entry"
      fi
    fi
  done
}

echo "$TARGET_DIR"
print_tree "$TARGET_DIR" ""
