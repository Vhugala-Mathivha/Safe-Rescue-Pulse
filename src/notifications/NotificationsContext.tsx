import type { MaterialCommunityIcons } from '@expo/vector-icons';
import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { colors } from '../theme';

export type NotificationCategory = 'report' | 'nearby' | 'road' | 'tip' | 'system';

export type AppNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  receivedAt: Date;
  read: boolean;
};

export const CATEGORY_STYLE: Record<
  NotificationCategory,
  { label: string; color: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  report: { label: 'Your report', color: colors.emergency, icon: 'clipboard-check-outline' },
  nearby: { label: 'Near you', color: colors.watchAndAct, icon: 'map-marker-alert-outline' },
  road: { label: 'Road warning', color: '#C77700', icon: 'road-variant' },
  tip: { label: 'Safety tip', color: '#2E9E4F', icon: 'lightbulb-on-outline' },
  system: { label: 'System', color: '#5B6472', icon: 'cog-outline' },
};

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

/**
 * Every notification the system sends. The "Your report" ones follow the response process from the
 * problem statement: report, verify, prioritise, assign resources, dispatch, coordinate, resolve, analyse.
 * The entries below are sample history; real ones will come from the backend.
 */
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-report-received',
    category: 'report',
    title: 'Emergency report received',
    message: 'Your emergency has been logged. Stay safe and keep your phone with you.',
    receivedAt: minutesAgo(3),
    read: false,
  },
  {
    id: 'n-report-verified',
    category: 'report',
    title: 'Report verified',
    message: 'The control centre has confirmed your incident and its location.',
    receivedAt: minutesAgo(5),
    read: false,
  },
  {
    id: 'n-report-priority',
    category: 'report',
    title: 'Priority assigned',
    message: 'Your incident has been rated High priority and moved to the front of the queue.',
    receivedAt: minutesAgo(6),
    read: false,
  },
  {
    id: 'n-report-assigned',
    category: 'report',
    title: 'Emergency teams assigned',
    message: 'An ambulance and traffic officers have been assigned to your incident.',
    receivedAt: minutesAgo(8),
    read: false,
  },
  {
    id: 'n-report-dispatched',
    category: 'report',
    title: 'Help is on the way',
    message: 'Responders have been dispatched to your location. Estimated arrival: 6 minutes.',
    receivedAt: minutesAgo(9),
    read: false,
  },
  {
    id: 'n-nearby-incident',
    category: 'nearby',
    title: 'Incident near you',
    message: 'Vehicle collision reported on Molotlegi Road, 800 m from your location.',
    receivedAt: minutesAgo(11),
    read: false,
  },
  {
    id: 'n-road-closure',
    category: 'road',
    title: 'Road closure expected',
    message: 'Avoid Sekwati Street near Dr George Mukhari Hospital. Emergency crews are on the scene.',
    receivedAt: minutesAgo(18),
    read: true,
  },
  {
    id: 'n-report-arrived',
    category: 'report',
    title: 'Responders have arrived',
    message: 'Emergency responders have reached the scene. Follow their instructions.',
    receivedAt: minutesAgo(26),
    read: true,
  },
  {
    id: 'n-report-update',
    category: 'report',
    title: 'Incident update',
    message: 'Traffic officers are managing the scene and directing traffic around it.',
    receivedAt: minutesAgo(34),
    read: true,
  },
  {
    id: 'n-road-traffic',
    category: 'road',
    title: 'Heavy traffic ahead',
    message: 'Heavy traffic on the R566 towards Wildebeesthoek. Allow extra travel time.',
    receivedAt: minutesAgo(52),
    read: true,
  },
  {
    id: 'n-report-resolved',
    category: 'report',
    title: 'Incident resolved',
    message: 'Your incident has been marked as resolved. Thank you for reporting it.',
    receivedAt: minutesAgo(95),
    read: true,
  },
  {
    id: 'n-road-reopened',
    category: 'road',
    title: 'Road reopened',
    message: 'Molotlegi Road is open again. Expect some delays while traffic clears.',
    receivedAt: minutesAgo(130),
    read: true,
  },
  {
    id: 'n-report-feedback',
    category: 'report',
    title: 'How did we do?',
    message: 'Tell us how the response went so we can improve emergency services in your area.',
    receivedAt: minutesAgo(180),
    read: true,
  },
  {
    id: 'n-tip-speed',
    category: 'tip',
    title: 'Drive safely',
    message: 'Reduce your speed near incident scenes and give emergency vehicles room to pass.',
    receivedAt: minutesAgo(300),
    read: true,
  },
  {
    id: 'n-system-location',
    category: 'system',
    title: 'Turn on location',
    message: 'Allow location access so responders can find you faster when you log an emergency.',
    receivedAt: minutesAgo(1440),
    read: true,
  },
];

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markRead = useCallback((id: string) => {
    setNotifications((list) => list.map((n) => (n.id === id && !n.read ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((list) => list.map((n) => (n.read ? n : { ...n, read: true })));
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      markRead,
      markAllRead,
    }),
    [notifications, markRead, markAllRead],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return ctx;
}
