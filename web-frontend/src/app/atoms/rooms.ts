import { atom } from 'jotai';
import type { Room, Channel } from '../types';

export const rooms = atom<Room[]>([]);
export const selectedRoom = atom<Room | null>(null);
export const selectChannel = atom<Channel | null>(null);
