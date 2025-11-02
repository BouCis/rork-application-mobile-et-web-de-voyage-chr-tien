import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  CheckCircle,
  Circle,
  FileText,
  Heart,
  Package,
  Calendar,
  Settings,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { ChecklistItem } from '@/types';

interface TravelChecklistProps {
  items: ChecklistItem[];
  onItemToggle: (itemId: string) => void;
  onItemAdd?: (item: Omit<ChecklistItem, 'id'>) => void;
  onItemDelete?: (itemId: string) => void;
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  documents: FileText,
  health: Heart,
  packing: Package,
  booking: Calendar,
  preparation: Settings,
  other: Settings,
};

const categoryLabels = {
  documents: 'Documents',
  health: 'Santé',
  packing: 'Bagages',
  booking: 'Réservations',
  preparation: 'Préparation',
};

const priorityColors = {
  high: theme.colors.error,
  medium: theme.colors.warning,
  low: theme.colors.textSecondary,
};

export function TravelChecklist({ 
  items, 
  onItemToggle, 
  onItemAdd, 
  onItemDelete 
}: TravelChecklistProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const getCompletionStats = () => {
    const completed = items.filter(item => item.completed).length;
    const total = items.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const getOverdueItems = () => {
    const now = new Date();
    return items.filter(item => 
      !item.completed && 
      item.dueDate && 
      new Date(item.dueDate) < now
    );
  };

  const handleItemDelete = (itemId: string) => {
    Alert.alert(
      'Supprimer l\'élément',
      'Êtes-vous sûr de vouloir supprimer cet élément de la checklist ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => onItemDelete?.(itemId)
        },
      ]
    );
  };

  const renderProgressBar = () => {
    const { completed, total, percentage } = getCompletionStats();
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progression</Text>
          <Text style={styles.progressText}>{completed}/{total} ({percentage}%)</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${percentage}%` }
            ]} 
          />
        </View>
      </View>
    );
  };

  const renderOverdueAlert = () => {
    const overdueItems = getOverdueItems();
    
    if (overdueItems.length === 0) return null;

    return (
      <View style={styles.overdueAlert}>
        <AlertTriangle size={20} color={theme.colors.error} />
        <View style={styles.overdueContent}>
          <Text style={styles.overdueTitle}>
            {overdueItems.length} élément{overdueItems.length > 1 ? 's' : ''} en retard
          </Text>
          <Text style={styles.overdueText}>
            Certaines tâches ont dépassé leur date limite
          </Text>
        </View>
      </View>
    );
  };

  const renderCategoryFilter = () => {
    const categories = Object.keys(groupedItems);
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
        contentContainerStyle={styles.categoryFilterContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === null && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === null && styles.categoryButtonTextActive,
          ]}>
            Tout
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
          const itemCount = groupedItems[category].length;
          const completedCount = groupedItems[category].filter(item => item.completed).length;
          
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <IconComponent 
                size={16} 
                color={selectedCategory === category ? theme.colors.white : theme.colors.primary} 
              />
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive,
              ]}>
                {categoryLabels[category as keyof typeof categoryLabels]}
              </Text>
              <View style={[
                styles.categoryBadge,
                selectedCategory === category && styles.categoryBadgeActive,
              ]}>
                <Text style={[
                  styles.categoryBadgeText,
                  selectedCategory === category && styles.categoryBadgeTextActive,
                ]}>
                  {completedCount}/{itemCount}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderChecklistItem = (item: ChecklistItem) => {
    const IconComponent = categoryIcons[item.category];
    const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && !item.completed;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.checklistItem,
          item.completed && styles.checklistItemCompleted,
          isOverdue && styles.checklistItemOverdue,
        ]}
        onPress={() => onItemToggle(item.id)}
      >
        <View style={styles.itemLeft}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => onItemToggle(item.id)}
          >
            {item.completed ? (
              <CheckCircle size={24} color={theme.colors.success} />
            ) : (
              <Circle size={24} color={theme.colors.border} />
            )}
          </TouchableOpacity>
          
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <IconComponent 
                size={16} 
                color={item.completed ? theme.colors.textSecondary : theme.colors.primary} 
              />
              <Text style={[
                styles.itemTitle,
                item.completed && styles.itemTitleCompleted,
              ]}>
                {item.title}
              </Text>
              <View style={[
                styles.priorityDot,
                { backgroundColor: priorityColors[item.priority] }
              ]} />
            </View>
            
            {item.description && (
              <Text style={[
                styles.itemDescription,
                item.completed && styles.itemDescriptionCompleted,
              ]}>
                {item.description}
              </Text>
            )}
            
            {item.dueDate && (
              <Text style={[
                styles.itemDueDate,
                isOverdue && styles.itemDueDateOverdue,
              ]}>
                Échéance: {new Date(item.dueDate).toLocaleDateString('fr-FR')}
              </Text>
            )}
          </View>
        </View>
        
        {onItemDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleItemDelete(item.id)}
          >
            <Trash2 size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const filteredItems = selectedCategory 
    ? items.filter(item => item.category === selectedCategory)
    : items;

  const sortedItems = filteredItems.sort((a, b) => {
    // Priorité: non complétés d'abord, puis par priorité, puis par date d'échéance
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    return 0;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checklist de voyage</Text>
        {onItemAdd && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProgressBar()}
        {renderOverdueAlert()}
        {renderCategoryFilter()}
        
        <View style={styles.itemsList}>
          {sortedItems.map(renderChecklistItem)}
        </View>
        
        {sortedItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun élément dans cette catégorie</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    backgroundColor: theme.colors.white,
    margin: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 4,
  },
  overdueAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  overdueContent: {
    flex: 1,
  },
  overdueTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.white,
  },
  overdueText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.white,
    opacity: 0.9,
  },
  categoryFilter: {
    marginBottom: theme.spacing.md,
  },
  categoryFilterContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    color: theme.colors.text,
  },
  categoryButtonTextActive: {
    color: theme.colors.white,
  },
  categoryBadge: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryBadgeActive: {
    backgroundColor: theme.colors.white,
  },
  categoryBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  categoryBadgeTextActive: {
    color: theme.colors.primary,
  },
  itemsList: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  checklistItemCompleted: {
    opacity: 0.7,
  },
  checklistItemOverdue: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    flex: 1,
  },
  checkbox: {
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  itemTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  itemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  itemDescriptionCompleted: {
    textDecorationLine: 'line-through',
  },
  itemDueDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  itemDueDateOverdue: {
    color: theme.colors.error,
    fontWeight: '600',
  },
  deleteButton: {
    padding: theme.spacing.xs,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});