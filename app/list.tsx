import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  UIManager,
  ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'expo-router';
import 'react-native-get-random-values'; // Import this line
import { v4 as uuidv4 } from 'uuid'; // Import the UUID generator
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import { useColorScheme } from '@/hooks/useColorScheme';
import ThemeModal from '@/components/modals/ThemeModal';
import NewListModal from '@/components/modals/NewListModal'; // Import NewListModal
import ListCard from '@/components/ui/ListCard'; // Import ListCard
import ListItemMenuModal from '@/components/modals/ListItemMenuModal'; // Import the modal
import ListItemEditModal from '@/components/modals/ListItemEditModal';
import ListItemDeleteModal from '@/components/modals/ListItemDeleteModal';
import ListItemShareModal from '@/components/modals/ListItemShareModal';
import ListItemArchiveModal from '@/components/modals/ListItemArchiveModal';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function ListScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [activeTab, setActiveTab] = useState('Lists');
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const colorScheme = useColorScheme();

  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const [isNewListModalVisible, setIsNewListModalVisible] = useState(false);
  const [lists, setLists] = useState([

  ]); // Example list data

  const handleToggleTheme = (event: any) => {
    if (event == "system") event = colorScheme;
    dispatch(toggleTheme(event));
  };

  const openThemeModal = () => {
    setIsThemeModalVisible(true);
  };

  const closeThemeModal = () => {
    setIsThemeModalVisible(false);
  };

  const onButtonLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setButtonLayout({ x, y, width, height });
  };

  const handleTabPress = (tabName: any) => {
    setActiveTab(tabName);
  };

  const openNewListModal = () => {
    setIsNewListModalVisible(true);
  };

  const closeNewListModal = () => {
    setIsNewListModalVisible(false);
  };

  const handleAddNewList = (newList: any) => {
    // Generate a unique ID using UUID
    const newListWithId = {
      ...newList,
      id: uuidv4(), // Add the unique ID to the new list object
    };
  
    setLists([...lists, newListWithId]);
    closeNewListModal();
  };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [listName, setListName] = useState('My List');

  const handleSave = (newName: any) => {
    setListName(newName);
    setEditModalVisible(false);
  };

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDelete = () => {
    setDeleteModalVisible(false);
  };

  const [archiveModalVisible, setArchiveModalVisible] = useState(false);

  const handleArchive = () => {
    setArchiveModalVisible(false);
  };

  const [shareModalVisible, setShareModalVisible] = useState(false);

  const handleShare = () => {
    setShareModalVisible(false);
  };

  const handleItemMenu = (data: any) => {
    if (data.type == 'edit') setEditModalVisible(true);
    else if (data.type == 'delete') setDeleteModalVisible(true)
      else if (data.type == 'share') setShareModalVisible(true)
        else if (data.type == 'archive') setArchiveModalVisible(true)
  }

  return (
    <SafeAreaView style={[styles.container, styles.bgColor]}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            <Link href='/'>
              <Text style={[styles.title, styles.textColor]}>Listii</Text>
            </Link>
            <TouchableOpacity style={styles.newlist} onPress={openNewListModal}>
              <Text style={styles.newlistText}>+ New List</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.signout}>
              <Text style={styles.signoutText}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.themeToggleButton} onPress={openThemeModal} onLayout={onButtonLayout}>
              <Text>{
                themeMode == 'light' ? (
                  <Image
                    source={require('@/assets/images/light.png')}
                    style={styles.themeToggleImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require('@/assets/images/dark.png')}
                    style={styles.themeToggleImage}
                    resizeMode="contain"
                  />
                )
              }</Text>
            </TouchableOpacity>

            <ThemeModal
              visible={isThemeModalVisible}
              onClose={closeThemeModal}
              setTheme={handleToggleTheme}
              buttonLayout={buttonLayout}
            />
          </View>
          <NewListModal
            visible={isNewListModalVisible}
            onClose={closeNewListModal}
            onAdd={handleAddNewList}
          />
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'Lists' && styles.activeTabButton,
            ]}
            onPress={() => handleTabPress('Lists')}
          >
            <Text
              style={[
                styles.tabText,
                styles.textColor,
                activeTab === 'Lists' && styles.activeTabText,
              ]}
            >
              {lists.length} Lists
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'Archive' && styles.activeTabButton,
            ]}
            onPress={() => handleTabPress('Archive')}
          >
            <Text
              style={[
                styles.tabText,
                styles.textColor,
                activeTab === 'Archive' && styles.activeTabText,
              ]}
            >
              0 Archive
            </Text>
          </TouchableOpacity>
        </View>

        {/* List Content Here */}
        <View>
          {
            activeTab == 'Lists' ? (
              <View>
                {lists.map((list, index) => (
                  <ListCard key={index} list={list} /> // Use list.id as the key
                ))}
              </View>
            ) : (
              <View>
                {/* Archive Content */}
              </View>
            )
          }
        </View>
      </ScrollView>

      <ListItemMenuModal 
        onItemPress={handleItemMenu}
      />
      <ListItemEditModal 
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        initialName={listName}
        onSave={handleSave}
      />
      <ListItemDeleteModal 
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={handleDelete}
      />
      <ListItemShareModal 
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        onShare={handleShare}
      />
      <ListItemArchiveModal 
        visible={archiveModalVisible}
        onClose={() => setArchiveModalVisible(false)}
        onArchive={handleArchive}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Use theme background color
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      alignItems: 'center',
    },
    scrollContainer: {
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingTop: 15,
    },
    headerLogo: {
      flexDirection: 'row',
      gap: 10,
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    newlist: {
      backgroundColor: '#007bff',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 5,
      marginRight: 10,
    },
    newlistText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    signout: {
      backgroundColor: '#ddd',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 5,
      marginRight: 10,
    },
    signoutText: {
      color: '#333',
      fontWeight: 'bold',
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.tabBg,
      borderRadius: 8,
      overflow: 'hidden',
      marginVertical: 10,
      alignSelf: 'flex-start',
      width: 200,
      padding: 5
    },
    tabButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      backgroundColor: colors.tabBg, // Theme card color
    },
    activeTabButton: {
      backgroundColor: colors.background, // Theme primary color for active tab
    },
    tabText: {
      fontSize: 16,
      color: colors.text, // Theme text color
    },
    activeTabText: {
      fontWeight: 'bold',
      color: colors.text, // Theme text color for active tab
    },
    //Theme
    bgColor: {
      backgroundColor: colors.background,
    },
    textColor: {
      color: colors.text,
    },
    themeToggleButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      borderRadius: 5,
    },
    themeToggleImage: {

    },
    modalListOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    // List Card Styles
    listCard: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 10,
      flexDirection: 'row',
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

    },
    listCardTotal: {
      fontSize: 14,
      marginTop: 5,
    },
    listCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
  });