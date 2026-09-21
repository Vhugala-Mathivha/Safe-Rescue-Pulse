import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

export type TabKey = 'home' | 'map' | 'alerts' | 'info' | 'more';

type TabDef = {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: TabDef[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { key: 'map', label: 'Map', icon: 'map-outline', iconActive: 'map' },
  { key: 'alerts', label: 'Alerts', icon: 'notifications-outline', iconActive: 'notifications' },
  { key: 'info', label: 'Info', icon: 'information-circle-outline', iconActive: 'information-circle' },
  { key: 'more', label: 'More', icon: 'ellipsis-horizontal', iconActive: 'ellipsis-horizontal' },
];

type Props = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
};

export function BottomTabBar({ active, onChange }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const color = isActive ? colors.tabActive : colors.tabInactive;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons name={isActive ? tab.iconActive : tab.icon} size={22} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  label: {
    fontSize: 10,
  },
});
