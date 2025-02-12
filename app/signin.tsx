import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Image
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'expo-router';
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import { useColorScheme } from '@/hooks/useColorScheme';
import ThemeModal from '@/components/modals/ThemeModal'; // Import ThemeModal
import { images } from '@/constants/Resources';

export default function LoginScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const dispatch = useDispatch();
    const themeMode = useSelector(selectThemeMode);

    const colorScheme = useColorScheme();
    const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (text) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
            setEmailError('Invalid email format.');
        } else if (text.length < 5) {
            setEmailError('Email must be at least 5 characters long.');
        } else {
            setEmailError('');
        }
        setEmail(text);
    };

    const validatePassword = (text) => {
        if (text.length < 9) {
        setPasswordError('Password must be at least 9 characters.');
        } else {
        setPasswordError('');
        }
        setPassword(text);
    };

    const handleLogin = () => {
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
    };

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

    return (
        <SafeAreaView style={[styles.container, styles.bgColor]}>
            {/* Header */}
            <View style={styles.header}>
                <Link href='/'>
                    <Image
                        source={ images[themeMode].back }
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
                    buttonLayout={ buttonLayout }
                    />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={[styles.label, styles.textColor]}>Email</Text>
                <TextInput
                    style={[styles.input, styles.textColor, { borderColor: colors.border }]}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.secondaryText}
                    value={email}
                    onChangeText={validateEmail}
                />
                <Text style={[styles.description, styles.textColor]}>Your email won't be shared.</Text>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <Text style={[styles.label, styles.textColor]}>Password</Text>
                <TextInput
                    style={[styles.input, styles.textColor, { borderColor: colors.border }]}
                    placeholder="Password"
                    placeholderTextColor={colors.secondaryText}
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

const getStyles = (colors) => 
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
            borderRadius: 10
        },
        label: {
            fontSize: 16,
            marginBottom: 5,
        },
        input: {
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            fontSize: 16,
            marginBottom: 10,
        },
        description: {
            fontSize: 12,
            marginBottom: 10,
            color: colors.secondaryText,
        },
        loginButton: {
            backgroundColor: '#007bff',
            paddingVertical: 12,
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
            backgroundColor: colors.background,
        },
        textColor: {
            color: colors.text,
        },
    });