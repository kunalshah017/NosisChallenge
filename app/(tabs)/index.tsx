import * as React from 'react';
import { View, Text } from 'react-native';

export default function Screen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-primary text-lg">
        Welcome to the Home Screen!
      </Text>
    </View>
  );
}