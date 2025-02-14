import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { Theme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Example icon library - install it! (npm install react-native-vector-icons)

const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const baseFontSize = Math.min(screenWidth, screenHeight) * 0.04;
  const isSmallScreen = screenWidth < 375;

interface SelectInputProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (option: string) => void;
  colors: Theme['colors'];
  style: any;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, options, onSelect, colors, style }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const dropdownRef = useRef<View>(null);
  const styles = getSelectInputStyles(colors);

  const handleSelect = useCallback((option: string) => {
    onSelect(option);
    setShowOptions(false);
  }, [onSelect]);

  const handleButtonLayout = useCallback((event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setButtonLayout({ x, y, width, height });
  }, []);

  const calculateDropdownPosition = useCallback(() => {
    const DROPDOWN_OFFSET = 5;
    return {
      top: buttonLayout.y + buttonLayout.height + DROPDOWN_OFFSET,
      left: buttonLayout.x,
      width: buttonLayout.width,
    };
  }, [buttonLayout]);

  const handleClickOutside = useCallback(() => {
    setShowOptions(false);
  }, []);

  useEffect(() => {
    if (showOptions) {
      const listener = () => {
        handleClickOutside();
      };

      const touchHandler = () => {
        listener();
      };

      return () => {
      };
    }
  }, [showOptions, handleClickOutside]);

  return (
    <View style={style}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={styles.selectContainer}
        onPress={() => setShowOptions(!showOptions)}
        onLayout={handleButtonLayout}
      >
        <Text style={[styles.selectText, { color: colors.text }]}>{value}</Text>
        <Icon name="chevron-down" size={baseFontSize * 1.1} color={colors.text} />
      </TouchableOpacity>

      {showOptions && (
        <View
          ref={dropdownRef}
          style={[styles.dropdownOptionsContainer, calculateDropdownPosition()]}
        >
          <ScrollView>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownOption}
                onPress={() => handleSelect(option)}
              >
                <Text style={[styles.dropdownOptionText, { color: colors.text }]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};


const getSelectInputStyles = (colors: any) => {

  return StyleSheet.create({
    selectContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      paddingVertical: isSmallScreen ? 6 : 8,
      paddingHorizontal: isSmallScreen ? 8 : 12,
      marginBottom: 10,
      backgroundColor: colors.background,
    },
    selectText: {
      fontSize: baseFontSize,
    },
    dropdownOptionsContainer: {
      position: 'absolute',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      zIndex: 1,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        android: {
          elevation: 5, // Android shadow
        },
        web: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)', // Web shadow
        },
      }),
      maxHeight: 200,
    },
    dropdownOption: {
      paddingVertical: isSmallScreen ? 5 : 8,
      paddingHorizontal: isSmallScreen ? 8 : 12,
    },
    dropdownOptionText: {
      fontSize: baseFontSize,
    },
    label: {
      fontSize: baseFontSize,
      marginBottom: 5,
    }
  });
};

export default SelectInput;