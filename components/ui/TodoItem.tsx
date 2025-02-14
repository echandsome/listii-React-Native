import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const baseFontSize = Math.min(screenWidth, screenHeight) * 0.04;
const isSmallScreen = screenWidth < 375;

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
    <View style={[styles.itemContainer, { backgroundColor: colors.tabBg, borderLeftColor: typeColors[item.priority] }]}>
      <View style={styles.row}>
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
            </View>
          </View>
          <TouchableOpacity onPress={() => openMenuModal(menuButtonRef, item.id)} ref={menuButtonRef}>
            <Ionicons name="ellipsis-vertical" size={baseFontSize * 1.5} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: isSmallScreen ? 8 : 10,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: isSmallScreen ? 3 : 5,
  },
  listCardIndicator: {
    width: isSmallScreen ? 5 : 8,
    height: '100%',
    borderRadius: 4,
    marginRight: isSmallScreen ? 8 : 16,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    flexBasis: 'auto',
  },
  name: {
    fontSize: baseFontSize * 1.1,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
});

export default TodoItem;