import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

interface BookmarkItemProps {
  item: {
    id: string;
    name: string;
    note: string;
    is_check: boolean;
  };
  openMenuModal: (ref: React.RefObject<TouchableOpacity>, itemId: string) => void;
  handleToggleCheck: (itemId: string) => void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ item, openMenuModal, handleToggleCheck }) => {
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
              onPress={() => handleToggleCheck(item.id)}
              style={styles.checkboxContainer}
            >
              <Ionicons
                name={item.is_check ? 'checkbox-outline' : 'square-outline'}
                size={baseFontSize * 1.5}
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
            <Ionicons name="ellipsis-vertical" size={baseFontSize * 1.5} color={colors.text} />
          </TouchableOpacity>
        </View>
        {isNoteVisible && (
          <View style={styles.content}>
            <Text style={[styles.note, { color: colors.text }]}>
              {item.note}
            </Text>
          </View>
        )}
        <TouchableOpacity style={[styles.toggleButton, { backgroundColor: colors.background }]} onPress={toggleNoteVisibility}>
          <Text style={[styles.toggleButtonText, { color: colors.text }]}>
            {isNoteVisible ? 'Hide Note' : 'Show Note'}
          </Text>
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
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? 5 : 10,
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
    marginRight: isSmallScreen ? 5 : 10,
  },
  itemDetails: {
    marginLeft: isSmallScreen ? 5 : 10,
    flexShrink: 1,
    flexBasis: 'auto',
    flex: 1,
    overflow: 'hidden',
  },
  name: {
    fontSize: baseFontSize * 1.1,
    fontWeight: 'bold',
  },
  note: {
    fontSize: baseFontSize,
    lineHeight: 20,
    wordWrap: 'break-word',
  },
  toggleButton: {
    paddingVertical: isSmallScreen ? 3 : 5,
    paddingHorizontal: isSmallScreen ? 5 : 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
    marginBottom: 5,
  },
  toggleButtonText: {
    fontSize: baseFontSize * 0.8,
  },
});

export default BookmarkItem;