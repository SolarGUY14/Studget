import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getHealth } from '../api/client';

type Connection = 'loading' | 'healthy' | 'error';

const cards = [
  ['Available money', 'Your cash balances will appear here.'],
  ['Spending this month', 'See where your money goes over time.'],
  ['Savings goals', 'Track progress toward what matters to you.'],
] as const;

export default function DashboardScreen() {
  const [connection, setConnection] = useState<Connection>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getHealth().then(
      () => {
        if (active) setConnection('healthy');
      },
      () => {
        if (active) setConnection('error');
      },
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>
            studget<Text style={styles.dot}>.</Text>
          </Text>
          <Text style={styles.badge}>EARLY PREVIEW</Text>
        </View>
        <Text style={styles.eyebrow}>YOUR MONEY, IN PERSPECTIVE</Text>
        <Text accessibilityRole="header" style={styles.title}>
          A little clarity.{'\n'}More room to live.
        </Text>
        <Text style={styles.subtitle}>
          Your finances, spending habits, and goals — together in one place.
        </Text>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Safe to spend</Text>
          <Text style={styles.amount}>—</Text>
          <Text style={styles.heroText}>
            A clearer answer to “Can I afford this?”
          </Text>
          <Text style={styles.heroNote}>
            Available once accounts, obligations, and budgets are set up.
          </Text>
        </View>

        <View style={styles.cards}>
          {cards.map(([title, description]) => (
            <View key={title} style={styles.card}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.placeholder}>—</Text>
              <Text style={styles.body}>{description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Your spending story
          </Text>
          <Text style={styles.body}>
            No transactions yet. Trends and personalized insights will appear
            here as your financial history becomes available.
          </Text>
        </View>

        <View style={styles.connection}>
          <View style={styles.connectionText} accessibilityLiveRegion="polite">
            <Text style={styles.cardTitle}>Service connection</Text>
            <Text style={styles.body}>
              {connection === 'loading'
                ? 'Checking connection…'
                : connection === 'healthy'
                  ? 'Connected to Studget'
                  : 'Unable to connect. Check that the API is running and reachable.'}
            </Text>
          </View>
          {connection === 'loading' ? (
            <ActivityIndicator
              accessibilityLabel="Checking service connection"
              color="#16634d"
            />
          ) : (
            <Pressable
              accessibilityRole="button"
              style={styles.button}
              onPress={() => {
                setConnection('loading');
                setAttempt((value) => value + 1);
              }}
            >
              <Text style={styles.buttonText}>
                {connection === 'error' ? 'Retry connection' : 'Check again'}
              </Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.footer}>
          Foundation preview · No accounts connected. Financial features are
          coming in later milestones.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f8f3' },
  page: {
    padding: 24,
    paddingBottom: 48,
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: '#193b30',
    letterSpacing: -1,
  },
  dot: { color: '#57946c' },
  badge: {
    fontSize: 10,
    letterSpacing: 1,
    color: '#466154',
    backgroundColor: '#e8eedf',
    padding: 10,
    borderRadius: 20,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#496a58',
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#193b30',
    letterSpacing: -1,
    lineHeight: 46,
  },
  subtitle: { fontSize: 16, color: '#58675e', lineHeight: 25, maxWidth: 580 },
  hero: { backgroundColor: '#193b30', borderRadius: 24, padding: 28, gap: 12 },
  heroLabel: { fontSize: 16, color: '#e1eddd' },
  amount: { color: '#e6f3bd', fontSize: 56, fontWeight: '600' },
  heroText: { color: '#ffffff', fontSize: 20, fontWeight: '600' },
  heroNote: { color: '#c5d4ca', fontSize: 14, lineHeight: 22 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: {
    flexGrow: 1,
    flexBasis: 240,
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e7dd',
  },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#203f32' },
  placeholder: { fontSize: 32, color: '#6c7d71' },
  body: { fontSize: 14, lineHeight: 22, color: '#58675e' },
  panel: {
    padding: 24,
    borderWidth: 1,
    borderColor: '#dce3d5',
    borderRadius: 18,
    gap: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#203f32' },
  connection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  connectionText: { flexGrow: 1, flexBasis: 230, gap: 4 },
  button: {
    backgroundColor: '#e3ebdb',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: { color: '#193b30', fontWeight: '600' },
  footer: { fontSize: 12, lineHeight: 20, color: '#667367' },
});
