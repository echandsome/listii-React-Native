import React, { useState, useEffect, useCallback } from 'react';
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

  const handleBackdropPress = (event) => {
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

            <Text style={[styles.modalTitle, styles.textColor]}>Edit list</Text>
            <Text style={[styles.modalDescription, styles.textColor]}>
              Make changes to your list here. Click save when you're done.
            </Text>

            <Text style={[styles.label, styles.textColor]}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="List Name"
              placeholderTextColor={styles.placeholder.color}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: colors.text, // Ensure text color is dynamic
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholder: {
    color: '#999',
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

export default EditListModal;