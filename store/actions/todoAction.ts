import supabase from '@/supabase';
import { Dispatch } from 'redux';
import store from '@/store';
import {  addItem, updateItem, removeItem, 
    setAllItemsFalse, setAllItemsTrue, removeItemsFalse, removeItemsTrue } from '@/store/reducers/todoReducer';
import { findItemByUserIdAndId } from '@/helpers/utility';
import { replaceItemInStorage } from '../localstorage';
import { tbl_names } from '@/constants/Config';

export async function editItemStorage(type: string, newList: any, listId: string, dispatch: Dispatch) {
    if (type == 'INSERT') {
        dispatch(addItem({ listId, 
            item: {id: newList.id, name: newList.name, priority: newList.priority, is_check: newList.checked?? false} }));
    }else {
        if (newList.deleted) {
            dispatch(removeItem({listId, itemId: newList.id}));
        }else {
            dispatch(updateItem({listId, 
                item: {id: newList.id, name: newList.name, priority: newList.priority, is_check: newList.checked?? false}}));
        }
        
    }
}   

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
       
        let _item = await findItemByUserIdAndId(userId, listId) || [];
        _item.item_number = _item.item_number + 1;
        
        let _data = {
            "user_id": userId,
            "name": item.name,
            "list_name": _item.clean_name,
            "checked": false,
            "deleted": false,
            "edited": false,
            "priority": item.priority,
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

        let listItems = store.getState().todo.listitems[listId] || [];
        let item = listItems.find(item => item.id == itemId) || undefined;
        if (!item) return;
        let _item = await findItemByUserIdAndId(userId, listId) || [];
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
            
            let _item = await findItemByUserIdAndId(userId, listId) || [];
            if (newItem.is_check) {
                _item.item_number = _item.item_number - 1;
            }else {
                _item.item_number = _item.item_number + 1;
            }
            dispatch(updateItem(nData));
           
            const { data, error } = await supabase
                .from(tbl_names.items)
                .update({ checked: newItem.is_check?? false })
                .eq("user_id", userId).eq("id", newItem.id);
        
            if (error) {
                console.error("Error updating item", error);
            } else {
                updateTotalAndNumber(userId, listId, _item);
            }
        }else {
            dispatch(updateItem(nData));

            const {data, error} = await supabase.from(tbl_names.items).update({ name: newItem.name, priority: newItem.priority, checked: newItem.is_check?? false }).eq('id', newItem.id);

            if (error) {
                console.error("Error deleting item", error);
            } else {
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
        let _item = await findItemByUserIdAndId(userId, listId) || [];
        _item.item_number = 0;
        dispatch(setAllItemsTrue(nData));

        const { data, error } = await supabase
        .from(tbl_names.items)
        .update({ checked: true })
        .eq("user_id", userId).eq("list_name", _item.clean_name);
       
        if (error) {
            console.error("Error updating item", error);
        } else {
            updateTotalAndNumber(userId, listId, _item);
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
        let listItems = store.getState().todo.listitems[listId] || [];
        let { totalCount, totalPrice } = calculateTotalAndCount(listItems);
        let _item = await findItemByUserIdAndId(userId, listId) || [];
        _item.item_number = Number(_item.item_number) + totalCount;
        dispatch(setAllItemsFalse(nData));

        const { data, error } = await supabase
        .from(tbl_names.items)
        .update({ checked: false })
        .eq("user_id", userId).eq("list_name", _item.clean_name);
       
        if (error) {
            console.error("Error updating item", error);
        } else {
            updateTotalAndNumber(userId, listId, _item);
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
        let _item = await findItemByUserIdAndId(userId, listId) || [];
        _item.item_number = 0;
        dispatch(removeItemsFalse(nData));

        const { data, error } = await supabase.from(tbl_names.items).update({ deleted: true })
            .eq("user_id", userId).eq("list_name", _item.clean_name).eq("checked", false);
  
        if (error) {
          console.error("Error deleting item", error);
        } else {
            updateTotalAndNumber(userId, listId, _item);
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
        let _item = await findItemByUserIdAndId(userId, listId) || [];
        dispatch(removeItemsTrue(nData));

        const { data, error } = await supabase.from(tbl_names.items).update({ deleted: true })
            .eq("user_id", userId).eq("list_name", _item.clean_name).eq("checked", true);
  
        if (error) {
          console.error("Error deleting item", error);
        } else {
        }
        isLoading = false;
    }else {
        dispatch(removeItemsTrue(nData));
    }
}


