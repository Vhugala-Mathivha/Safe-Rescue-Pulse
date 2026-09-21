import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { SuccessBadge } from './SuccessBadge';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  buttonLabel: string;
  onDone: () => void;
};

/** Centred confirmation card with the green tick badge, matching the "Emergency successfully logged" pop up. */
export function SuccessDialog({ visible, title, message, buttonLabel, onDone }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDone}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityViewIsModal>
          <SuccessBadge />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={onDone}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
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
  title: {
    marginTop: 18,
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    marginTop: 6,
    fontSize: 13.5,
    color: colors.textMuted,
    textAlign: 'center',
  },
  button: {
    marginTop: 22,
    alignSelf: 'stretch',
    backgroundColor: colors.emergency,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
