import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { User } from '../types';

export const loginUserDataAtom = atomWithStorage<User | null>(
  'login_user_data',
  null,
  {
    getItem: (key: string, inithialValue: User | null) => {
      const loadUserJson = window.localStorage.getItem(key);
      if (loadUserJson) {
        return JSON.parse(loadUserJson);
      } else {
        return inithialValue;
      }
    },
    setItem: (key: string, newValue: User | null) => {
      if (newValue) {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    },
    removeItem: (key: string) => {
      window.localStorage.removeItem(key);
    },
  },
  { getOnInit: true },
);
