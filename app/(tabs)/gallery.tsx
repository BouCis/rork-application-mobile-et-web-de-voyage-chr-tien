import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/store/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PHOTOS: { id: string; uri: string }[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  uri: `https://images.unsplash.com/photo-15${(i + 10).toString().padStart(2, '0')}-travel?auto=format&fit=crop&w=1200&q=60`,
}));

export default function GalleryScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();
  const size = (Dimensions.get('window').width - spacing.lg * 2 - spacing.md * 2) / 3;

  const styles = StyleSheet.create({
    container: { flex: 1 },
    bg: { ...StyleSheet.absoluteFillObject },
    list: { padding: spacing.lg, paddingTop: spacing.lg + insets.top },
    item: { width: size, height: size, borderRadius: borderRadius.md, overflow: 'hidden', margin: spacing.md / 2 },
    row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    empty: { padding: spacing.lg },
    emptyText: { color: colors.textSecondary },
  });

  return (
    <View style={styles.container} testID="gallery-screen">
      <LinearGradient colors={[colors.background, colors.backgroundSecondary]} style={styles.bg} />
      <FlatList
        data={PHOTOS}
        keyExtractor={(i) => i.id}
        numColumns={3}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.uri }} style={{ width: '100%', height: '100%' }} />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}><Text style={styles.emptyText}>Aucune photo pour le moment</Text></View>
        )}
      />
    </View>
  );
}
