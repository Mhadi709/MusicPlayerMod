import React from "react"; 
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from "react-native"; 
import { AntDesign, Ionicons, MaterialIcons, Feather, Octicons } from "@expo/vector-icons";


type AlertType = 'warning' | 'reminder' | 'error' | 'success' | 'delete';

export interface UniversalAlertProps {
  visible: boolean;
  type: AlertType;
  title: string;
  loading?: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function AlertIcon({ type }: { type: AlertType }) {
  switch (type) {
    case 'warning':
      return (
        <View style={[styles.iconCircle, styles.iconCircleWarning]}>
          <Ionicons name="warning-outline" size={22} color="#F59E0B" />
        </View>
      );
    case 'reminder':
      return (
        <View style={[styles.iconCircle, styles.iconCircleReminder]}>
          <Ionicons name="information-circle-outline" size={22} color="#60A5FA" />
        </View>
      );
    case 'error':
      return (
        <View style={[styles.iconCircle, styles.iconCircleError]}>
          <Ionicons name="warning-outline" size={22} color="#F87171" />
        </View>
      );
    case 'success':
      return (
        <View style={[styles.iconCircle, styles.iconCircleSuccess]}>
          <Feather name="check" size={22} color="#34D399" />
        </View>
      );
    case 'delete':
      return null;
    default:
      return null;
  }
}

export default function UniversalAlert({
  visible,
  type,
  title,
  message,
  confirmText,
  loading,
  cancelText,
  onConfirm,
  onCancel,
}: UniversalAlertProps) {
  const isWarning = type === 'warning';
  const isDelete = type === 'delete';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, isDelete && styles.cardDelete]}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeX} onPress={onCancel}>
            <AntDesign name="close" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Icon (not shown for delete) */}
          {!isDelete && (
            <View style={styles.iconWrapper}>
              <AlertIcon type={type} />
            </View>
          )}

          {/* Title */}
          <Text style={[styles.title, isDelete && styles.titleDelete]}>
            {title}
          </Text>

          {/* Message */}
          <Text style={[styles.message, isDelete && styles.messageDelete]}>
            {message}
          </Text>
          {/* Buttons */}
            {isDelete ? (
              <TouchableOpacity 
                style={styles.btnDeleteRow} 
                onPress={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#EF4444" />
                ) : (
                  <>
                    <Text style={styles.btnDeleteText}>{confirmText || "Yes, Delete"}</Text>
                    <Octicons name="trash" size={18} color="#EF4444" />
                  </>
                )}
              </TouchableOpacity>
          ) : isWarning ? (
            // Warning: two buttons side by side
            <View style={styles.rowButtons}>
              <TouchableOpacity style={[styles.btnMain, { flex: 1 }]} onPress={onConfirm}>
                <Text style={styles.btnMainText}>{confirmText || "OK"}</Text>
              </TouchableOpacity>
              {cancelText && (
                <TouchableOpacity style={[styles.btnCancel, { flex: 1 }]} onPress={onCancel}>
                  <Text style={styles.btnCancelText}>{cancelText}</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            // Reminder / Error / Success: single full-width black button
            <TouchableOpacity style={styles.btnMainFull} onPress={onConfirm}>
              <Text style={styles.btnMainText}>{confirmText || "OK"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card
  card: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    paddingTop: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    alignSelf: 'center',
  },
  cardDelete: {
    alignItems: 'flex-start', // delete card is left-aligned
    paddingTop: 24,
  },

  // Close X
  closeX: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 4,
    zIndex: 10,
  },

  // Icon
  iconWrapper: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleWarning: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  iconCircleReminder: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  iconCircleError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  iconCircleSuccess: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },

  // Title
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    width: '100%', 
    flexShrink: 1, 
  },
  titleDelete: {
    textAlign: 'left',
    fontSize: 17,
    marginBottom: 6,
  },

  // Message
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
   flexWrap: 'wrap', 
   width: '100%', 
  },
  messageDelete: {
    textAlign: 'left',
    marginBottom: 20,
    color: '#6B7280',
  },

  // Row buttons (Warning type)
  rowButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },

  // Main black button (shared)
  btnMain: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    flexShrink: 1, 
  },
  btnMainFull: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnMainText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    flexShrink: 1, 
  },

  // Cancel button (Warning type only)
  btnCancel: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnCancelText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 15,
  },

  // Delete button row
  btnDeleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  btnDeleteText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 15,
  },
});