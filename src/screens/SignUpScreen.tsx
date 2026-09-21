import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { validateIdNumber } from '../auth/idNumber';
import { useRegistration } from '../auth/RegistrationContext';
import { validateMobile, validateName } from '../auth/validators';
import { SuccessDialog } from '../components/SuccessDialog';
import { useLanguage } from '../i18n/LanguageContext';
import { APP_NAME, colors } from '../theme';

/** First page for new users. Finishing it registers them and the app moves on to the home dashboard. */
export function SignUpScreen() {
  const { t } = useLanguage();
  const { register } = useRegistration();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const mobileInput = useRef<TextInput>(null);
  const idInput = useRef<TextInput>(null);

  // Errors only appear once the user has tried to sign up, then update as they fix each field.
  const nameError = submitted ? validateName(name) : null;
  const mobileError = submitted ? validateMobile(mobile) : null;
  const idError = submitted ? validateIdNumber(idNumber) : null;

  const submit = () => {
    setSubmitted(true);
    if (validateName(name) || validateMobile(mobile) || validateIdNumber(idNumber)) return;
    setDone(true);
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <Image source={require('../../assets/logo.jpg')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.appName}>{APP_NAME}</Text>
          </View>

          <Text style={styles.title}>{t('signup.title')}</Text>
          <Text style={styles.subtitle}>{t('signup.subtitle')}</Text>

          <View style={styles.field}>
            <Text style={styles.label}>{t('signup.nameLabel')}</Text>
            <TextInput
              style={[styles.input, nameError && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder={t('signup.namePlaceholder')}
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
              onSubmitEditing={() => mobileInput.current?.focus()}
              accessibilityLabel={t('signup.nameLabel')}
            />
            {nameError && <Text style={styles.error}>{t(nameError)}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('signup.mobileLabel')}</Text>
            <TextInput
              ref={mobileInput}
              style={[styles.input, mobileError && styles.inputError]}
              value={mobile}
              onChangeText={setMobile}
              placeholder={t('signup.mobilePlaceholder')}
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              autoComplete="tel"
              maxLength={16}
              returnKeyType="next"
              onSubmitEditing={() => idInput.current?.focus()}
              accessibilityLabel={t('signup.mobileLabel')}
            />
            {mobileError && <Text style={styles.error}>{t(mobileError)}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('signup.idLabel')}</Text>
            <TextInput
              ref={idInput}
              style={[styles.input, idError && styles.inputError]}
              value={idNumber}
              onChangeText={(text) => setIdNumber(text.replace(/\D/g, ''))}
              placeholder={t('signup.idPlaceholder')}
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={13}
              autoComplete="off"
              returnKeyType="done"
              onSubmitEditing={submit}
              accessibilityLabel={t('signup.idLabel')}
            />
            {idError && <Text style={styles.error}>{t(idError)}</Text>}
          </View>

          <Pressable
            onPress={submit}
            accessibilityRole="button"
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>{t('signup.submit')}</Text>
          </Pressable>

          <View style={styles.privacy}>
            <Ionicons name="lock-closed-outline" size={15} color={colors.textMuted} />
            <Text style={styles.privacyText}>{t('signup.privacy')}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessDialog
        visible={done}
        title={t('signup.successTitle')}
        message={t('signup.successMessage')}
        buttonLabel={t('signup.done')}
        onDone={register}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 84,
    height: 84,
  },
  appName: {
    marginTop: 10,
    fontFamily: 'Trebuchet MS',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: colors.text,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 22,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: colors.emergency,
  },
  error: {
    marginTop: 5,
    fontSize: 12,
    color: colors.emergency,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.emergency,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 22,
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
  },
});
