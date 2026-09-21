import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SuccessBadge } from '../components/SuccessBadge';
import { colors } from '../theme';

const OTHER_TYPE = 'Other';
const EMERGENCY_TYPES: string[] = [
  'Vehicle Collision',
  'Vehicle and Pedestrian Collision',
  'Hit-and-Run',
  OTHER_TYPE,
];
const DESCRIPTION_MAX = 200;

type Props = {
  onCancel: () => void;
  /** Called when the user dismisses the "successfully logged" pop up. */
  onDone: () => void;
};

const CIRCLE_SIZE = 240;

const formatDate = (d: Date) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const formatTime = (d: Date) => d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

export function LogEmergencyScreen({ onCancel, onDone }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loggedAt, setLoggedAt] = useState<Date | null>(null);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const blink = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] });
  const haloScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] });
  const haloOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] });

  return (
    <View style={styles.screen}>
      <Pressable style={styles.cancel} onPress={onCancel} hitSlop={10} accessibilityRole="button">
        <Ionicons name="chevron-back" size={22} color={colors.text} />
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.typeSection}>
        <Text style={styles.typeLabel}>Incident Type</Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setTypeOpen((open) => !open)}
          accessibilityRole="button"
          accessibilityLabel="Incident Type"
          accessibilityState={{ expanded: typeOpen }}
        >
          <Text style={[styles.dropdownText, !selectedType && styles.placeholder]}>
            {selectedType ?? 'Select incident type'}
          </Text>
          <Ionicons name={typeOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.text} />
        </Pressable>

        {typeOpen && (
          <View style={styles.options}>
            {EMERGENCY_TYPES.length === 0 ? (
              <Text style={styles.emptyText}>No incident types added yet</Text>
            ) : (
              EMERGENCY_TYPES.map((type) => (
                <Pressable
                  key={type}
                  style={styles.option}
                  accessibilityRole="button"
                  onPress={() => {
                    setSelectedType(type);
                    if (type !== OTHER_TYPE) setDescription('');
                    setTypeOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{type}</Text>
                </Pressable>
              ))
            )}
          </View>
        )}

        {selectedType === OTHER_TYPE && (
          <View style={styles.descriptionBlock}>
            <Text style={styles.typeLabel}>Short description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Briefly describe the incident"
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={DESCRIPTION_MAX}
              textAlignVertical="top"
              accessibilityLabel="Short description of the incident"
            />
            <Text style={styles.counter}>
              {description.length}/{DESCRIPTION_MAX}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.center}>
        <View style={styles.circleWrapper}>
          <Animated.View style={[styles.halo, { opacity: haloOpacity, transform: [{ scale: haloScale }] }]} />
          <Animated.View style={{ opacity: blink }}>
            <Pressable
              onPress={() => setLoggedAt(new Date())}
              accessibilityRole="button"
              accessibilityLabel="Confirm log"
              style={({ pressed }) => [styles.circle, pressed && styles.circlePressed]}
            >
              <Text style={styles.circleText}>CONFIRM LOG</Text>
            </Pressable>
          </Animated.View>
        </View>
        <Text style={styles.hint}>Tap the circle to confirm the emergency</Text>
      </View>
      </ScrollView>

      <Modal visible={loggedAt !== null} transparent animationType="fade" onRequestClose={onDone}>
        <View style={styles.backdrop}>
          <View style={styles.popup} accessibilityViewIsModal>
            <SuccessBadge />
            <Text style={styles.popupTitle}>Emergency successfully logged</Text>
            <Text style={styles.popupMessage}>Your report has been recorded.</Text>

            <View style={styles.summary}>
              <SummaryRow label="Incident type" value={selectedType ?? 'Not specified'} />
              <SummaryRow
                label="Logged at"
                value={loggedAt ? `${formatDate(loggedAt)}, ${formatTime(loggedAt)}` : ''}
              />
            </View>

            <Pressable
              style={({ pressed }) => [styles.popupButton, pressed && styles.popupButtonPressed]}
              onPress={onDone}
              accessibilityRole="button"
            >
              <Text style={styles.popupButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  cancel: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  cancelText: {
    fontSize: 15,
    color: colors.text,
  },
  // Scrolls on small screens; the list and description sit in the layout, so they push the circle down.
  content: {
    flexGrow: 1,
  },
  typeSection: {
    paddingHorizontal: 16,
  },
  descriptionBlock: {
    marginTop: 14,
  },
  descriptionInput: {
    minHeight: 84,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#FFFFFF',
  },
  counter: {
    alignSelf: 'flex-end',
    marginTop: 4,
    fontSize: 11,
    color: colors.textMuted,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 14,
    color: colors.text,
  },
  placeholder: {
    color: colors.textMuted,
  },
  options: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  emptyText: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 13,
    color: colors.textMuted,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
    paddingBottom: 60,
  },
  circleWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.emergency,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.emergency,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.emergency,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  circlePressed: { opacity: 0.85 },
  circleText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  hint: {
    marginTop: 48,
    fontSize: 13,
    color: colors.textMuted,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  popup: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: 30,
    paddingBottom: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  popupTitle: {
    marginTop: 18,
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  popupMessage: {
    marginTop: 6,
    fontSize: 13.5,
    color: colors.textMuted,
    textAlign: 'center',
  },
  summary: {
    alignSelf: 'stretch',
    marginTop: 20,
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F6F7F9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    gap: 16,
  },
  summaryLabel: {
    fontSize: 12.5,
    color: colors.textMuted,
  },
  summaryValue: {
    flexShrink: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
  },
  popupButton: {
    marginTop: 22,
    alignSelf: 'stretch',
    backgroundColor: colors.emergency,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  popupButtonPressed: { opacity: 0.85 },
  popupButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
