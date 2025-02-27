import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
  Keyboard,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

interface EditListModalProps {
  visible: boolean;
  onClose: () => void;
  initialName?: string;
  onSave: (newName: string) => void;
}

const EditListModal: React.FC<EditListModalProps> = ({
  visible,
  onClose,
  initialName = '',
  onSave,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [name, setName] = useState(initialName);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  useEffect(() => {
    setIsSaveButtonDisabled(name.length < 4);
  }, [name]);

  useEffect(() => {
    if (visible && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 400);
    }
  }, [visible]);

  const handleSave = useCallback(() => {
    Keyboard.dismiss(); // Dismiss keyboard before save

    if (name.length >= 4) {
      onSave(name);
      onClose();
    }
  }, [name, onSave, onClose]);

  const handleBackdropPress = (event: any) => {
    if (event.target == event.currentTarget) {
      onClose();
    }
  };

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
            <Text style={[styles.modalTitle, styles.textColor]}>Edit list</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.modalDescription]}>
            Make changes to your list here. Click save when you're done.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, styles.textColor]}>Name</Text>
            <TextInput
              ref={nameInputRef}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]} // Added dynamic styles
              value={name}
              onChangeText={setName}
              placeholder="List Name"
              placeholderTextColor={(styles.placeholder as any).color}
              onSubmitEditing={handleSave}
              returnKeyType="done"
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={[styles.saveButton, isSaveButtonDisabled ? styles.saveButtonDisabled : {}]}
              onPress={handleSave}
              disabled={isSaveButtonDisabled}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
      // alignItems: 'flex-end',
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
      // padding: isSmallScreen ? 4 : 8,
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
    modalDescription: {
      marginBottom: isSmallScreen ? 10 : 20,
      textAlign: 'left',
      color: '#758295',
      fontSize: baseFontSize,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginBottom: isSmallScreen ? 10 : 20,
    },
    label: {
      fontSize: baseFontSize,
      marginRight: 10,
      width: '25%',
    },
    input: {
      flex: 1,
      height: 40,
      borderRadius: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
    },
    placeholder: {
      color: '#999',
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
    saveButtonDisabled: {
      opacity: 0.5,
    },
  });
};

export default EditListModal;