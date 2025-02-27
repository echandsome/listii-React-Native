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
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { baseFontSize, isSmallScreen } from '@/constants/Config';

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
  const [email, setEmail] = useState('');
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const emailInputRef = useRef<TextInput>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    setIsSaveButtonDisabled(!emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    if (visible && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 400);
    }
  }, [visible]);


  const handleSave = useCallback(() => {
    if (emailRegex.test(email) && !isSaveButtonDisabled) { // Add check for isSaveButtonDisabled
      onSave(email);
      onClose();
      setEmail('');
    }
  }, [email, onSave, onClose, isSaveButtonDisabled]);

  const handleBackdropPress = (event: any) => {
    if (event.target == event.currentTarget) {
      onClose();
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handleEnterPress = () => {
    if (!isSaveButtonDisabled) { // Prevent save if the button is disabled
      handleSave();
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
            <Text style={[styles.modalTitle, styles.textColor]}>Share list</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

          </View>

          <Text style={[styles.modalDescription]}>
            Enter the email of the person you'd like to share your list with.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, styles.textColor]}>Name</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: 'transparent' }]} // Added dynamic styles
              value={initialName}
              readOnly={true}
              placeholderTextColor={(styles.placeholder as any).color}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, styles.textColor]}>Email</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]} // Added dynamic styles
              value={email}
              onChangeText={handleEmailChange}
              placeholder="Email"
              placeholderTextColor={(styles.placeholder as any).color}
              onSubmitEditing={handleEnterPress} // Handle Enter Key Press
              returnKeyType="done" // Adjust return key type as needed
              blurOnSubmit={false} //Prevent keyboard from dismissing
              ref={emailInputRef}
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