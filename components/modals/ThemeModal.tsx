import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@react-navigation/native'; // Import useTheme

const ThemeModal = ({ visible, onClose, setTheme, buttonLayout }) => {
  const { colors } = useTheme(); // Access theme colors
  const styles = getModalStyles(colors); // Get themed styles

  const modalTop = buttonLayout.y + buttonLayout.height + 26;

  const handleModalPress = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleModalPress}>
        <View style={[styles.modalContent, { top: modalTop }]}>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setTheme('light');
              onClose();
            }}
          >
            <Text style={styles.textColor}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setTheme('dark');
              onClose();
            }}
          >
            <Text style={styles.textColor}>Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setTheme('system');
              onClose();
            }}
          >
            <Text style={styles.textColor}>System</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const getModalStyles = (colors) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      padding: 20,
      borderRadius: 10,
      elevation: 5,
      width: 200,
      position: 'absolute',
      right: 16,
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1
    },
    modalOption: {
      paddingVertical: 10,
    },
    textColor: {
      color: colors.text,
    },
  });

export default ThemeModal;