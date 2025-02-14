import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Dimensions,
  Platform
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import SelectInput from '@/components/ui/SelectInput';

interface NewListModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (list: { name: string; type: string }) => void;
}

const NewListModal: React.FC<NewListModalProps> = ({ visible, onClose, onAdd }) => {
  const { colors } = useTheme();
  const styles = getModalStyles(colors);

  const [listName, setListName] = useState('');
  const [listType, setListType] = useState('Grocery');
  const listTypes = ['Grocery', 'ToDo', 'Bookmark', 'Note'];

  const handleSelectListType = (type: string) => {
    setListType(type);
  };

  const handleModalPress = (event: any) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleAddPress = () => {
    if (listName !== '') {
      onAdd({
        name: listName,
        type: listType,
      });
      setListName('');
      setListType('Grocery');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalListOverlay} onPress={handleModalPress}>
        <View style={styles.newListModalContent}>
          <View style={styles.newListModalHeader}>
            <Text style={[styles.newListModalTitle, styles.textColor]}>Add a new list</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.textColor, styles.closeButton]}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.newListModalBody}>
            <Text style={[styles.textColor, styles.label]}>Name</Text>
            <TextInput
              style={[styles.input, styles.textColor]}
              value={listName}
              onChangeText={setListName}
              placeholder="List Name"
              placeholderTextColor={(styles.placeholder as any).color}
            />

            <SelectInput
              label="List Type"
              value={listType}
              options={listTypes}
              onSelect={handleSelectListType}
              colors={colors}
              style={{}}
            />

            <TouchableOpacity style={styles.newlist} onPress={handleAddPress}>
              <Text style={styles.newlistText}>Add List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const getModalStyles = (colors: any) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const baseFontSize = Math.min(screenWidth, screenHeight) * 0.04;
  const isSmallScreen = screenWidth < 375;

  return StyleSheet.create({
    modalListOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    newListModalContent: {
      backgroundColor: colors.background,
      borderRadius: 8,
      width: '80%',
      maxWidth: 400,
      padding: isSmallScreen ? 10 : 20,
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
    },
    newListModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isSmallScreen ? 8 : 15,
    },
    newListModalTitle: {
      fontSize: baseFontSize * 1.2,
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1,
    },
    newListModalBody: {
      marginBottom: isSmallScreen ? 8 : 15,
    },
    label: {
      fontSize: baseFontSize,
      marginBottom: isSmallScreen ? 3 : 5,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      paddingVertical: isSmallScreen ? 6 : 8,
      paddingHorizontal: isSmallScreen ? 8 : 12,
      marginBottom: isSmallScreen ? 5 : 10,
      fontSize: baseFontSize,
      color: colors.text,
    },
    placeholder: {
      color: '#999',
      fontSize: baseFontSize,
    },
    newlist: {
      backgroundColor: '#007bff',
      paddingVertical: isSmallScreen ? 8 : 10,
      paddingHorizontal: isSmallScreen ? 12 : 16,
      borderRadius: 5,
      alignSelf: 'center', // Center the button
      marginTop: isSmallScreen ? 5 : 10, // Add some space above the button
    },
    newlistText: {
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: baseFontSize,
    },
    textColor: {
      color: colors.text,
    },
    closeButton: {
      fontSize: baseFontSize * 1.5,
      fontWeight: 'bold',
    },
  });
}
export default NewListModal;