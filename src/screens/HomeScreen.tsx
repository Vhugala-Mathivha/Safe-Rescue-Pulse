import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AlertLevelCard } from '../components/AlertLevelCard';
import { AppHeader } from '../components/AppHeader';
import type { TabKey } from '../components/BottomTabBar';
import { IncidentsMapPreview } from '../components/IncidentsMapPreview';
import { DEFAULT_LOCATION, colors } from '../theme';

type Props = {
  onNavigate: (tab: TabKey) => void;
  onLogEmergency: () => void;
  onOpenIncidents: () => void;
  onOpenWarnings: () => void;
};

export function HomeScreen({ onNavigate, onLogEmergency, onOpenIncidents, onOpenWarnings }: Props) {
  return (
    <View style={styles.screen}>
      <AppHeader location={DEFAULT_LOCATION} onPressBell={() => onNavigate('alerts')} />

      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <View style={styles.cards}>
          <AlertLevelCard
            title="Log Emergency"
            description="Report a fire, accident or medical emergency and get help on the way."
            color={colors.emergency}
            onPress={onLogEmergency}
          />
          <AlertLevelCard
            title="Active Incidents"
            description="View active reported incidents that are in your area."
            color={colors.watchAndAct}
            onPress={onOpenIncidents}
          />
          <AlertLevelCard
            title="Warnings and Alerts"
            description="Avoid accident-hit roads and heavy traffic, and stay off speeding."
            color={colors.advice}
            onPress={onOpenWarnings}
          />
        </View>

        <View style={styles.incidentsHeader}>
          <Text style={styles.incidentsTitle}>INCIDENTS NEAR ME</Text>
          <Pressable onPress={() => onNavigate('map')} hitSlop={8}>
            <Text style={styles.viewMap}>VIEW MAP {'>'}</Text>
          </Pressable>
        </View>

        <IncidentsMapPreview />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
  },
  cards: {
    paddingHorizontal: 14,
    paddingTop: 14,
    gap: 10,
  },
  incidentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  incidentsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.2,
  },
  viewMap: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.link,
  },
});
