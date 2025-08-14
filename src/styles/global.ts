import { StyleSheet } from 'react-native';

export const colors = {
  text: '#000',
  bg: '#fff',
};

export const globalStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: colors.text, fontSize: 24, fontWeight: '700' },
});
