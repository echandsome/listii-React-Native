import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'expo-router';
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import { useColorScheme } from '@/hooks/useColorScheme';
import ThemeModal from '@/components/modals/ThemeModal';
import { images } from '@/constants/Resources';

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  logo: ImageStyle;
  headerButtons: ViewStyle;
  signInButton: ViewStyle;
  signInButtonText: TextStyle;
  placeholder: TextStyle;
  anonymousModeButton: ViewStyle;
  anonymousModeButtonText: TextStyle;
  themeToggleImage: ImageStyle;
  themeToggleButton: ViewStyle;
  content: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  description: TextStyle;
  loginButton: ViewStyle;
  loginButtonText: TextStyle;
  errorText: TextStyle;
  bgColor: ViewStyle;
  textColor: TextStyle;
}

interface ViewStyle {
    flex?: number;
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'space-between' | 'center';
    alignItems?: 'center';
    padding?: number;
    width?: string | number;
    backgroundColor?: string;
    paddingTop?: number;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    marginTop?: number;
    paddingVertical?: number;
    paddingHorizontal?: number;
  }
  
  interface TextStyle {
    fontSize?: number;
    fontWeight?: 'bold';
    color?: string;
    marginBottom?: number;
  }
  
  interface ImageStyle {
    width?: number;
    height?: number;
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';
  }

export default function LoginScreen() {
  const { colors } = useTheme();
  const styles: Styles = getStyles(colors);
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);

  const colorScheme = useColorScheme();
  const [isThemeModalVisible, setIsThemeModalVisible] = useState<boolean>(false);
  const [buttonLayout, setButtonLayout] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const validateEmail = useCallback((text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setEmailError('Invalid email format.');
    } else if (text.length < 5) {
      setEmailError('Email must be at least 5 characters long.');
    } else {
      setEmailError('');
    }
    setEmail(text);
  }, [setEmail, setEmailError]);

  const validatePassword = useCallback((text: string) => {
    if (text.length < 9) {
      setPasswordError('Password must be at least 9 characters.');
    } else {
      setPasswordError('');
    }
    setPassword(text);
  }, [setPassword, setPasswordError]);

  const handleLogin = useCallback(() => {
    let isValid = true;

    if (email.length < 5) {
      setEmailError('Email must be at least 5 characters long.');
      isValid = false;
    }
    if (password.length < 9) {
      setPasswordError('Password must be at least 9 characters.');
      isValid = false;
    }

    if (isValid) {
      // Perform login logic here
      console.log('Login successful');
    }
  }, [email, password, setEmailError, setPasswordError]);

  const handleToggleTheme = useCallback((event: 'light' | 'dark' | 'system') => {
    let theme = event;
    if (event === "system") theme = colorScheme as 'light' | 'dark';
    dispatch(toggleTheme(theme));
  }, [colorScheme, dispatch]);

  const openThemeModal = useCallback(() => {
    setIsThemeModalVisible(true);
  }, [setIsThemeModalVisible]);

  const closeThemeModal = useCallback(() => {
    setIsThemeModalVisible(false);
  }, [setIsThemeModalVisible]);

  const onButtonLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setButtonLayout({ x, y, width, height });
  }, [setButtonLayout]);

  const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

  return (
    <SafeAreaView style={[styles.container, styles.bgColor, { paddingTop: statusBarHeight }]}>
      {/* Header */}
      <View style={styles.header}>
        <Link href='/'>
          <Image
            source={images[themeMode].back}
            style={styles.logo}
            resizeMode="contain"
          />
        </Link>
        <View style={styles.headerButtons}>
          <Link href='/signup' style={styles.signInButton}>
            <Text style={[styles.signInButtonText]}>Sign up</Text>
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

      <View style={styles.content}>
        <Text style={[styles.label, styles.textColor]}>Email</Text>
        <TextInput
          style={[styles.input, styles.textColor, { borderColor: colors?.border }]}
          placeholder="you@example.com"
          placeholderTextColor={(styles.placeholder as any).color}
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={[styles.description, styles.textColor]}>Your email won't be shared.</Text>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={[styles.label, styles.textColor]}>Password</Text>
        <TextInput
          style={[styles.input, styles.textColor, { borderColor: colors?.border }]}
          placeholder="Password"
          placeholderTextColor={(styles.placeholder as any).color}
          secureTextEntry
          value={password}
          onChangeText={validatePassword}
        />
        <Text style={[styles.description, styles.textColor]}>This is the key to your account. Please keep it safe.</Text>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any): Styles =>
  StyleSheet.create<Styles>({
    container: {
      flex: 1,
      backgroundColor: colors?.background,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      width: '100%',
    },
    logo: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
      tintColor: colors?.text, // Example: Dynamically style the logo's tint color
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
    placeholder: {
      color: '#999',
    },
    anonymousModeButton: {
      backgroundColor: colors?.background,
      borderWidth: 1,
      borderColor: colors?.border,
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
      width: 20,
      height: 20,
    },
    themeToggleButton: {
      backgroundColor: colors?.background,
      borderWidth: 1,
      borderColor: colors?.border,
      padding: 10,
      borderRadius: 5,
    },
    content: {
      width: '90%',
      marginTop: 20,
      padding: 20,
      borderColor: colors?.border,
      borderWidth: 1,
      borderRadius: 10
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: colors?.text
    },
    input: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      marginBottom: 10,
      color: colors?.text
    },
    description: {
      fontSize: 12,
      marginBottom: 10,
      color: colors?.secondaryText,
    },
    loginButton: {
      backgroundColor: '#007bff',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginBottom: 20,
    },
    bgColor: {
      backgroundColor: colors?.background,
    },
    textColor: {
      color: colors?.text,
    },
  });