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
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'expo-router';
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import { useColorScheme } from '@/hooks/useColorScheme';
import ThemeModal from '@/components/modals/ThemeModal';
import { images } from '@/constants/Resources';

export default function LoginScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
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

  return (
    <SafeAreaView style={[styles.container, styles.bgColor]}>
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

const getStyles = (colors: any) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const baseFontSize = Math.min(screenWidth, screenHeight) * 0.04;
  const isSmallScreen = screenWidth < 375;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors?.background,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isSmallScreen ? 10 : 15,
      width: '100%',
    },
    logo: {
      width: baseFontSize * 1.5,
      height: baseFontSize * 1.5,
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
    placeholder: {
      color: '#999',
      fontSize: baseFontSize,
    },
    themeToggleImage: {
      width: baseFontSize * 1.1, // Set the desired width
      height: baseFontSize * 1.1, // Set the desired height
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
      padding: isSmallScreen ? 10 : 20,
      borderColor: colors?.border,
      borderWidth: 1,
      borderRadius: 10,
    },
    label: {
      fontSize: baseFontSize,
      marginBottom: isSmallScreen ? 3 : 5,
      color: colors?.text,
      fontWeight: 'bold',
    },
    input: {
      borderWidth: 1,
      borderRadius: 5,
      padding: isSmallScreen ? 8 : 10,
      fontSize: baseFontSize,
      marginBottom: 10,
      color: colors?.text,
    },
    description: {
      fontSize: baseFontSize * 0.8,
      marginBottom: 10,
      color: colors?.secondaryText,
    },
    loginButton: {
      backgroundColor: '#007bff',
      paddingVertical: isSmallScreen ? 8 : 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    loginButtonText: {
      color: '#fff',
      fontSize: baseFontSize,
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      fontSize: baseFontSize * 0.8,
      marginBottom: 10,
    },
    bgColor: {
      backgroundColor: colors?.background,
    },
    textColor: {
      color: colors?.text,
    },
  });
};