import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LiveBadge } from '../components/LiveBadge';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNow } from '../hooks/useNow';
import {
  INCIDENTS,
  distanceAway,
  incidentIcon,
  severityColor,
  severityLabel,
  sortIncidents,
  timeAgo,
} from '../map/incidents';
import { DEFAULT_LOCATION, colors } from '../theme';

export function ActiveIncidentsScreen({ onBack }: { onBack: () => void }) {
  const now = useNow();
  const incidents = sortIncidents(INCIDENTS);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Active Incidents" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <LiveBadge />
          <Text style={styles.summaryText}>
            {incidents.length} {incidents.length === 1 ? 'incident' : 'incidents'} reported near {DEFAULT_LOCATION}
          </Text>
        </View>

        {incidents.length === 0 && <Text style={styles.empty}>No active incidents in your area right now.</Text>}

        {incidents.map((incident) => {
          const color = severityColor(incident.severity);
          return (
            <View key={incident.id} style={[styles.card, { borderLeftColor: color }]}>
              <View style={[styles.iconCircle, { backgroundColor: color }]}>
                <MaterialCommunityIcons name={incidentIcon(incident)} size={22} color="#FFFFFF" />
              </View>

              <View style={styles.body}>
                <View style={styles.titleRow}>
                  <Text style={styles.type}>{incident.type}</Text>
                  <Text style={styles.time}>{timeAgo(incident.reportedAt, now)}</Text>
                </View>

                <View style={styles.locationRow}>
                  <Ionicons name="location-sharp" size={14} color={color} />
                  <Text style={styles.street}>{incident.street}</Text>
                </View>
                <Text style={styles.area}>
                  {incident.area} · {distanceAway(incident)}
                </Text>

                <Text style={styles.description}>{incident.description}</Text>

                <View style={[styles.severityTag, { backgroundColor: color }]}>
                  <Text style={styles.severityText}>{severityLabel(incident.severity)} priority</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },
  content: {
    padding: 14,
    gap: 10,
  },
  summary: {
    gap: 8,
    paddingBottom: 4,
  },
  summaryText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  empty: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 14,
    color: colors.textMuted,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  type: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  time: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 6,
  },
  street: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  area: {
    marginTop: 2,
    marginLeft: 17,
    fontSize: 12,
    color: colors.textMuted,
  },
  description: {
    marginTop: 8,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.text,
  },
  severityTag: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
