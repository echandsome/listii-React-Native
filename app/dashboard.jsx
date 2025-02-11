import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';  // Important: Use useTheme!
import { useThemeColor } from '@/hooks/useThemeColor';

export default function DashboardScreen() {
  const { colors } = useTheme();  // Get theme colors from context
  const styles = getStyles(colors); // Pass the theme colors to the style function

  const backgroundColor = useThemeColor({ light: '#fff', dark: '222.2 84% 4.9%' }, 'background');

  const listsData = [
    { id: '1', title: 'Favorite Youtube Channels', items: 4 },
    { id: '2', title: 'January Groceries', items: 23, total: 4972 },
    { id: '3', title: 'Urgent Work Tasks', items: 3 },
    { id: '4', title: 'Vacation spots', items: 9 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.text }]}>Listii</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.signInButton}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.anonymousModeButton}>
              <Text style={styles.anonymousModeButtonText}>Anonymous Mode</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Section (Image, Title, Description, Buttons) */}
        <View style={styles.topSection}>
          <Image
            source={require('@/assets/images/hero.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>
            Unlock the magic of organization with Listii
          </Text>
          <Text style={[styles.description, { color: colors.secondary }]}>
            Ditch the sticky notes and endless notebooks. Manage all your lists and tasks
            seamlessly in one powerful platform.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.getStartedButton}>
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Key Features Section */}
        <View style={styles.keyFeaturesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
          <Text style={[styles.sectionDescription, { color: colors.secondary }]}>
            Explore the powerful features that make us stand out among other task management tools.
          </Text>
          <Image
            source={require('@/assets/images/lists.png')}
            style={styles.listsImage}
            resizeMode="contain"
          />
        </View>

        {/* Organize Groceries Section */}
        <View style={styles.featureSection}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>Organize Groceries</Text>
          <Text style={[styles.featureDescription, { color: colors.secondary }]}>
            Never forget an item at the store again! Organize your grocery lists and watch your checkout totals stay on track.
          </Text>
        </View>

        {/* Share Your Lists Section */}
        <View style={styles.featureSection}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>Share Your Lists</Text>
          <Text style={[styles.featureDescription, { color: colors.secondary }]}>
            Plan the perfect vacation together, in real-time. Share your travel wishlist and see each other's dream destinations appear.
          </Text>
        </View>

        {/* View Updates Instantly Section */}
        <View style={styles.featureSection}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>View Updates Instantly</Text>
          <Text style={[styles.featureDescription, { color: colors.secondary }]}>
            Never wait for an update again. Real-time magic means your list is always in sync, everywhere.
          </Text>
        </View>

        {/* Discover What's New Section */}
        <View style={styles.discoverSection}>
          <Text style={[styles.newFeaturesLabel, { color: colors.secondary }]}>New Features</Text>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Discover What's New</Text>
          <Text style={[styles.sectionDescription, { color: colors.secondary }]}>
            Explore our latest features designed to improve your productivity.
          </Text>
          <Image
            source={require('@/assets/images/click.png')} // Replace with your image path
            style={styles.museImage}
            resizeMode="contain"
          />
          <Text style={[styles.featureTitle, { color: colors.text }]}>One-Click Bookmarks</Text>
          <Text style={[styles.featureDescription, { color: colors.secondary }]}>
            Access your favorite websites instantly with one-click bookmarks. No more sifting through tabs.
          </Text>

          <Image
            source={require('@/assets/images/anon.png')} // Replace with your image path
            style={styles.discoverImage}
            resizeMode="contain"
          />
          <Text style={[styles.featureTitle, { color: colors.text }]}>Anonymous Mode</Text>
          <Text style={[styles.featureDescription, { color: colors.secondary }]}>
            Skip the sign-up and dive right in! Use Anonymous Mode to keep your lists and bookmarks private.
          </Text>

          <Image
            source={require('@/assets/images/dark.png')} // Replace with your image path
            style={styles.discoverImage}
            resizeMode="contain"
          />
          <Text style={[styles.featureTitle, { color: colors.text }]}>Customize Display</Text>
          <Text style={[styles.featureDescription, { color: colors.secondary }]}>
            Customize your screen for day or night with a simple tap.
          </Text>
        </View>

        {/* Start Using Listii Today Section */}
        <View style={styles.startUsingSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Start Using Listii Today!</Text>
          <Text style={[styles.sectionDescription, { color: colors.secondary }]}>
            Join the many individuals and teams who are becoming more organized and productive with Listii.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.signUpButton}>
              <Text style={styles.signUpButtonText}>Sign Up</Text>
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
      backgroundColor: colors.background, // Use theme background color
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
      color: colors.text, // Use theme text color
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
      backgroundColor: '#ddd',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 5,
      marginRight: 10,
    },
    anonymousModeButtonText: {
      color: '#333',
      fontWeight: 'bold',
    },
    topSection: {
      alignItems: 'center',
      padding: 20,
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
      color: colors.text, // Use theme text color
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.secondary, // Use theme secondary color
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
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      color: colors.text, // Use theme text color
      textAlign: 'center',
    },
    sectionDescription: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.secondary, // Use theme secondary color
      marginBottom: 20,
    },
    listsImage: {
      width: Dimensions.get('window').width * 0.9, // Responsive width
      height: 200, // Adjust as needed
      marginBottom: 20,
    },
    featureSection: {
      padding: 20,
      width: '100%',
      alignItems: 'center',
    },
    featureTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text, // Use theme text color
      textAlign: 'center',
    },
    featureDescription: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.secondary, // Use theme secondary color
    },
    discoverSection: {
      padding: 20,
      width: '100%',
      alignItems: 'center',
    },
    newFeaturesLabel: {
      fontSize: 14,
      color: colors.secondary, // Use theme secondary color
      marginBottom: 5,
    },
    discoverImage: {
      width: Dimensions.get('window').width * 0.8,
      height: 150,
      marginBottom: 15,
    },
     museImage: {
      width: Dimensions.get('window').width * 0.8,
      height: 150,
      marginBottom: 15,
    },
    startUsingSection: {
      padding: 20,
      width: '100%',
      alignItems: 'center',
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
  });