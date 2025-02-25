import { getData, storeData } from '@/store/localstorage';
import { tbl_names } from '@/constants/Config';

export const listExists = async (lists: any, clean_name: string) => {
    if (!lists) return false;
    
    for (let i = 0; i < lists.length; i++) {
        const list = lists[i];
        if (list.clean_name == clean_name) return true;
    }
    return false;
};

export const createCleanName = (name:string) =>{
    return name.replaceAll('"','')
               .replace(/[^A-Z0-9]+/ig, "_");
}

export const createCleanNameChanged = (clean_name: string, variation: number) => {
    return clean_name + variation.toString();
};

export const createNewCleanName = async (clean_name: string) => {
    let variation = 1;
    let clean_name_changed = createCleanNameChanged(clean_name, variation);
    
    let lists = await getData(tbl_names.lists) || []; // Ensure lists is an array

    while (await listExists(lists, clean_name_changed)) {
        variation += 1;
        clean_name_changed = createCleanNameChanged(clean_name, variation);
    }

    return clean_name_changed;
};

export const findItemByUserIdAndId = async (userId: string, id: string) => {
    let lists = await getData(tbl_names.lists) || []; // Ensure lists is an array
    return lists.find((item: any) => item.id == id);
};

export const findItemByUserIdAndCleanName = async (userId: string, clean_name: string) => {
    let lists = await getData(tbl_names.lists) || []; // Ensure lists is an array
    return lists.find((item: any) => item.clean_name == clean_name);
};
