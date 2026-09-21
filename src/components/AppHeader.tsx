import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { APP_NAME, colors } from '../theme';

type Props = {
  location: string;
  onPressBell?: () => void;
  onPressLocation?: () => void;
};

export function AppHeader({ location, onPressBell, onPressLocation }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={1}>
          {APP_NAME}
        </Text>
        <Pressable onPress={onPressBell} hitSlop={10} accessibilityLabel="Notifications">
          <Ionicons name="notifications" size={22} color={colors.emergency} />
        </Pressable>
      </View>

      <Pressable style={styles.locationRow} onPress={onPressLocation} accessibilityLabel="Change location">
        <Ionicons name="location-sharp" size={15} color={colors.text} />
        <Text style={styles.locationLabel}>Current Location</Text>
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
  title: {
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
  spacer: { flex: 1 },
  locationValue: {
    fontSize: 11,
    color: colors.text,
  },
  chevron: { marginLeft: 4 },
});
