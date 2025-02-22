import { MMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';

const storage = new MMKV();
const isWeb = Platform.OS == 'web';

const storeData = (key: string, value: any) => {
  const data = JSON.stringify(value);
  if (isWeb) {
    localStorage.setItem(key, data);
  } else {
    storage.set(key, data);
  }
};

const addToData = (item: any, storageName: string) => {
    
    if (storageName.length <= 0) return
    let store = getData(storageName)

    // check if an item exists before adding it to storage
    for(let i = 0; i < store.length; i++)
    {
        if(store[i].name == item.name && store[i].id == item.id)
        {
            return 
        }
    }

    store.push(item);
    storeData(storageName, store);
}

const markItemAsDeleted = (storageName: string, userId: string, id: number) => {
    if (storageName.length <= 0) return;

    let store = getData(storageName);
    if (!store) return;

    store = store.map((item: any) => 
      item.user_id == userId && item.id == id ? { ...item, deleted: true } : item
    );

    storeData(storageName, store);
};

const replaceItemInStorage = (storageName: string, userId: string, id: number, newItem: any) => {
  if (storageName.length <= 0) return;

  let store = getData(storageName);
  if (!store) return;

  store = store.map((item: any) => 
    item.user_id == userId && item.id == id ? newItem : item
  );
  console.log(store);
  storeData(storageName, store);
};


const getData = (key: string) => {
  if (isWeb) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } else {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
  }
};

const removeData = (key: string) => {
  if (isWeb) {
    localStorage.removeItem(key);
  } else {
    storage.delete(key);
  }
};

export { storeData, addToData, markItemAsDeleted, replaceItemInStorage, getData, removeData };
