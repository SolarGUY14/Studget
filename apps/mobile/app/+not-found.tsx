import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.page}>
      <Stack.Screen options={{ title: 'Page not found' }} />
      <Text accessibilityRole="header" style={styles.title}>
        Page not found
      </Text>
      <Link href="/" style={styles.link}>
        Return to your dashboard
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    backgroundColor: '#f7f8f3',
    padding: 24,
  },
  title: { fontSize: 28, color: '#193b30', fontWeight: '600' },
  link: { color: '#16634d', fontSize: 16, textDecorationLine: 'underline' },
});
