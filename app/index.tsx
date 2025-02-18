import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Link } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import ThemeModal from '@/components/modals/ThemeModal';
import { images } from '@/constants/Resources';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const scrollViewRef = useRef(null);
  const [keyFeaturesY, setKeyFeaturesY] = useState(0);

  const colorScheme = useColorScheme();

  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

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

  const scrollToKeyFeatures = useCallback(() => {
    if (scrollViewRef.current && keyFeaturesY) {
      (scrollViewRef.current as any).scrollTo({
        x: 0,
        y: keyFeaturesY,
        animated: true,
      });
    }
  }, [keyFeaturesY]);

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        ref={scrollViewRef}
        scrollEventThrottle={16}
      >

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.logo, styles.textColor]}>Listii</Text>
          <View style={styles.headerButtons}>
            <Link href='/signin' style={styles.signInButton}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </Link>
            <Link href='/list' style={styles.anonymousModeButton}>
              <Text style={styles.anonymousModeButtonText}>Anonymous Mode</Text>
            </Link>
            {/* Theme Toggle Button */}
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

        {/* Top Section (Image, Title, Description, Buttons) */}
        <View style={styles.topSection}>
          <Image
            source={require('@/assets/images/hero.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <View> 
          <Text style={[styles.title, styles.textColor]}>
            Unlock the magic of organization with Listii
          </Text>
          <Text style={[styles.description, styles.textColor]}>
            Ditch the sticky notes and endless notebooks. Manage all your lists and tasks
            seamlessly in one powerful platform.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Link href='/signin' style={styles.getStartedButton}>
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </Link>
            <TouchableOpacity style={styles.learnMoreButton} onPress={scrollToKeyFeatures}>
              <Text style={styles.learnMoreButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>

        {/* Key Features Section */}
        <View
          style={styles.keyFeaturesSection}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            setKeyFeaturesY(y);
          }}
        >
          <View style={styles.featureSection}>
            <Text style={[styles.newFeaturesLabel, styles.textColor]}>What can you do on Listii?</Text>
            <Text style={[styles.sectionTitle, styles.textColor]}>Key Features</Text>
            <Text style={[styles.sectionDescription, styles.textColor]}>
              Explore the powerful features that make us stand out among other task management tools.
            </Text>
            <Image
              source={require('@/assets/images/lists.png')}
              style={styles.listsImage}
              resizeMode="cover"
            />
          </View>

          {/* Organize Groceries Card */}
          <View style={styles.featureCard}>
            <Text style={[styles.featureTitle, styles.textColor]}>Organize Groceries</Text>
            <Text style={[styles.featureDescription, styles.textColor]}>
              Never forget an item at the store again! Organize your grocery lists and watch your checkout totals stay on track.
            </Text>
          </View>

          {/* Share Your Lists Card */}
          <View style={styles.featureCard}>
            <Text style={[styles.featureTitle, styles.textColor]}>Share Your Lists</Text>
            <Text style={[styles.featureDescription, styles.textColor]}>
              Plan the perfect vacation together, in real-time. Share your travel wishlist and see each other's dream destinations appear.
            </Text>
          </View>

          {/* View Updates Instantly Card */}
          <View style={styles.featureCard}>
            <Text style={[styles.featureTitle, styles.textColor]}>View Updates Instantly</Text>
            <Text style={[styles.featureDescription, styles.textColor]}>
              Never wait for an update again. Real-time magic means your list is always in sync, everywhere.
            </Text>
          </View>
        </View>

        {/* Discover What's New Section */}
        <View style={styles.discoverSection}>
          <Text style={[styles.newFeaturesLabel, styles.textColor]}>New Features</Text>
          <Text style={[styles.sectionTitle, styles.textColor]}>Discover What's New</Text>
          <Text style={[styles.sectionDescription, styles.textColor]}>
            Explore our latest features designed to improve your productivity.
          </Text>
          <View style={styles.discoverCard}>
            <Image
              source={require('@/assets/images/click.png')}
              style={styles.discoverImage}
              resizeMode="cover"
            />
            <View style={styles.discoverContent}>
              <Text style={[styles.featureTitle, styles.textColor]}>One-Click Bookmarks</Text>
              <Text style={[styles.featureDescription, styles.textColor]}>
                Access your favorite websites instantly with one-click bookmarks. No more sifting through tabs.
              </Text>
            </View>
          </View>

          <View style={styles.discoverCard}>
            <Image
              source={require('@/assets/images/anon.png')}
              style={styles.discoverImage}
              resizeMode="cover"
            />
            <View style={styles.discoverContent}>
              <Text style={[styles.featureTitle, styles.textColor]}>Anonymous Mode</Text>
              <Text style={[styles.featureDescription, styles.textColor]}>
                Skip the sign-up and dive right in! Use Anonymous Mode to keep your lists and bookmarks private.
              </Text>
            </View>
          </View>

          <View style={styles.discoverCard}>
            <Image
              source={require('@/assets/images/dark1.png')}
              style={styles.discoverImage}
              resizeMode="cover"
            />
            <View style={styles.discoverContent}>
              <Text style={[styles.featureTitle, styles.textColor]}>Customize Display</Text>
              <Text style={[styles.featureDescription, styles.textColor]}>
                Customize your screen for day or night with a simple tap.
              </Text>
            </View>
          </View>
        </View>

        {/* Start Using Listii Today Section */}
        <View style={styles.startUsingSection}>
          <Text style={[styles.sectionTitle, styles.textColor]}>Start Using Listii Today!</Text>
          <Text style={[styles.sectionDescription, styles.textColor]}>
            Join the many individuals and teams who are becoming more organized and productive with Listii.
          </Text>
          <View style={styles.buttonContainer}>
            <Link href='/signup' style={styles.signUpButton}>
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </Link>
            <TouchableOpacity style={styles.learnMoreButton} onPress={scrollToKeyFeatures}>
              <Text style={styles.learnMoreButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => {

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContainer: {
      paddingBottom: 20,
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isSmallScreen ? 10 : 15,
      width: '100%',
    },
    logo: {
      fontSize: baseFontSize * 1.5,
      fontWeight: 'bold',
    },
    headerButtons: {
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
    topSection: {
      alignItems: 'center',
      paddingHorizontal: 20,
      width: '100%',
    },
    heroImage: {
      width: screenWidth * 0.8,
      height: 200,
    },
    title: {
      fontSize: baseFontSize * 2,
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 10,
    },
    description: {
      fontSize: baseFontSize,
      textAlign: 'left',
      marginBottom: 20,
    },
    buttonContainer: {
      justifyContent: 'center',
      marginBottom: 20,
      // ...Platform.select({
      //   web: {
      //     flexDirection: screenWidth > 500? 'row': 'column',
      //   },
      // }),
    },
    getStartedButton: {
      backgroundColor: '#007bff',
      paddingVertical: isSmallScreen ? 8 : 12,
      paddingHorizontal: isSmallScreen ? 16 : 24,
      borderRadius: 5,
      textAlign: 'center',
      marginBottom: 10,
      // ...Platform.select({
      //   web: {
      //     flex: 1,
      //     marginRight: 10,
      //   },
      // }),
    },
    getStartedButtonText: {
      color: '#fff',
      fontSize: baseFontSize,
      fontWeight: 'bold',
    },
    learnMoreButton: {
      backgroundColor: '#ddd',
      paddingVertical: isSmallScreen ? 8 : 12,
      paddingHorizontal: isSmallScreen ? 16 : 24,
      borderRadius: 5,
    },
    learnMoreButtonText: {
      color: '#333',
      fontSize: baseFontSize,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    keyFeaturesSection: {
      padding: 20,
      width: '100%',
      alignItems: 'center',
      backgroundColor: colors.secondaryBg,
    },
    sectionTitle: {
      fontSize: baseFontSize * 1.5,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    sectionDescription: {
      fontSize: baseFontSize,
      // textAlign: 'center',
      marginBottom: 20,
    },
    listsImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
    },
    featureSection: {
      width: '100%',
      alignItems: 'center',
    },
    featureCard: {
      paddingVertical: 20,
      width: '100%',
    },
    featureTitle: {
      fontSize: baseFontSize * 1.2,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'left',
    },
    featureDescription: {
      fontSize: baseFontSize,
      textAlign: 'left',
    },
    discoverSection: {
      padding: 20,
      width: '100%',
      alignItems: 'center',
    },
    newFeaturesLabel: {
      fontSize: baseFontSize,
      marginBottom: 5,
    },
    discoverCard: {
      width: '100%',
      borderWidth: 1,
      borderColor: colors.border,
      marginVertical: 15,
      borderRadius: 20,
    },
    discoverContent: {
      padding: 20,
      backgroundColor: colors.secondaryBg,
      borderBottomEndRadius: 20,
      borderBottomLeftRadius: 20,
    },
    discoverImage: {
      width: '100%',
      height: 200,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    startUsingSection: {
      padding: 20,
      width: '100%',
      // alignItems: 'center',
      backgroundColor: colors.secondaryBg
    },
    signUpButton: {
      backgroundColor: '#007bff',
      paddingVertical: isSmallScreen ? 8 : 12,
      paddingHorizontal: isSmallScreen ? 16 : 24,
      borderRadius: 5,
      // marginRight: 10,
      textAlign: 'center',
      marginBottom: 10
    },
    signUpButtonText: {
      color: '#fff',
      fontSize: baseFontSize,
      fontWeight: 'bold',
    },
    textColor: {
      color: colors.text,
    },
    bgColor: {
      backgroundColor: colors.background
    }
  });
}