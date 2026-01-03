import { atom } from 'jotai';
import type { Room, Channel } from '../types';

export const roomsAtom = atom<Room[]>([]);
export const selectedRoomAtom = atom<Room | null>(null);
export const selectChannelAtom = atom<Channel | null>(null);
