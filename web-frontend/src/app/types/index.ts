export interface Message {
  id: string;
  text: string;
  sender: string;
  avatar: string;
  time: string;
  color: string;
}

export interface User {
  name: string;
  avatar: string;
  status: 'online' | 'away';
}

export interface Room {
  id: string;
  name: string;
  icon: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  lastActivity: string;
}

export interface Channel {
  id: string;
  name: string;
  icon: string;
  unread: number;
  active: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export type Screen = 'login' | 'roomList' | 'chat';
