import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { ExternalLink } from '../ExternalLink';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

interface BookmarkItemProps {
  item: {
    id: string;
    name: string;
    path?: string; // Optional path
    is_check: boolean;
  };
  openMenuModal: (ref: React.RefObject<TouchableOpacity>, itemId: string) => void;
  handleToggleCheck: (itemId: string) => void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ item, openMenuModal, handleToggleCheck }) => {
  const { colors } = useTheme();
  const menuButtonRef = useRef<TouchableOpacity>(null);

  return (
    <View style={[styles.itemContainer, { backgroundColor: colors.tabBg }]}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.header}>
          <View style={styles.content}>
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

              {item.path && item.path.startsWith('http') ? (
                <ExternalLink href={item.path} style={styles.button}>
                  <Text style={styles.buttonText}>Open link </Text>
                  <Ionicons name="open-outline" size={baseFontSize} color="white" />
                </ExternalLink>
              ) : (
                <View style={styles.noLinkButton}>
                  <Text style={styles.noLinkButtonText}>No link</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={{ alignSelf: 'flex-start' }}
            onPress={() => openMenuModal(menuButtonRef, item.id)}
            ref={menuButtonRef}
          >
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
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? 5 : 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    flexWrap: 'nowrap',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#9333EA',
    paddingVertical: isSmallScreen ? 3 : 5,
    paddingHorizontal: isSmallScreen ? 10 : 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: baseFontSize,
    fontWeight: 'bold',
    marginRight: 5,
  },
  noLinkButton: {
    width: isSmallScreen ? 70 : 100,
    backgroundColor: '#4A148C',
    paddingVertical: isSmallScreen ? 3 : 5,
    paddingHorizontal: isSmallScreen ? 10 : 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 10,
  },
  noLinkButtonText: {
    color: 'white',
    fontSize: baseFontSize,
    fontWeight: 'bold',
  },
});

export default BookmarkItem;