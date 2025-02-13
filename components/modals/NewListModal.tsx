import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Theme } from '@react-navigation/native'; // Import Theme type

import SelectInput from '@/components/ui/SelectInput';

interface NewListModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (list: { name: string; type: string }) => void;
}

interface ModalStyles {
  modalListOverlay: StyleProp<ViewStyle>;
  newListModalContent: StyleProp<ViewStyle>;
  newListModalHeader: StyleProp<ViewStyle>;
  newListModalTitle: StyleProp<TextStyle>;
  newListModalBody: StyleProp<ViewStyle>;
  label: StyleProp<TextStyle>;
  input: StyleProp<TextStyle>;
  placeholder: StyleProp<TextStyle>;
  newlist: StyleProp<ViewStyle>;
  newlistText: StyleProp<TextStyle>;
  textColor: StyleProp<TextStyle>;
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

  const handleModalPress = (event: any) => { //TODO: Type this event correctly
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
            {/* Must be wrapped in a Text component */}
            <Text style={[styles.newListModalTitle, styles.textColor]}>Add a new list</Text>
            {/* Must be wrapped in a Text component */}
            <TouchableOpacity onPress={onClose}>
              {/* Must be wrapped in a Text component */}
              <Text style={[styles.textColor, { fontSize: 20 }]}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.newListModalBody}>
            <Text style={[styles.textColor, styles.label]}>Name</Text>
            <TextInput
              style={[styles.input, styles.textColor]}
              value={listName}
              onChangeText={setListName}
              placeholder="List Name"
              placeholderTextColor={(styles.placeholder as any).color} // Assertion required because placeholder is a TextStyle but only the color property is used
            />

            {/* Using SelectInput component */}
            <SelectInput
              label="List Type"
              value={listType}
              options={listTypes}
              onSelect={handleSelectListType}
              colors={colors}
            />

            <TouchableOpacity style={styles.newlist} onPress={handleAddPress}>
              {/* Must be wrapped in a Text component */}
              <Text style={styles.newlistText}>Add List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};


const getModalStyles = (colors: Theme['colors']): ModalStyles =>
  StyleSheet.create<ModalStyles>({
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
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    newListModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    newListModalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    newListModalBody: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    placeholder: {
      color: '#999',
    },
    newlist: {
      backgroundColor: '#007bff',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 5,
      marginRight: 10,
    },
    newlistText: {
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
    },
    textColor: {
      color: colors.text,
    },
  });

export default NewListModal;