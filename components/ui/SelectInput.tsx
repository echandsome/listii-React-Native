import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Theme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

interface SelectInputProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (option: string) => void;
  colors: Theme['colors'];
  style: any;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, options, onSelect, colors, style, page }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const styles = getSelectInputStyles(colors);

  let _isSmallScreen = false;
  if (style.width == '100%') _isSmallScreen = true;

  const handleSelect = useCallback((option: string) => {
    onSelect(option);
    setShowOptions(false);
  }, [onSelect]);

  const handleButtonLayout = useCallback((event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setButtonLayout({ x, y, width, height });
  }, []);

  const calculateDropdownPosition =() => {
    const DROPDOWN_OFFSET = 5;
    let left = buttonLayout.x;
    if (_isSmallScreen && buttonLayout.width < 200) left -= (200 - buttonLayout.width)/2;
    
    return {
      top: buttonLayout.y + buttonLayout.height + DROPDOWN_OFFSET,
      left:left,
      width: buttonLayout.width,
    };
  };

  const handleClickOutside = useCallback(() => {
    setShowOptions(false);
  }, []);

  return (
    <View style={[style, styles.container]}>
      {
        label != ''? (
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        ): (
          <></>
        )
      }

      <TouchableOpacity
        style={[page=='listDetail'? styles._selectContainer: styles.selectContainer, ]}
        onPress={() => setShowOptions(!showOptions)}
        onLayout={handleButtonLayout}
      >
        <Text
          style={[styles.selectText, { color: colors.text, textAlign: page=='listDetail'? 'center': undefined }]}
        >
          {value}
        </Text>
        <Icon name="chevron-down" size={baseFontSize * 1.1} color={colors.text} />
      </TouchableOpacity>

      {showOptions && (
        <View
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
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 100,
    },
    selectContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      paddingVertical: isSmallScreen ? 6 : 8,
      paddingHorizontal: isSmallScreen ? 8 : 12,
      backgroundColor: colors.background,
      flex: 1, // Take remaining space
    },
    _selectContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: isSmallScreen ? 8 : 12,
      backgroundColor: colors.background,
      flex: 1, // Take remaining space
    },
    selectText: {
      fontSize: baseFontSize,
      // textAlign: 'center',
      marginRight: 1,
      flex: 1
    },
    dropdownOptionsContainer: {
      position: 'absolute',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      minWidth: 200,
      zIndex: 100000,
      marginTop: 4,
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
      marginRight: 10,
      width: '25%', // Adjust as needed for label width
    }
  });
};

export default SelectInput;