import supabase from '@/supabase';
import { Dispatch } from 'redux';
import store from '@/store';
import { v4 as uuidv4 } from 'uuid';
import { setList, addList, deleteList,
    updateList, archiveList, restoreList } from '@/store/reducers/listSlice';
import { setItems as setItemsGrocery, addItems as addItemsGrocery } from '@/store/reducers/groceryReducer';
import { setItems as setItemsBookmark, addItems as addItemsBookmark } from '@/store/reducers/bookmarkReducer';
import { setItems as setItemsTodo, addItems as addItemsTodo } from '@/store/reducers/todoReducer';
import { setItems as setItemsNote, addItems as addItemsNote } from '@/store/reducers/noteReducer';
import { getData, storeData, addToData,replaceItemInStorage } from '../localstorage';
import { listExists, createNewCleanName, findItemByUserIdAndId } from '@/helpers/utility';

import { tbl_names } from '@/constants/Config';

const groupAndTransformItems = (data: any[], list: any, type: any) => {

    let transformedData: any[] = [];
    switch (type) {
        case 'note':
            transformedData = data.map(({ id, name, list_name, notes, checked }) => ({
                id,
                name,
                list_name,
                note: notes,
                is_check: checked,
            }));
            break;
        case 'bookmark':
            transformedData = data.map(({ id, name, link, list_name, checked }) => ({
                id,
                name,
                path: link,
                list_name,
                is_check: checked,
            }));
            break;
        case 'todo':
            transformedData = data.map(({ id, name, priority, list_name, checked }) => ({
                id,
                name,
                priority,
                list_name,
                is_check: checked,
            }));
            break;
        case 'grocery':
            transformedData = data.map(({ id, name, price, quantity, list_name, checked, store_name }) => ({
                id,
                name,
                price,
                quantity,
                list_name,
                is_check: checked,  
                shop: store_name  
            }));
            break;
    }

    return transformedData.reduce((acc: any, item: any) => {
        let id = getIdsByCleanName(list, item.list_name);

        if (id && !acc[id]) {
            acc[id] = [];
        }

        if (id) acc[id].push(item);

        return acc;
    }, {});
};

const getIdsByCleanName = (data: any[], cleanName: string) => {
    data = data.find(item => item.clean_name === cleanName);
    if (data) return data.id;
    else return null;
};

function transformData(data: any) {
    return data
        .filter(item => !item.deleted)
        .map(item => ({
            ...item,
            is_archive: item.archived,
            type: item.list_type,
        }));
}


export async function getLists(userId: string, dispatch: Dispatch) {
    if (!userId) return false;
    console.log('getLists');
    try {

        const [lists, items] = await Promise.all([
            supabase.from(tbl_names.lists).select().eq('user_id', userId).neq('deleted', true).order('created_at', { ascending: true }),
            supabase.from(tbl_names.items).select().eq('user_id', userId).neq('deleted', true).order('created_at', { ascending: true })
        ]);

        if (lists.error || items.error) {
            console.error("Error fetching data:", {
                lists: lists.error,
                items: items.error,
            });
            return false;
        }

        dispatch((dispatch) => {
            dispatch(setList(transformData(lists.data) || []));
            dispatch(setItemsGrocery(groupAndTransformItems(items.data || [], lists.data, 'grocery')));
            dispatch(setItemsBookmark(groupAndTransformItems(items.data || [], lists.data, 'bookmark')));
            dispatch(setItemsTodo(groupAndTransformItems(items.data || [], lists.data, 'todo')));
            dispatch(setItemsNote(groupAndTransformItems(items.data || [], lists.data, 'note')));
        });
        storeData(tbl_names.lists, lists.data);
        return true;
    } catch (error) {
        console.error("Unexpected error:", error);
        return false;
    }
}

export async function addNewList({ userId, name, type, id }, dispatch: Dispatch) {
    if (userId) {
        
        type = type.toLowerCase();
        let clean_name = name;
        if(listExists(getData(tbl_names.lists), name)) clean_name = createNewCleanName(clean_name);

        let _data = {
            "name": name,
            "list_type": type,
            "clean_name": clean_name,
            "total": 0,
            "item_number": 0,
            "user_id": userId,
            "deleted": false,
            "edited": false,
            "archived": false
        }
        
        const { data, error } = await supabase
        .from(tbl_names.lists)
        .insert([_data])
        .select('id');

        if (error) {
            console.error("Error inserting user:", error);
        } else {
            addToData({ id: data[0].id, ..._data }, tbl_names.lists);
            dispatch(addList({id: data[0].id, name, type}));
        }
    }else {
        dispatch(addList({id, name, type}));
    }
}

export async function deleteListByDB(userId: string, listId :string, dispatch: Dispatch) {
    if (userId) {

        let _item = findItemByUserIdAndId(userId, listId) || [];

        const [lists, items] = await Promise.all([
            supabase.from(tbl_names.lists).update({ deleted: true }).eq('clean_name', _item.clean_name),
            supabase.from(tbl_names.items).update({ deleted: true }).eq('list_name', _item.clean_name)
        ]);

        if (lists.error || items.error ) {
            console.error("Error deleting user:", lists.error, items.error);
        } else {
            dispatch(deleteList(_item.id));
        }
    }else {
        dispatch(deleteList(listId));
    }
}

export async function updateListByDB(nData: any, dispatch: Dispatch) {
    const { userId, id, updates } = nData;
    if (userId) {
        let _items = findItemByUserIdAndId(userId, id) || [];
        _items.name = updates.name;

        const {data, error} = await supabase
                .from(tbl_names.lists)
                .update({ name: updates.name }).eq("id", id)

    
        if (error) {
            console.error("Error updating user:", error);
        } else {
            replaceItemInStorage(tbl_names.lists, userId, id, _items)
            dispatch(updateList(nData));
        }
    }else {
        dispatch(updateList(nData));
    }
}

export async function duplicateListByDB(userId: string, nData: any, dispatch: Dispatch) {
    const {id, name, type, is_archive} = nData;
    let listItems: any = [];
    let tbl_items = '';
    switch (type) {
        case 'note':
        listItems = store.getState().note.listitems[id] || [];
        tbl_items = 'note_items';
        break;
        case 'bookmark':
        listItems = store.getState().bookmark.listitems[id] || [];
        tbl_items = 'bookmark_items';
        break;
        case 'todo':
        listItems = store.getState().todo.listitems[id] || [];
        tbl_items = 'todo_items';
        break;
        case 'grocery':
        listItems = store.getState().grocery.listitems[id] || [];
        tbl_items = 'grocery_items';
        break;
    }

    if (userId) {

        let _item = findItemByUserIdAndId(userId, id) || [];
        let clean_name = _item.clean_name;
        if(listExists(getData(tbl_names.lists), clean_name)) clean_name = createNewCleanName(clean_name);

        let _data = {
            "name": name,
            "list_type": type,
            "clean_name": clean_name,
            "total": _item.total,
            "item_number": _item.item_number,
            "user_id": userId,
            "deleted": false,
            "edited": false,
            "archived": is_archive?? false
        }

        let filteredData: any[] = [];
        
        switch (type) {
            case 'note':
                filteredData = listItems.map((item: any) => ({
                    "user_id": userId,
                    "name": item.name,
                    "list_name": clean_name,
                    "checked": item.is_check?? false,
                    "deleted": false,
                    "edited": false,
                    "notes": item.note,
                    "shared_with": null,  
                }));
                break;
            case 'bookmark':
                filteredData = listItems.map((item: any) => ({
                    "user_id": userId,
                    "name": item.name,
                    "list_name": clean_name,
                    "checked": item.is_check?? false,
                    "deleted": false,
                    "edited": false,
                    "link": item.path,
                    "shared_with": null,  
                }));
                break;
            case 'todo':
               filteredData = listItems.map((item: any) => ({
                    "user_id": userId,
                    "name": item.name,
                    "list_name": clean_name,
                    "checked": item.is_check?? false,
                    "deleted": false,
                    "edited": false,
                    "priority": item.priority,
                    "shared_with": null,  
                }));
                break;
            case 'grocery':
                filteredData = listItems.map((item: any) => ({
                    "user_id": userId,
                    "name": item.name,
                    "list_name": clean_name,
                    "checked": item.is_check?? false,
                    "deleted": false,
                    "edited": false,
                    "price": item.price,
                    "quantity": item.quantity,
                    "store_name": item.shop,
                    "shared_with": null,  
                }));
                break;
        }

        const [lists, items] = await Promise.all([
            supabase.from(tbl_names.lists).insert([_data]).select('id'),
            supabase.from(tbl_names.items).insert(filteredData).select('id')
        ]);

        if (lists.error || items.error) {
            console.error("Error inserting user:", lists.error, items.error);
        }else {
            addToData({ id: lists.data[0].id, ..._data }, tbl_names.lists);
            filteredData = listItems.map((item: any, index: int) => ({
                ...item,
                id: items.data[index].id
            }));
            console.log(filteredData);
            dispatch((dispatch) => {
                dispatch(addList({...nData, id: lists.data[0].id}));
                switch (type) {
                    case 'note':
                        dispatch(addItemsNote({ listId: lists.data[0].id, items: filteredData}));
                    break;
                    case 'bookmark':
                        dispatch(addItemsBookmark({ listId: lists.data[0].id, items: filteredData}));
                    break;
                    case 'todo':
                        dispatch(addItemsTodo({ listId: lists.data[0].id, items: filteredData}));
                    break;
                    case 'grocery':
                        dispatch(addItemsGrocery({ listId: lists.data[0].id, items: filteredData}));
                    break;
                }
            });
        }
    }else {
        const listId = uuidv4();
        const filteredData = listItems.map(({ created_at, ...rest }) => ({
            ...rest,
            id: uuidv4(),
            list_id: listId
        }));

        dispatch((dispatch) => {
            dispatch(addList({...nData, id: listId}));
            switch (type) {
                case 'Note':
                    dispatch(addItemsNote({ listId, items: filteredData}));
                break;
                case 'Bookmark':
                    dispatch(addItemsBookmark({ listId, items: filteredData}));
                break;
                case 'ToDo':
                    dispatch(addItemsTodo({ listId, items: filteredData}));
                break;
                case 'Grocery':
                    dispatch(addItemsGrocery({ listId, items: filteredData}));
                break;
            }
        });
    }
}

export async function archiveListByDB(userId: string, listId: string, dispatch: Dispatch) {
    if (userId) {
        const { data, error } = await supabase
            .from(tbl_names.lists)
            .update({ archived: true })
            .eq("user_id", userId).eq("id", listId);
        
        if (error) {
            console.error("Error updating user:", error);
        } else {
            dispatch(archiveList(listId));
        }
    }else {
        dispatch(archiveList(listId));
    }
}

export async function restoreListByDB(userId: string, listId: string, dispatch: Dispatch) {
    if (userId) {
        const { data, error } = await supabase
            .from(tbl_names.lists)
            .update({ archived: false })
            .eq("user_id", userId).eq("id", listId);
        
        if (error) {
            console.error("Error updating user:", error);
        } else {
            dispatch(restoreList(listId));
        }
    }else {
        dispatch(restoreList(listId));
    }  
}
