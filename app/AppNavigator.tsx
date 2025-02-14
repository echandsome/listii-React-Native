import React, { createContext, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { toggleTheme, selectThemeMode } from "@/store/reducers/themeSlice";
import { MyLightTheme, MyDarkTheme } from "@/constants/CustomTheme";

export const ThemeContext = createContext({
  theme: MyLightTheme,
  themeMode: "light",
});

export default function AppNavigator() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);

  useEffect(() => {
    dispatch(toggleTheme(colorScheme));
  }, [colorScheme]);

  const theme = useMemo(
    () => (themeMode === "light" ? MyLightTheme : MyDarkTheme),
    [themeMode]
  );

  return (
    <ThemeContext.Provider value={{ theme, themeMode }}>
      <NavigationThemeProvider value={theme}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
          <Stack.Screen name="signin" options={{ title: "Signin", headerShown: false }} />
          <Stack.Screen name="signup" options={{ title: "Signup", headerShown: false }} />
          <Stack.Screen name="list" options={{ title: "List", headerShown: false }} />
          <Stack.Screen name="listDetail" options={{ title: "listDetail", headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={themeMode === "light" ? "dark" : "light"} />
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}
