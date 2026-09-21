import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AlertLevelCard } from '../components/AlertLevelCard';
import { AppHeader } from '../components/AppHeader';
import type { TabKey } from '../components/BottomTabBar';
import { IncidentsMapPreview } from '../components/IncidentsMapPreview';
import { useLanguage } from '../i18n/LanguageContext';
import { DEFAULT_LOCATION, colors } from '../theme';

type Props = {
  onNavigate: (tab: TabKey) => void;
  onLogEmergency: () => void;
  onOpenIncidents: () => void;
  onOpenWarnings: () => void;
};

export function HomeScreen({ onNavigate, onLogEmergency, onOpenIncidents, onOpenWarnings }: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.screen}>
      <AppHeader location={DEFAULT_LOCATION} onPressBell={() => onNavigate('alerts')} />

      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <View style={styles.cards}>
          <AlertLevelCard
            title={t('home.log.title')}
            description={t('home.log.desc')}
            color={colors.emergency}
            onPress={onLogEmergency}
          />
          <AlertLevelCard
            title={t('home.active.title')}
            description={t('home.active.desc')}
            color={colors.watchAndAct}
            onPress={onOpenIncidents}
          />
          <AlertLevelCard
            title={t('home.warnings.title')}
            description={t('home.warnings.desc')}
            color={colors.advice}
            onPress={onOpenWarnings}
          />
        </View>

        <View style={styles.incidentsHeader}>
          <Text style={styles.incidentsTitle}>{t('home.incidentsNearMe').toUpperCase()}</Text>
          <Pressable onPress={() => onNavigate('map')} hitSlop={8}>
            <Text style={styles.viewMap}>{t('home.viewMap').toUpperCase()} {'>'}</Text>
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
