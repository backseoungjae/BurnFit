import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '@styles/global';

export default function Library() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Library</Text>
    </View>
  );
}
