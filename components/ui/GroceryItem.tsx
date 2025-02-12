import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const GroceryItem = ({ item, openMenuModal, handleToggleCart }) => {
  const { colors } = useTheme();
  const menuButtonRef = useRef(null);

  return (
    <View style={[styles.itemContainer, { backgroundColor: colors.tabBg }]}>
        <Text style={[styles.shop, { backgroundColor: colors.badge, color: colors.badgeText }]}>{item.shop}</Text>
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
                    <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
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
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical:  10
  },
  shop: {
    backgroundColor: '#ADD8E6', // Light blue
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 15,
    position: 'absolute',
    top: -10,
    borderRadius: 13,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  itemDetails: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GroceryItem;