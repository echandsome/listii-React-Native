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
import { useSelector } from 'react-redux';
import { useTheme, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

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
  const menuButtonRef = useRef(null);
  const navigation = useNavigation();

  let listItems ;
  switch (list.type) {
    case 'Note':
      listItems = useSelector((state: any) => state.note.listitems[list.id]);
      break;
    case 'Bookmark':
      listItems = useSelector((state: any) => state.bookmark.listitems[list.id]);
      break;
    case 'ToDo':
      listItems = useSelector((state: any) => state.todo.listitems[list.id]);
      break;
    case 'Grocery':
      listItems = useSelector((state: any) => state.grocery.listitems[list.id]);
      break;
  }
  if (!listItems) listItems = [];

  const typeColors: { [key in List['type']]: string } = {
    Note: '#FFDA61',
    Bookmark: '#D0BCFF',
    ToDo: '#96E6A6',
    Grocery: '#79B4FF',
  };

  const itemCount = (): string => {
    switch (list.type) {
      case 'Note':
        return listItems.length + ' notes';
      case 'Bookmark':
        return listItems.length + ' bookmarks';
      case 'ToDo':
        return listItems.length + ' tasks';
      case 'Grocery':
        return listItems.length + ' items';
      default:
        return listItems.length + ' items';
    }
  };

  const totalPrice = () => {
    return listItems.reduce((sum: any, item: any) =>{
      if (!item.is_check)
        return sum + (parseFloat(item.price) * parseInt(item.quantity));
      else
        return sum + 0;
    }, 0)
  }

  const movePage = () => {
    navigation.navigate('listDetail', {
      ...list
    });
  };

  return (
    <TouchableOpacity style={[styles.listCard, { borderLeftColor: typeColors[list.type] }]} onPress={movePage} activeOpacity={0.7}>
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
          {list.type === 'Grocery' && <Text style={[styles.textColor, styles.listCardTotal]}>List total: R{totalPrice()}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors: any): Styles => {

  return StyleSheet.create({
    listCard: {
      backgroundColor: colors.tabBg,
      borderRadius: 8,
      padding: 16,
      marginBottom: 10,
      flexDirection: 'row',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
        },
        android: {
          elevation: 3, // Android shadow
        },
        web: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)', // Web shadow
        },
      }),
      borderLeftWidth: 5,
    },
    listCardTitle: {
      fontSize: baseFontSize * 1.2, // Responsive title
      fontWeight: 'bold',
    },
    listCardItemCount: {
      fontSize: baseFontSize, // Responsive item count
      color: colors.textSecondary,
    },
    listCardMenuButton: {
      padding: 0, // Increased padding for a bigger touch target
    },
    listCardTotal: {
      fontSize: baseFontSize, // Responsive total
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
};

export default ListCard;