import supabase from '@/supabase';
import { Dispatch } from 'redux';
import store from '@/store';
import {
  addItem, updateItem, removeItem,
  setAllItemsFalse, setAllItemsTrue, removeItemsFalse, removeItemsTrue
} from '@/store/reducers/bookmarkReducer';
import { findItemByUserIdAndId, findItemByUserIdAndCleanName } from '@/helpers/utility';
import { replaceItemInStorage } from '../localstorage';
import { tbl_names } from '@/constants/Config';

export async function editItemStorage(type: string, newList: any, listId: string, dispatch: Dispatch) {
    if (type == 'INSERT') {
        dispatch(addItem({ listId, 
            item: {id: newList.id, name: newList.name, path: newList.link, is_check: newList.checked?? false} }));
    }else {
        if (newList.deleted) {
            dispatch(removeItem({listId, itemId: newList.id}));
        }else {
            dispatch(updateItem({listId, 
                item: {id: newList.id, name: newList.name, path: newList.link, is_check: newList.checked?? false}}));
        }
        
    }
} 

const updateTotalAndNumber = async (userId: string, listId: string, _item: any) => {
    const { data, error } = await supabase
        .from(tbl_names.lists)
        .update({ item_number: _item.item_number, total: _item.total })
        .eq('id', _item.id);

    if (error) {
        console.error("Error updating total and number:", error);
    } else {
        replaceItemInStorage(tbl_names.lists, userId, listId, _item);
    }
};

const calculateTotalAndCount = (data: any[]): { totalPrice: number; totalCount: number } => {
    return data.reduce(
        (acc, item) => {
            if (item.is_check) {
                acc.totalPrice += item.price ?? 0; // Ensure price is added properly
                acc.totalCount += 1;
            }
            return acc;
        },
        { totalPrice: 0, totalCount: 0 }
    );
};

export async function addItemByDB(nData: any, dispatch: Dispatch) {
    const { userId, listId, item } = nData;
    if (!userId) return dispatch(addItem(nData));

    let _item = await findItemByUserIdAndId(userId, listId) || {};
    _item.item_number = Number(_item.item_number || 0) + 1;

    const newItem = {
        user_id: userId,
        name: item.name,
        list_name: _item.clean_name,
        checked: false,
        deleted: false,
        edited: false,
        link: item.path,
        shared_with: null,
    };

    const { data, error } = await supabase.from(tbl_names.items).insert(newItem).select('id');

    if (error) {
        console.error("Error inserting item", error);
    } else {
        updateTotalAndNumber(userId, listId, _item);
        dispatch(addItem({ listId, item: { ...nData.item, id: data[0].id } }));
    }
}

export async function removeItemByDB(nData: any, dispatch: Dispatch) {
    const { userId, listId, itemId } = nData;
    if (!userId) return dispatch(removeItem(nData));

    let listItems = store.getState().bookmark.listitems[listId] || [];
    let item = listItems.find(item => item.id == itemId);
    if (!item) return;

    let _item = await findItemByUserIdAndId(userId, listId) || {};
    _item.item_number = _item.item_number - 1;

    const { error } = await supabase.from(tbl_names.items).update({ deleted: true }).eq('id', itemId);

    if (error) {
        console.error("Error deleting item", error);
    } else {
        updateTotalAndNumber(userId, listId, _item);
        dispatch(removeItem(nData));
    }
}

let isLoading = false;
export async function updateItemByDB(nData: any, dispatch: Dispatch) {
    if (isLoading) return;
    isLoading = true;

    try {
        const { userId, listId, item: newItem, toggle } = nData;
        if (!userId) return dispatch(updateItem(nData));

        let _item = await findItemByUserIdAndId(userId, listId) || {};
        if (toggle) {
            _item.item_number += newItem.is_check ? -1 : 1;

            const { error } = await supabase
                .from(tbl_names.items)
                .update({ checked: newItem.is_check ?? false })
                .eq("user_id", userId)
                .eq("id", newItem.id);

            if (error) {
                console.error("Error updating item", error);
            } else {
                updateTotalAndNumber(userId, listId, _item);
                dispatch(updateItem(nData));
            }
        } else {
            const { error } = await supabase
                .from(tbl_names.items)
                .update({ name: newItem.name, link: newItem.path, checked: newItem.is_check ?? false })
                .eq('id', newItem.id);

            if (error) {
                console.error("Error updating item", error);
            } else {
                dispatch(updateItem(nData));
            }
        }
    } finally {
        isLoading = false;
    }
}

export async function updateAllItemsFalseByDB(nData: any, dispatch: Dispatch) {
    const { userId, listId } = nData;
    if (isLoading) return;
    if (userId) {
        isLoading = true;
        let listItems = store.getState().bookmark.listitems[listId] || [];
        let { totalCount, totalPrice } = calculateTotalAndCount(listItems);
        let _item = await findItemByUserIdAndId(userId, listId) || [];
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

export async function updateAllItemsTrueByDB(nData: any, dispatch: Dispatch) {
    if (isLoading) return;
    isLoading = true;

    try {
        const { userId, listId } = nData;
        if (!userId) return dispatch(setAllItemsTrue(nData));

        let _item = await findItemByUserIdAndId(userId, listId) || {};
        _item.item_number = 0;

        const { error } = await supabase
            .from(tbl_names.items)
            .update({ checked: true })
            .eq("user_id", userId)
            .eq("list_name", _item.clean_name);

        if (error) {
            console.error("Error updating item", error);
        } else {
            updateTotalAndNumber(userId, listId, _item);
            dispatch(setAllItemsTrue(nData));
        }
    } finally {
        isLoading = false;
    }
}

export async function removeItemsFalseByDB(nData: any, dispatch: Dispatch) {
    if (isLoading) return;
    isLoading = true;

    try {
        const { userId, listId } = nData;
        if (!userId) return dispatch(removeItemsFalse(nData));

        let _item = await findItemByUserIdAndId(userId, listId) || {};
        _item.item_number = 0;

        const { error } = await supabase
            .from(tbl_names.items)
            .update({ deleted: true })
            .eq("user_id", userId)
            .eq("list_name", _item.clean_name)
            .eq("checked", false);

        if (error) {
            console.error("Error deleting item", error);
        } else {
            updateTotalAndNumber(userId, listId, _item);
            dispatch(removeItemsFalse(nData));
        }
    } finally {
        isLoading = false;
    }
}

export async function removeItemsTrueByDB(nData: any, dispatch: Dispatch) {
    if (isLoading) return;
    isLoading = true;

    try {
        const { userId, listId } = nData;
        if (!userId) return dispatch(removeItemsTrue(nData));

        let _item = await findItemByUserIdAndId(userId, listId) || {};

        const { error } = await supabase
            .from(tbl_names.items)
            .update({ deleted: true })
            .eq("user_id", userId)
            .eq("list_name", _item.clean_name)
            .eq("checked", true);

        if (error) {
            console.error("Error deleting item", error);
        } else {
            dispatch(removeItemsTrue(nData));
        }
    } finally {
        isLoading = false;
    }
}
