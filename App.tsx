import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar, type TabKey } from './src/components/BottomTabBar';
import { ActiveIncidentsScreen } from './src/screens/ActiveIncidentsScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LogEmergencyScreen } from './src/screens/LogEmergencyScreen';
import { MapScreen } from './src/screens/MapScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import { WarningsScreen } from './src/screens/WarningsScreen';
import { colors } from './src/theme';

const TAB_TITLES: Record<Exclude<TabKey, 'home' | 'map'>, string> = {
  alerts: 'Alerts',
  call: 'Call',
  more: 'More',
};

/** Full-screen pages opened from the home cards; they hide the bottom tab bar. */
type Overlay = 'logEmergency' | 'activeIncidents' | 'warnings';

export default function App() {
  const [tab, setTab] = useState<TabKey>('home');
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const closeOverlay = () => setOverlay(null);

  // Android hardware back button closes the open page instead of leaving the app.
  useEffect(() => {
    if (!overlay) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setOverlay(null);
      return true;
    });
    return () => subscription.remove();
  }, [overlay]);

  return (
    <SafeAreaProvider>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.app} edges={['top']}>
          <StatusBar style="dark" />
          {overlay === 'logEmergency' && <LogEmergencyScreen onCancel={closeOverlay} onDone={closeOverlay} />}
          {overlay === 'activeIncidents' && <ActiveIncidentsScreen onBack={closeOverlay} />}
          {overlay === 'warnings' && <WarningsScreen onBack={closeOverlay} />}
          {overlay === null && (
            <>
              <View style={styles.body}>
                {tab === 'home' && (
                  <HomeScreen
                    onNavigate={setTab}
                    onLogEmergency={() => setOverlay('logEmergency')}
                    onOpenIncidents={() => setOverlay('activeIncidents')}
                    onOpenWarnings={() => setOverlay('warnings')}
                  />
                )}
                {tab === 'map' && <MapScreen onNavigate={setTab} />}
                {tab !== 'home' && tab !== 'map' && <PlaceholderScreen title={TAB_TITLES[tab]} />}
              </View>
              <BottomTabBar active={tab} onChange={setTab} />
            </>
          )}
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
