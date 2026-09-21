import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LiveBadge } from '../components/LiveBadge';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNow } from '../hooks/useNow';
import { INCIDENTS, type Severity, roadWarnings, severityColor, timeAgo, warningAdvice } from '../map/incidents';
import { colors } from '../theme';

const ACTION_LABEL: Record<Severity, string> = {
  high: 'AVOID',
  medium: 'CAUTION',
  low: 'ADVISORY',
};

export function WarningsScreen({ onBack }: { onBack: () => void }) {
  const now = useNow();
  const warnings = roadWarnings(INCIDENTS);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Warnings and Alerts" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <LiveBadge />
          <Text style={styles.summaryText}>Road warnings based on the incidents currently reported in your area.</Text>
        </View>

        {warnings.length === 0 && <Text style={styles.empty}>No road warnings right now. Drive safely.</Text>}

        {warnings.map((warning) => {
          const color = severityColor(warning.severity);
          return (
            <View key={warning.street} style={styles.card}>
              <View style={[styles.cardHeader, { backgroundColor: color }]}>
                <MaterialCommunityIcons name="road-variant" size={20} color="#FFFFFF" />
                <Text style={styles.street} numberOfLines={1}>
                  {warning.street}
                </Text>
                <View style={styles.actionTag}>
                  <Text style={[styles.actionText, { color }]}>{ACTION_LABEL[warning.severity]}</Text>
                </View>
              </View>

              {warning.incidents.map((incident, index) => (
                <View key={incident.id} style={[styles.item, index > 0 && styles.itemDivider]}>
                  <View style={styles.itemTitleRow}>
                    <Text style={styles.itemTitle}>{incident.type}</Text>
                    <Text style={styles.itemTime}>{timeAgo(incident.reportedAt, now)}</Text>
                  </View>
                  <Text style={styles.itemArea}>{incident.area}</Text>
                  <Text style={styles.itemAdvice}>{warningAdvice(incident)}</Text>
                </View>
              ))}
            </View>
          );
        })}

        <View style={styles.tip}>
          <Ionicons name="speedometer-outline" size={20} color={colors.text} />
          <Text style={styles.tipText}>
            Reduce your speed near incident scenes and follow the directions of emergency crews.
          </Text>
        </View>
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
    gap: 12,
  },
  summary: {
    gap: 8,
    paddingBottom: 2,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  empty: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 14,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  street: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  actionText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemTitle: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
  },
  itemTime: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  itemArea: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  itemAdvice: {
    marginTop: 8,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.text,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#FFF6DB',
  },
  tipText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.text,
  },
});
