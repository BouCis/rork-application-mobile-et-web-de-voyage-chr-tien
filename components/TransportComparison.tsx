import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Plane,
  Train,
  Bus,
  Car,
  Ship,
  MapPin,
  Clock,
  Leaf,
  Star,
  Users,
  ExternalLink,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { TransportOption } from '@/types';

interface TransportComparisonProps {
  options: TransportOption[];
  onSelectOption: (option: TransportOption) => void;
}

const transportIcons = {
  flight: Plane,
  train: Train,
  bus: Bus,
  car: Car,
  boat: Ship,
  walk: MapPin,
};

const transportColors = {
  flight: '#3b82f6',
  train: '#10b981',
  bus: '#f59e0b',
  car: '#ef4444',
  boat: '#06b6d4',
  walk: '#8b5cf6',
};

export function TransportComparison({ options, onSelectOption }: TransportComparisonProps) {
  const formatDuration = (duration: string) => {
    return duration.replace('h', 'h ').replace('m', 'min');
  };

  const getComfortStars = (comfort: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        color={i < comfort ? theme.colors.secondary : theme.colors.border}
        fill={i < comfort ? theme.colors.secondary : 'transparent'}
      />
    ));
  };

  const getCarbonColor = (footprint?: number) => {
    if (!footprint) return theme.colors.success;
    if (footprint < 50) return theme.colors.success;
    if (footprint < 200) return theme.colors.warning;
    return theme.colors.error;
  };

  const renderTransportCard = (option: TransportOption) => {
    const IconComponent = transportIcons[option.type];
    const transportColor = transportColors[option.type];

    return (
      <TouchableOpacity
        key={option.id}
        style={styles.transportCard}
        onPress={() => {
          console.log('🚀 Option de transport sélectionnée:', option.provider);
          onSelectOption(option);
        }}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.transportInfo}>
            <View style={[styles.transportIcon, { backgroundColor: transportColor }]}>
              <IconComponent size={20} color={theme.colors.white} />
            </View>
            <View>
              <Text style={styles.providerName}>{option.provider}</Text>
              <Text style={styles.transportType}>
                {option.type === 'flight' ? 'Vol' :
                 option.type === 'train' ? 'Train' :
                 option.type === 'bus' ? 'Bus' :
                 option.type === 'car' ? 'Voiture' :
                 option.type === 'boat' ? 'Bateau' : 'Marche'}
              </Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{option.price}€</Text>
            <Text style={styles.currency}>par personne</Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <Text style={styles.routeTime}>{option.departure.time}</Text>
            <Text style={styles.routeLocation}>{option.departure.location}</Text>
          </View>
          
          <View style={styles.routeLine}>
            <View style={styles.routeDot} />
            <View style={styles.routePath} />
            <View style={styles.routeDot} />
          </View>
          
          <View style={styles.routePoint}>
            <Text style={styles.routeTime}>{option.arrival.time}</Text>
            <Text style={styles.routeLocation}>{option.arrival.location}</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Clock size={14} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{formatDuration(option.duration)}</Text>
          </View>
          
          {option.stops > 0 && (
            <View style={styles.detailItem}>
              <Text style={styles.stopsText}>
                {option.stops} escale{option.stops > 1 ? 's' : ''}
              </Text>
            </View>
          )}
          
          <View style={styles.detailItem}>
            <View style={styles.comfortStars}>
              {getComfortStars(option.comfort)}
            </View>
          </View>
          
          {option.carbonFootprint && (
            <View style={styles.detailItem}>
              <Leaf size={14} color={getCarbonColor(option.carbonFootprint)} />
              <Text style={[styles.detailText, { color: getCarbonColor(option.carbonFootprint) }]}>
                {option.carbonFootprint}kg CO₂
              </Text>
            </View>
          )}
          
          {option.accessibility && (
            <View style={styles.detailItem}>
              <Users size={14} color={theme.colors.success} />
              <Text style={[styles.detailText, { color: theme.colors.success }]}>
                Accessible
              </Text>
            </View>
          )}
        </View>

        {/* Class info */}
        {option.class && (
          <View style={styles.classContainer}>
            <Text style={styles.classText}>{option.class}</Text>
          </View>
        )}

        {/* Book button */}
        {option.bookingUrl && (
          <View style={styles.bookingContainer}>
            <TouchableOpacity 
              style={styles.bookingButton}
              onPress={() => {
                console.log('🔗 Ouverture du lien de réservation:', option.bookingUrl);
                console.log('💡 Note: L\'ouverture de liens externes nécessite Linking.openURL()');
              }}
              activeOpacity={0.7}
            >
              <ExternalLink size={16} color={theme.colors.primary} />
              <Text style={styles.bookingText}>Réserver</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (options.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucune option de transport trouvée</Text>
        <Text style={styles.emptySubtext}>
          Essayez de modifier vos filtres ou votre destination
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Options de transport</Text>
        <Text style={styles.headerSubtitle}>
          {options.length} option{options.length > 1 ? 's' : ''} trouvée{options.length > 1 ? 's' : ''}
        </Text>
      </View>
      
      <View style={styles.optionsList}>
        {options && options.map(renderTransportCard)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  optionsList: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  transportCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  transportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  transportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  transportType: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  currency: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  routePoint: {
    flex: 1,
    alignItems: 'center',
  },
  routeTime: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
  },
  routeLocation: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  routePath: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.xs,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  stopsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.warning,
    fontWeight: '500',
  },
  comfortStars: {
    flexDirection: 'row',
    gap: 2,
  },
  classContainer: {
    marginBottom: theme.spacing.sm,
  },
  classText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  bookingContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },
  bookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  bookingText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});