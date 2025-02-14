import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  UIManager
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Link } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import { useColorScheme } from '@/hooks/useColorScheme';
import ThemeModal from '@/components/modals/ThemeModal';
import NewListModal from '@/components/modals/NewListModal';
import ListCard from '@/components/ui/ListCard';
import ListItemMenuModal from '@/components/modals/ListItemMenuModal';
import ListItemEditModal from '@/components/modals/ListItemEditModal';
import ListItemDeleteModal from '@/components/modals/ListItemDeleteModal';
import ListItemShareModal from '@/components/modals/ListItemShareModal';
import ListItemArchiveModal from '@/components/modals/ListItemArchiveModal';
import LogoutModal from '@/components/modals/LogoutModal';
import { images } from '@/constants/Resources';

// Import list-related actions and selectors from Redux
import { addList, deleteList,
  updateList, duplicateList, archiveList, restoreList,
  selectLists, selectArchiveLists, selectListById } from '@/store/reducers/listSlice';

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

  // Retrieve lists from Redux store
  const lists = useSelector(selectLists);
  const archiveLists = useSelector(selectArchiveLists);

  const [selectedListId, setSelectedListId] = useState('');
  const listItem = useSelector((state) => selectListById(state, selectedListId));

  const [listName, setListName] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleToggleTheme = useCallback((event: any) => {
    if (event == "system") event = colorScheme;
    dispatch(toggleTheme(event));
  }, [colorScheme, dispatch]);

  const openThemeModal = useCallback(() => {
    setIsThemeModalVisible(true);
  }, [setIsThemeModalVisible]);

  const closeThemeModal = useCallback(() => {
    setIsThemeModalVisible(false);
  }, [setIsThemeModalVisible]);

  const onButtonLayout = useCallback((event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setButtonLayout({ x, y, width, height });
  }, [setButtonLayout]);

  const handleTabPress = useCallback((tabName: any) => {
    setActiveTab(tabName);
  }, [setActiveTab]);

  const openNewListModal = useCallback(() => {
    setIsNewListModalVisible(true);
  }, [setIsNewListModalVisible]);

  const closeNewListModal = useCallback(() => {
    setIsNewListModalVisible(false);
  }, [setIsNewListModalVisible]);

  const handleAddNewList = useCallback((newList: any) => {
    const newListWithId = {
      ...newList,
      id: uuidv4(),
    };
    dispatch(addList(newListWithId));
    closeNewListModal();
  }, [dispatch, closeNewListModal]);

  const handleSave = useCallback((newName: any) => {
    dispatch(updateList({ id: selectedListId, updates: { name: newName } }));
    setEditModalVisible(false);
  }, [dispatch, selectedListId, setEditModalVisible]);

  const handleDelete = useCallback(() => {
    dispatch(deleteList(selectedListId));
    setDeleteModalVisible(false);
  }, [dispatch, selectedListId, setDeleteModalVisible]);

  const handleArchive = useCallback(() => {
    if (activeTab === 'Lists')
      dispatch(archiveList(selectedListId));
    else
      dispatch(restoreList(selectedListId));

    setArchiveModalVisible(false);
  }, [dispatch, selectedListId, activeTab, setArchiveModalVisible]);

  const handleShare = useCallback(() => {
    dispatch(duplicateList(selectedListId));
    setShareModalVisible(false);
  }, [dispatch, selectedListId, setShareModalVisible]);

  const handleItemMenu = useCallback((data: any) => {
    setSelectedListId(data.id);
    if (data.type == 'edit') setEditModalVisible(true);
    else if (data.type == 'delete') setDeleteModalVisible(true)
    else if (data.type == 'share') setShareModalVisible(true)
    else if (data.type == 'archive') setArchiveModalVisible(true)
  }, [setSelectedListId, setEditModalVisible, setDeleteModalVisible, setShareModalVisible, setArchiveModalVisible]);

  const [isVisible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [menuButtonLayout, setMenuButtonLayout] = useState(null);
  const openMenuModal = useCallback((ref: any, itemId: any) => {
    if (ref.current) {
      ref.current.measure((fx, fy, width, height, px, py) => {
        setMenuButtonLayout({ x: px, y: py, width, height });
        setSelectedId(itemId);
        setVisible(true);
      });
    }
  }, [setMenuButtonLayout, setSelectedId, setVisible]);

  const onMenuClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleLogout = useCallback(() => {
    //TODO: Implement logout functionality
  }, []);

  useEffect(() => {
    if (listItem != undefined) {
      setListName(listItem.name);
    }
  }, [listItem]);

  return (
    <SafeAreaView style={[styles.container]}>
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
            <TouchableOpacity style={styles.signout} onPress={() => setLogoutModalVisible(true)}>
              <Text style={styles.signoutText}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.themeToggleButton} onPress={openThemeModal} onLayout={onButtonLayout}>
              <Image
                source={images[themeMode].theme}
                style={styles.themeToggleImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <ThemeModal
              visible={isThemeModalVisible}
              onClose={closeThemeModal}
              setTheme={handleToggleTheme}
              buttonLayout={buttonLayout}
            />
          </View>
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
              {archiveLists.length} Archive
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          {
            activeTab == 'Lists' ? (
              <View>
                {lists.map((list: any) => (
                  <ListCard
                    key={list.id}
                    list={list}
                    openMenuModal={openMenuModal}
                  />
                ))}
              </View>
            ) : (
              <View>
                {archiveLists.map((list: any) => (
                  <ListCard
                    key={list.id}
                    list={list}
                    openMenuModal={openMenuModal}
                  />
                ))}
              </View>
            )
          }
        </View>
      </ScrollView>

      <NewListModal
        visible={isNewListModalVisible}
        onClose={closeNewListModal}
        onAdd={handleAddNewList}
      />
      <ListItemMenuModal
        isVisible={isVisible}
        selectedId={selectedId}
        menuButtonLayout={menuButtonLayout}
        onMenuClose={onMenuClose}
        onItemPress={handleItemMenu}
        activeTab={activeTab}
        detailTab=''
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
        activeTab={activeTab}
      />
      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const baseFontSize = Math.min(screenWidth, screenHeight) * 0.04;
  const isSmallScreen = screenWidth < 375;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContainer: {
      paddingHorizontal: isSmallScreen ? 10 : 20,
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
      alignItems: 'center',
      gap: isSmallScreen ? 5 : 10,
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: baseFontSize * 1.5,
      fontWeight: 'bold',
    },
    newlist: {
      backgroundColor: '#007bff',
      paddingVertical: isSmallScreen ? 6 : 8,
      paddingHorizontal: isSmallScreen ? 12 : 16,
      borderRadius: 5,
    },
    newlistText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: baseFontSize,
    },
    signout: {
      backgroundColor: '#007bff',
      paddingVertical: isSmallScreen ? 6 : 8,
      paddingHorizontal: isSmallScreen ? 12 : 16,
      borderRadius: 5,
      marginRight: isSmallScreen ? 5 : 10,
    },
    signoutText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: baseFontSize,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.tabBg,
      borderRadius: 8,
      overflow: 'hidden',
      marginVertical: 10,
      alignSelf: 'flex-start',
      width: 200,
      padding: 5,
    },
    tabButton: {
      flex: 1,
      paddingVertical: isSmallScreen ? 6 : 8,
      alignItems: 'center',
      backgroundColor: colors.tabBg,
      borderRadius: 8
    },
    activeTabButton: {
      backgroundColor: colors.background,
    },
    tabText: {
      fontSize: baseFontSize,
      color: colors.text,
    },
    activeTabText: {
      fontWeight: 'bold',
      fontSize: baseFontSize,
      color: colors.text,
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
      width: baseFontSize * 1.1,
      height: baseFontSize * 1.1,
    },
    modalListOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });
}