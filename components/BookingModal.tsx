import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Calendar, Users, CreditCard, Check } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '@/constants/theme';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  itemName: string;
  itemPrice: string | number;
  itemType: 'hotel' | 'activity' | 'restaurant';
  onConfirm?: (bookingData: BookingData) => void;
}

export interface BookingData {
  date: Date;
  guests: number;
  notes: string;
  paymentMethod: 'card' | 'paypal' | 'later';
}

export default function BookingModal({
  visible,
  onClose,
  itemName,
  itemPrice,
  itemType,
  onConfirm,
}: BookingModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [guests, setGuests] = useState<string>('2');
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'later'>('card');

  const formatDate = (d: Date): string => {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    const guestCount = parseInt(guests);
    if (isNaN(guestCount) || guestCount < 1) {
      Alert.alert('Nombre de personnes', 'Veuillez entrer un nombre valide.');
      return;
    }

    const bookingData: BookingData = {
      date,
      guests: guestCount,
      notes,
      paymentMethod,
    };

    if (onConfirm) {
      onConfirm(bookingData);
    }

    Alert.alert(
      'Réservation confirmée !',
      `${itemName}\n\nDate: ${formatDate(date)}\nPersonnes: ${guestCount}\nPrix: ${itemPrice}\n\n✓ Confirmation envoyée par email`,
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const getTitle = () => {
    switch (itemType) {
      case 'hotel':
        return 'Réserver l\'hôtel';
      case 'activity':
        return 'Réserver l\'activité';
      case 'restaurant':
        return 'Réserver une table';
      default:
        return 'Réservation';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={[theme.colors.backgroundDark, theme.colors.background]}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{getTitle()}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color={theme.colors.text} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{itemName}</Text>
              <Text style={styles.itemPrice}>{itemPrice}</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Calendar color={theme.colors.textLight} size={20} />
                <Text style={styles.dateText}>{formatDate(date)}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Nombre de personnes</Text>
              <View style={styles.inputContainer}>
                <Users color={theme.colors.textLight} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="2"
                  placeholderTextColor={theme.colors.textLight}
                  value={guests}
                  onChangeText={setGuests}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Méthode de paiement</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'card' && styles.paymentOptionActive,
                  ]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <CreditCard
                    color={
                      paymentMethod === 'card'
                        ? theme.colors.white
                        : theme.colors.text
                    }
                    size={20}
                  />
                  <Text
                    style={[
                      styles.paymentText,
                      paymentMethod === 'card' && styles.paymentTextActive,
                    ]}
                  >
                    Carte
                  </Text>
                  {paymentMethod === 'card' && (
                    <Check color={theme.colors.white} size={18} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'paypal' && styles.paymentOptionActive,
                  ]}
                  onPress={() => setPaymentMethod('paypal')}
                >
                  <Text
                    style={[
                      styles.paymentText,
                      paymentMethod === 'paypal' && styles.paymentTextActive,
                    ]}
                  >
                    PayPal
                  </Text>
                  {paymentMethod === 'paypal' && (
                    <Check color={theme.colors.white} size={18} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'later' && styles.paymentOptionActive,
                  ]}
                  onPress={() => setPaymentMethod('later')}
                >
                  <Text
                    style={[
                      styles.paymentText,
                      paymentMethod === 'later' && styles.paymentTextActive,
                    ]}
                  >
                    Plus tard
                  </Text>
                  {paymentMethod === 'later' && (
                    <Check color={theme.colors.white} size={18} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Notes (optionnel)</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Ajoutez des demandes spéciales..."
                  placeholderTextColor={theme.colors.textLight}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.confirmGradient}
              >
                <Text style={styles.confirmText}>Confirmer la réservation</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingTop: theme.spacing.lg,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  modalTitle: {
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
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  itemInfo: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  itemName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  itemPrice: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  formSection: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  dateText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    paddingVertical: theme.spacing.xs,
  },
  paymentOptions: {
    gap: theme.spacing.sm,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
  paymentOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  paymentText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  paymentTextActive: {
    color: theme.colors.white,
  },
  textAreaContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  textArea: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  confirmButton: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  confirmGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
});
