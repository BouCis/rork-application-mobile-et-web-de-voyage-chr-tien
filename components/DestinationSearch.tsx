import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, X, MapPin, Star, TrendingUp } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { searchDestinations, type Destination } from '@/data/destinations';

interface DestinationSearchProps {
  visible: boolean;
  onClose: () => void;
  onSelectDestination: (destination: Destination) => void;
}

export default function DestinationSearch({
  visible,
  onClose,
  onSelectDestination,
}: DestinationSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const searchResults = useMemo(() => {
    return searchDestinations(searchQuery);
  }, [searchQuery]);

  const handleSelectDestination = useCallback((destination: Destination) => {
    console.log('[DestinationSearch] Selected destination:', destination.name);
    onSelectDestination(destination);
    setSearchQuery('');
    onClose();
  }, [onSelectDestination, onClose]);

  const handleClose = useCallback(() => {
    setSearchQuery('');
    setIsFocused(false);
    onClose();
  }, [onClose]);

  const renderDestinationItem = useCallback(({ item }: { item: Destination }) => (
    <TouchableOpacity
      testID={`destination-item-${item.id}`}
      style={styles.destinationItem}
      onPress={() => handleSelectDestination(item)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Sélectionner ${item.name}, ${item.country}`}
    >
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.05)', 'rgba(236, 72, 153, 0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.destinationGradient}
      >
        <View style={styles.destinationIcon}>
          <MapPin color={theme.colors.primary} size={20} strokeWidth={2} />
        </View>
        <View style={styles.destinationInfo}>
          <Text style={styles.destinationName}>{item.name}</Text>
          <Text style={styles.destinationCountry}>{item.country} • {item.continent}</Text>
          <View style={styles.destinationMeta}>
            <View style={styles.ratingContainer}>
              <Star color={theme.colors.warning} size={12} fill={theme.colors.warning} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>{item.recommendedDuration}</Text>
          </View>
        </View>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>À partir de</Text>
          <Text style={styles.budgetValue}>{item.averageBudget.budget}€/j</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  ), [handleSelectDestination]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <TrendingUp color={theme.colors.textLight} size={48} strokeWidth={1.5} />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'Aucune destination trouvée' : 'Recherchez une destination'}
      </Text>
      <Text style={styles.emptyText}>
        {searchQuery 
          ? 'Essayez avec un autre nom de ville ou pays'
          : 'Explorez plus de 20 destinations à travers le monde'}
      </Text>
    </View>
  ), [searchQuery]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.colors.backgroundDark, theme.colors.background]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Rechercher une destination</Text>
            <TouchableOpacity
              testID="btn-close-search"
              style={styles.closeButton}
              onPress={handleClose}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Fermer la recherche"
            >
              <X color={theme.colors.text} size={24} />
            </TouchableOpacity>
          </View>

          <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
            <LinearGradient
              colors={isFocused 
                ? ['rgba(99, 102, 241, 0.15)', 'rgba(236, 72, 153, 0.15)']
                : ['rgba(99, 102, 241, 0.1)', 'rgba(236, 72, 153, 0.1)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.searchGradient}
            >
              <Search color={isFocused ? theme.colors.primary : theme.colors.textLight} size={20} />
              <TextInput
                testID="input-search-destination"
                style={styles.searchInput}
                placeholder="Paris, Tokyo, Bali..."
                placeholderTextColor={theme.colors.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus={true}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="words"
                keyboardType="default"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  testID="btn-clear-search"
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Effacer la recherche"
                >
                  <X color={theme.colors.textLight} size={18} />
                </TouchableOpacity>
              )}
            </LinearGradient>
          </View>

          <View style={styles.resultsCount}>
            <Text style={styles.resultsCountText}>
              {searchResults.length} {searchResults.length > 1 ? 'destinations' : 'destination'}
            </Text>
          </View>
        </View>

        <FlatList
          data={searchResults}
          renderItem={renderDestinationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginBottom: theme.spacing.md,
  },
  searchContainerFocused: {
    transform: [{ scale: 1.01 }],
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    paddingVertical: theme.spacing.xs,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  resultsCount: {
    paddingVertical: theme.spacing.xs,
  },
  resultsCountText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  destinationItem: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  destinationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
  },
  destinationIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  destinationCountry: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  destinationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  metaText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  budgetContainer: {
    alignItems: 'flex-end',
    marginLeft: theme.spacing.sm,
  },
  budgetLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  budgetValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxxl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
});
