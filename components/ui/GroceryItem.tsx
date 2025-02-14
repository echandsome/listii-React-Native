import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const baseFontSize = Math.min(screenWidth, screenHeight) * 0.04;
const isSmallScreen = screenWidth < 375;

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
      {item.shop != '' ? (
        <Text
          style={[styles.shop, { backgroundColor: colors.badge, color: colors.badgeText }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.shop}
        </Text>
      ) : (
        <></>
      )}

      <View style={styles.header}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => handleToggleCart(item.id)} style={styles.checkboxContainer}>
            <Ionicons
              name={item.isCart ? "checkbox-outline" : "square-outline"}
              size={baseFontSize * 1.5}
              color={colors.text}
            />
          </TouchableOpacity>
          <View style={styles.itemDetails}>
            <Text style={[styles.name, { color: colors.text }]}>
              {item.name}
            </Text>
            {item.quantity > 1 ? (
              <>
                <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity} x R{item.price}</Text>
                <Text style={[styles.totalText, { color: colors.text }]}>Total: R{item.quantity * item.price}</Text>
              </>
            ) : (
              <Text style={[styles.priceText, { color: colors.text }]}>R{item.price}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={() => openMenuModal(menuButtonRef, item.id)} ref={menuButtonRef}>
          <Ionicons name="ellipsis-vertical" size={baseFontSize * 1.5} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: isSmallScreen ? 8 : 10,
    borderRadius: 8,
    marginBottom: 20,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  shop: {
    backgroundColor: '#ADD8E6',
    paddingVertical: isSmallScreen ? 2 : 3,
    paddingHorizontal: isSmallScreen ? 5 : 8,
    fontSize: baseFontSize * 0.9,
    position: 'absolute',
    top: -10,
    borderRadius: 13,
    maxWidth: isSmallScreen ? 80 : 100,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  checkboxContainer: {
    marginRight: isSmallScreen ? 5 : 10,
  },
  itemDetails: {
    marginLeft: isSmallScreen ? 5 : 10,
    flexShrink: 1,
  },
  name: {
    fontSize: baseFontSize * 1.1,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  quantityText: {
    fontSize: baseFontSize,
  },
  priceText: {
    fontSize: baseFontSize,
  },
  totalText: {
    fontSize: baseFontSize,
  }
});

export default GroceryItem;