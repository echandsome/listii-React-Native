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
  TouchableWithoutFeedback, // Important for detecting outside clicks
} from 'react-native';
import { Theme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Example icon library - install it! (npm install react-native-vector-icons)

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

    const styles = getSelectInputStyles(colors);

    const handleClickOutside = () => {
        setShowOptions(false);
    };
    // Use the 'useEffect' hook to detect touches outside the dropdown.
    useEffect(() => {
      if (showOptions) {
        // This effect sets up a touch listener that detects taps outside the dropdown.
        const listener = () => {
          handleClickOutside(); // Calls the 'handleClickOutside' function when a tap is detected.
        };

        // Listen for all touch events outside the dropdown.
        // The 'TouchableWithoutFeedback' component ensures these touches are detectable.
        // This part is crucial for implementing outside click detection.
        const touchHandler = () => {
          listener(); // Calls the listener when a touch is detected.
        };
        // Attach the touch handler.
        // This setup ensures that any touch outside the dropdown will trigger the 'listener',
        // which then calls 'handleClickOutside' to close the dropdown.

        // Clean up the listener when the component unmounts or when 'showOptions' changes to false.
        return () => {
        };
      }
      // Only activate the listener when 'showOptions' is true to avoid unnecessary processing.
    }, [showOptions]);
    return (
        <View style={style}>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            <TouchableOpacity
                style={styles.selectContainer}
                onPress={() => setShowOptions(!showOptions)}
                onLayout={handleButtonLayout}
            >
                <Text style={[styles.selectText, { color: colors.text }]}>{value}</Text>
                <Icon name="chevron-down" size={16} color={colors.text} />
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