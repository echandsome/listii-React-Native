import supabase from '@/supabase';
import { Dispatch } from 'redux';
import { setUser } from '../reducers/authReducer';

interface CacheUser {
  id: string;
  aud: string;
  email: string;
}

export async function signUpWithEmailAndPassword(
  email: string,
  password: string,
  dispatch: Dispatch
): Promise<{ success: boolean }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log(error);
      return { success: false };
    }

    const userData: CacheUser = {
      id: data.user.id,
      aud: data.user.aud,
      email: data.user.email ?? '',
    };

    dispatch(setUser(userData));
    return { success: true, userData: userData};
  } catch (err) {
    return { success: false };
  }
}

export async function loginWithEmailAndPassword(
  email: string,
  password: string,
  dispatch: Dispatch
): Promise<{ success: boolean }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    if (error) {
      const { code } = error;
      if (code == 'email_not_confirmed') return { verify: false };
      else if (code == 'invalid_credentials') return { invalid: false };

      return { success: false };
    }

    const userData: CacheUser = {
      id: data.user.id,
      aud: data.user.aud,
      email: data.user.email ?? '',
    };
    dispatch(setUser(userData));
    return { success: true, userData: userData};
  } catch (err) {
    return { success: false };
  }
}