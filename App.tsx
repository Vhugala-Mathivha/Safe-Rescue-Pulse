import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar, type TabKey } from './src/components/BottomTabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import { colors } from './src/theme';

const TAB_TITLES: Record<Exclude<TabKey, 'home'>, string> = {
  map: 'Map',
  alerts: 'Alerts',
  info: 'Info',
  more: 'More',
};

export default function App() {
  const [tab, setTab] = useState<TabKey>('home');

  return (
    <SafeAreaProvider>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.app} edges={['top']}>
          <StatusBar style="dark" />
          <View style={styles.body}>
            {tab === 'home' ? <HomeScreen onNavigate={setTab} /> : <PlaceholderScreen title={TAB_TITLES[tab]} />}
          </View>
          <BottomTabBar active={tab} onChange={setTab} />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#DADADA' : colors.background,
    alignItems: 'center',
  },
  app: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.background,
  },
  body: { flex: 1 },
});
