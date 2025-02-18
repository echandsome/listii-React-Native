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
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';
import { signUpWithEmailAndPassword } from '@/store/actions/authAction';
import { showToast } from '@/helpers/toastHelper';
import Nav from '@/components/ui/Nav';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

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

  const handleRegister = async () => { // Make the function async
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
      setIsSubmitting(true); // Set submitting to true

      const res = await signUpWithEmailAndPassword(email, password, dispatch);
      if (res) {
        if (res.success) {
          showToast('success', 'Registration Successful!', 'You can now sign in.');
        }else if (res.success == false) {
          showToast('error', 'Registration Failed!', 'Try again');
        }
        
        setIsSubmitting(false);
      } else {
        showToast('error', 'Registration Failed!', 'An error occurred.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, styles.bgColor]}>
      {/* Header */}
      <Nav page='signup' />

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

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          activeOpacity={0.7}
          disabled={isSubmitting} // Disable the button while submitting
        >
          <Text style={styles.registerButtonText}>
            {isSubmitting ? 'Submitting...' : 'Sign up'}
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
      backgroundColor: colors.background, // Use theme background color
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    content: {
      width: '90%',
      marginTop: 20,
      padding: isSmallScreen ? 10 : 20,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 10,
    },
    label: {
      fontSize: baseFontSize,
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
      padding: isSmallScreen ? 8 : 10,
      fontSize: baseFontSize,
      marginBottom: 10,
    },
    placeholder: {
      color: '#999',
      fontSize: baseFontSize,
    },
    description: {
      fontSize: baseFontSize * 0.8,
      marginBottom: 10,
      color: colors.secondaryText,
    },
    registerButton: {
      backgroundColor: '#007bff',
      paddingVertical: isSmallScreen ? 8 : 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    registerButtonText: {
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
      backgroundColor: colors.background,
    },
    textColor: {
      color: colors.text,
    },
  });
};