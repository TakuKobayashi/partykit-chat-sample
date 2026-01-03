import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import type { User } from '../types';

const loginUserDataStorage = createJSONStorage<User | null>(() => localStorage);

export const loginUserDataAtom = atomWithStorage<User | null>('login_user_data', null, loginUserDataStorage, { getOnInit: false });
