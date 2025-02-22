import supabase from '@/supabase';
import { Dispatch } from 'redux';
import store from '@/store';
import {  addItem, updateItem, removeItem, 
    setAllItemsFalse, setAllItemsTrue, removeItemsFalse, removeItemsTrue } from '@/store/reducers/noteReducer';
import { findItemByUserIdAndId } from '@/helpers/utility';
import { replaceItemInStorage } from '../localstorage';
import { tbl_names } from '@/constants/Config';

const updateTotalAndNumber = async (userId: string, listId: string, _item: any) => {
    const {data, error} = await supabase.from(tbl_names.lists).update({item_number: _item.item_number, total: _item.total}).eq('id', _item.id);
    if (error) console.error("Error updating total and number:", error);
    else {
        replaceItemInStorage(tbl_names.lists, userId, listId, _item)
    }
}

const calculateTotalAndCount = (data: any[]): { totalPrice: number; totalCount: number } => {
    return data.reduce(
        (acc, item) => {
            if (item.is_check) { 
                acc.totalPrice = 0;
                acc.totalCount += 1; 
            }
            return acc;
        },
        { totalPrice: 0, totalCount: 0 }
    );
};

export async function addItemByDB(nData: any , dispatch: Dispatch) {
    const { userId, listId, item } = nData
    if (userId) {

        let _item = findItemByUserIdAndId(userId, listId) || [];
        _item.item_number = Number(_item.item_number || 0) + 1;

        let _data = {
            "user_id": userId,
            "name": item.name,
            "list_name": _item.clean_name,
            "checked": false,
            "deleted": false,
            "edited": false,
            "notes": item.note,
            "shared_with": null,         
        }

        const {data, error} = await supabase.from(tbl_names.items).insert(_data).select('id');

        if (error) {
            console.error("Error inserting item", data);
        } else {
            updateTotalAndNumber(userId, listId, _item);
            dispatch(addItem({ listId, item: {...nData.item, id: data[0].id}}));
        }
 
    }else {
        dispatch(addItem(nData));
    }
}

export async function removeItemByDB(nData: any, dispatch: Dispatch) {
    const {userId, listId, itemId} = nData;

    if (userId) {

        let listItems = store.getState().note.listitems[listId] || [];
        let item = listItems.find(item => item.id == itemId) || undefined;
        if (!item) return;
        let _item = findItemByUserIdAndId(userId, listId) || [];
        _item.item_number = _item.item_number - 1;

        const {data, error} = await supabase.from(tbl_names.items).update({ deleted: true }).eq('id', itemId);

        if (error) {
          console.error("Error deleting item", error);
        } else {
            updateTotalAndNumber(userId, listId, _item);
            dispatch(removeItem(nData));
        }
    }else {
        dispatch(removeItem(nData));
    }
}

let isLoading = false;
export async function updateItemByDB(nData: any, dispatch: Dispatch) {
    const { userId, listId, item: newItem, toggle } = nData;
    if (isLoading) return;
    if (userId) {
        isLoading = true;
        if (toggle) {
            
            let _item = findItemByUserIdAndId(userId, listId) || [];
            if (newItem.is_check) {
                _item.item_number = _item.item_number - 1;
            }else {
                _item.item_number = _item.item_number + 1;
            }

            const { data, error } = await supabase
                .from(tbl_names.items)
                .update({ checked: newItem.is_check?? false })
                .eq("user_id", userId).eq("id", newItem.id);
        
            if (error) {
                console.error("Error updating item", error);
            } else {
                updateTotalAndNumber(userId, listId, _item);
                dispatch(updateItem(nData));
            }
        }else {
            const {data, error} = await supabase.from(tbl_names.items).update({ name: newItem.name, notes: newItem.note, checked: newItem.is_check?? false }).eq('id', newItem.id);

            if (error) {
                console.error("Error deleting item", error);
            } else {
                dispatch(updateItem(nData));
            }
        }
        isLoading = false;
    }else {
        dispatch(updateItem(nData));
    }
}

export async function updateAllItemsTrueByDB(nData: any, dispatch: Dispatch) {
    const { userId, listId } = nData;
    if (isLoading) return;
    if (userId) {
        isLoading = true;
        let _item = findItemByUserIdAndId(userId, listId) || [];
        _item.item_number = 0;

        const { data, error } = await supabase
        .from(tbl_names.items)
        .update({ checked: true })
        .eq("user_id", userId).eq("list_name", _item.clean_name);
       
        if (error) {
            console.error("Error updating item", error);
        } else {
            updateTotalAndNumber(userId, listId, _item);
            dispatch(setAllItemsTrue(nData));
        }
        isLoading = false;
    }else {
        dispatch(setAllItemsTrue(nData));
    }
}

export async function updateAllItemsFalseByDB(nData: any, dispatch: Dispatch) {
    const { userId, listId } = nData;
    if (isLoading) return;
    if (userId) {
        isLoading = true;
        let listItems = store.getState().note.listitems[listId] || [];
        let { totalCount, totalPrice } = calculateTotalAndCount(listItems);
        let _item = findItemByUserIdAndId(userId, listId) || [];
        _item.item_number = Number(_item.item_number) + totalCount;

        const { data, error } = await supabase
        .from(tbl_names.items)
        .update({ checked: false })
        .eq("user_id", userId).eq("list_name", _item.clean_name);
       
        if (error) {
            console.error("Error updating item", error);
        } else {
            updateTotalAndNumber(userId, listId, _item);
            dispatch(setAllItemsFalse(nData));
        }
        isLoading = false;
    }else {
        dispatch(setAllItemsFalse(nData));
    }
}

export async function removeItemsFalseByDB(nData: any, dispatch: Dispatch) {
    const {userId, listId} = nData;
    if (isLoading) return;
    if (userId) {
        isLoading = true;
        let _item = findItemByUserIdAndId(userId, listId) || [];
        _item.item_number = 0;

        const { data, error } = await supabase.from(tbl_names.items).update({ deleted: true })
            .eq("user_id", userId).eq("list_name", _item.clean_name).eq("checked", false);
  
        if (error) {
          console.error("Error deleting item", error);
        } else {
            updateTotalAndNumber(userId, listId, _item);
            dispatch(removeItemsFalse(nData));
        }
        isLoading = false;
    }else {
        dispatch(removeItemsFalse(nData));
    }
}

export async function removeItemsTrueByDB(nData: any, dispatch: Dispatch) {
    const {userId, listId} = nData;
    if (isLoading) return;
    if (userId) {
        isLoading = true;
        let _item = findItemByUserIdAndId(userId, listId) || [];
        const { data, error } = await supabase.from(tbl_names.items).update({ deleted: true })
            .eq("user_id", userId).eq("list_name", _item.clean_name).eq("checked", true);
  
        if (error) {
          console.error("Error deleting item", error);
        } else {
          dispatch(removeItemsTrue(nData));
        }
        isLoading = false;
    }else {
        dispatch(removeItemsTrue(nData));
    }
}


