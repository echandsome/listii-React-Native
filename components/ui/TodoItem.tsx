import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

interface TodoItemProps {
  item: {
    id: string;
    name: string;
    isCart: boolean;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent'; // Define possible priority values
  };
  openMenuModal: (ref: React.RefObject<TouchableOpacity>, itemId: string) => void;
  handleToggleCart: (itemId: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ item, openMenuModal, handleToggleCart }) => {
  const { colors } = useTheme();
  const menuButtonRef = useRef<TouchableOpacity>(null);

  const typeColors = {
    Low: '#26428E',
    Medium: '#1E8445',
    High: '#EAB512',
    Urgent: '#C2410C',
  };

  return (
    <View style={[styles.itemContainer, { backgroundColor: colors.tabBg }]}>
      <View style={styles.row}>
        <View style={[styles.listCardIndicator, { backgroundColor: typeColors[item.priority] }]} />
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
            </View>
          </View>
          <TouchableOpacity onPress={() => openMenuModal(menuButtonRef, item.id)} ref={menuButtonRef}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  row: { // Added row style
    flexDirection: 'row',
    paddingVertical: 5
  },
  listCardIndicator: {
    width: 8,
    height: '100%',
    borderRadius: 4,
    marginRight: 16,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Changed to flex-start
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1, // Added flexShrink to content
  },
  checkboxContainer: {
    marginRight: 10,
  },
  itemDetails: {
    marginLeft: 10,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flexWrap: 'wrap', // Add flexWrap to allow text to wrap
  },
});

export default TodoItem;