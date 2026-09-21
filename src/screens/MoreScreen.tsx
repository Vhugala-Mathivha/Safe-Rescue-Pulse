import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import type { TabKey } from '../components/BottomTabBar';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES } from '../i18n/translations';
import { DEFAULT_LOCATION, colors } from '../theme';

export function MoreScreen({ onNavigate }: { onNavigate: (tab: TabKey) => void }) {
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <View style={styles.screen}>
      <AppHeader location={DEFAULT_LOCATION} onPressBell={() => onNavigate('alerts')} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('more.title')}</Text>

        <View style={styles.card}>
          <Pressable
            style={styles.row}
            onPress={() => setOpen((v) => !v)}
            accessibilityRole="button"
            accessibilityState={{ expanded: open }}
            accessibilityLabel={t('more.languages')}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="translate" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{t('more.languages')}</Text>
              <Text style={styles.rowDesc}>{t('more.languagesDesc')}</Text>
            </View>
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.text} />
          </Pressable>

          <View style={styles.selected}>
            <Text style={styles.selectedLabel}>{t('more.selectLanguage')}</Text>
            <Text style={styles.selectedValue}>{current?.name}</Text>
          </View>

          {open && (
            <View style={styles.options}>
              {LANGUAGES.map((l) => {
                const isSelected = l.code === language;
                return (
                  <Pressable
                    key={l.code}
                    style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                    onPress={() => {
                      setLanguage(l.code);
                      setOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{l.name}</Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color={colors.emergency} />}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.emergency,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  rowDesc: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
  },
  selected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#F6F7F9',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  selectedLabel: {
    fontSize: 12.5,
    color: colors.textMuted,
  },
  selectedValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text,
  },
  options: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionPressed: { backgroundColor: '#F6F7F9' },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  optionTextSelected: {
    fontWeight: '700',
    color: colors.emergency,
  },
});
