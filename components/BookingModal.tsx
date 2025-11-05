import React, { useCallback, useMemo } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X, Calendar, CreditCard, Info } from 'lucide-react-native';
import { useTheme } from '@/store/ThemeContext';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  itemName: string;
  itemPrice: string;
  itemType: 'hotel' | 'activity' | 'flight' | 'restaurant' | string;
}

export default function BookingModal({ visible, onClose, itemName, itemPrice, itemType }: BookingModalProps) {
  const { colors, spacing, borderRadius, fontSize, fontWeight } = useTheme();

  const title = useMemo(() => {
    switch (itemType) {
      case 'hotel':
        return "Détails de l'hôtel";
      case 'activity':
        return "Détails de l'activité";
      case 'flight':
        return 'Détails du vol';
      case 'restaurant':
        return 'Détails du restaurant';
      default:
        return 'Détails';
    }
  }, [itemType]);

  const handleConfirm = useCallback(() => {
    console.log('[BookingModal] confirm pressed', { itemName, itemPrice, itemType });
    onClose();
  }, [onClose, itemName, itemPrice, itemType]);

  const styles = useMemo(() => StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20 + 8,
      borderColor: colors.border,
      borderWidth: 1,
      borderBottomWidth: 0,
    },
    grabber: {
      alignSelf: 'center',
      width: 44,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.backgroundLight,
      marginBottom: 12,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.backgroundLight,
    },
    block: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    blockTextWrap: { flex: 1 },
    blockTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
    blockSub: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    cta: {
      marginTop: 8,
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: 'center',
    },
    ctaText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '700' as const,
    },
  }), [colors]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay} testID="booking-modal-overlay">
        <View style={styles.sheet} testID="booking-modal-sheet">
          <View style={styles.grabber} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity accessibilityRole="button" onPress={onClose} style={styles.closeBtn} testID="booking-modal-close">
              <X color={colors.text} size={18} />
            </TouchableOpacity>
          </View>

          <View style={styles.block}>
            <Info color={colors.text} size={18} />
            <View style={styles.blockTextWrap}>
              <Text style={styles.blockTitle}>{itemName}</Text>
              <Text style={styles.blockSub}>{itemPrice}</Text>
            </View>
          </View>

          <View style={styles.block}>
            <Calendar color={colors.text} size={18} />
            <View style={styles.blockTextWrap}>
              <Text style={styles.blockTitle}>Dates flexibles</Text>
              <Text style={styles.blockSub}>Sélectionnez vos dates au prochain écran</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.cta} onPress={handleConfirm} testID="booking-modal-confirm">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <CreditCard color={colors.white} size={18} />
              <Text style={styles.ctaText}>Continuer</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
