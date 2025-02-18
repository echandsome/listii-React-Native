import supabase from "./supabase"

const listChannel = supabase.channel('list-channel')
const itemChannel = supabase.channel('item-channel')

export { listChannel, itemChannel }