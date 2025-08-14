import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '@styles/global';

export default function Calendar() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Calendar</Text>
    </View>
  );
}
