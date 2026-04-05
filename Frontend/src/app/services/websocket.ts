import { Injectable } from '@angular/core';
import { Client, StompSubscription, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  id?: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'TYPING';
}

export interface SessionParticipant {
  userId: number;
  userName: string;
  joinedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client: Client | null = null;
  private connected = false;
  private currentSessionId: number | null = null;

  private chatMessagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private participantsSubject = new BehaviorSubject<SessionParticipant[]>([]);
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService) {}

  connect(sessionId: number): Observable<boolean> {
    this.currentSessionId = sessionId;
    this.connectionStatusSubject.next(false);

    const token = this.authService.getToken();
    const userId = this.authService.getUserId();
    const userName = this.authService.getUserName();

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.wsUrl}/ws`),
      connectHeaders: {
        'Authorization': `Bearer ${token}`,
        'userId': userId?.toString() || '',
        'userName': userName || ''
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = () => {
      this.connected = true;
      this.connectionStatusSubject.next(true);
      this.subscribeToChat(sessionId);
      this.subscribeToParticipants(sessionId);
      this.sendJoinMessage(sessionId);
    };

    this.client.onStompError = (frame) => {
      console.error('WebSocket error:', frame);
      this.connectionStatusSubject.next(false);
    };

    this.client.onDisconnect = () => {
      this.connected = false;
      this.connectionStatusSubject.next(false);
    };

    this.client.activate();
    return this.connectionStatusSubject.asObservable();
  }

  private subscribeToChat(sessionId: number): void {
    if (!this.client) return;

    this.client.subscribe(`/topic/session/${sessionId}/chat`, (message: Message) => {
      const chatMessage: ChatMessage = JSON.parse(message.body);
      const currentMessages = this.chatMessagesSubject.getValue();
      this.chatMessagesSubject.next([...currentMessages, chatMessage]);
    });
  }

  private subscribeToParticipants(sessionId: number): void {
    if (!this.client) return;

    this.client.subscribe(`/topic/session/${sessionId}/participants`, (message: Message) => {
      const participants: SessionParticipant[] = JSON.parse(message.body);
      this.participantsSubject.next(participants);
    });
  }

  sendMessage(content: string): void {
    if (!this.client || !this.currentSessionId) return;

    const userId = this.authService.getUserId();
    const userName = this.authService.getUserName();

    const message: ChatMessage = {
      senderId: userId!,
      senderName: userName || 'Utilisateur',
      content: content,
      timestamp: new Date(),
      type: 'CHAT'
    };

    this.client.publish({
      destination: `/app/session/${this.currentSessionId}/chat`,
      body: JSON.stringify(message)
    });
  }

  private sendJoinMessage(sessionId: number): void {
    if (!this.client) return;

    const userId = this.authService.getUserId();
    const userName = this.authService.getUserName();

    const joinMessage: ChatMessage = {
      senderId: userId!,
      senderName: userName || 'Utilisateur',
      content: `${userName} a rejoint la session`,
      timestamp: new Date(),
      type: 'JOIN'
    };

    this.client.publish({
      destination: `/app/session/${sessionId}/join`,
      body: JSON.stringify(joinMessage)
    });
  }

  sendLeaveMessage(): void {
    if (!this.client || !this.currentSessionId) return;

    const userId = this.authService.getUserId();
    const userName = this.authService.getUserName();

    const leaveMessage: ChatMessage = {
      senderId: userId!,
      senderName: userName || 'Utilisateur',
      content: `${userName} a quitté la session`,
      timestamp: new Date(),
      type: 'LEAVE'
    };

    this.client.publish({
      destination: `/app/session/${this.currentSessionId}/leave`,
      body: JSON.stringify(leaveMessage)
    });
  }

  getChatMessages(): Observable<ChatMessage[]> {
    return this.chatMessagesSubject.asObservable();
  }

  getParticipants(): Observable<SessionParticipant[]> {
    return this.participantsSubject.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatusSubject.asObservable();
  }

  isConnected(): boolean {
    return this.connected;
  }

  disconnect(): void {
    if (this.currentSessionId) {
      this.sendLeaveMessage();
    }

    if (this.client && this.connected) {
      this.client.deactivate();
    }

    this.client = null;
    this.connected = false;
    this.currentSessionId = null;
    this.chatMessagesSubject.next([]);
    this.participantsSubject.next([]);
    this.connectionStatusSubject.next(false);
  }
}
