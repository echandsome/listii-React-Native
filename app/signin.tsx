import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Keyboard,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useRouter  } from 'expo-router';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';
import { loginWithEmailAndPassword } from '@/store/actions/authAction';
import { showToast } from '@/helpers/toastHelper';
import Nav from '@/components/ui/Nav';

export default function LoginScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const dispatch = useDispatch();

  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('Login');
  const [countdown, setCountdown] = useState<number | null>(null);

  const passwordInputRef = useRef<TextInput>(null); // Ref to password input
  const emailInputRef = useRef<TextInput>(null); // Ref to email input

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

  const handleLogin = useCallback(async () => {
    Keyboard.dismiss(); // Dismiss keyboard before login attempt

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
      setIsSubmitting(true);
      setButtonText('Submitting...');
      try {
        const res = await loginWithEmailAndPassword(email, password, dispatch);
        if (res) {
          if (res.success) {
            showToast('success', 'Login Successful!', '');
            setButtonText('Login');
            router.push('/list');
          } else {
            let errorMessage = 'Login Failed!';
            if (res.verify == false) {
              errorMessage = 'Please confirm your email before logging in.';
            } else if (res.invalid == false) {
              errorMessage = 'Invalid email or password.';
            } else if (res.success == false) {
              errorMessage = 'Try again after 3s';
            }
            showToast('error', 'Login Failed!', errorMessage);
            setButtonText('Invalid login, try again: 3');
            setCountdown(3);
          }
        } else {
          showToast('error', 'Login Failed!', 'An error occurred.');
          setButtonText('Invalid login, try again: 3');
          setCountdown(3);
        }
      } catch (error) {
        console.error("Login failed:", error);
        showToast('error', 'Login Failed!', 'An unexpected error occurred.');
        setButtonText('Invalid login, try again: 3');
        setCountdown(3);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [email, password, setEmailError, setPasswordError, dispatch, router]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        setButtonText(`Invalid login, try again: ${countdown - 1}`);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setButtonText('Login');
      setCountdown(null);
    }
  }, [countdown]);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []); // Empty dependency array means this runs only once after initial render

  const handleEmailSubmitEditing = () => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };


  return (
    <SafeAreaView style={[styles.container, styles.bgColor]}>
      {/* Header */}
      <Nav page='signin' />

      <View style={styles.content}>
        <Text style={[styles.label, styles.textColor]}>Email</Text>
        <TextInput
          ref={emailInputRef} // Attach the ref
          style={[styles.input, styles.textColor, { borderColor: colors?.border }]}
          placeholder="you@example.com"
          placeholderTextColor={(styles.placeholder as any).color}
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          onSubmitEditing={handleEmailSubmitEditing}
          returnKeyType="next"
          blurOnSubmit={false} // Prevents blurring of the input after pressing Enter
        />
        <Text style={[styles.description, styles.textColor]}>Your email won't be shared.</Text>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={[styles.label, styles.textColor]}>Password</Text>
        <TextInput
          ref={passwordInputRef} // Attach the ref
          style={[styles.input, styles.textColor, { borderColor: colors?.border }]}
          placeholder="Password"
          placeholderTextColor={(styles.placeholder as any).color}
          secureTextEntry
          value={password}
          onChangeText={validatePassword}
          onSubmitEditing={handleLogin} // Trigger handleLogin on Enter
          returnKeyType="go" // Change Enter key to "go"
        />
        <Text style={[styles.description, styles.textColor]}>This is the key to your account. Please keep it safe.</Text>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity
          style={[styles.loginButton]}
          onPress={handleLogin}
          activeOpacity={0.7}
          disabled={isSubmitting || countdown !== null}
        >
          <Text style={styles.loginButtonText}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors?.background,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
    },
    placeholder: {
      color: '#999',
      fontSize: baseFontSize,
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