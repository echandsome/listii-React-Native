import {
    Dimensions,
    Platform,
} from 'react-native';

const NEXT_PUBLIC_SUPABASE_URL = 'https://qtgkheaclxgwfrpjiqdv.supabase.co';
const NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0Z2toZWFjbHhnd2ZycGppcWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAzNDM5NzYsImV4cCI6MTk4NTkxOTk3Nn0.4Jq36bAv5ReZtqeNK-59r1x8xLX8I2R-F9E4X9zVzg4';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
// const baseFontSize = Math.min(screenWidth, screenHeight) * 0.038;
const baseFontSize = 15.2;
const isSmallScreen = screenWidth < 375;

const tbl_names = {
    lists: 'lists',
    items: 'items'
}

export  {
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    screenWidth,
    screenHeight,
    baseFontSize,
    isSmallScreen,
    tbl_names
}