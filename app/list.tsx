import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  UIManager,
  BackHandler,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import { useColorScheme } from '@/hooks/useColorScheme';
import useBackHandler from '../hooks/useBackHandler';
import NewListModal from '@/components/modals/NewListModal';
import ListCard from '@/components/ui/ListCard';
import ListItemMenuModal from '@/components/modals/ListItemMenuModal';
import ListItemEditModal from '@/components/modals/ListItemEditModal';
import ListItemDeleteModal from '@/components/modals/ListItemDeleteModal';
import ListItemShareModal from '@/components/modals/ListItemShareModal';
import ListItemArchiveModal from '@/components/modals/ListItemArchiveModal';
import { baseFontSize, isSmallScreen } from '@/constants/Config';
import { showToast } from '@/helpers/toastHelper';
import Nav from '@/components/ui/Nav';

// Import list-related actions and selectors from Redux
import { selectLists, selectArchiveLists, selectListById } from '@/store/reducers/listSlice';
import { getLists, addNewList, deleteListByDB, 
  updateListByDB, duplicateListByDB, archiveListByDB, restoreListByDB} from '@/store/actions/listAction';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function ListScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1000;
  const styles = getStyles(colors, isLargeScreen);

  const [activeTab, setActiveTab] = useState('Lists');
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const [isNewListModalVisible, setIsNewListModalVisible] = useState(false);

  // Retrieve lists from Redux store
  const lists = useSelector(selectLists);
  const archiveLists = useSelector(selectArchiveLists);

  const [selectedListId, setSelectedListId] = useState('');
  const listItem = useSelector((state) => selectListById(state, selectedListId));
  const userInfo = useSelector((state) => state.auth);
  const userId = useMemo(() => userInfo.user? userInfo.user.id: null, [userInfo]);

  const [listName, setListName] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    console.log('effect----------');
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('focusEffect----------');
      fatchData ();  
    }, [])
  )

  const fatchData = async () => {
    if (userId && ((lists == undefined && archiveLists == undefined) 
              || (lists == null && archiveLists == null) || (lists.length == 0 && archiveLists.length == 0))){
      setLoading(true);
      const res = await getLists(userId, dispatch);
      if (res) showToast('success', 'Data loaded successfully.', '');
      else showToast('error', 'Unable to connect to the server. Please try again later.', '');
      setLoading(false);
    }
  }

  const handleTabPress = (tabName: string) => setActiveTab(tabName);

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
    addNewList({userId: userId, ...newListWithId}, dispatch);
    closeNewListModal();
  }, [dispatch, closeNewListModal]);

  const handleSave = useCallback((newName: any) => {
    updateListByDB({ userId: userId, id: selectedListId, updates: { name: newName } }, dispatch);
    setEditModalVisible(false);
  }, [dispatch, selectedListId, setEditModalVisible]);

  const handleDelete = useCallback(() => {
    deleteListByDB(userId, selectedListId, dispatch);
    setDeleteModalVisible(false);
  }, [dispatch, selectedListId, setDeleteModalVisible]);

  const handleArchive = useCallback(() => {
    if (activeTab === 'Lists')
      archiveListByDB(userId, selectedListId, dispatch);
    else
      restoreListByDB(userId, selectedListId, dispatch);

    setArchiveModalVisible(false);
  }, [dispatch, selectedListId, activeTab, setArchiveModalVisible]);

  const handleShare = () => {
    let listToDuplicate = lists.find((list) => list.id === selectedListId);
    if (listToDuplicate == undefined)
      listToDuplicate = archiveLists.find((list) => list.id === selectedListId);
    duplicateListByDB( userId, listToDuplicate, dispatch);
    setShareModalVisible(false);
  }

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

 

  useEffect(() => {
    if (listItem != undefined) {
      setListName(listItem.name);
    }
  }, [listItem]);

  const exitApp = () => {
    BackHandler.exitApp();
  };

  const handleBackPress = () => {
    Alert.alert(
      "Exit App",
      "Do you want to exit the app?",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "OK", onPress: exitApp }
      ],
      { cancelable: false }
    );
    return true; // Return true to override the default back button behavior
  };

  useBackHandler(handleBackPress);

  return (
    <SafeAreaView style={[styles.container]}>
      
      <ScrollView >
        <Nav page='list' openNewListModal={openNewListModal}/>
        <View style={styles.scrollContainer}>
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
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
            </View>
          ) : (
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
          )}
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
      
    </SafeAreaView>
  );
}

const getStyles = (colors: any, isLargeScreen: boolean) => {

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.tabBg,
      borderRadius: 8,
      overflow: 'hidden',
      marginVertical: 10,
      alignSelf: 'flex-start',
      padding: 5,
    },
    tabButton: {
      padding: isSmallScreen ? 6 : 8,
      alignItems: 'center',
      backgroundColor: colors.tabBg,
      borderRadius: 8,
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
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContainer: {
      paddingHorizontal: isLargeScreen? 40: 20,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
    },
  });
}