import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  FileText,
  Heart,
  Cloud,
  Phone,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Thermometer,
  Droplets,
  Wind,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { VisaRequirement, HealthInfo, WeatherForecast } from '@/types';

interface TravelInfoProps {
  visaInfo?: VisaRequirement;
  healthInfo?: HealthInfo;
  weather?: WeatherForecast[];
  localInfo?: {
    currency: string;
    language: string;
    timezone: string;
    emergencyNumbers: {
      police: string;
      medical: string;
      fire: string;
    };
    usefulPhrases: {
      phrase: string;
      translation: string;
    }[];
  };
}

type TabType = 'visa' | 'health' | 'weather' | 'local';

export function TravelInfo({ visaInfo, healthInfo, weather, localInfo }: TravelInfoProps) {
  const [activeTab, setActiveTab] = useState<TabType>('visa');

  const tabs = [
    { key: 'visa' as TabType, label: 'Visa', icon: FileText },
    { key: 'health' as TabType, label: 'Santé', icon: Heart },
    { key: 'weather' as TabType, label: 'Météo', icon: Cloud },
    { key: 'local' as TabType, label: 'Infos locales', icon: Info },
  ];

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {tabs.map(({ key, label, icon: IconComponent }) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.tab,
            activeTab === key && styles.tabActive,
          ]}
          onPress={() => setActiveTab(key)}
        >
          <IconComponent
            size={18}
            color={activeTab === key ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text style={[
            styles.tabText,
            activeTab === key && styles.tabTextActive,
          ]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderVisaInfo = () => {
    if (!visaInfo) return null;

    return (
      <View style={styles.tabContent}>
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.statusContainer}>
              {visaInfo.required ? (
                <AlertTriangle size={20} color={theme.colors.warning} />
              ) : (
                <CheckCircle size={20} color={theme.colors.success} />
              )}
              <Text style={[
                styles.statusText,
                { color: visaInfo.required ? theme.colors.warning : theme.colors.success }
              ]}>
                {visaInfo.required ? 'Visa requis' : 'Pas de visa requis'}
              </Text>
            </View>
          </View>

          {visaInfo.required && (
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type:</Text>
                <Text style={styles.infoValue}>{visaInfo.type}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Durée:</Text>
                <Text style={styles.infoValue}>{visaInfo.duration}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Coût:</Text>
                <Text style={styles.infoValue}>{visaInfo.cost}€</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Délai de traitement:</Text>
                <Text style={styles.infoValue}>{visaInfo.processingTime}</Text>
              </View>
            </View>
          )}

          {visaInfo.requirements && (
            <View style={styles.requirementsSection}>
              <Text style={styles.sectionTitle}>Documents requis:</Text>
              {visaInfo.requirements.map((requirement: string, index: number) => (
                <View key={index} style={styles.requirementItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderHealthInfo = () => {
    if (!healthInfo) return null;

    return (
      <View style={styles.tabContent}>
        {/* Vaccinations */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Vaccinations</Text>
          {healthInfo.vaccinations.map((vaccination: any, index: number) => (
            <View key={index} style={styles.vaccinationItem}>
              <View style={styles.vaccinationHeader}>
                <Text style={styles.vaccinationName}>{vaccination.name}</Text>
                <View style={styles.vaccinationStatus}>
                  {vaccination.required ? (
                    <Text style={[styles.statusBadge, styles.statusRequired]}>Obligatoire</Text>
                  ) : vaccination.recommended ? (
                    <Text style={[styles.statusBadge, styles.statusRecommended]}>Recommandé</Text>
                  ) : (
                    <Text style={[styles.statusBadge, styles.statusOptional]}>Optionnel</Text>
                  )}
                </View>
              </View>
              <Text style={styles.vaccinationDescription}>{vaccination.description}</Text>
            </View>
          ))}
        </View>

        {/* Risques sanitaires */}
        {healthInfo.healthRisks && healthInfo.healthRisks.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Risques sanitaires</Text>
            {healthInfo.healthRisks.map((risk: string, index: number) => (
              <View key={index} style={styles.riskItem}>
                <AlertTriangle size={16} color={theme.colors.warning} />
                <Text style={styles.riskText}>{risk}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Assurance médicale */}
        <View style={styles.infoCard}>
          <View style={styles.insuranceHeader}>
            <Heart size={20} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Assurance médicale</Text>
          </View>
          <Text style={styles.insuranceText}>
            {healthInfo.medicalInsurance 
              ? 'Une assurance médicale est recommandée pour ce voyage.'
              : 'Aucune assurance médicale spécifique requise.'
            }
          </Text>
        </View>

        {/* Numéros d'urgence */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Numéros d'urgence</Text>
          <View style={styles.emergencyNumbers}>
            <View style={styles.emergencyItem}>
              <Phone size={16} color={theme.colors.error} />
              <Text style={styles.emergencyLabel}>Police:</Text>
              <Text style={styles.emergencyNumber}>{healthInfo.emergencyNumbers.police}</Text>
            </View>
            <View style={styles.emergencyItem}>
              <Phone size={16} color={theme.colors.error} />
              <Text style={styles.emergencyLabel}>Médical:</Text>
              <Text style={styles.emergencyNumber}>{healthInfo.emergencyNumbers.medical}</Text>
            </View>
            <View style={styles.emergencyItem}>
              <Phone size={16} color={theme.colors.error} />
              <Text style={styles.emergencyLabel}>Pompiers:</Text>
              <Text style={styles.emergencyNumber}>{healthInfo.emergencyNumbers.fire}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderWeatherInfo = () => {
    if (!weather || weather.length === 0) return null;

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Prévisions météo</Text>
        {weather.map((forecast, index) => (
          <View key={index} style={styles.weatherCard}>
            <View style={styles.weatherHeader}>
              <Text style={styles.weatherDate}>
                {new Date(forecast.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </Text>
              <Text style={styles.weatherCondition}>{forecast.condition}</Text>
            </View>
            
            <View style={styles.weatherDetails}>
              <View style={styles.weatherItem}>
                <Thermometer size={16} color={theme.colors.primary} />
                <Text style={styles.weatherLabel}>Température:</Text>
                <Text style={styles.weatherValue}>
                  {forecast.temperature.min}° - {forecast.temperature.max}°C
                </Text>
              </View>
              
              <View style={styles.weatherItem}>
                <Droplets size={16} color={theme.colors.primary} />
                <Text style={styles.weatherLabel}>Précipitations:</Text>
                <Text style={styles.weatherValue}>{forecast.precipitation}%</Text>
              </View>
              
              <View style={styles.weatherItem}>
                <Wind size={16} color={theme.colors.primary} />
                <Text style={styles.weatherLabel}>Vent:</Text>
                <Text style={styles.weatherValue}>{forecast.windSpeed} km/h</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderLocalInfo = () => {
    if (!localInfo) return null;

    return (
      <View style={styles.tabContent}>
        {/* Informations générales */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informations générales</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Monnaie:</Text>
            <Text style={styles.infoValue}>{localInfo.currency}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Langue:</Text>
            <Text style={styles.infoValue}>{localInfo.language}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fuseau horaire:</Text>
            <Text style={styles.infoValue}>{localInfo.timezone}</Text>
          </View>
        </View>

        {/* Numéros d'urgence */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Numéros d'urgence</Text>
          <View style={styles.emergencyNumbers}>
            <View style={styles.emergencyItem}>
              <Phone size={16} color={theme.colors.error} />
              <Text style={styles.emergencyLabel}>Police:</Text>
              <Text style={styles.emergencyNumber}>{localInfo.emergencyNumbers.police}</Text>
            </View>
            <View style={styles.emergencyItem}>
              <Phone size={16} color={theme.colors.error} />
              <Text style={styles.emergencyLabel}>Médical:</Text>
              <Text style={styles.emergencyNumber}>{localInfo.emergencyNumbers.medical}</Text>
            </View>
            <View style={styles.emergencyItem}>
              <Phone size={16} color={theme.colors.error} />
              <Text style={styles.emergencyLabel}>Pompiers:</Text>
              <Text style={styles.emergencyNumber}>{localInfo.emergencyNumbers.fire}</Text>
            </View>
          </View>
        </View>

        {/* Phrases utiles */}
        <View style={styles.infoCard}>
          <View style={styles.phrasesHeader}>
            <MessageCircle size={20} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Phrases utiles</Text>
          </View>
          {localInfo.usefulPhrases.map((phrase, index) => (
            <View key={index} style={styles.phraseItem}>
              <Text style={styles.phraseText}>{phrase.phrase}</Text>
              <Text style={styles.phraseTranslation}>{phrase.translation}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'visa':
        return renderVisaInfo();
      case 'health':
        return renderHealthInfo();
      case 'weather':
        return renderWeatherInfo();
      case 'local':
        return renderLocalInfo();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderTabBar()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  cardContent: {
    gap: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  infoLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
  },
  requirementsSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  bulletPoint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  requirementText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  vaccinationItem: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  vaccinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  vaccinationName: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  vaccinationStatus: {
    marginLeft: theme.spacing.sm,
  },
  statusBadge: {
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusRequired: {
    backgroundColor: theme.colors.error,
    color: theme.colors.white,
  },
  statusRecommended: {
    backgroundColor: theme.colors.warning,
    color: theme.colors.white,
  },
  statusOptional: {
    backgroundColor: theme.colors.border,
    color: theme.colors.textSecondary,
  },
  vaccinationDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  riskText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  insuranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  insuranceText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  emergencyNumbers: {
    gap: theme.spacing.sm,
  },
  emergencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  emergencyLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    minWidth: 60,
  },
  emergencyNumber: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.error,
  },
  weatherCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  weatherDate: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  weatherCondition: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  weatherDetails: {
    gap: theme.spacing.sm,
  },
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  weatherLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    minWidth: 100,
  },
  weatherValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text,
  },
  phrasesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  phraseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  phraseText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  phraseTranslation: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: theme.spacing.md,
  },
});