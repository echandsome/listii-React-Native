import React, { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSave = useCallback(() => {
    onSave(name);
    onClose();
  }, [name, onSave, onClose]);

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
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Text style={[styles.modalTitle, styles.textColor]}>Edit list</Text>
          <Text style={[styles.modalDescription, styles.textColor]}>
            Make changes to your list here. Click save when you're done.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, styles.textColor]}>Name</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]} // Added dynamic styles
              value={name}
              onChangeText={setName}
              placeholder="List Name"
              placeholderTextColor={(styles.placeholder as any).color}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
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
      alignItems: 'center',
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
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: isSmallScreen ? 4 : 8,
    },
    closeButtonText: {
      fontSize: baseFontSize * 1.5,
      fontWeight: 'bold',
      color: 'grey',
    },
    modalTitle: {
      fontSize: baseFontSize * 1.2,
      fontWeight: 'bold',
      marginBottom: isSmallScreen ? 5 : 10,
      textAlign: 'center',
    },
    modalDescription: {
      marginBottom: isSmallScreen ? 10 : 20,
      textAlign: 'center',
      color: '#555',
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
  });
};

export default EditListModal;