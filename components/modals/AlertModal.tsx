import React, { useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

interface LogoutModalProps {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  title,
  content,
  onConfirm,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const handleLogout = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  const handleBackdropPress = (event: any) => {
    if (event.target == event.currentTarget) {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalListOverlay} onPress={handleBackdropPress}>
        <View style={[styles.modalView]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, styles.textColor]}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          {content != null && content != '' ? (
            <Text style={[styles.modalcontent, styles.textColor]}>{content}</Text>
          ) : (
            <View style={{ paddingVertical: 10 }}></View>
          )}
          <View style={styles.btnGroup}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleLogout}>
              <Text style={styles.saveButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const getStyles = (colors: any) => {

  return StyleSheet.create({
    modalListOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: isSmallScreen ? 10 : 20,
      // alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        android: {
          elevation: 5, // Android shadow
        },
        web: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)', // Web shadow
        },
      }),
      width: '80%',
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isSmallScreen ? 8 : 15,
    },
    closeButton: {
    },
    closeButtonText: {
      fontSize: baseFontSize * 1.5,
      fontWeight: 'bold',
      color: 'grey',
    },
    modalTitle: {
      fontSize: baseFontSize * 1.2,
      fontWeight: 'bold',
      textAlign: 'left',
    },
    modalcontent: {
      marginBottom: isSmallScreen ? 10 : 20,
      color: '#555',
      fontSize: baseFontSize,
    },
    btnGroup: {
      flexDirection: 'row',
      gap: isSmallScreen ? 5 : 10,
      justifyContent: 'flex-end'
    },
    cancelButton: {
      borderRadius: 5,
      paddingVertical: isSmallScreen ? 6 : 10,
      paddingHorizontal: isSmallScreen ? 10 : 20,
      elevation: 2,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      color: colors.text,
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: baseFontSize,
    },
    saveButton: {
      backgroundColor: '#2962FF',
      borderRadius: 5,
      paddingVertical: isSmallScreen ? 6 : 10,
      paddingHorizontal: isSmallScreen ? 10 : 20,
      elevation: 2,
    },
    saveButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: baseFontSize,
    },
    textColor: {
      color: colors.text,
    },
  });
};

export default LogoutModal;