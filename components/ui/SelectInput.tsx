import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Theme } from '@react-navigation/native'; 

interface SelectInputProps {
    label: string;
    value: string;
    options: string[];
    onSelect: (option: string) => void;
    colors: Theme['colors']; // Use the Theme type from @react-navigation/native
}
  
const SelectInput: React.FC<SelectInputProps> = ({ label, value, options, onSelect, colors }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const dropdownRef = useRef<View>(null);
  
    const handleSelect = (option: string) => {
        onSelect(option);
        setShowOptions(false);
    };
  
    const handleButtonLayout = (event: any) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setButtonLayout({ x, y, width, height });
    };
  
    const calculateDropdownPosition = () => {
        const DROPDOWN_OFFSET = 5;
        return {
            top: buttonLayout.y + buttonLayout.height + DROPDOWN_OFFSET,
            left: buttonLayout.x,
            width: buttonLayout.width,
        };
    };
  
    // useEffect for detecting outside clicks (React Native compatible)
    useEffect(() => {
        const handleClickOutside = (event: any) => { //TODO: Type this event correctly
            if (showOptions && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        if (Platform.OS === 'web') {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
  
    }, [showOptions]);
  
  
    const styles = getSelectInputStyles(colors);
  
    return (
      <View>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() => setShowOptions(!showOptions)}
          onLayout={handleButtonLayout}
        >
          <Text style={[styles.selectText, { color: colors.text }]}>{value}</Text>
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
  
interface SelectInputStyles {
    selectContainer: StyleProp<ViewStyle>;
    selectText: StyleProp<TextStyle>;
    dropdownOptionsContainer: StyleProp<ViewStyle>;
    dropdownOption: StyleProp<ViewStyle>;
    dropdownOptionText: StyleProp<TextStyle>;
    label: StyleProp<TextStyle>;
}
  
const getSelectInputStyles = (colors: Theme['colors']): SelectInputStyles =>
    StyleSheet.create<SelectInputStyles>({
        selectContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 4,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginBottom: 10,
            backgroundColor: colors.background, // Added background color
        },
        selectText: {
            fontSize: 16,
        },
        dropdownOptionsContainer: {
            position: 'absolute',
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 4,
            zIndex: 1,
            // Shadow effect
            shadowColor: "#000",
            shadowOffset: {
            width: 0,
            height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            maxHeight: 200, // Maximum height specified
        },
        dropdownOption: {
            paddingVertical: 8,
            paddingHorizontal: 12,
        },
        dropdownOptionText: {
            fontSize: 16,
        },
        label: {
            fontSize: 16,
            marginBottom: 5,
        },
});

export default SelectInput;