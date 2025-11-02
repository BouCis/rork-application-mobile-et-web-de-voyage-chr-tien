import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Calendar, Heart } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { theme } from '@/constants/theme';
import { Trip } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface TripCardProps {
  trip: Trip;
  onPress: () => void;
}

export function TripCard({ trip, onPress }: TripCardProps) {
  const { favoriteTrips, toggleFavoriteTrip } = useAppStore();
  const isFavorite = favoriteTrips.includes(trip.id);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };
  
  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'ongoing':
        return theme.colors.warning;
      case 'planning':
      case 'upcoming':
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };
  
  const getStatusText = (status: Trip['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'ongoing':
        return 'En cours';
      case 'planning':
        return 'En planification';
      case 'upcoming':
        return 'À venir';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card style={styles.card}>
        {trip.coverImage && (
          <Image source={{ uri: trip.coverImage }} style={styles.coverImage} />
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {trip.title}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
                <Text style={styles.statusText}>{getStatusText(trip.status)}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={() => toggleFavoriteTrip(trip.id)}
              style={styles.favoriteButton}
            >
              <Heart
                size={20}
                color={isFavorite ? theme.colors.error : theme.colors.textLight}
                fill={isFavorite ? theme.colors.error : 'transparent'}
              />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {trip.description}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.dateContainer}>
              <Calendar size={16} color={theme.colors.textSecondary} />
              <Text style={styles.dateText}>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </Text>
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={theme.colors.textSecondary} />
              <Text style={styles.locationText}>
                {trip.locations.length} lieu{trip.locations.length > 1 ? 'x' : ''}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  coverImage: {
    width: '100%',
    height: 160,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  content: {
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
    color: theme.colors.white,
  },
  favoriteButton: {
    padding: theme.spacing.xs,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  locationText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});