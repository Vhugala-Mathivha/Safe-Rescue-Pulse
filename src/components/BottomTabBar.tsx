import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';
import { useNotifications } from '../notifications/NotificationsContext';
import { colors } from '../theme';
import { CountBadge } from './CountBadge';

export type TabKey = 'home' | 'map' | 'call' | 'alerts' | 'more';

type TabDef = {
  key: TabKey;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  /** Highlighted centre button: bigger icon inside a red circle. */
  featured?: boolean;
};

const TABS: TabDef[] = [
  { key: 'home', icon: 'home-outline', iconActive: 'home' },
  { key: 'map', icon: 'map-outline', iconActive: 'map' },
  { key: 'call', icon: 'call', iconActive: 'call', featured: true },
  { key: 'alerts', icon: 'notifications-outline', iconActive: 'notifications' },
  { key: 'more', icon: 'ellipsis-horizontal', iconActive: 'ellipsis-horizontal' },
];

type Props = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
};

export function BottomTabBar({ active, onChange }: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { unreadCount } = useNotifications();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const color = isActive ? colors.tabActive : colors.tabInactive;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, tab.featured && styles.featuredTab]}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            {tab.featured ? (
              <View style={styles.featuredCircle}>
                <Ionicons name={tab.icon} size={28} color="#FFFFFF" />
              </View>
            ) : (
              <View>
                <Ionicons name={isActive ? tab.iconActive : tab.icon} size={22} color={color} />
                {tab.key === 'alerts' && <CountBadge count={unreadCount} style={styles.tabBadge} />}
              </View>
            )}
            <Text style={[styles.label, { color }]}>{t(`tab.${tab.key}`)}</Text>
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
  // Lifted so the circle rises above the bar; moving the tab itself keeps the circle inside its touch area.
  featuredTab: {
    marginTop: -16,
  },
  label: {
    fontSize: 10,
  },
  tabBadge: { top: -6, right: -10 },
  featuredCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.emergency,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
    shadowColor: colors.emergency,
    shadowOpacity: 0.45,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});
