import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS == 'web';

const storeData = async (key: string, value: any) => {
  const data = JSON.stringify(value);
  if (isWeb) {
    localStorage.setItem(key, data);
  } else {
    await AsyncStorage.setItem(key, data);
  }
};

const addToData = async (item: any, storageName: string) => {
  if (storageName.length <= 0) return;
  let store = await getData(storageName) || [];

  for (let i = 0; i < store.length; i++) {
    if (store[i].name == item.name && store[i].id == item.id) {
      return;
    }
  }

  store.push(item);
  await storeData(storageName, store);
};

const markItemAsDeleted = async (storageName: string, userId: string, id: number) => {
  if (storageName.length <= 0) return;

  let store = await getData(storageName);
  if (!store) return;

  store = store.map((item: any) => 
    item.id == id ? { ...item, deleted: true } : item
  );

  await storeData(storageName, store);
};

const replaceItemInStorage = async (storageName: string, userId: string, id: string, newItem: any) => {
  if (storageName.length <= 0) return;

  let store = await getData(storageName);
  if (!store) return;

  store = store.map((item: any) => 
    item.id == id ? newItem : item
  );
  await storeData(storageName, store);
};

const getData = async (key: string) => {
  if (isWeb) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } else {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
};

const removeData = async (key: string) => {
  if (isWeb) {
    localStorage.removeItem(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
};

export { storeData, addToData, markItemAsDeleted, replaceItemInStorage, getData, removeData };
