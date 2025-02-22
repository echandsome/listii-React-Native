import { getData, storeData } from '@/store/localstorage';
import { tbl_names } from '@/constants/Config';

export const listExists = (lists: any, clean_name: string) =>
{;
    for (let i = 0; i < lists.length; i++) {
        const list = lists[i]
        if(list.clean_name == clean_name) return true
    }
    return false
}

export const createCleanNameChanged = (clean_name:string, variation: number) =>
{
    return clean_name + variation.toString()
}


export const createNewCleanName = (clean_name: string) =>
{
    let variation = 1
    let clean_name_changed = createCleanNameChanged(clean_name, variation)
    while(listExists(getData(tbl_names.lists), clean_name_changed))
    {
        variation += 1
        clean_name_changed = createCleanNameChanged(clean_name, variation)
    }
    return clean_name_changed
}

export const findItemByUserIdAndId = (userId: string, id: string) => {
    return getData(tbl_names.lists).find(item => item.user_id == userId && item.id == id);
}