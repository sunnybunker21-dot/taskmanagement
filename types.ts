
export enum Role {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  TASK_ASSIGNER = 'TASK_ASSIGNER',
  DEVELOPER = 'DEVELOPER',
  SALES = 'SALES',
  MANAGEMENT = 'MANAGEMENT'
}

export enum TicketStatus {
  NEW = 'NEW',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING = 'WAITING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum TaskStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: string;
  unreadCount: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: string;
  assignedBy: string;
  createdAt: string;
}
