import React, { useState, useMemo, useRef } from 'react';
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
    Clipboard,
    Dimensions
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocalSearchParams } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';
import { toggleTheme, selectThemeMode } from '@/store/reducers/themeSlice';
import * as groceryReducer from '@/store/reducers/groceryReducer';
import * as todoReducer from '@/store/reducers/todoReducer';
import * as bookmarkReducer from '@/store/reducers/bookmarkReducer';
import * as noteReducer from '@/store/reducers/noteReducer';
import { useColorScheme } from '@/hooks/useColorScheme';

import AddItemGroceryModal from '@/components/modals/AddItemGroceryModal';
import AddItemTodoModal from '@/components/modals/AddItemTodoModal';
import AddItemBookmarkModal from '@/components/modals/AddItemBookmarkModal';
import AddItemNoteModal from '@/components/modals/AddItemNoteModal';

import ThemeModal from '@/components/modals/ThemeModal';
import AlertModal from '@/components/modals/AlertModal';
import LogoutModal from '@/components/modals/LogoutModal';
import ListItemMenuModal from '@/components/modals/ListItemMenuModal';
import ListItemDeleteModal from '@/components/modals/ListItemDeleteModal';

import SelectInput from '@/components/ui/SelectInput';
import GroceryItem from '@/components/ui/GroceryItem';
import TodoItem from '@/components/ui/TodoItem';
import BookmarkItem from '@/components/ui/BookmarkItem';
import NoteItem from '@/components/ui/NoteItem';

import { images } from '@/constants/Resources';

// Define Types
interface ColorsType {
    text: string;
}

interface ItemType {
    id: string;
    isCart: boolean;
    price?: string;
    quantity?: number;
    note?: string;
    // Add other properties as needed
}

interface LayoutType {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface LocalSearchParams {
    type: 'Grocery' | 'ToDo' | 'Bookmark' | 'Note';
    name: string;
}

// Arrow Components
const UpArrow = (colors: ColorsType) => (
    <Text><Ionicons name="arrow-up" size={20} color={colors.text} /></Text>
);

const DownArrow = (colors: ColorsType) => (
    <Text><Ionicons name="arrow-down" size={20} color={colors.text} /></Text>
);

export default function ListDetailScreen() {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]); // Memoize styles
    const category = useLocalSearchParams<LocalSearchParams>();
    const colorScheme = useColorScheme();

    const dispatch = useDispatch();

    let itemlist: ItemType[] = [];
    let tempReducer: any;

    switch (category.type) {
        case 'Grocery':
            itemlist = useSelector((state: any) => state.grocery.items) as ItemType[];
            tempReducer = groceryReducer;
            break;
        case 'ToDo':
            itemlist = useSelector((state: any) => state.todo.items) as ItemType[];
            tempReducer = todoReducer;
            break;
        case 'Bookmark':
            itemlist = useSelector((state: any) => state.bookmark.items) as ItemType[];
            tempReducer = bookmarkReducer;
            break;
        case 'Note':
            itemlist = useSelector((state: any) => state.note.items) as ItemType[];
            tempReducer = noteReducer;
            break;
    }

    const { addItem, updateItem, removeItem, setAllItemsFalse, setAllItemsTrue, removeItemsFalse, removeItemsTrue } = tempReducer;

    const themeMode = useSelector(selectThemeMode);

    const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
    const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
    const [buttonLayout, setButtonLayout] = useState<LayoutType>({ x: 0, y: 0, width: 0, height: 0 });
    const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [alertModalVisible, setAlertModalVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('Are you absolutely sure?');
    const [alertContent, setAlertContent] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [showCartItems, setShowCartItems] = useState(true);
    const [showListItems, setShowListItems] = useState(true);

    const cartItems = useMemo(() => itemlist.filter((item) => item.isCart), [itemlist]);
    const listItems = useMemo(() => itemlist.filter((item) => !item.isCart), [itemlist]);
    const menuRef = useRef<View>(null);

    const handleToggleTheme = (event: string) => {
        const theme = event === "system" ? colorScheme : event;
        dispatch(toggleTheme(theme));
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

    const handleLogout = () => {
        // Implement logout logic here
    };

    const handleAlert = () => {
        if (selectedStatus === 'Check items' ||
            selectedStatus === 'Check bookmarks' || selectedStatus === 'Check notes') {
            dispatch(setAllItemsTrue());
        } else if (selectedStatus === 'Clear unchecked items' ||
            selectedStatus === 'Clear active bookmarks' || selectedStatus === 'Clear notes') {
            dispatch(removeItemsFalse());
        } else if (selectedStatus === 'Uncheck cart'
            || selectedStatus === 'Uncheck tasks' || selectedStatus === 'Uncheck bookmarks' || selectedStatus === 'Uncheck notes') {
            dispatch(setAllItemsFalse());
        } else if (selectedStatus === 'Clear cart'
            || selectedStatus === 'Clear completed tasks' || selectedStatus === 'Clear hidden bookmarks' || selectedStatus === 'Clear hidden notes') {
            dispatch(removeItemsTrue());
        }
    };

    let listTypes: string[] = [];
    if (listItems.length > 0) {
        if (category.type === 'Bookmark') {
            listTypes.push('Check bookmarks');
            listTypes.push('Clear active bookmarks');
        } else if (category.type === 'Note') {
            listTypes.push('Check notes');
            listTypes.push('Clear notes');
        } else {
            listTypes.push('Check items');
            listTypes.push('Clear unchecked items');
        }
    }
    if (cartItems.length > 0) {
        if (category.type === 'Grocery') {
            listTypes.push('Uncheck cart');
            listTypes.push('Clear cart');
        } else if (category.type === 'ToDo') {
            listTypes.push('Uncheck tasks');
            listTypes.push('Clear completed tasks');
        } else if (category.type === 'Bookmark') {
            listTypes.push('Uncheck bookmarks');
            listTypes.push('Clear hidden bookmarks');
        } else if (category.type === 'Note') {
            listTypes.push('Uncheck notes');
            listTypes.push('Clear hidden notes');
        }

    }
    const handleSelectListType = (status: string) => {
        setSelectedStatus(status);
        if (status === 'Check items' ||
            status === 'Check bookmarks' || status === 'Check notes') {
            setAlertContent('');
        } else if (status === 'Clear unchecked items' ||
            status === 'Clear active bookmarks' || status === 'Clear notes') {
            setAlertContent('This action cannot be undone. This will permanently remove your unchecked items from our servers.');
        } else if (status === 'Uncheck cart'
            || status === 'Uncheck tasks' || status === 'Uncheck bookmarks' || status === 'Uncheck notes') {
            setAlertContent('');
        } else if (status === 'Clear cart'
            || status === 'Clear completed tasks' || status === 'Clear hidden bookmarks' || status === 'Clear hidden notes') {
            setAlertContent('This action cannot be undone. This will permanently remove your completed tasks from our servers.');
        }
        setAlertModalVisible(true);
    };

    const openAddItemModal = () => {
        setIsAddItemModalVisible(true);
    };

    const closeAddItemModal = () => {
        setSelectedItem(null);
        setIsAddItemModalVisible(false);
    };

    const handleAddNewItem = (item: any, mode: string) => {
        if (mode === 'add') {
            dispatch(addItem({ ...item, id: uuidv4() }));
        } else {
            dispatch(updateItem({ ...item, id: selectedItem!.id }));
        }

        setSelectedItem(null);
        closeAddItemModal();
    };

    const calculateTotal = (items: ItemType[]) => {
        return items.reduce((sum, item) => sum + (parseFloat(item.price || '0') * (item.quantity || 1)), 0);
    };

    const cartTotal = calculateTotal(cartItems);
    const listTotal = calculateTotal(listItems);

    const handleToggleCart = (itemId: string) => {
        const itemToUpdate = itemlist.find((item) => item.id === itemId);
        if (itemToUpdate) {
            dispatch(updateItem({ ...itemToUpdate, isCart: !itemToUpdate.isCart }));
        }
    };

    const [isVisible, setVisible] = useState<boolean | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [menuButtonLayout, setMenuButtonLayout] = useState<any>(null);

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
        if (selectedItem) {
            dispatch(removeItem(selectedItem.id));
            setSelectedItem(null);
            setDeleteModalVisible(false);
        }
    };

    const handleItemMenu = (data: any) => {
        let item = itemlist.find((item: { id: string; }) => item.id === data.id);
        setSelectedItem(item);
        if (data.type == 'edit') openAddItemModal();
        else if (data.type == 'delete') setDeleteModalVisible(true);
        else if (data.type == 'copy') Clipboard.setString(item.note);
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
                        <TouchableOpacity style={styles.newlist} onPress={openAddItemModal}>
                            <Text style={styles.newlistText}>+ New Item</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={styles.signout} onPress={() => setLogoutModalVisible(true)}>
                            <Text style={styles.signoutText}>Sign Out</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.themeToggleButton} onPress={openThemeModal} onLayout={onButtonLayout}>
                            <Image
                                source={images[themeMode].theme}
                                style={styles.themeToggleImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        <ThemeModal
                            visible={isThemeModalVisible}
                            onClose={closeThemeModal}
                            setTheme={handleToggleTheme}
                            buttonLayout={buttonLayout}
                        />
                    </View>

                    {category.type === 'Grocery' && (
                        <AddItemGroceryModal
                            visible={isAddItemModalVisible}
                            onClose={closeAddItemModal}
                            onAddItem={handleAddNewItem}
                            mode={selectedItem ? 'edit' : 'add'}
                            initialData={selectedItem}
                        />
                    )}
                    {category.type === 'ToDo' && (
                        <AddItemTodoModal
                            visible={isAddItemModalVisible}
                            onClose={closeAddItemModal}
                            onAddItem={handleAddNewItem}
                            mode={selectedItem ? 'edit' : 'add'}
                            initialData={selectedItem}
                        />
                    )}
                    {category.type === 'Bookmark' && (
                        <AddItemBookmarkModal
                            visible={isAddItemModalVisible}
                            onClose={closeAddItemModal}
                            onAddItem={handleAddNewItem}
                            mode={selectedItem ? 'edit' : 'add'}
                            initialData={selectedItem}
                        />
                    )}
                    {category.type === 'Note' && (
                        <AddItemNoteModal
                            visible={isAddItemModalVisible}
                            onClose={closeAddItemModal}
                            onAddItem={handleAddNewItem}
                            mode={selectedItem ? 'edit' : 'add'}
                            initialData={selectedItem}
                        />
                    )}
                </View>

                <SelectInput
                    label=""
                    value={category.name}
                    options={listTypes}
                    onSelect={handleSelectListType}
                    colors={colors}
                    style={{ width: 200 }}
                />

                {category.type === 'Grocery' && (
                    <>
                        <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowListItems(!showListItems)}>
                            <Text>{listItems.length} list items totaling: R{listTotal}</Text>
                            {showListItems ? <UpArrow colors={colors} /> : <DownArrow colors={colors} />}
                        </TouchableOpacity>
                        {showListItems && (
                            <View>
                                {listItems.map(item => (
                                    <GroceryItem key={item.id} item={item} openMenuModal={openMenuModal} handleToggleCart={handleToggleCart} />
                                ))}
                            </View>
                        )}

                        <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowCartItems(!showCartItems)}>
                            <Text>{cartItems.length} cart items totaling: R{cartTotal}</Text>
                            {showCartItems ? <UpArrow colors={colors} /> : <DownArrow colors={colors} />}
                        </TouchableOpacity>
                        {showCartItems && (
                            <View>
                                {cartItems.map(item => (
                                    <GroceryItem key={item.id} item={item} openMenuModal={openMenuModal} handleToggleCart={handleToggleCart} />
                                ))}
                            </View>
                        )}
                    </>
                )}

                {category.type === 'ToDo' && (
                    <>
                        <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowListItems(!showListItems)}>
                            <Text>{listItems.length} task in progress</Text>
                            {showListItems ? <UpArrow colors={colors} /> : <DownArrow colors={colors} />}
                        </TouchableOpacity>
                        {showListItems && (
                            <View>
                                {listItems.map(item => (
                                    <TodoItem key={item.id} item={item} openMenuModal={openMenuModal} handleToggleCart={handleToggleCart} />
                                ))}
                            </View>
                        )}

                        <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowCartItems(!showCartItems)}>
                            <Text>{cartItems.length} task completed</Text>
                            {showCartItems ? <UpArrow colors={colors} /> : <DownArrow colors={colors} />}
                        </TouchableOpacity>
                        {showCartItems && (
                            <View>
                                {cartItems.map(item => (
                                    <TodoItem key={item.id} item={item} openMenuModal={openMenuModal} handleToggleCart={handleToggleCart} />
                                ))}
                            </View>
                        )}
                    </>
                )}

                {category.type === 'Bookmark' && (
                    <>
                        <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowListItems(!showListItems)}>
                            <Text>{listItems.length} bookmarks active</Text>
                            {showListItems ? <UpArrow colors={colors} /> : <DownArrow colors={colors} />}
                        </TouchableOpacity>
                        {showListItems && (
                            <View>
                                {listItems.map(item => (
                                    <BookmarkItem key={item.id} item={item} openMenuModal={openMenuModal} handleToggleCart={handleToggleCart} />
                                ))}
                            </View>
                        )}

                        <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowCartItems(!showCartItems)}>
                            <Text>{cartItems.length} bookmarks hidden</Text>
                            {showCartItems ? <UpArrow colors={colors} /> : <DownArrow colors={colors} />}
                        </TouchableOpacity>
                        {showCartItems && (
                            <View>
                                {cartItems.map(item => (
                                    <BookmarkItem key={item.id} item={item} openMenuModal={openMenuModal} handleToggleCart={handleToggleCart} />
                                ))}
                            </View>
                        )}
                    </>
                )}

                {category.type === 'Note' && (
                    <>
                        <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowListItems(!showListItems)}>
                            <Text>{listItems.length} notes active</Text>
                            {showListItems ? <UpArrow colors={colors} /> : <DownArrow colors={colors} />}
                        </TouchableOpacity>
                        {showListItems && (
                            <View>
                                {listItems.map(item => (
                                    <NoteItem key={item.id} item={item} openMenuModal={openMenuModal} handleToggleCart={handleToggleCart} />
                                ))}
                            </View>
                        )}

                        <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowCartItems(!showCartItems)}>
                            <Text>{cartItems.length} notes hidden</Text>
                            {showCartItems ? <UpArrow colors={colors} /> : <DownArrow colors={colors} />}
                        </TouchableOpacity>
                        {showCartItems && (
                            <View>
                                {cartItems.map(item => (
                                    <NoteItem key={item.id} item={item} openMenuModal={openMenuModal} handleToggleCart={handleToggleCart} />
                                ))}
                            </View>
                        )}
                    </>
                )}

                <AlertModal
                    visible={alertModalVisible}
                    title={alertTitle}
                    content={alertContent}
                    onClose={() => setAlertModalVisible(false)}
                    onConfirm={handleAlert}
                />
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
                    detailTab={category.type}
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
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            alignItems: 'center',
        },
        scrollContainer: {
            paddingHorizontal: 20,
            width: '100%', // Make sure it takes full width
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
            width: 24,
            height: 24,
            color: colors.text,
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
            marginBottom: 18,
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
        },
    });