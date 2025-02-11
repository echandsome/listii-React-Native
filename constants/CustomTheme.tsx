import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)', 
    background: '#fff',
    secondaryBg: 'rgb(243 244 246)',
    tabBg: '#F1F5F9',
    menuBg: '#64748B',
    border: '#ddd',
    card: 'rgb(255, 255, 255)',    
    text: 'rgb(28, 28, 30)', 
    secondaryText: 'black',      
    notification: 'rgb(255, 69, 58)', 
    myCustomColor: '#007AFF',  
  },
};

export const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: 'rgb(255, 58, 120)',
    background: '#020817',
    secondaryBg: '#1f2937',
    tabBg: '#1E293B',
    menuBg: '#000000',
    border: '#1f2937',
    card: 'rgb(34, 34, 34)',    
    text: 'rgb(229, 229, 231)',
    secondaryText: 'lightgray',
    notification: 'rgb(255, 69, 58)', 
    myCustomColor: '#007AFF',  
  },
};