import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Platform,
  Keyboard,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import SelectInput from '@/components/ui/SelectInput';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

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
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true); // New state

  const listNameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setIsAddButtonDisabled(listName.length < 4);
  }, [listName]);

  useEffect(() => {
    if (visible && listNameInputRef.current) {
      listNameInputRef.current.focus();
    }
  }, [visible]);

  const handleSelectListType = (type: string) => {
    setListType(type);
  };

  const handleModalPress = (event: any) => {
    if (event.target == event.currentTarget) {
      onClose();
    }
  };

  const handleAddPress = useCallback(() => {
    Keyboard.dismiss(); // Dismiss keyboard before adding

    if (listName.length >= 4) { //Modified Validation
      onAdd({
        name: listName,
        type: listType.toLowerCase(),
      });
      setListName('');
      setListType('Grocery');
      onClose(); //Close modal after adding list
    }
  }, [listName, listType, onAdd, onClose]);

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
            <View style={styles.inputContainer}>
              <Text style={[styles.textColor, styles.label]}>Name</Text>
              <TextInput
                ref={listNameInputRef}
                style={[styles.input, styles.textColor]}
                value={listName}
                onChangeText={setListName}
                placeholder="List Name"
                placeholderTextColor={(styles.placeholder as any).color}
                onSubmitEditing={handleAddPress}
                returnKeyType="done"
              />
            </View>

            <SelectInput
              label="List Type"
              value={listType}
              options={listTypes}
              onSelect={handleSelectListType}
              colors={colors}
              style={{}}
            />

            <View style={{flexDirection: 'row', justifyContent: 'flex-end', zIndex: -1,}}>
              <TouchableOpacity
                style={[styles.newlist, isAddButtonDisabled ? styles.newlistDisabled : {}]} // Conditional style
                onPress={handleAddPress}
                disabled={isAddButtonDisabled} // Disabled prop
              >
                <Text style={styles.newlistText}>Add List</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const getModalStyles = (colors: any) => {

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
      textAlign: 'left',
      flex: 1,
    },
    newListModalBody: {
      marginBottom: isSmallScreen ? 8 : 15,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center', // Added to vertically align label and input
      marginBottom: isSmallScreen ? 5 : 10,
    },
    label: {
      fontSize: baseFontSize,
      marginRight: 10, // Added to create space between label and input
      width: '25%', // Adjust as needed for label width
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      paddingVertical: isSmallScreen ? 6 : 8,
      paddingHorizontal: isSmallScreen ? 8 : 12,
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
      marginTop: isSmallScreen ? 5 : 10, // Add some space above the
      zIndex: -1
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
    newlistDisabled: {
      opacity: 0.5, // Reduce opacity for visual indication
    },
  });
}
export default NewListModal;