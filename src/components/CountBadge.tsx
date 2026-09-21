import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

/** Red unread-count bubble. Renders nothing at 0. Position it over an icon with the `style` prop. */
export function CountBadge({ count, style }: { count: number; style?: object }) {
  if (count <= 0) return null;
  const label = count > 99 ? '99+' : String(count);

  return (
    <View style={[styles.badge, style]} accessibilityLabel={`${count} unread`}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.emergency,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 12,
  },
});
