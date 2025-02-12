import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { selectThemeMode } from '@/store/reducers/themeSlice';
import { images } from '@/constants/Resources';
import { closeMenu } from '@/store/reducers/listItemMenuSlice'; // Import closeMenu

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ListItemMenuModal = ({onItemPress, activeTab}) => { // Remove props: visible, onClose, menuButtonLayout
    const dispatch = useDispatch();
    const themeMode = useSelector(selectThemeMode);
    const { colors } = useTheme();
    const styles = getModalStyles(colors);
    const [adjustedPosition, setAdjustedPosition] = useState(null);

    // Get modal state from Redux
    const { isVisible, menuButtonLayout, selectedListId } = useSelector(state => state.listItemMenu);

    const handleModalPress = (event: any) => {
        if (event.target === event.currentTarget) {
            dispatch(closeMenu()); // Close via Redux
        }
    };

    const calculateDropdownPosition = () => {
        if (!menuButtonLayout) return null; // Guard against null layout

        const DROPDOWN_OFFSET = 5;
        let initialTop = menuButtonLayout.y + menuButtonLayout.height + DROPDOWN_OFFSET - 20;
        let initialLeft = menuButtonLayout.x - 40;
        const modalHeight = 200; // Adjust this value if your modal's height is different
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
            id: selectedListId,
            type: 'edit'
        });
        dispatch(closeMenu()); // Close via Redux
    };

    const handleDelete = () => {
        onItemPress({
            id: selectedListId,
            type: 'delete'
        });
        dispatch(closeMenu()); // Close via Redux
    };

    const handleShare = () => {
        onItemPress({
            id: selectedListId,
            type: 'share'
        });
        dispatch(closeMenu()); // Close via Redux
    };

    const handleArchive = () => {
        onItemPress({
            id: selectedListId,
            type: 'archive'
        });
        dispatch(closeMenu()); // Close via Redux
    };


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => dispatch(closeMenu())} // Close via Redux
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