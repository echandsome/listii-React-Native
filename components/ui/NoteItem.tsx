import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const BookmarkItem = ({ item, openMenuModal, handleToggleCart }) => {
  const { colors } = useTheme();
  const menuButtonRef = useRef(null);
  const [isNoteVisible, setIsNoteVisible] = useState(false);

  const toggleNoteVisibility = () => {
    setIsNoteVisible(!isNoteVisible);
  };

  return (
    <View style={[styles.itemContainer, { backgroundColor: colors.tabBg }]}>
      <View>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => handleToggleCart(item.id)}
              style={styles.checkboxContainer}
            >
              <Ionicons
                name={item.isCart ? 'checkbox-outline' : 'square-outline'}
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
            <View style={styles.itemDetails}>
              <Text
                style={[styles.name, { color: colors.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => openMenuModal(menuButtonRef, item.id)}
            ref={menuButtonRef}
          >
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.toggleButton, { backgroundColor: colors.background }]} onPress={toggleNoteVisibility}>
          <Text style={{ color: colors.text, fontSize: 12 }}>
            {isNoteVisible ? 'Hide Note' : 'Show Note'}
          </Text>
        </TouchableOpacity>

        {isNoteVisible && (
          <View style={styles.content}>
            <Text style={[styles.note, { color: colors.text }]}>
              {item.note}
            </Text>
          </View>
        )}
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
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  content: {
    marginTop: 5,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  itemDetails: {
    marginLeft: 10,
    flexShrink: 1,
    flexBasis: 'auto',
    flex: 1,
    overflow: 'hidden',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    wordWrap: 'break-word',
  },
  toggleButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start', // Aligns the button to the start (left)
    marginTop: 5,
    marginBottom: 5,
  },
});

export default BookmarkItem;