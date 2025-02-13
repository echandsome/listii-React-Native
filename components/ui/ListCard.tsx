import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform, // Import Platform
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Define types for better type safety
interface List {
  id: string;
  name: string;
  type: 'Note' | 'Bookmark' | 'ToDo' | 'Grocery';
  [key: string]: any; // Allow for other properties
}

interface ListCardProps {
  list: List;
  openMenuModal: (ref: React.RefObject<TouchableOpacity>, listId: string) => void;
}

interface Styles {
  listCard: StyleProp<ViewStyle>;
  listCardIndicator: StyleProp<ViewStyle>;
  listCardTitle: StyleProp<TextStyle>;
  listCardItemCount: StyleProp<TextStyle>;
  listCardMenuButton: StyleProp<ViewStyle>;
  listCardTotal: StyleProp<TextStyle>;
  listCardHeader: StyleProp<ViewStyle>;
  listItemMenuIcon: StyleProp<ViewStyle>;
  textColor: StyleProp<TextStyle>;
}

const ListCard: React.FC<ListCardProps> = ({ list, openMenuModal }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const menuButtonRef = useRef<TouchableOpacity>(null);
  const navigation = useNavigation();

  const typeColors: { [key in List['type']]: string } = {
    Note: '#FFDA61',
    Bookmark: '#D0BCFF',
    ToDo: '#96E6A6',
    Grocery: '#79B4FF',
  };

  const itemCount = (): string => {
    switch (list.type) {
      case 'Note':
        return '3 notes';
      case 'Bookmark':
        return '0 bookmarks';
      case 'ToDo':
        return '4 tasks';
      case 'Grocery':
        return '0 items';
      default:
        return '0 items';
    }
  };

  const movePage = () => {
    navigation.navigate('listDetail', {
      ...list
    });
  };

  return (
    <TouchableOpacity style={[styles.listCard]} onPress={movePage} activeOpacity={0.7}>
      <View style={[styles.listCardIndicator, { backgroundColor: typeColors[list.type] }]} />
      <View style={{ flex: 1 }} >
        <View style={styles.listCardHeader}>
          <Text style={[styles.listCardItemCount, styles.textColor]}>{itemCount()}</Text>
          <TouchableOpacity
            style={styles.listCardMenuButton}
            onPress={() => openMenuModal(menuButtonRef, list.id)}
            ref={menuButtonRef} // Attach the ref
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touch target for iOS
          >
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={[styles.listCardTitle, styles.textColor]}>{list.name}</Text>
          {list.type === 'Grocery' && <Text style={[styles.textColor, styles.listCardTotal]}>List total: R0</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors: any): Styles =>
  StyleSheet.create({
    listCard: {
      backgroundColor: colors.tabBg,
      borderRadius: 8,
      padding: 16,
      marginBottom: 10,
      flexDirection: 'row',
      // Shadow properties for iOS
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      // Elevation for Android
      elevation: 3,
    },
    listCardIndicator: {
      width: 8,
      height: '100%',
      borderRadius: 4,
      marginRight: 16,
    },
    listCardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    listCardItemCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    listCardMenuButton: {
       // Increased padding for a bigger touch target
      padding: 0,
    },
    listCardTotal: {
      fontSize: 14,
      marginTop: 5,
    },
    listCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    listItemMenuIcon: {
      width: 20,
      height: 20,
      marginRight: 10,
    },
    textColor: {
      color: colors.text,
    },
  });

export default ListCard;