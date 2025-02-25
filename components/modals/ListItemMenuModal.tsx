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
    Platform,
    useWindowDimensions
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { images } from '@/constants/Resources';
import { screenWidth, screenHeight, baseFontSize, isSmallScreen } from '@/constants/Config';
import { useSelector } from 'react-redux';

const ListItemMenuModal = ({isVisible, selectedId, menuButtonRef, onMenuClose, onItemPress, activeTab, detailTab, isLargeScreen}) => {
    const { colors } = useTheme();
    const styles = getModalStyles(colors);
    const [adjustedPosition, setAdjustedPosition] = useState(null);

    const { width } = useWindowDimensions();

    const userInfo = useSelector((state) => state.auth);

    const handleModalPress = (event: any) => {
        if (event.target == event.currentTarget) {
            onMenuClose();
        }
    };

    const calculateDropdownPosition = () => {
        if (!menuButtonRef?.current) return null; // Guard clause for null layout
    
        menuButtonRef.current.measure((fx, fy, fwidth, height, px, py) => {
            const DROPDOWN_OFFSET = 5;
            let initialTop = py + DROPDOWN_OFFSET;
            let initialLeft = px;
    
            if (Platform.OS !== 'web') initialTop -= height;
            else initialTop += height;
    
            let modalHeight = activeTab !== 'Detail' ? 250 : 120;
            const modalWidth = 40;
    
            // Ensure dropdown fits within screen boundaries
            if (initialTop + modalHeight > screenHeight) {
                initialTop = screenHeight - modalHeight - 10;
            }
            if (initialLeft < 0) {
                initialLeft = 10;
            }
    
            setAdjustedPosition({
                top: initialTop,
                right: width - initialLeft,
                width: modalWidth,
            });
        });
    };

    
    useEffect(() => {
        if (isVisible && menuButtonRef) {
            calculateDropdownPosition()
        }
    }, [isVisible, menuButtonRef, isLargeScreen]);

    const handlePress = (type: string) => {
        onItemPress({
            id: selectedId,
            type: type
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
                        <TouchableOpacity style={styles.listItemMenuOption} onPress={() => handlePress('edit')}>
                            <Image source={images['dark'].edit} style={styles.listItemMenuIcon} />
                            <Text style={[styles.listItemMenuText, styles.textColor]}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItemMenuOption} onPress={() => handlePress('delete')}>
                            <Image source={images['dark'].delete} style={styles.listItemMenuIcon} />
                            <Text style={[styles.listItemMenuText, styles.textColor]}></Text>
                        </TouchableOpacity>
                        {
                            activeTab != 'Detail'? (
                                <>
                                    {
                                        userInfo.isAuthenticated? (
                                            <TouchableOpacity style={styles.listItemMenuOption} onPress={() => handlePress('share')}>
                                                <Image source={images['dark'].share} style={styles.listItemMenuIcon} />
                                                <Text style={[styles.listItemMenuText, styles.textColor]}></Text>
                                            </TouchableOpacity>
                                        ): (<></>)
                                    }
                                    
                                    <TouchableOpacity style={styles.listItemMenuOption} onPress={() => handlePress('duplicate')}>
                                        <Image source={images['dark'].duplicate} style={styles.listItemMenuIcon} />
                                        <Text style={[styles.listItemMenuText, styles.textColor]}></Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.listItemMenuOption} onPress={() => handlePress('archive')}>
                                        <Image source={
                                            activeTab == 'Lists'? (images['dark'].archive): (images['dark'].unarchive)
                                        } style={styles.listItemMenuIcon} />
                                        <Text style={[styles.listItemMenuText, styles.textColor]}></Text>
                                    </TouchableOpacity>
                                </>
                            ): (
                                <>
                                {
                                    detailTab == 'note'? (
                                        <TouchableOpacity style={styles.listItemMenuOption} onPress={() => handlePress('copy')}>
                                            <Image source={images['dark'].copy} style={styles.listItemMenuIcon} />
                                            <Text style={[styles.listItemMenuText, styles.textColor]}></Text>
                                        </TouchableOpacity>
                                    ): (
                                        <></>
                                    )
                                }
                                </>
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
            position: 'absolute', // Make sure position is absolute to control top/left
        },
        listItemMenuOption: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            width: 40,
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