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
import { listExists, createCleanName, createNewCleanName, findItemByUserIdAndId } from '@/helpers/utility';

import { tbl_names } from '@/constants/Config';

export async function editStorage(type: string, newList: any, oldList: any, dispatch: Dispatch) {
    if (type == 'INSERT') {
        dispatch(addList({
            id: newList.id, name: newList.name, type: newList.list_type,
            is_archive: false
        }));
        await addToData(newList, tbl_names.lists);
    }else {
        dispatch(updateList({id: newList.id, updates: {name: newList.name, type: newList.list_type, is_archive: newList.archived}}))
        await replaceItemInStorage(tbl_names.lists, newList.user_id, newList.id, newList)
    }
} 

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
    data = data.find(item => item.clean_name == cleanName);
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
    try {

        const [lists, items] = await Promise.all([
            supabase.from(tbl_names.lists).select().neq('deleted', true).order('created_at', { ascending: true }),
            supabase.from(tbl_names.items).select().neq('deleted', true).order('created_at', { ascending: true })
        ]);

        if (lists.error || items.error) {
            console.error("Error fetching data:", {
                lists: lists.error,
                items: items.error,
            });
            return false;
        }
        
        // Await the dispatch call, even if it seems synchronous. This makes it more predictable and consistent.
        await dispatch((dispatch: Dispatch) => { //Explicitly type dispatch
            dispatch(setList(transformData(lists.data) || []));
            dispatch(setItemsGrocery(groupAndTransformItems(items.data || [], lists.data, 'grocery')));
            dispatch(setItemsBookmark(groupAndTransformItems(items.data || [], lists.data, 'bookmark')));
            dispatch(setItemsTodo(groupAndTransformItems(items.data || [], lists.data, 'todo')));
            dispatch(setItemsNote(groupAndTransformItems(items.data || [], lists.data, 'note')));
        });

        await storeData(tbl_names.lists, lists.data);
        return true;
    } catch (error) {
        console.error("Unexpected error:", error);
        return false;
    }
}

export async function addNewList({ userId, name, type, id }, dispatch: Dispatch) {
    if (userId) {
        
        type = type.toLowerCase();
        let clean_name = createCleanName(name);
        const lists = await getData(tbl_names.lists); // Get lists before calling listExists
        if(await listExists(lists, name)) clean_name = await createNewCleanName(clean_name);

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
        dispatch(addList({id: '-1000', name, type}));     
        const { data, error } = await supabase
        .from(tbl_names.lists)
        .insert([_data])
        .select('id');

        if (error) {
            console.error("Error inserting user:", error);
        } else {
            dispatch(updateList({id: '-1000', updates: {id: data[0].id, ..._data}}));
            await addToData({ id: data[0].id, ..._data }, tbl_names.lists);
        }
    }else {
        dispatch(addList({id, name, type}));
    }
}

export async function deleteListByDB(userId: string, listId :string, dispatch: Dispatch) {
    if (userId) {
       
        let _item = await findItemByUserIdAndId(userId, listId) || [];
        let auth = store.getState().auth;

        dispatch(deleteList(_item.id));

        if (_item.user_id != userId) {
            if (!_item.shared_with.includes(auth.user?.email)) return


            const { data, error } = await supabase.from(tbl_names.revoked_lists)
            .insert({ id: _item.id, clean_name: _item.clean_name, revoked: auth.user?.email });

            if (error) console.error("Error deleting user:", error);
        }else {
            const [listsRes, itemsRes] = await Promise.all([
                supabase.from(tbl_names.lists).update({ deleted: true }).eq('clean_name', _item.clean_name),
                supabase.from(tbl_names.items).update({ deleted: true }).eq('list_name', _item.clean_name)
            ]);
    
            if (listsRes.error || itemsRes.error ) {
                console.error("Error deleting user:", listsRes.error, itemsRes.error);
            } else {
               
            }
        }
        
    }else {
        dispatch(deleteList(listId));
    }
}

export async function updateShareListByDB(nData: any, dispatch: Dispatch) {
    const { userId, id, updates } = nData;
    if (userId) {

        const lists = await getData(tbl_names.lists); // Get lists before calling findItemByUserIdAndId
        let _items = await findItemByUserIdAndId(userId, id) || [];

        let shared_with = _items.shared_with ?? []

        if (shared_with.includes(updates.email)) return;

        shared_with.push(updates.email);

        _items.shared_with = shared_with;

        const [listsRes, itemsRes] = await Promise.all([
            supabase.from(tbl_names.lists).update({ shared_with: shared_with }).eq("clean_name", _items.clean_name),
            supabase.from(tbl_names.items).update({ shared_with: shared_with }).eq("list_name", _items.clean_name)
        ]);

        if (listsRes.error || itemsRes.error) {
            console.error("Error updating user:", listsRes.error, itemsRes.error);
        } else {
            await replaceItemInStorage(tbl_names.lists, userId, id, _items)
        }
    }else {
        
    }
}

export async function updateListByDB(nData: any, dispatch: Dispatch) {
    const { userId, id, updates } = nData;
    if (userId) {

        const lists = await getData(tbl_names.lists); // Get lists before calling findItemByUserIdAndId
        let _items = await findItemByUserIdAndId(userId, id) || [];

        if (_items.name == updates.name) return;

        _items.name = updates.name;

        let prev_clean_name = _items.clean_name;
        let clean_name = createCleanName(updates.name);
        if(await listExists(lists, clean_name)) clean_name = await createNewCleanName(clean_name);

        _items.clean_name = clean_name;

        dispatch(updateList(nData));

        const [listsRes, itemsRes] = await Promise.all([
            supabase.from(tbl_names.lists).update({ name: updates.name, clean_name: clean_name }).eq("id", id),
            supabase.from(tbl_names.items).update({ list_name: clean_name }).eq("list_name", prev_clean_name)
        ]);

        if (listsRes.error || itemsRes.error) {
            console.error("Error updating user:", listsRes.error, itemsRes.error);
        } else {
            await replaceItemInStorage(tbl_names.lists, userId, id, _items)
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

        const _item = await findItemByUserIdAndId(userId, id) || [];
        let clean_name = createCleanName(_item.clean_name);

        const lists = await getData(tbl_names.lists); // Get lists before calling listExists
        if(await listExists(lists, clean_name)) clean_name = await createNewCleanName(clean_name);

        let _data = {
            "name": name,
            "list_type": type,
            "clean_name": clean_name,
            "total": _item.total,
            "item_number": _item.item_number,
            "user_id": _item.user_id,
            "deleted": false,
            "edited": false,
            "archived": is_archive?? false
        }

        let filteredData: any[] = [];
        
        switch (type) {
            case 'note':
                filteredData = listItems.map((item: any) => ({
                    "user_id": _item.user_id,
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
                    "user_id": _item.user_id,
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
                    "user_id": _item.user_id,
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
                    "user_id": _item.user_id,
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

        const [listsRes, itemsRes] = await Promise.all([
            supabase.from(tbl_names.lists).insert([_data]).select('id'),
            supabase.from(tbl_names.items).insert(filteredData).select('id')
        ]);

        if (listsRes.error || itemsRes.error) {
            console.error("Error inserting user:", listsRes.error, itemsRes.error);
        }else {
            await addToData({ id: listsRes.data[0].id, ..._data }, tbl_names.lists);
            const itemsData = itemsRes.data;
            filteredData = listItems.map((item: any, index: number) => ({
                ...item,
                id: itemsData[index].id
            }));

            await dispatch((dispatch: Dispatch) => {
                dispatch(addList({...nData, id: listsRes.data[0].id}));
                switch (type) {
                    case 'note':
                         dispatch(addItemsNote({ listId: listsRes.data[0].id, items: filteredData}));
                    break;
                    case 'bookmark':
                         dispatch(addItemsBookmark({ listId: listsRes.data[0].id, items: filteredData}));
                    break;
                    case 'todo':
                         dispatch(addItemsTodo({ listId: listsRes.data[0].id, items: filteredData}));
                    break;
                    case 'grocery':
                         dispatch(addItemsGrocery({ listId: listsRes.data[0].id, items: filteredData}));
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

        await dispatch((dispatch: Dispatch) => {
            dispatch(addList({...nData, id: listId}));
            switch (type) {
                case 'note':
                    dispatch(addItemsNote({ listId, items: filteredData}));
                break;
                case 'bookmark':
                    dispatch(addItemsBookmark({ listId, items: filteredData}));
                break;
                case 'todo':
                    dispatch(addItemsTodo({ listId, items: filteredData}));
                break;
                case 'grocery':
                    dispatch(addItemsGrocery({ listId, items: filteredData}));
                break;
            }
        });
    }
}

export async function archiveListByDB(userId: string, listId: string, dispatch: Dispatch) {
    if (userId) {
        dispatch(archiveList(listId));

        const { data, error } = await supabase
            .from(tbl_names.lists)
            .update({ archived: true }).eq("id", listId);
        
        if (error) {
            console.error("Error updating user:", error);
        } else {
            
        }
    }else {
        dispatch(archiveList(listId));
    }
}

export async function restoreListByDB(userId: string, listId: string, dispatch: Dispatch) {
    if (userId) {
        dispatch(restoreList(listId));
        
        const { data, error } = await supabase
            .from(tbl_names.lists)
            .update({ archived: false }).eq("id", listId);
        
        if (error) {
            console.error("Error updating user:", error);
        } else {
           
        }
    }else {
        dispatch(restoreList(listId));
    }  
}