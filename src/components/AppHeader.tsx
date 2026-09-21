import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { useNotifications } from '../notifications/NotificationsContext';
import { APP_NAME, colors } from '../theme';
import { CountBadge } from './CountBadge';

type Props = {
  location: string;
  onPressBell?: () => void;
  onPressLocation?: () => void;
};

export function AppHeader({ location, onPressBell, onPressLocation }: Props) {
  const { t } = useLanguage();
  const { unreadCount } = useNotifications();

  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <View style={styles.brand}>
          <Image source={require('../../assets/logo.jpg')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title} numberOfLines={1}>
            {APP_NAME}
          </Text>
        </View>
        <Pressable onPress={onPressBell} hitSlop={10} accessibilityLabel="Notifications" style={styles.bell}>
          <Ionicons name="notifications" size={24} color={colors.emergency} />
          <CountBadge count={unreadCount} style={styles.bellBadge} />
        </Pressable>
      </View>

      <Pressable style={styles.locationRow} onPress={onPressLocation} accessibilityLabel="Change location">
        <Ionicons name="location-sharp" size={15} color={colors.text} />
        <Text style={styles.locationLabel}>{t('header.currentLocation')}</Text>
        <View style={styles.spacer} />
        <Text style={styles.locationValue}>{location}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.text} style={styles.chevron} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  logo: {
    width: 34,
    height: 34,
    marginRight: 8,
  },
  title: {
    fontFamily: 'Trebuchet MS',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: colors.text,
    flexShrink: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  locationLabel: {
    marginLeft: 4,
    fontSize: 11,
    color: colors.textMuted,
  },
  bell: { paddingRight: 6 },
  bellBadge: { top: -7, right: -4 },
  spacer: { flex: 1 },
  locationValue: {
    fontSize: 11,
    color: colors.text,
  },
  chevron: { marginLeft: 4 },
});
