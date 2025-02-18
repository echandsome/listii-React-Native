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

const table_name = 'lists';

function groupByListId(data: any) {
    return data.reduce((acc: any, item: any) => {
        if (!acc[item.list_id]) {
            acc[item.list_id] = [];
        }
        acc[item.list_id].push(item);
        return acc;
    }, {});
}

export async function getLists(userId: string, dispatch: Dispatch) {
    if (!userId) return false;
    console.log('getLists');
    try {
        const [lists, grocery_items, bookmark_items, note_items, todo_items] = await Promise.all([
            supabase.from(table_name).select("*").eq("user_id", userId),
            supabase.from('grocery_items').select("*").eq("user_id", userId),
            supabase.from('bookmark_items').select("*").eq("user_id", userId),
            supabase.from('note_items').select("*").eq("user_id", userId),
            supabase.from('todo_items').select("*").eq("user_id", userId)
        ]);

        if (lists.error || grocery_items.error || bookmark_items.error || note_items.error || todo_items.error) {
            console.error("Error fetching data:", {
                lists: lists.error,
                grocery_items: grocery_items.error,
                bookmark_items: bookmark_items.error,
                note_items: note_items.error,
                todo_items: todo_items.error
            });
            return false;
        }

        dispatch((dispatch) => {
            dispatch(setList(lists.data || []));
            dispatch(setItemsGrocery(groupByListId(grocery_items.data || [])));
            dispatch(setItemsBookmark(groupByListId(bookmark_items.data || [])));
            dispatch(setItemsTodo(groupByListId(todo_items.data || [])));
            dispatch(setItemsNote(groupByListId(note_items.data || [])));
        });
        return true;
    } catch (error) {
        console.error("Unexpected error:", error);
        return false;
    }
}

export async function addNewList({ userId, name, type, id }, dispatch: Dispatch) {
    if (userId) {
        const { data, error } = await supabase
        .from(table_name)
        .insert([{ user_id: userId, name, type, is_archive: false }])
        .select('*');
  
      if (error) {
        console.error("Error inserting user:", error);
      } else {
          dispatch(addList(data[0]));
      }
    }else {
        dispatch(addList({id, name, type}));
    }
}

export async function deleteListByDB(userId: string, listId :string, dispatch: Dispatch) {
    if (userId) {
        const { data, error } = await supabase.from(table_name).delete().eq("user_id", userId).eq("id", listId);
  
        if (error) {
          console.error("Error deleting user:", error);
        } else {
          dispatch(deleteList(listId));
        }
    }else {
        dispatch(deleteList(listId));
    }
}

export async function updateListByDB(nData: any, dispatch: Dispatch) {
    const { userId, id, updates } = nData;
    if (userId) {
        const { data, error } = await supabase
        .from(table_name)
        .update({ name: updates.name })
        .eq("user_id", userId).eq("id", id);
    
        if (error) {
            console.error("Error updating user:", error);
        } else {
            dispatch(updateList(nData));
        }
    }else {
        dispatch(updateList(nData));
    }
}

export async function duplicateListByDB(userId: string, nData: any, dispatch: Dispatch) {
    const {id, name, type, is_archive} = nData;
    let listItems: any = [];
    let item_table_name = '';
    switch (type) {
        case 'Note':
        listItems = store.getState().note.listitems[id] || [];
        item_table_name = 'note_items';
        break;
        case 'Bookmark':
        listItems = store.getState().bookmark.listitems[id] || [];
        item_table_name = 'bookmark_items';
        break;
        case 'ToDo':
        listItems = store.getState().todo.listitems[id] || [];
        item_table_name = 'todo_items';
        break;
        case 'Grocery':
        listItems = store.getState().grocery.listitems[id] || [];
        item_table_name = 'grocery_items';
        break;
    }

    if (userId) {
        const { data, error } = await supabase
        .from(table_name)
        .insert([{ user_id: userId, name, type, is_archive }])
        .select('*');

        if (error) {
            console.error("Error inserting user:", error);
        }

        const filteredData = listItems.map(({ created_at, id, ...rest }) => ({
            ...rest,
            list_id: data[0].id
        }));

        const itemLists = await supabase
        .from(item_table_name)
        .insert(filteredData)
        .select('*');

        if (itemLists.error) {
            console.error("Error inserting user:", itemLists.error);
            await supabase.from(table_name).delete().eq("user_id", userId).eq("id", data[0].id);
        } else {
            dispatch((dispatch) => {
                dispatch(addList(data[0]));
                switch (type) {
                    case 'Note':
                        dispatch(addItemsNote({ listId: data[0].id, items: itemLists.data}));
                    break;
                    case 'Bookmark':
                        dispatch(addItemsBookmark({ listId: data[0].id, items: itemLists.data}));
                    break;
                    case 'ToDo':
                        dispatch(addItemsTodo({ listId: data[0].id, items: itemLists.data}));
                    break;
                    case 'Grocery':
                        dispatch(addItemsGrocery({ listId: data[0].id, items: itemLists.data}));
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
            .from(table_name)
            .update({ is_archive: true })
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
            .from(table_name)
            .update({ is_archive: false })
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
