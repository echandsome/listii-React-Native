import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { ExternalLink } from '../ExternalLink';

interface BookmarkItemProps {
  item: {
    id: string;
    name: string;
    path?: string; // Optional path
    isCart: boolean;
  };
  openMenuModal: (ref: React.RefObject<TouchableOpacity>, itemId: string) => void;
  handleToggleCart: (itemId: string) => void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ item, openMenuModal, handleToggleCart }) => {
  const { colors } = useTheme();
  const menuButtonRef = useRef<TouchableOpacity>(null);

  return (
    <View style={[styles.itemContainer, { backgroundColor: colors.tabBg }]}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.header}>
          <View style={styles.content}>
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

              {item.path && item.path.startsWith('http') ? (
                <ExternalLink href={item.path} style={styles.button}>
                  <Text style={styles.buttonText}>Open link </Text>
                  <Ionicons name="open-outline" size={18} color="white" />
                </ExternalLink>
              ) : (
                <View style={styles.noLinkButton}>
                  <Text style={styles.noLinkButtonText}>No link</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={{alignSelf: 'flex-start'}}
            onPress={() => openMenuModal(menuButtonRef, item.id)}
            ref={menuButtonRef}
          >
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
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Changed to center
    paddingVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Added flex: 1
    flexShrink: 1, // Add flexShrink to content
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
    flexWrap: 'nowrap', // Disable wrapping
  },
  button: {
    width: 130,
    flexDirection: 'row',
    backgroundColor: '#9333EA',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  noLinkButton: {
    width: 100,
    backgroundColor: '#4A148C', // Darker purple color
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
  },
  noLinkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookmarkItem;