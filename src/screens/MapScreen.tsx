import { StyleSheet, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import type { TabKey } from '../components/BottomTabBar';
import { InteractiveMap } from '../components/InteractiveMap';
import { DEFAULT_LOCATION, colors } from '../theme';

type Props = {
  onNavigate: (tab: TabKey) => void;
};

export function MapScreen({ onNavigate }: Props) {
  return (
    <View style={styles.screen}>
      <AppHeader location={DEFAULT_LOCATION} onPressBell={() => onNavigate('alerts')} />
      <InteractiveMap />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
