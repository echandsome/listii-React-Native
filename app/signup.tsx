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
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'expo-router';
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import { useColorScheme } from '@/hooks/useColorScheme';
import ThemeModal from '@/components/modals/ThemeModal'; // Import ThemeModal
import { images, ImageSource } from '@/constants/Resources'; // Ensure ImageSource is exported

interface Styles {
  container: StyleProp<ViewStyle>;
  header: StyleProp<ViewStyle>;
  logo: StyleProp<TextStyle>;
  headerButtons: StyleProp<ViewStyle>;
  signInButton: StyleProp<ViewStyle>;
  signInButtonText: StyleProp<TextStyle>;
  anonymousModeButton: StyleProp<ViewStyle>;
  anonymousModeButtonText: StyleProp<TextStyle>;
  themeToggleImage: StyleProp<ViewStyle>;
  themeToggleButton: StyleProp<ViewStyle>;
  content: StyleProp<ViewStyle>;
  label: StyleProp<TextStyle>;
  input: StyleProp<TextStyle>;
  description: StyleProp<TextStyle>;
  registerButton: StyleProp<ViewStyle>;
  registerButtonText: StyleProp<TextStyle>;
  errorText: StyleProp<TextStyle>;
  bgColor: StyleProp<ViewStyle>;
  textColor: StyleProp<TextStyle>;
}

interface ButtonLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function RegisterScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const dispatch = useDispatch();
    const themeMode = useSelector(selectThemeMode) as 'light' | 'dark' | 'system'; // Explicit type
    const colorScheme = useColorScheme();
    const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
    const [buttonLayout, setButtonLayout] = useState<ButtonLayout>({ x: 0, y: 0, width: 0, height: 0 });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Use useCallback to prevent unnecessary re-renders
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
    }, []);

    const validatePassword = useCallback((text: string) => {
        if (text.length < 9) {
            setPasswordError('Password must be at least 9 characters.');
        } else {
            setPasswordError('');
        }
        setPassword(text);
    }, []);

    const handleRegister = () => {
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
            // Perform register logic here
            console.log('register successful');
        }
    };

    const handleToggleTheme = (event: 'light' | 'dark' | 'system') => {
        if (event === "system") {
          event = colorScheme as 'light' | 'dark'; // Type assertion
        }
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

    const backImage = images[themeMode]?.back as ImageSource; // Type assertion
    const themeImage = images[themeMode]?.theme as ImageSource;   // Type assertion

    return (
        <SafeAreaView style={[styles.container, styles.bgColor]}>
            {/* Header */}
            <View style={styles.header}>
                <Link href='/'>
                    <Image
                        source={backImage}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Link>
                <View style={styles.headerButtons}>
                    <Link href='/signin' style={styles.signInButton}>
                        <Text style={[styles.signInButtonText]}>Sign in</Text>
                    </Link>
                    {/* Theme Toggle Button */}
                    <TouchableOpacity
                        style={styles.themeToggleButton}
                        onPress={openThemeModal}
                        onLayout={onButtonLayout}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increased touch target
                    >
                        <Image
                            source={themeImage}
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
                    style={[styles.input, styles.textColor, { borderColor: colors.border }]}
                    placeholder="you@example.com"
                    placeholderTextColor={(styles.placeholder as any).color}
                    value={email}
                    onChangeText={validateEmail}
                    keyboardType="email-address" // Specify keyboard type
                    autoCapitalize="none"        // Prevent auto capitalization
                />
                <Text style={[styles.description, styles.textColor]}>Your email won't be shared.</Text>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <Text style={[styles.label, styles.textColor]}>Password</Text>
                <TextInput
                    style={[styles.input, styles.textColor, { borderColor: colors.border }]}
                    placeholder="Password"
                    placeholderTextColor={(styles.placeholder as any).color}
                    secureTextEntry
                    value={password}
                    onChangeText={validatePassword}
                />
                <Text style={[styles.description, styles.textColor]}>This is the key to your account. Please keep it safe.</Text>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.7}>
                    <Text style={styles.registerButtonText}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const getStyles = (colors: any): Styles =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background, // Use theme background color
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
            width: 24, //Added width and height to fix the error
            height: 24,
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
            width: 20, // Set the desired width
            height: 20, // Set the desired height
        },
        themeToggleButton: {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 10,
            borderRadius: 5,
        },
        content: {
            width: '90%',
            marginTop: 20,
            padding: 20,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 10,
        },
        label: {
            fontSize: 16,
            marginBottom: 5,
            ...Platform.select({ //Consistent font weight across platforms
              ios: {
                fontWeight: '600',
              },
              android: {
                fontWeight: 'bold',
              },
            }),
        },
        input: {
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            fontSize: 16,
            marginBottom: 10,
        },
        placeholder: {
            color: '#999',
        },
        description: {
            fontSize: 12,
            marginBottom: 10,
            color: colors.secondaryText,
        },
        registerButton: {
            backgroundColor: '#007bff',
            paddingVertical: 10,
            borderRadius: 5,
            alignItems: 'center',
        },
        registerButtonText: {
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
            backgroundColor: colors.background,
        },
        textColor: {
            color: colors.text,
        },
    });