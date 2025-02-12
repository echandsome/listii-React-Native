import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    Text,
    Pressable,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { images } from '@/constants/Resources';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ListItemMenuModal = ({isVisible, selectedId, menuButtonLayout, onMenuClose, onItemPress, activeTab}) => {
    const { colors } = useTheme();
    const styles = getModalStyles(colors);
    const [adjustedPosition, setAdjustedPosition] = useState(null);

    const handleModalPress = (event: any) => {
        if (event.target === event.currentTarget) {
            onMenuClose();
        }
    };

    const calculateDropdownPosition = () => {
        if (!menuButtonLayout) return null; // Guard against null layout

        const DROPDOWN_OFFSET = 5;
        let initialTop = menuButtonLayout.y + DROPDOWN_OFFSET;
        let initialLeft = menuButtonLayout.x - 40;
        let modalHeight;
        if (activeTab != 'Detail') modalHeight = 200;
        else modalHeight = 120;
        const modalWidth = 40;

        // Check if the modal will go off-screen at the bottom
        if (initialTop + modalHeight > screenHeight) {
            initialTop = screenHeight - modalHeight - 10; // Push it up so it fits, add a little margin
        }

        // Check if the modal will go off-screen on the left
        if (initialLeft < 0) {
            initialLeft = 10; // Push it right so it fits, add a little margin
        }

        // Check if the modal will go off-screen on the right
        if (initialLeft + modalWidth > screenWidth) {
            initialLeft = screenWidth - modalWidth - 10; // Push it left so it fits, add a little margin
        }

        return {
            top: initialTop,
            left: initialLeft,
            width: 40,
        };
    };

    useEffect(() => {
        if (isVisible && menuButtonLayout) {
            setAdjustedPosition(calculateDropdownPosition());
        }
    }, [isVisible, menuButtonLayout]);

    // Handler functions for menu options
    const handleEdit = () => {
        onItemPress({
            id: selectedId,
            type: 'edit'
        });
        onMenuClose();
    };

    const handleDelete = () => {
        onItemPress({
            id: selectedId,
            type: 'delete'
        });
        onMenuClose();
    };

    const handleShare = () => {
        onItemPress({
            id: selectedId,
            type: 'share'
        });
        onMenuClose();
    };

    const handleArchive = () => {
        onItemPress({
            id: selectedId,
            type: 'archive'
        });
        onMenuClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => onMenuClose()} // Close via Redux
        >
            <Pressable style={styles.modalOverlay} onPress={handleModalPress}>
                {adjustedPosition && (
                    <View style={[styles.listItemMenuModalContent, adjustedPosition]}>
                        <TouchableOpacity style={styles.listItemMenuOption} onPress={handleEdit}>
                            <Image source={images['dark'].edit} style={styles.listItemMenuIcon} />
                            <Text style={[styles.listItemMenuText, styles.textColor]}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItemMenuOption} onPress={handleDelete}>
                            <Image source={images['dark'].delete} style={styles.listItemMenuIcon} />
                            <Text style={[styles.listItemMenuText, styles.textColor]}></Text>
                        </TouchableOpacity>
                        {
                            activeTab != 'Detail'? (
                                <>
                                    <TouchableOpacity style={styles.listItemMenuOption} onPress={handleShare}>
                                        <Image source={images['dark'].share} style={styles.listItemMenuIcon} />
                                        <Text style={[styles.listItemMenuText, styles.textColor]}></Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.listItemMenuOption} onPress={handleArchive}>
                                        <Image source={
                                            activeTab == 'Lists'? (images['dark'].archive): (images['dark'].unarchive)
                                        } style={styles.listItemMenuIcon} />
                                        <Text style={[styles.listItemMenuText, styles.textColor]}></Text>
                                    </TouchableOpacity>
                                </>
                            ): (
                                <></>
                            )
                        }
                       
                    </View>
                )}
            </Pressable>
        </Modal>
    );
};

const getModalStyles = (colors: any) =>
    StyleSheet.create({
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        listItemMenuModalContent: {
            backgroundColor: colors.menuBg,
            borderRadius: 8,
            width: 50,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            position: 'absolute', // Make sure position is absolute to control top/left
        },
        listItemMenuOption: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            width: 100,
        },
        listItemMenuIcon: {
            width: 20,
            height: 20,
            marginRight: 10,
        },
        listItemMenuText: {
            fontSize: 16,
        },
        textColor: {
            color: colors.text,
        },
    });

export default ListItemMenuModal;