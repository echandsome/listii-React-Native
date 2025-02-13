import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

interface GroceryItemProps {
  item: {
    id: string;
    name: string;
    shop: string;
    price: number;
    quantity: number;
    isCart: boolean;
  };
  openMenuModal: (ref: React.RefObject<TouchableOpacity>, itemId: string) => void;
  handleToggleCart: (itemId: string) => void;
}

const GroceryItem: React.FC<GroceryItemProps> = ({ item, openMenuModal, handleToggleCart }) => {
  const { colors } = useTheme();
  const menuButtonRef = useRef(null);

  return (
    <View style={[styles.itemContainer, { backgroundColor: colors.tabBg }]}>
      <Text
        style={[styles.shop, { backgroundColor: colors.badge, color: colors.badgeText }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.shop}
      </Text>
      <View style={styles.header}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => handleToggleCart(item.id)} style={styles.checkboxContainer}>
            <Ionicons
              name={item.isCart ? "checkbox-outline" : "square-outline"}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <View style={styles.itemDetails}>
            <Text style={[styles.name, { color: colors.text }]}>
              {item.name}
            </Text>
            {item.quantity > 1 ? (
              <>
                <Text style={{ color: colors.text }}>{item.quantity} x R{item.price}</Text>
                <Text style={{ color: colors.text }}>Total: R{item.quantity * item.price}</Text>
              </>
            ) : (
              <Text style={{ color: colors.text }}>R{item.price}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={() => openMenuModal(menuButtonRef, item.id)} ref={menuButtonRef}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    paddingVertical: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  shop: {
    backgroundColor: '#ADD8E6', // Light blue
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 15,
    position: 'absolute',
    top: -10,
    borderRadius: 13,
    maxWidth: 100, // Add max width
    overflow: 'hidden', // Add overflow hidden
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  itemDetails: {
    marginLeft: 10,
    flexShrink: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
});

export default GroceryItem;