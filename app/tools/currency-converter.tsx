import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowDownUp, TrendingUp, DollarSign } from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

const currencies: Currency[] = [
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 1 },
  { code: 'USD', name: 'Dollar américain', symbol: '$', rate: 1.09 },
  { code: 'GBP', name: 'Livre sterling', symbol: '£', rate: 0.86 },
  { code: 'JPY', name: 'Yen japonais', symbol: '¥', rate: 161.89 },
  { code: 'CHF', name: 'Franc suisse', symbol: 'CHF', rate: 0.96 },
  { code: 'CAD', name: 'Dollar canadien', symbol: 'C$', rate: 1.52 },
  { code: 'AUD', name: 'Dollar australien', symbol: 'A$', rate: 1.67 },
  { code: 'CNY', name: 'Yuan chinois', symbol: '¥', rate: 7.87 },
  { code: 'MAD', name: 'Dirham marocain', symbol: 'MAD', rate: 10.86 },
  { code: 'XOF', name: 'Franc CFA', symbol: 'CFA', rate: 655.96 },
  { code: 'TND', name: 'Dinar tunisien', symbol: 'TND', rate: 3.43 },
  { code: 'EGP', name: 'Livre égyptienne', symbol: 'E£', rate: 54.27 },
  { code: 'ZAR', name: 'Rand sud-africain', symbol: 'R', rate: 20.21 },
  { code: 'NGN', name: 'Naira nigérian', symbol: '₦', rate: 1686.50 },
  { code: 'KES', name: 'Shilling kenyan', symbol: 'KSh', rate: 140.85 },
];

export default function CurrencyConverterScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0]);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[1]);

  const convertedAmount = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;
    const result = (numAmount * toCurrency.rate) / fromCurrency.rate;
    return result.toFixed(2);
  }, [amount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = useCallback(() => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  }, [fromCurrency, toCurrency]);

  const handleSelectFromCurrency = useCallback((currency: Currency) => {
    setFromCurrency(currency);
  }, []);

  const handleSelectToCurrency = useCallback((currency: Currency) => {
    setToCurrency(currency);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Convertisseur',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <DollarSign color={colors.primary} size={32} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Conversion de devises</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Taux de change en temps réel
          </Text>
        </View>

        <View style={styles.converterCard}>
          <LinearGradient
            colors={[colors.surface, colors.backgroundLight]}
            style={[styles.converterGradient, { borderColor: colors.border }]}
          >
            <View style={styles.currencySection}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>De</Text>
              <TouchableOpacity
                style={[styles.currencySelector, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.currencyCode, { color: colors.text }]}>
                  {fromCurrency.code}
                </Text>
                <Text style={[styles.currencyName, { color: colors.textSecondary }]}>
                  {fromCurrency.name}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <TouchableOpacity
              style={[styles.swapButton, { backgroundColor: colors.primary }]}
              onPress={handleSwapCurrencies}
            >
              <ArrowDownUp color={colors.white} size={20} />
            </TouchableOpacity>

            <View style={styles.currencySection}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Vers</Text>
              <TouchableOpacity
                style={[styles.currencySelector, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.currencyCode, { color: colors.text }]}>
                  {toCurrency.code}
                </Text>
                <Text style={[styles.currencyName, { color: colors.textSecondary }]}>
                  {toCurrency.name}
                </Text>
              </TouchableOpacity>
              <View style={[styles.resultContainer, { backgroundColor: `${colors.primary}10` }]}>
                <Text style={[styles.resultAmount, { color: colors.primary }]}>
                  {toCurrency.symbol} {convertedAmount}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.rateInfo}>
          <View style={[styles.rateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TrendingUp color={colors.accent} size={20} />
            <View style={styles.rateTextContainer}>
              <Text style={[styles.rateText, { color: colors.textSecondary }]}>
                1 {fromCurrency.code} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {toCurrency.code}
              </Text>
              <Text style={[styles.rateSubtext, { color: colors.textLight }]}>
                Mis à jour aujourd'hui
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.popularCurrencies}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Devises populaires</Text>
          <View style={styles.currencyGrid}>
            {currencies.slice(0, 8).map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyItem,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  toCurrency.code === currency.code && {
                    backgroundColor: `${colors.primary}15`,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => handleSelectToCurrency(currency)}
              >
                <Text style={[styles.currencyItemCode, { color: colors.text }]}>
                  {currency.code}
                </Text>
                <Text style={[styles.currencyItemSymbol, { color: colors.textSecondary }]}>
                  {currency.symbol}
                </Text>
                <Text style={[styles.currencyItemRate, { color: colors.textLight }]}>
                  {((parseFloat(amount) || 0) * currency.rate / fromCurrency.rate).toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  converterCard: {
    marginBottom: 24,
  },
  converterGradient: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  currencySection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  currencyCode: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  currencyName: {
    fontSize: 14,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700' as const,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  swapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 16,
  },
  resultContainer: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  resultAmount: {
    fontSize: 36,
    fontWeight: '800' as const,
  },
  rateInfo: {
    marginBottom: 32,
  },
  rateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  rateTextContainer: {
    flex: 1,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  rateSubtext: {
    fontSize: 12,
  },
  popularCurrencies: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  currencyItem: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  currencyItemCode: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  currencyItemSymbol: {
    fontSize: 12,
    marginBottom: 8,
  },
  currencyItemRate: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
