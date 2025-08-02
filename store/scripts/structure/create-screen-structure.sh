#!/bin/bash

set -e

BASE_DIR="./src/screens"

declare -A screens

# Define feature folders and screen files
screens=(
  ["onboarding"]="SplashScreen.tsx IntroSlidesScreen.tsx LoginScreen.tsx RegisterScreen.tsx ForgotPasswordScreen.tsx SocialLoginScreen.tsx"
  ["home"]="HomeScreen.tsx SearchResultScreen.tsx BusDetailScreen.tsx"
  ["booking"]="PassengerInfoScreen.tsx SelectPickupDropoffScreen.tsx ReviewBookingScreen.tsx PaymentMethodScreen.tsx BookingConfirmationScreen.tsx"
  ["orders"]="MyTicketsScreen.tsx TicketDetailScreen.tsx"
  ["map"]="StationMapScreen.tsx LocationPickerScreen.tsx LiveTrackingScreen.tsx"
  ["profile"]="MyAccountScreen.tsx PreferencesScreen.tsx SavedCardsScreen.tsx SettingsScreen.tsx"
  ["support"]="FAQScreen.tsx LiveChatScreen.tsx RateReviewScreen.tsx NotificationsScreen.tsx TermsConditionsScreen.tsx"
)

echo "Creating screens folder structure under $BASE_DIR..."

for feature in "${!screens[@]}"; do
  folder="$BASE_DIR/$feature"
  echo "Creating folder: $folder"
  mkdir -p "$folder"

  # Create screen files
  for screen in ${screens[$feature]}; do
    filepath="$folder/$screen"
    if [[ ! -f "$filepath" ]]; then
      echo "Creating file: $filepath"
      cat > "$filepath" << EOF
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ${screen%.tsx} = () => {
  return (
    <View style={styles.container}>
      <Text>${screen%.tsx}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ${screen%.tsx};
EOF
    fi
  done

  # Create or update index.ts to export all screens
  index_file="$folder/index.ts"
  echo "Creating index file: $index_file"
  echo "// Auto-generated index file for $feature screens" > "$index_file"
  for screen in ${screens[$feature]}; do
    screen_name="${screen%.tsx}"
    echo "export { default as $screen_name } from './$screen_name';" >> "$index_file"
  done
done

echo "Screens folder structure creation completed!"
