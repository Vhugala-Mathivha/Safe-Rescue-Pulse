import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import type { TabKey } from '../components/BottomTabBar';
import { useNow } from '../hooks/useNow';
import { useLanguage } from '../i18n/LanguageContext';
import { timeAgo } from '../map/incidents';
import { CATEGORY_STYLE, useNotifications } from '../notifications/NotificationsContext';
import { DEFAULT_LOCATION, colors } from '../theme';

export function AlertsScreen({ onNavigate }: { onNavigate: (tab: TabKey) => void }) {
  const { t } = useLanguage();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const now = useNow();

  return (
    <View style={styles.screen}>
      <AppHeader location={DEFAULT_LOCATION} onPressBell={() => onNavigate('alerts')} />

      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>{t('alerts.title')}</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0 ? t('alerts.unread', { n: unreadCount }) : t('alerts.allRead')}
          </Text>
        </View>
        <Pressable
          onPress={markAllRead}
          disabled={unreadCount === 0}
          hitSlop={8}
          accessibilityRole="button"
          style={unreadCount === 0 && styles.disabled}
        >
          <Text style={styles.markAll}>{t('alerts.markAllRead')}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {notifications.map((n) => {
          const category = CATEGORY_STYLE[n.category];
          return (
            <Pressable
              key={n.id}
              onPress={() => markRead(n.id)}
              accessibilityRole="button"
              accessibilityLabel={`${n.read ? '' : 'Unread. '}${n.title}. ${n.message}`}
              style={({ pressed }) => [styles.item, !n.read && styles.itemUnread, pressed && styles.itemPressed]}
            >
              <View style={[styles.iconCircle, { backgroundColor: category.color }]}>
                <MaterialCommunityIcons name={category.icon} size={20} color="#FFFFFF" />
              </View>

              <View style={styles.body}>
                <View style={styles.metaRow}>
                  <Text style={[styles.category, { color: category.color }]}>{category.label.toUpperCase()}</Text>
                  <Text style={styles.time}>{timeAgo(n.receivedAt, now)}</Text>
                </View>
                <Text style={[styles.itemTitle, !n.read && styles.itemTitleUnread]}>{n.title}</Text>
                <Text style={styles.message}>{n.message}</Text>
              </View>

              <View style={styles.dotSlot}>{!n.read && <View style={styles.dot} />}</View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  markAll: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.link,
  },
  disabled: { opacity: 0.4 },
  list: {
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  itemUnread: {
    backgroundColor: '#FFF4F4',
  },
  itemPressed: { opacity: 0.7 },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 11,
    color: colors.textMuted,
  },
  itemTitle: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  itemTitleUnread: {
    fontWeight: '800',
  },
  message: {
    marginTop: 3,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#444444',
  },
  dotSlot: {
    width: 10,
    paddingTop: 4,
    alignItems: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.emergency,
  },
});
