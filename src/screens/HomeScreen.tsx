import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AlertLevelCard } from '../components/AlertLevelCard';
import { AppHeader } from '../components/AppHeader';
import type { TabKey } from '../components/BottomTabBar';
import { IncidentsMapPreview } from '../components/IncidentsMapPreview';
import { DEFAULT_LOCATION, colors } from '../theme';

type Props = {
  onNavigate: (tab: TabKey) => void;
};

export function HomeScreen({ onNavigate }: Props) {
  return (
    <View style={styles.screen}>
      <AppHeader location={DEFAULT_LOCATION} onPressBell={() => onNavigate('alerts')} />

      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <View style={styles.cards}>
          <AlertLevelCard
            title="Emergency Warning"
            description="You are in danger and need to act immediately."
            color={colors.emergency}
            onPress={() => onNavigate('alerts')}
          />
          <AlertLevelCard
            title="Watch and Act"
            description="There is a heightened level of threat."
            color={colors.watchAndAct}
            onPress={() => onNavigate('alerts')}
          />
          <AlertLevelCard
            title="Advice"
            description="There is no immediate threat."
            color={colors.advice}
            onPress={() => onNavigate('alerts')}
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
