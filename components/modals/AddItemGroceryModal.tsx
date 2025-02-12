import React, { useState, useEffect } from 'react';
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
import { Theme } from '@react-navigation/native';

interface AddItemGroceryModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (item: { name: string; price: string; quantity: string; shop: string }, mode: 'add' | 'edit') => void;
  mode: 'add' | 'edit';
  initialData?: { name: string; price: string; quantity: string; shop: string };
}

interface ModalStyles {
  modalOverlay: StyleProp<ViewStyle>;
  modalContent: StyleProp<ViewStyle>;
  modalHeader: StyleProp<ViewStyle>;
  modalTitle: StyleProp<TextStyle>;
  closeButton: StyleProp<TextStyle>;
  modalBody: StyleProp<ViewStyle>;
  label: StyleProp<TextStyle>;
  input: StyleProp<TextStyle>;
  addItemButton: StyleProp<ViewStyle>;
  addItemButtonText: StyleProp<TextStyle>;
}

const AddItemGroceryModal: React.FC<AddItemGroceryModalProps> = ({ visible, onClose, onAddItem, mode, initialData }) => {
  const { colors } = useTheme();
  const styles = getModalStyles(colors);

  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [quantity, setQuantity] = useState(initialData?.quantity || '');
  const [shop, setShop] = useState(initialData?.shop || '');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price || '');
      setQuantity(initialData.quantity || '');
      setShop(initialData.shop || '');
    } else {
      setName('');
      setPrice('');
      setQuantity('');
      setShop('');
    }
  }, [mode, initialData]);
  const handleAddItem = () => {
    onAddItem({ ...initialData, name, price, quantity, shop }, mode);
    onClose();
  };

  const handleModalPress = (event: any) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handlePriceChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPrice(numericValue);
  };

  const handleQuantityChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setQuantity(numericValue);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleModalPress}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{mode === 'add' ? 'Add a new item' : 'Edit item'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: colors.text }]}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={[styles.label, { color: colors.text }]}>Name</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={name}
              onChangeText={setName}
              placeholder="Item Name"
              placeholderTextColor={(styles.placeholder as any).color}
            />

            <Text style={[styles.label, { color: colors.text }]}>Price</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={price}
              onChangeText={handlePriceChange}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={(styles.placeholder as any).color}
            />

            <Text style={[styles.label, { color: colors.text }]}>Quantity</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={quantity}
              onChangeText={handleQuantityChange}
              placeholder="1"
              keyboardType="numeric"
              placeholderTextColor={(styles.placeholder as any).color}
            />

            <Text style={[styles.label, { color: colors.text }]}>Shop</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={shop}
              onChangeText={setShop}
              placeholder="Shop Name"
              placeholderTextColor={colors.text}
            />
          </View>

          <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
            <Text style={styles.addItemButtonText}>{mode === 'add' ? 'Add item' : 'Save item'}</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const getModalStyles = (colors: Theme['colors']): ModalStyles =>
  StyleSheet.create<ModalStyles>({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 8,
      width: '90%',
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    closeButton: {
      fontSize: 20,
    },
    modalBody: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderRadius: 4,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    placeholder: {
      color: '#999',
    },
    addItemButton: {
      backgroundColor: '#2962FF',
      paddingVertical: 12,
      borderRadius: 5,
    },
    addItemButtonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });

export default AddItemGroceryModal;