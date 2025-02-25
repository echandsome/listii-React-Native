import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

interface AddItemGroceryModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (item: { name: string; price: string; quantity: string; shop: string }, mode: 'add' | 'edit') => void;
  mode: 'add' | 'edit';
  initialData?: { name: string; price: string; quantity: string; shop: string };
}

const AddItemGroceryModal: React.FC<AddItemGroceryModalProps> = ({ visible, onClose, onAddItem, mode, initialData }) => {
  const { colors } = useTheme();
  const styles = getModalStyles(colors);

  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [quantity, setQuantity] = useState(initialData?.quantity || '');
  const [shop, setShop] = useState(initialData?.shop || '');

  useEffect(() => {
    if (mode == 'edit' && initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price || '');
      setQuantity(initialData.quantity || '1');
      setShop(initialData.shop || '');
    } else {
      setName('');
      setPrice('');
      setQuantity('');
      setShop('');
    }
  }, [mode, initialData]);

  const handleAddItem = () => {
    let t_quantity = (quantity == '' || quantity == '0') ? '1' : quantity;
    let t_price = (price == '') ? '0' : price;
    onAddItem({ ...initialData, name, price: t_price, quantity: t_quantity, shop }, mode);

    setName('');
    setPrice('');
    setQuantity('');
    setShop('');

    onClose();
  };

  const handleModalPress = (event: any) => {
    if (event.target == event.currentTarget) {
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
            <Text style={[styles.modalTitle, { color: colors.text }]}>{mode == 'add' ? 'Add a new item' : 'Edit item'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButtonContainer}>
              <Text style={[styles.closeButton, { color: colors.text }]}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.modalDescription]}>
              Make changes to your list here. Click save when you're done.
          </Text>

          <View style={styles.modalBody}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Name</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
                placeholder="Item Name"
                placeholderTextColor={(styles.placeholder as any).color}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Price</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                value={price}
                onChangeText={handlePriceChange}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={(styles.placeholder as any).color}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Quantity</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                value={quantity}
                onChangeText={handleQuantityChange}
                placeholder="1"
                keyboardType="numeric"
                placeholderTextColor={(styles.placeholder as any).color}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Shop</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                value={shop}
                onChangeText={setShop}
                placeholder="Shop Name"
                placeholderTextColor={(styles.placeholder as any).color}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
              <Text style={styles.addItemButtonText}>{mode == 'add' ? 'Add item' : 'Save item'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const getModalStyles = (colors: any) => {

  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
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
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isSmallScreen ? 8 : 15,
    },
    modalTitle: {
      fontSize: baseFontSize * 1.1,
      fontWeight: 'bold',
      textAlign: 'left',
      flex: 1,
    },
    modalDescription: {
      marginBottom: isSmallScreen ? 10 : 20,
      textAlign: 'left',
      color: '#758295',
      fontSize: baseFontSize,
    },
    closeButtonContainer: {
      padding: isSmallScreen ? 4 : 8,
    },
    closeButton: {
      fontSize: baseFontSize * 1.2,
      ...Platform.select({
        ios: {
          fontWeight: '600',
        },
        android: {
          fontWeight: 'bold',
        },
      }),
    },
    modalBody: {
      marginBottom: isSmallScreen ? 8 : 15,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: isSmallScreen ? 5 : 10,
    },
    label: {
      fontSize: baseFontSize,
      marginBottom: 0,
      marginRight: 10,
      width: '25%', // Adjust as needed - Increased for longer labels
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 4,
      paddingVertical: isSmallScreen ? 6 : 8,
      paddingHorizontal: isSmallScreen ? 8 : 12,
      fontSize: baseFontSize,
    },
    placeholder: {
      color: '#999',
      fontSize: baseFontSize,
    },
    addItemButton: {
      backgroundColor: '#2962FF',
      paddingVertical: isSmallScreen ? 8 : 10,
      borderRadius: 5,
      paddingHorizontal: 10
    },
    addItemButtonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: baseFontSize,
    },
  });
}

export default AddItemGroceryModal;