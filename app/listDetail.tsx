import React, { useState, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocalSearchParams } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons'; // Or any other icon library
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import { addItem, updateItem, removeItem } from '@/store/reducers/groceryReducer'; // Import updateItem action
import { useColorScheme } from '@/hooks/useColorScheme';
import ThemeModal from '@/components/modals/ThemeModal';
import AddItemGroceryModal from '@/components/modals/AddItemGroceryModal';
import LogoutModal from '@/components/modals/LogoutModal';
import { images } from '@/constants/Resources';
import SelectInput from '@/components/ui/SelectInput';

import GroceryItem from '@/components/ui/GroceryItem'; // Import the new component
import ListItemMenuModal from '@/components/modals/ListItemMenuModal';
import ListItemDeleteModal from '@/components/modals/ListItemDeleteModal';

const UpArrow = (colors: any) => (
    <Text><Ionicons name="arrow-up" size={20} color={colors.text} /></Text> 
);

const DownArrow = (colors: any) => (
    <Text><Ionicons name="arrow-down" size={20} color={colors.text} /></Text> 
);

export default function ListDetailScreen() {

    const { colors } = useTheme();
    const styles = getStyles(colors);
    const dispatch = useDispatch();

    const item = useLocalSearchParams();
    const itemlist = useSelector((state) => state.grocery.items);
    const themeMode = useSelector(selectThemeMode);
    const colorScheme = useColorScheme();

    const [selectedItem, setSelectedItem] = useState(null);
    const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [isAddItemGroceryModalVisible, setIsAddItemGroceryModalVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const [showCartItems, setShowCartItems] = useState(true); // State to control cart visibility
    const [showListItems, setShowListItems] = useState(true); // State to control list visibility

    const cartItems = useMemo(() => itemlist.filter((item: { isCart: any; }) => item.isCart), [itemlist]);
    const listItems = useMemo(() => itemlist.filter((item: { isCart: any; }) => !item.isCart), [itemlist]);

    const handleToggleTheme = (event: any) => {
        if (event == "system") event = colorScheme;
        dispatch(toggleTheme(event));
    };

    const openThemeModal = () => {
        setIsThemeModalVisible(true);
    };

    const closeThemeModal = () => {
        setIsThemeModalVisible(false);
    };

    const onButtonLayout = (event: any) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setButtonLayout({ x, y, width, height });
    };

    const openAddItemGroceryModal = () => {
        setIsAddItemGroceryModalVisible(true);
    };
    const closeAddItemGroceryModal = () => {
        setSelectedItem(null);
        setIsAddItemGroceryModalVisible(false);
    };
    const handleAddNewItem = (item: any, mode: string) => {
        if (mode === 'add') {
            dispatch(addItem({ ...item, id: uuidv4() }));
        } else {
            dispatch(updateItem({ ...item, id: selectedItem.id }));
        }
        setSelectedItem(null);
        closeAddItemGroceryModal();
    };

    const handleLogout = () => {

    }

    let listTypes: string[] = [];
    if (listItems.length > 0) {
        listTypes.push('Check items');
        listTypes.push('Clear  list');
    }
    if (cartItems.length > 0) {
        listTypes.push('Uncheck cart');
        listTypes.push('Clear  cart');
    }

    const handleSelectListType = (data: any) => {
       
    };

    const calculateTotal = (items: any) => {
        return items.reduce((sum: number, item: { price: any; quantity: any; }) => sum + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);
    }

    const cartTotal = calculateTotal(cartItems);
    const listTotal = calculateTotal(listItems);

    const handleToggleCart = (itemId: any) => {
        const itemToUpdate = itemlist.find((item: { id: any; }) => item.id === itemId);
        if (itemToUpdate) {
            dispatch(updateItem({ ...itemToUpdate, isCart: !itemToUpdate.isCart }));
        }
    };

    const [isVisible, setVisible] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [menuButtonLayout, setMenuButtonLayout] = useState(null);
    const openMenuModal = (ref: any, itemId: any) => {
        if (ref.current) {
            ref.current.measure((fx, fy, width, height, px, py) => {
                setMenuButtonLayout({ x: px, y: py, width, height });
                setSelectedId(itemId);
                setVisible(true);
            });
        }
    }
    const onMenuClose = () => {
        setVisible(false);
    }

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const handleDelete = () => {
        dispatch(removeItem(selectedItem.id));
        setSelectedItem(null);
        setDeleteModalVisible(false);
    };

    const handleItemMenu = (data: any) => {
        setSelectedItem (itemlist.find((item: {id: string;}) => item.id === data.id));
        if (data.type == 'edit') openAddItemGroceryModal();
        else if (data.type == 'delete') setDeleteModalVisible(true);
    }

    return (
        <SafeAreaView style={[styles.container, styles.bgColor]}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.header}>
                    <View style={styles.headerLogo}>
                        <Link href='/list'>
                            <Image
                                source={images[themeMode].back}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </Link>
                        <TouchableOpacity style={styles.newlist} onPress={openAddItemGroceryModal}>
                            <Text style={styles.newlistText}>+ New Item</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={styles.signout} onPress={() => setLogoutModalVisible(true)}>
                            <Text style={styles.signoutText}>Sign Out</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.themeToggleButton} onPress={openThemeModal} onLayout={onButtonLayout}>
                            <Text>
                                <Image
                                    source={images[themeMode].theme}
                                    style={styles.themeToggleImage}
                                    resizeMode="contain"
                                />
                            </Text>
                        </TouchableOpacity>

                        <ThemeModal
                            visible={isThemeModalVisible}
                            onClose={closeThemeModal}
                            setTheme={handleToggleTheme}
                            buttonLayout={buttonLayout}
                        />
                    </View>
                    <AddItemGroceryModal
                        visible={isAddItemGroceryModalVisible}
                        onClose={closeAddItemGroceryModal}
                        onAddItem={handleAddNewItem}
                        mode={selectedItem ? 'edit' : 'add'}
                        initialData={selectedItem}
                    />
                </View>

                <SelectInput
                    label=""
                    value={item.name}
                    options={listTypes}
                    onSelect={handleSelectListType}
                    colors={colors}
                    style={{ width: 135 }}
                />

                {/* List Items Section */}
                <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowListItems(!showListItems)}>
                    <Text>{listItems.length} list items totaling: R{listTotal}</Text>
                    {showListItems ? <UpArrow colors /> : <DownArrow colors />}
                </TouchableOpacity>
                {showListItems && (
                    <View>
                        {listItems.map(item => (
                            <GroceryItem key={item.id} item={item} openMenuModal={openMenuModal} handleToggleCart={handleToggleCart} />
                        ))}
                    </View>
                )}

                {/* Cart Items Section */}
                <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowCartItems(!showCartItems)}>
                    <Text>{cartItems.length} cart items totaling: R{cartTotal}</Text>
                    {showCartItems ? <UpArrow colors /> : <DownArrow colors />}
                </TouchableOpacity>
                {showCartItems && (
                    <View>
                        {cartItems.map(item => (
                            <GroceryItem key={item.id} item={item} openMenuModal={openMenuModal} handleToggleCart={handleToggleCart}  />
                        ))}
                    </View>
                )}

                <LogoutModal
                    visible={logoutModalVisible}
                    onClose={() => setLogoutModalVisible(false)}
                    onLogout={handleLogout}
                />
                <ListItemDeleteModal
                    visible={deleteModalVisible}
                    onClose={() => setDeleteModalVisible(false)}
                    onDelete={handleDelete}
                />
                <ListItemMenuModal
                    isVisible={isVisible}
                    selectedId={selectedId}
                    menuButtonLayout={menuButtonLayout}
                    onMenuClose={onMenuClose}
                    onItemPress={handleItemMenu}
                    activeTab='Detail'
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            alignItems: 'center',
        },
        scrollContainer: {
            paddingHorizontal: 20,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            paddingTop: 15,
        },
        headerLogo: {
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center'
        },
        logo: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text, // Use theme text color
        },
        headerButtons: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        newlist: {
            backgroundColor: '#007bff',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 5,
            marginRight: 10,
        },
        newlistText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        signout: {
            backgroundColor: '#ddd',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 5,
            marginRight: 10,
        },
        signoutText: {
            color: '#333',
            fontWeight: 'bold',
        },
        //Theme
        bgColor: {
            backgroundColor: colors.background,
        },
        textColor: {
            color: colors.text,
        },
        themeToggleButton: {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 10,
            borderRadius: 5,
        },
        themeToggleImage: {

        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 5,
            backgroundColor: '#f0f0f0',
            borderRadius: 5,
            marginBottom: 5,
        },
        listItemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        listItem: {
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        listItemShop: {
            fontSize: 12,
            color: colors.text,
        },
        listItemName: {
            fontSize: 16,
            color: colors.text,
        }
    });