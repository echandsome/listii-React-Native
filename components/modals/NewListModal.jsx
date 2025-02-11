import React, { useState } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

const NewListModal = ({ visible, onClose, onAdd }) => {
    const { colors } = useTheme();
    const styles = getModalStyles(colors);

    const [listName, setListName] = useState('');
    const [listType, setListType] = useState('Grocery');
    const [showListTypeOptions, setShowListTypeOptions] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const listTypes = ['Grocery', 'ToDo', 'Bookmark', 'Note'];

    const handleSelectListType = (type) => {
        setListType(type);
        setShowListTypeOptions(false);
    };

    const handleListTypeButtonLayout = (event) => {
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

    const handleModalPress = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleAddPress = () => {
        if (listName !== '') {
            onAdd({
                name: listName,
                type: listType,
            });
            setListName('');
            setListType('Grocery');
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalListOverlay} onPress={handleModalPress}>
                <View style={styles.newListModalContent}>
                    <View style={styles.newListModalHeader}>
                        <Text style={[styles.newListModalTitle, styles.textColor]}>Add a new list</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={[styles.textColor, { fontSize: 20 }]}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.newListModalBody}>
                        <Text style={[styles.textColor, styles.label]}>Name</Text>
                        <TextInput
                            style={[styles.input, styles.textColor]}
                            value={listName}
                            onChangeText={setListName}
                            placeholder="List Name"
                            placeholderTextColor={styles.placeholder.color}
                        />

                        <Text style={[styles.textColor, styles.label]}>List Type</Text>
                        <TouchableOpacity
                            style={styles.selectContainer}
                            onPress={() => setShowListTypeOptions(!showListTypeOptions)}
                            onLayout={handleListTypeButtonLayout}
                        >
                            <Text style={[styles.selectText, styles.textColor]}>{listType}</Text>
                        </TouchableOpacity>

                        {showListTypeOptions && (
                            <View style={[styles.dropdownOptionsContainer, calculateDropdownPosition()]}>
                                {listTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={styles.dropdownOption}
                                        onPress={() => handleSelectListType(type)}
                                    >
                                        <Text style={[styles.dropdownOptionText, styles.textColor]}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <TouchableOpacity style={styles.newlist} onPress={handleAddPress}>
                            <Text style={styles.newlistText}>Add List</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const getModalStyles = (colors) =>
    StyleSheet.create({
        modalListOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        newListModalContent: {
            backgroundColor: colors.background,
            borderRadius: 8,
            width: 300,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        newListModalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
        },
        newListModalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        newListModalBody: {
            marginBottom: 15,
        },
        label: {
            fontSize: 16,
            marginBottom: 5,
        },
        input: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 4,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginBottom: 10,
        },
        placeholder: {
            color: '#999',
        },
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
        },
        dropdownOption: {
            paddingVertical: 8,
            paddingHorizontal: 12,
        },
        dropdownOptionText: {
            fontSize: 16,
        },
        newlist: {
            backgroundColor: '#007bff',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 5,
            marginRight: 10,
        },
        newlistText: {
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
        },
        textColor: {
            color: colors.text,
        },
    });

export default NewListModal;