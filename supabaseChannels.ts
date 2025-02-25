import { RealtimeChannel } from '@supabase/supabase-js';
import supabase from './supabase';

let listChannel: RealtimeChannel | null = null;
let itemChannel: RealtimeChannel | null = null;

export const initializeChannels = () => {
  if (!listChannel) {
    listChannel = supabase.channel('list-channel');
  }

  if (!itemChannel) {
    itemChannel = supabase.channel('item-channel');
  }
};

export const getListChannel = () => listChannel;
export const getItemChannel = () => itemChannel;


export const removeChannels = async () => {
  if (listChannel && listChannel.joinedOnce) {
    await supabase.removeChannel(listChannel);
    listChannel = null;
  }
  if (itemChannel && itemChannel.joinedOnce) {
    await supabase.removeChannel(itemChannel);
    itemChannel = null;
  }
};
