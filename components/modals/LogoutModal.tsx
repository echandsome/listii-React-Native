import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable
} from 'react-native';
import { useTheme } from '@react-navigation/native';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  onLogout,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const handleLogout = useCallback(() => {
    onLogout();
    onClose();
  }, [onLogout, onClose]);

  const handleBackdropPress = (event: any) => {
    if (event.target === event.currentTarget) {
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
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={[styles.modalTitle, styles.textColor]}>Are you absolutely sure?</Text>
            <View style={{paddingVertical: 10}}></View>

            <View style={styles.btnGroup}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleLogout}>
                <Text style={styles.saveButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
      </Pressable>
    </Modal>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  modalListOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxWidth: 400,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'grey',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 10
  },
  cancelButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#2962FF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textColor: {
    color: colors.text,
  }
});

export default LogoutModal;