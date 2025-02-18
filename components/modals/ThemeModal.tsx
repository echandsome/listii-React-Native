import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';

const ThemeModal = ({ visible, onClose, setTheme, buttonLayout }) => {
  const { colors } = useTheme();
  const styles = getModalStyles(colors);

  const modalTop = buttonLayout.y + buttonLayout.height + 26;

  const handleModalPress = (event: any) => {
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

const getModalStyles = (colors: any) => {

  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      padding: isSmallScreen ? 10 : 20,
      borderRadius: 10,
      elevation: 5,
      width: isSmallScreen ? 150 : 200,
      position: 'absolute',
      right: isSmallScreen ? 8 : 16,
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
    },
    modalOption: {
      paddingVertical: isSmallScreen ? 5 : 10,
    },
    textColor: {
      color: colors.text,
      fontSize: baseFontSize,
    },
  });
};

export default ThemeModal;