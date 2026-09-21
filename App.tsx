import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar, type TabKey } from './src/components/BottomTabBar';
import { LanguageProvider, useLanguage } from './src/i18n/LanguageContext';
import { NotificationsProvider } from './src/notifications/NotificationsContext';
import { ActiveIncidentsScreen } from './src/screens/ActiveIncidentsScreen';
import { AlertsScreen } from './src/screens/AlertsScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LogEmergencyScreen } from './src/screens/LogEmergencyScreen';
import { MapScreen } from './src/screens/MapScreen';
import { MoreScreen } from './src/screens/MoreScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import { WarningsScreen } from './src/screens/WarningsScreen';
import { colors } from './src/theme';

/** Full-screen pages opened from the home cards; they hide the bottom tab bar. */
type Overlay = 'logEmergency' | 'activeIncidents' | 'warnings';

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NotificationsProvider>
          <AppShell />
        </NotificationsProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const { t } = useLanguage();
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
    <>
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
                {tab === 'alerts' && <AlertsScreen onNavigate={setTab} />}
                {tab === 'more' && <MoreScreen onNavigate={setTab} />}
                {tab === 'call' && <PlaceholderScreen title={t('tab.call')} />}
              </View>
              <BottomTabBar active={tab} onChange={setTab} />
            </>
          )}
        </SafeAreaView>
      </View>
    </>
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
