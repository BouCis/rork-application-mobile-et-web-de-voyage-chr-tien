import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart,
  Repeat,
  Shuffle,
  Music,
  Volume2,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  category: string;
}

const playlist: Track[] = [
  { id: '1', title: 'Amazing Grace', artist: 'Chris Tomlin', album: 'Worship Collection', duration: '4:32', category: 'Louange' },
  { id: '2', title: 'How Great Is Our God', artist: 'Hillsong Worship', album: 'Hope', duration: '5:12', category: 'Louange' },
  { id: '3', title: 'Oceans', artist: 'Hillsong United', album: 'Zion', duration: '8:56', category: 'Méditation' },
  { id: '4', title: 'Goodness of God', artist: 'Bethel Music', album: 'Victory', duration: '6:45', category: 'Louange' },
  { id: '5', title: 'Way Maker', artist: 'Sinach', album: 'Way Maker', duration: '5:32', category: 'Gospel' },
];

export default function MusicPlayerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(playlist[0]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleBack = () => {
    router.back();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(playlist[currentIndex - 1]);
      setProgress(0);
    }
  };

  const handleNext = () => {
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < playlist.length - 1) {
      setCurrentTrack(playlist[currentIndex + 1]);
      setProgress(0);
    }
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.backgroundDark, theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lecture en cours</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.playerSection}>
          <View style={styles.albumArt}>
            <LinearGradient
              colors={theme.colors.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.albumGradient}
            >
              <Music color={theme.colors.textInverse} size={80} strokeWidth={1.5} />
            </LinearGradient>
          </View>

          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
            <Text style={styles.trackAlbum}>{currentTrack.album}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.timeLabels}>
              <Text style={styles.timeText}>0:00</Text>
              <Text style={styles.timeText}>{currentTrack.duration}</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setIsShuffle(!isShuffle)}
            >
              <Shuffle 
                color={isShuffle ? theme.colors.primary : theme.colors.textLight} 
                size={24} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePrevious}
            >
              <SkipBack color={theme.colors.text} size={32} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
            >
              <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.playGradient}
              >
                {isPlaying ? (
                  <Pause color={theme.colors.textInverse} size={32} fill={theme.colors.textInverse} />
                ) : (
                  <Play color={theme.colors.textInverse} size={32} fill={theme.colors.textInverse} />
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleNext}
            >
              <SkipForward color={theme.colors.text} size={32} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setIsRepeat(!isRepeat)}
            >
              <Repeat 
                color={isRepeat ? theme.colors.primary : theme.colors.textLight} 
                size={24} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Heart 
                color={isFavorite ? theme.colors.error : theme.colors.textLight} 
                size={24}
                fill={isFavorite ? theme.colors.error : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Volume2 color={theme.colors.textLight} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.playlistSection}>
          <Text style={styles.sectionTitle}>À suivre</Text>
          <View style={styles.playlistContainer}>
            {playlist.map((track, index) => (
              <TouchableOpacity
                key={track.id}
                style={[
                  styles.trackItem,
                  track.id === currentTrack.id && styles.trackItemActive
                ]}
                onPress={() => handleTrackSelect(track)}
              >
                <View style={styles.trackNumber}>
                  <Text style={[
                    styles.trackNumberText,
                    track.id === currentTrack.id && styles.trackNumberTextActive
                  ]}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.trackDetails}>
                  <Text style={[
                    styles.trackItemTitle,
                    track.id === currentTrack.id && styles.trackItemTitleActive
                  ]}>
                    {track.title}
                  </Text>
                  <Text style={styles.trackItemArtist}>{track.artist}</Text>
                </View>
                <Text style={styles.trackDuration}>{track.duration}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  playerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  albumArt: {
    width: width - theme.spacing.lg * 4,
    height: width - theme.spacing.lg * 4,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  albumGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  trackTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  trackArtist: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  trackAlbum: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  controlButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  playGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  actionButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistSection: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  playlistContainer: {
    gap: theme.spacing.sm,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  trackItemActive: {
    backgroundColor: `${theme.colors.primary}10`,
    borderColor: theme.colors.primary,
  },
  trackNumber: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackNumberText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textLight,
  },
  trackNumberTextActive: {
    color: theme.colors.primary,
  },
  trackDetails: {
    flex: 1,
  },
  trackItemTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  trackItemTitleActive: {
    color: theme.colors.primary,
  },
  trackItemArtist: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  trackDuration: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
});
