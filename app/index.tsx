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
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Link } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import ThemeModal from '@/components/modals/ThemeModal'; // Import the ThemeModal component

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

    const scrollToKeyFeatures = useCallback(() => {
        if (scrollViewRef.current && keyFeaturesY) {
            scrollViewRef.current.scrollTo({
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
          <Text style={[styles.logo, { color: colors.text }]}>Listii</Text>
          <View style={styles.headerButtons}>
            <Link href='/signin' style={styles.signInButton}>
              <Text style={[styles.signInButtonText]}>Sign In</Text>
            </Link>
            <Link href='/list' style={styles.anonymousModeButton}>
              <Text style={[styles.anonymousModeButtonText, styles.textColor]}>Anonymous Mode</Text>
            </Link>
            {/* Theme Toggle Button */}
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
              buttonLayout={ buttonLayout }
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
          <Text style={ styles.title }>
            Unlock the magic of organization with Listii
          </Text>
          <Text style={[styles.description]}>
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

        {/* Key Features Section */}
        <View
          style={styles.keyFeaturesSection}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            setKeyFeaturesY(y);
          }}
        >
            <View style={styles.featureSection}>
                <Text style={[styles.newFeaturesLabel]}>What can you do on Listii?</Text>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
                <Text style={[styles.sectionDescription]}>
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
                <Text style={[styles.featureTitle, { color: colors.text }]}>Organize Groceries</Text>
                <Text style={[styles.featureDescription]}>
                    Never forget an item at the store again! Organize your grocery lists and watch your checkout totals stay on track.
                </Text>
            </View>

            {/* Share Your Lists Card */}
            <View style={styles.featureCard}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Share Your Lists</Text>
                <Text style={[styles.featureDescription]}>
                    Plan the perfect vacation together, in real-time. Share your travel wishlist and see each other's dream destinations appear.
                </Text>
            </View>

            {/* View Updates Instantly Card */}
            <View style={styles.featureCard}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>View Updates Instantly</Text>
            <Text style={[styles.featureDescription]}>
                Never wait for an update again. Real-time magic means your list is always in sync, everywhere.
            </Text>
            </View>
        </View>

        {/* Discover What's New Section */}
        <View style={styles.discoverSection}>
            <Text style={[styles.newFeaturesLabel]}>New Features</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Discover What's New</Text>
            <Text style={[styles.sectionDescription]}>
                Explore our latest features designed to improve your productivity.
            </Text>
            <View style={styles.discoverCard}>
                <Image
                    source={require('@/assets/images/click.png')} // Replace with your image path
                    style={styles.discoverImage}
                    resizeMode="cover"
                />
                <View style={ styles.discoverContent }>
                    <Text style={[styles.featureTitle, { color: colors.text }]}>One-Click Bookmarks</Text>
                    <Text style={[styles.featureDescription]}>
                        Access your favorite websites instantly with one-click bookmarks. No more sifting through tabs.
                    </Text>
                </View>
            </View>

            <View style={styles.discoverCard}>
                <Image
                    source={require('@/assets/images/anon.png')} // Replace with your image path
                    style={styles.discoverImage}
                    resizeMode="cover"
                />
                <View style={ styles.discoverContent }>
                    <Text style={[styles.featureTitle, { color: colors.text }]}>Anonymous Mode</Text>
                    <Text style={[styles.featureDescription]}>
                        Skip the sign-up and dive right in! Use Anonymous Mode to keep your lists and bookmarks private.
                    </Text>
                </View>
            </View>

            <View style={styles.discoverCard}>
                <Image
                    source={require('@/assets/images/dark1.png')} // Replace with your image path
                    style={styles.discoverImage}
                    resizeMode="cover"
                />
                <View style={ styles.discoverContent }>
                    <Text style={[styles.featureTitle, { color: colors.text }]}>Customize Display</Text>
                    <Text style={[styles.featureDescription]}>
                        Customize your screen for day or night with a simple tap.
                    </Text>
                </View>
            </View>
        </View>

        {/* Start Using Listii Today Section */}
        <View style={styles.startUsingSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Start Using Listii Today!</Text>
          <Text style={[styles.sectionDescription]}>
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

const getStyles = (colors) =>
  StyleSheet.create({
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
      padding: 15,
      width: '100%',
    },
    logo: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    signInButton: {
      backgroundColor: '#007bff',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 5,
      marginRight: 10,
    },
    signInButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    anonymousModeButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginRight: 10,
    },
    anonymousModeButtonText: {
      color: '#333',
      fontWeight: 'bold',
    },
    themeToggleImage: {

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
      width: Dimensions.get('window').width * 0.8,
      height: 200,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      color: colors.text,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.secondaryText,
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    getStartedButton: {
      backgroundColor: '#007bff',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 5,
      marginRight: 10,
    },
    getStartedButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    learnMoreButton: {
      backgroundColor: '#ddd',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 5,
    },
    learnMoreButtonText: {
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold',
    },
    keyFeaturesSection: {
      padding: 20,
      width: '100%',
      alignItems: 'center',
      backgroundColor: colors.secondaryBg,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 15,
      color: colors.secondaryText,
      textAlign: 'center',
    },
    sectionDescription: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.secondaryText,
      marginBottom: 20,
    },
    listsImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        resizeMode: 'cover',
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
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
      textAlign: 'left',
    },
    featureDescription: {
      fontSize: 16,
      textAlign: 'left',
      color: colors.secondaryText,
    },
    discoverSection: {
      padding: 20,
      width: '100%',
      alignItems: 'center',
    },
    newFeaturesLabel: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 5,
    },
    discoverCard: {
        width: '100%',
        borderWidth: 1,
        borderColor: colors.border,
        marginVertical: 15,
        borderRadius: 20
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
        resizeMode: 'cover',
    },
    startUsingSection: {
      padding: 20,
      width: '100%',
      alignItems: 'center',
      backgroundColor: colors.secondaryBg
    },
    signUpButton: {
      backgroundColor: '#007bff',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 5,
      marginRight: 10,
    },
    signUpButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    // Global
    textColor: {
      color: colors.text,
    },
    bgColor: {
      backgroundColor: colors.background
    }
  });