import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import { useColorScheme } from '@/hooks/useColorScheme';
import ThemeModal from '@/components/modals/ThemeModal';
import NewListModal from '@/components/modals/NewListModal';
import LogoutModal from '@/components/modals/LogoutModal';
import { images } from '@/constants/Resources';

import SelectInput from '@/components/ui/SelectInput';

// Import list-related actions and selectors from Redux
import { addList, selectLists } from '@/store/reducers/listSlice';

export default function ListDetailScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const colorScheme = useColorScheme();

  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isNewListModalVisible, setIsNewListModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Retrieve lists from Redux store
  const lists = useSelector(selectLists);

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

  const openNewListModal = () => {
    setIsNewListModalVisible(true);
  };

  const closeNewListModal = () => {
    setIsNewListModalVisible(false);
  };

  const handleAddNewList = (newList: any) => {
    const newListWithId = {
      ...newList,
      id: uuidv4(),
    };
    dispatch(addList(newListWithId));
    closeNewListModal();
  };

  const handleLogout = () => {

  }

  return (
    <SafeAreaView style={[styles.container, styles.bgColor]}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            <Link href='/list'>
                <Image
                    source={ images[themeMode].back }
                    style={styles.logo}
                    resizeMode="contain"
                />
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
              <Text>
                <Image
                  source={ images[themeMode].theme }
                  style={styles.themeToggleImage}
                  resizeMode="contain"
                />
              </Text>
            </TouchableOpacity>

            <ThemeModal
              visible={isThemeModalVisible}
              onClose={closeThemeModal}
              setTheme={handleToggleTheme}
              buttonLayout={buttonLayout}
            />
          </View>

          {/* Content */}

          
          <NewListModal
            visible={isNewListModalVisible}
            onClose={closeNewListModal}
            onAdd={handleAddNewList}
          />
        </View>

        <LogoutModal
            visible={logoutModalVisible}
            onClose={() => setLogoutModalVisible(false)}
            onLogout={handleLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      alignItems: 'center'
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text, // Use theme text color
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
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
  });