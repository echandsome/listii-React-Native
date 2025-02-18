import supabase from '@/supabase';
import { Dispatch } from 'redux';
import {  setItems, addItem, updateItem, removeItem, 
    setAllItemsFalse, setAllItemsTrue, removeItemsFalse, removeItemsTrue } from '@/store/reducers/todoReducer';

const table_name = 'todo_items';

export async function getItems(userId: string, listId: string, dispatch: Dispatch) {
    console.log(userId);
    if (userId) {
        const { data, error } = await supabase.from(table_name).select("*").eq("user_id", userId).eq("list_id", listId);
    
        if (error) {
            console.error("Error fetching users:", error);
        } else {
            console.log(data);
            dispatch(setItems({listId, items: data}));
        }
    }
}

export async function addItemByDB(nData: any , dispatch: Dispatch) {
    const { userId, listId, item } = nData
    if (userId) {
        const { data, error } = await supabase
        .from(table_name)
        .insert([{ user_id: userId, list_id: listId, ...item, is_check: false }])
        .select('*');
  
      if (error) {
        console.error("Error inserting user:", error);
      } else {
          dispatch(addItem({ listId, item: data[0]}));
      }
    }else {
        dispatch(addItem(nData));
    }
}

export async function removeItemByDB(nData: any, dispatch: Dispatch) {
    const {userId, listId, itemId} = nData;

    if (userId) {
        const { data, error } = await supabase.from(table_name).delete()
            .eq("user_id", userId).eq("list_id", listId).eq("id", itemId);
  
        if (error) {
          console.error("Error deleting user:", error);
        } else {
          dispatch(removeItem(nData));
        }
    }else {
        dispatch(removeItem(nData));
    }
}

export async function updateItemByDB(nData: any, dispatch: Dispatch) {
    const { userId, listId, item } = nData;
    if (userId) {
        const { data, error } = await supabase
        .from(table_name)
        .update({ ...item })
        .eq("user_id", userId).eq("list_id", listId).eq("id", item.id);
       
        if (error) {
            console.error("Error updating user:", error);
        } else {
            dispatch(updateItem(nData));
        }
    }else {
        dispatch(updateItem(nData));
    }
}

export async function updateAllItemsTrueByDB(nData: any, dispatch: Dispatch) {
    const { userId, listId } = nData;
    if (userId) {
        const { data, error } = await supabase
        .from(table_name)
        .update({ is_check: true })
        .eq("user_id", userId).eq("list_id", listId);
       
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
        const { data, error } = await supabase
        .from(table_name)
        .update({ is_check: false })
        .eq("user_id", userId).eq("list_id", listId);
       
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
        console.log(userId, listId);
        const { data, error } = await supabase.from(table_name).delete()
            .eq("user_id", userId).eq("list_id", listId).eq("is_check", false);
  
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
        console.log(userId, listId);
        const { data, error } = await supabase.from(table_name).delete()
            .eq("user_id", userId).eq("list_id", listId).eq("is_check", true);
  
        if (error) {
          console.error("Error deleting user:", error);
        } else {
          dispatch(removeItemsTrue(nData));
        }
    }else {
        dispatch(removeItemsTrue(nData));
    }
}
