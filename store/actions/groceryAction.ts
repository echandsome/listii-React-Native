import supabase from '@/supabase';
import { Dispatch } from 'redux';
import store from '@/store';
import {  addItem, updateItem, removeItem, 
    setAllItemsFalse, setAllItemsTrue, removeItemsFalse, removeItemsTrue } from '@/store/reducers/groceryReducer';
import { findItemByUserIdAndId } from '@/helpers/utility';
import { replaceItemInStorage } from '../localstorage';
import { tbl_names } from '@/constants/Config';

export async function addItemByDB(nData: any , dispatch: Dispatch) {
    const { userId, listId, item: { name, price, quantity, shop } } = nData
    if (userId) {
       
        let _item = findItemByUserIdAndId(userId, listId) || [];
        _item.total = Number(_item.total) + price * quantity;
        _item.item_number = _item.item_number + 1;
        
        let _data = {
            "user_id": userId,
            "name": name,
            "list_name": _item.clean_name,
            "checked": false,
            "deleted": false,
            "edited": false,
            "price": price,
            "quantity": quantity,
            "store_name": shop,
            "shared_with": null,         
        }
        
        const [items, lists] = await Promise.all([
            supabase.from(tbl_names.items).insert(_data).select('id'),
            supabase.from(tbl_names.lists).update({item_number: _item.item_number, total: _item.total}).eq('id', _item.id)
        ]);

        if (lists.error || items.error ) {
            console.error("Error inserting user:", lists.error, items.error);
        } else {
            replaceItemInStorage(tbl_names.lists, userId, listId, _item)
            dispatch(addItem({ listId, item: {...nData.item, id: items.data[0].id}}));
        }
 
    }else {
        dispatch(addItem(nData));
    }
}

export async function removeItemByDB(nData: any, dispatch: Dispatch) {
    const {userId, listId, itemId} = nData;

    if (userId) {

        let listItems = store.getState().grocery.listitems[listId] || [];
        let item = listItems.find(item => item.id == itemId) || undefined;
        if (!item) return;
        let _item = findItemByUserIdAndId(userId, listId) || [];
        _item.total = Number(_item.total) - item.price * item.quantity;
        _item.item_number = _item.item_number - 1;

        const [lists, items] = await Promise.all([
            supabase.from(tbl_names.items).update({ deleted: true }).eq('id', itemId),
            supabase.from(tbl_names.lists).update({item_number: _item.item_number, total: _item.total}).eq('id', _item.id)
        ]);

        if (lists.error || items.error) {
          console.error("Error deleting user:", lists.error || items.error);
        } else {
            replaceItemInStorage(tbl_names.lists, userId, listId, _item)
            dispatch(removeItem(nData));
        }
    }else {
        dispatch(removeItem(nData));
    }
}

export async function updateItemByDB(nData: any, dispatch: Dispatch) {
    const { userId, listId, item: newItem } = nData;
    if (userId) {
        let listItems = store.getState().grocery.listitems[listId] || [];
        let item = listItems.find(item => item.id == newItem.id) || undefined;
        if (!item) return;
        let _item = findItemByUserIdAndId(userId, listId) || [];
        _item.total = Number(_item.total) + (newItem.price * newItem.quantity) - (item.price * item.quantity);

        const [lists, items] = await Promise.all([
            supabase.from(tbl_names.items).update({ name: newItem.name, 
                price: newItem.price, quantity: newItem.quantity, store_name: newItem.shop, checked: newItem.is_check?? false }).eq('id', newItem.id),
            supabase.from(tbl_names.lists).update({total: _item.total}).eq('id', _item.id)
        ]);

        if (lists.error || items.error) {
            console.error("Error deleting user:", lists.error || items.error);
        } else {
            replaceItemInStorage(tbl_names.lists, userId, listId, _item)
            dispatch(updateItem(nData));
        }
    }else {
        dispatch(updateItem(nData));
    }
}

export async function updateAllItemsTrueByDB(nData: any, dispatch: Dispatch) {
    const { userId, listId } = nData;
    if (userId) {
        let _item = findItemByUserIdAndId(userId, listId) || [];

        const { data, error } = await supabase
        .from(tbl_names.items)
        .update({ checked: true })
        .eq("user_id", userId).eq("list_name", _item.clean_name);
       
        if (error) {
            console.error("Error updating user:", error);
        } else {
            dispatch(setAllItemsTrue(nData));
        }
    }else {
        dispatch(setAllItemsTrue(nData));
    }
}

export async function updateAllItemsFalseByDB(nData: any, dispatch: Dispatch) {
    const { userId, listId } = nData;
    if (userId) {
        let _item = findItemByUserIdAndId(userId, listId) || [];

        const { data, error } = await supabase
        .from(tbl_names.items)
        .update({ checked: false })
        .eq("user_id", userId).eq("list_name", _item.clean_name);
       
        if (error) {
            console.error("Error updating user:", error);
        } else {
            dispatch(setAllItemsFalse(nData));
        }
    }else {
        dispatch(setAllItemsFalse(nData));
    }
}

export async function removeItemsFalseByDB(nData: any, dispatch: Dispatch) {
    const {userId, listId} = nData;

    if (userId) {
        let _item = findItemByUserIdAndId(userId, listId) || [];
        const { data, error } = await supabase.from(tbl_names.items).update({ deleted: true })
            .eq("user_id", userId).eq("list_name", _item.clean_name).eq("checked", false);
  
        if (error) {
          console.error("Error deleting user:", error);
        } else {
          dispatch(removeItemsFalse(nData));
        }
    }else {
        dispatch(removeItemsFalse(nData));
    }
}

export async function removeItemsTrueByDB(nData: any, dispatch: Dispatch) {
    const {userId, listId} = nData;

    if (userId) {
        let _item = findItemByUserIdAndId(userId, listId) || [];
        const { data, error } = await supabase.from(tbl_names.items).update({ deleted: true })
            .eq("user_id", userId).eq("list_name", _item.clean_name).eq("checked", true);
  
        if (error) {
          console.error("Error deleting user:", error);
        } else {
          dispatch(removeItemsTrue(nData));
        }
    }else {
        dispatch(removeItemsTrue(nData));
    }
}
