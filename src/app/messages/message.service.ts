import { Injectable } from '@angular/core';

/* kind of a logger for debugging copied from angular demo */

@Injectable({
  providedIn: 'root',
  }
)
export class MessageService {
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}
