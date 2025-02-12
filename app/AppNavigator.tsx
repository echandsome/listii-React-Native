import React, { useState, createContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as NavigationThemeProvider  } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'react-native-get-random-values';
import { selectThemeMode } from '@/store/reducers/themeSlice';
import { MyLightTheme, MyDarkTheme } from '@/constants/CustomTheme';

const ThemeContext = createContext({
    theme: MyLightTheme,
    toggleTheme: () => {},
});

export default function AppNavigator() {
    const themeMode = useSelector(selectThemeMode);

    const [theme, setTheme] = useState(themeMode == 'light'? MyLightTheme: MyDarkTheme);

    useEffect(() => {
        setTheme(themeMode == 'light'? MyLightTheme: MyDarkTheme);
    }, [themeMode]);

    const toggleTheme = () => {
        setTheme(theme === MyLightTheme ? MyDarkTheme : MyLightTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <NavigationThemeProvider value={theme}>
                <Stack >
                    <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
                    <Stack.Screen name="signin" options={{ title: 'Signin', headerShown: false }} />
                    <Stack.Screen name="signup" options={{ title: 'Signup', headerShown: false }} />
                    <Stack.Screen name="list" options={{ title: 'List', headerShown: false }} />
                    <Stack.Screen name="listDetail" options={{ title: 'listDetail', headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style={ themeMode == 'light'? 'dark': 'light' } />
            </NavigationThemeProvider>
        </ThemeContext.Provider>
    );
}
