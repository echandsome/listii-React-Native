import React, { useState, useRef, useCallback } from 'react';
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
  useWindowDimensions,
  ImageBackground
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Link } from 'expo-router';
import Nav from '@/components/ui/Nav';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

export default function DashboardScreen() {

  const scrollViewRef = useRef(null);
  const [keyFeaturesY, setKeyFeaturesY] = useState(0);

  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1000;
  const styles = getStyles(colors, isLargeScreen);

  const scrollToKeyFeatures = useCallback(() => {
    if (scrollViewRef.current && keyFeaturesY) {
      (scrollViewRef.current as any).scrollTo({
        x: 0,
        y: keyFeaturesY,
        animated: true,
      });
    }
  }, [keyFeaturesY, scrollViewRef]);

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        ref={scrollViewRef}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <Nav page='index' />

        {/* Top Section (Image, Title, Description, Buttons) */}
        <View style={styles.topSection}>
          <ImageBackground
            source={require('@/assets/images/hero.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.topSectionContent}>
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
            <View style={styles.featureCardsContainer}>
              <Image
                  source={require('@/assets/images/lists.png')}
                  style={styles.listsImage}
                  resizeMode="cover"
              />

              <View style={styles.featureCardsLeft}>
                <View style={styles.featureCard}>
                  <Text style={[styles.featureTitle, styles.textColor]}>Organize Groceries</Text>
                  <Text style={[styles.featureDescription, styles.textColor]}>
                    Never forget an item at the store again! Organize your grocery lists and watch your checkout totals stay on track.
                  </Text>
                </View>

                <View style={styles.featureCard}>
                  <Text style={[styles.featureTitle, styles.textColor]}>Share Your Lists</Text>
                  <Text style={[styles.featureDescription, styles.textColor]}>
                    Plan the perfect vacation together, in real-time. Share your travel wishlist and see each other's dream destinations appear.
                  </Text>
                </View>

                <View style={styles.featureCard}>
                  <Text style={[styles.featureTitle, styles.textColor]}>View Updates Instantly</Text>
                  <Text style={[styles.featureDescription, styles.textColor]}>
                    Never wait for an update again. Real-time magic means your list is always in sync, everywhere.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Discover What's New Section */}
        <View style={styles.discoverSection}>
          <Text style={[styles.newFeaturesLabel, styles.textColor]}>New Features</Text>
          <Text style={[styles.sectionTitle, styles.textColor]}>Discover What's New</Text>
          <Text style={[styles.sectionDescription, styles.textColor]}>
            Explore our latest features designed to improve your productivity.
          </Text>
          <View style={styles.discoverCardsContainer}>
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
        </View>

        {/* Start Using Listii Today Section */}
        <View style={styles.startUsingSection}>
          <View>
            <Text style={[styles.startUsingTitle, styles.textColor]}>Start Using Listii Today!</Text>
            <Text style={[styles.startUsingDescription, styles.textColor]}>
              Join the many individuals and teams who are becoming more organized and productive with Listii.
            </Text>
          </View>
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

const getStyles = (colors: any, isLargeScreen: boolean) => {

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
      
    },
    scrollContainer: {
      paddingBottom: 20,
      alignItems: 'center',
    },
    topSection: {
      flexDirection: isLargeScreen ? 'row-reverse' : 'column',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-around',
      paddingVertical: isLargeScreen? screenWidth * 0.07: 10,
      paddingHorizontal: isLargeScreen? 40: 20
    },
    topSectionContent: {
      flex: 1,
      paddingRight: isLargeScreen ? 40 : 0,
      maxWidth: isLargeScreen ? screenWidth * 0.5 : '100%',
    },
    heroImage: {
      width: isLargeScreen ? screenWidth * 0.4 : '100%',
      height: isLargeScreen? screenWidth * 0.25: screenWidth * 0.5,
      marginBottom: isLargeScreen ? 0 : 20,
    },
    title: {
      fontSize: baseFontSize * (isLargeScreen ? 2.5 : 2),
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 10,
    },
    description: {
      fontSize: baseFontSize * (isLargeScreen ? 1.2 : 1),
      textAlign: 'left',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: isLargeScreen ? 'row' : 'column',
      justifyContent: 'flex-start',
      alignItems: isLargeScreen? 'center': undefined,
      marginBottom: 20,
    },
    getStartedButton: {
      backgroundColor: '#007bff',
      paddingVertical: isSmallScreen ? 8 : 12,
      paddingHorizontal: isSmallScreen ? 16 : 24,
      borderRadius: 5,
      textAlign: 'center',
      marginBottom: isLargeScreen ? 0 : 10,
      marginRight: isLargeScreen ? 10 : 0,
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
      paddingVertical: isLargeScreen? screenWidth * 0.07: 20,
    },
    sectionTitle: {
      fontSize: baseFontSize * 1.5,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    sectionDescription: {
      fontSize: baseFontSize,
      marginBottom: 20,
      textAlign: 'center',
    },
    featureSection: {
      width: '100%',
      alignItems: 'center',
    },
    featureCardsContainer: { // Add this container
        ...Platform.select({
          web: {
            width: isLargeScreen ? '70%': '100%',
          }
        }),
        justifyContent: 'center',
        alignItems: isLargeScreen? 'flex-start': 'center',
        marginTop: 20,
        flexDirection: isLargeScreen ? 'row-reverse' : 'column',
    },
    listsImage: {
      maxWidth: isLargeScreen ? screenWidth * 0.4 : '100%',
      maxHeight: 280,
      borderRadius: 12,
      paddingBottom: 20,
    },
    featureCardsLeft: {
      maxWidth: isLargeScreen ? screenWidth * 0.4 : '100%',
      paddingRight: isLargeScreen? 20: 0,
    },
    featureCard: {
      paddingBottom: 20,
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
      width: '100%',
      alignItems: 'center',
      paddingVertical: isLargeScreen? screenWidth * 0.07: 20,
      paddingHorizontal: isLargeScreen? 40: 20
    },
    newFeaturesLabel: {
      fontSize: baseFontSize,
      marginBottom: 5,
    },
    discoverCardsContainer: {
      flexDirection: isLargeScreen ? 'row' : 'column',
      gap: isLargeScreen? 20: undefined,
      justifyContent: 'center'
    },
    discoverCard: {
      width: isLargeScreen ? '30%' : undefined,
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
      width: '100%',
      backgroundColor: colors.secondaryBg,
      flexDirection: isLargeScreen ? 'row' : 'column',
      justifyContent: 'space-between',
      paddingVertical: isLargeScreen? screenWidth * 0.07: 20,
      paddingHorizontal: isLargeScreen? 40: 20
    },
    startUsingTitle: {
      fontSize: baseFontSize * 1.5,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: isLargeScreen? 'left':'center',
    },
    startUsingDescription: {
      fontSize: baseFontSize,
      marginBottom: 20,
      textAlign: isLargeScreen? 'left':'center',
    },
    signUpButton: {
      backgroundColor: '#007bff',
      paddingVertical: isSmallScreen ? 8 : 12,
      paddingHorizontal: isSmallScreen ? 16 : 24,
      borderRadius: 5,
      textAlign: 'center',
      marginBottom: isLargeScreen? 0: 10,
      marginRight: isLargeScreen? 10: 0
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
};