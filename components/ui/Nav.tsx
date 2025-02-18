import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import ThemeModal from '@/components/modals/ThemeModal';
import LogoutModal from '@/components/modals/LogoutModal';
import { images } from '@/constants/Resources';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

export default function Nav ({ page, openNewListModal, openAddItemModal }){

    const router = useRouter();
    const themeButtonRef = useRef(null);
    const dispatch = useDispatch();
    const themeMode = useSelector(selectThemeMode);
    const colorScheme = useColorScheme();

    const { colors } = useTheme();
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 1000;
    const styles = getStyles(colors, isLargeScreen);

    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
    const handleToggleTheme = useCallback((event: any) => {
      if (event == "system") event = colorScheme;
      dispatch(toggleTheme(event));
    }, [colorScheme, dispatch]);
  
    const openThemeModal = useCallback(() => {
        if (themeButtonRef.current) {
            themeButtonRef.current.measure((x, y, width, height, px, py) => {
                let cx = 0, cy = 0;
                console.log(x, y);
                cx = -25;
                if (isLargeScreen) {
                  cx = 0;
                  cy = y + 40;
                }

                setButtonLayout({ x: cx, y: cy, width, height });
            });
          }
      setIsThemeModalVisible(true);
    }, [setIsThemeModalVisible, isLargeScreen]);
  
    const closeThemeModal = useCallback(() => {
      setIsThemeModalVisible(false);
    }, [setIsThemeModalVisible]);

    const handleLogout = useCallback(() => {
        dispatch({ type: "RESET" });
        router.push('/'); 
    }, []);

    return (
        <View style={styles.nav}>
            {(() => {
                switch (page) {
                case 'index':
                    return (
                        <Text style={[styles.logo, styles.textColor]}>Listii</Text>
                    );
                case 'signin':
                    return (
                        <Link href='/'>
                            <Image
                                source={images[themeMode].back}
                                style={styles.logo1}
                                resizeMode="contain"
                            />
                        </Link>
                    );
                case 'signup':
                    return (
                        <Link href='/'>
                            <Image
                                source={images[themeMode].back}
                                style={styles.logo1}
                                resizeMode="contain"
                            />
                        </Link>
                    );
                case 'list':
                    return (
                        <View style={styles.headerLogo}>
                            {/* <Link href='/'> */}
                                <Text style={[styles.logo, styles.textColor]}>Listii</Text>
                            {/* </Link> */}
                            <TouchableOpacity style={styles.newlist} onPress={openNewListModal}>
                                <Text style={styles.newlistText}>+ New List</Text>
                            </TouchableOpacity>
                        </View>
                    );
                case 'listDetail':
                    return (
                        <View style={styles.headerLogo}>
                            <Link href='/list'>
                                <Image
                                source={images[themeMode].back}
                                style={[styles.logo, { width: baseFontSize * 1.5, height: baseFontSize * 1.5 }]}
                                resizeMode="contain"
                                />
                            </Link>
                            <TouchableOpacity style={styles.newlist} onPress={openAddItemModal}>
                                <Text style={styles.newlistText}>+ New Item</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }
            })()}
          
            <View style={styles.navButtons}>
                {(() => {
                    switch (page) {
                    case 'index':
                        return (
                            <>
                                <Link href='/signin' style={styles.signInButton}>
                                    <Text style={styles.signInButtonText}>Sign In</Text>
                                </Link>
                                <Link href='/list' style={styles.anonymousModeButton}>
                                    <Text style={styles.anonymousModeButtonText}>Anonymous Mode</Text>
                                </Link>
                            </>
                        );
                    case 'signin':
                        return (
                            <Link href='/signup' style={styles.signInButton}>
                                <Text style={[styles.signInButtonText]}>Sign up</Text>
                            </Link>
                        );
                    case 'signup':
                        return (
                            <Link href='/signin' style={styles.signInButton}>
                                <Text style={[styles.signInButtonText]}>Sign in</Text>
                            </Link>
                        );
                    case 'list':
                        return (
                            <TouchableOpacity style={styles.signout} onPress={() => setLogoutModalVisible(true)}>
                                <Text style={styles.signoutText}>Sign Out</Text>
                            </TouchableOpacity>
                        );
                    case 'listDetail':
                        return (
                            <TouchableOpacity style={styles.signout} onPress={() => setLogoutModalVisible(true)}>
                                <Text style={styles.signoutText}>Sign Out</Text>
                            </TouchableOpacity>
                        );
                    }
                })()}
                {/* Theme Toggle Button */}
                <TouchableOpacity style={styles.themeToggleButton} onPress={openThemeModal} ref={themeButtonRef} >
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
                <LogoutModal
                    visible={logoutModalVisible}
                    onClose={() => setLogoutModalVisible(false)}
                    onLogout={handleLogout}
                /> 
            </View>
        </View>
    )
}

const getStyles = (colors: any, isLargeScreen: boolean) => {

    return StyleSheet.create({
      nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isSmallScreen ? 10 : 15,
        width: '100%',
        paddingHorizontal: isLargeScreen? 40: 15,
        paddingTop: isLargeScreen? 50: 15
      },
      logo: {
        fontSize: baseFontSize * 2,
        fontWeight: 'bold',
      },
      logo1: {
        width: baseFontSize * 1.5,
        height: baseFontSize * 1.5,
      },
      navButtons: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      signInButton: {
        backgroundColor: '#007bff',
        paddingVertical: isSmallScreen ? 6 : 8,
        paddingHorizontal: isSmallScreen ? 12 : 16,
        borderRadius: 5,
        marginRight: 10,
      },
      signInButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: baseFontSize,
      },
      anonymousModeButton: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 5,
        paddingVertical: isSmallScreen ? 6 : 8,
        paddingHorizontal: isSmallScreen ? 12 : 16,
        marginRight: 10,
      },
      anonymousModeButtonText: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: baseFontSize,
      },
      themeToggleImage: {
        width: baseFontSize * 1.1,
        height: baseFontSize * 1.1,
      },
      themeToggleButton: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 10,
        borderRadius: 5,
      },
      textColor: {
        color: colors.text,
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
      headerLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: isSmallScreen ? 5 : 10,
      },
    });
  };