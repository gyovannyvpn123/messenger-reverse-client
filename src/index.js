import WebSocket from 'ws';
import { buildLsReqMessage } from './utils.js';
import { WS_URL, DEFAULT_VERSION_ID } from './constants.js';

export class MessengerClient {
  constructor({ cookie }) {
    if (!cookie) throw new Error('Cookie-ul de sesiune este necesar!');
    this.cookie = cookie;
    this.ws = null;
    this.requestId = 1;
    this.epochId = Date.now();
    this.versionId = DEFAULT_VERSION_ID;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(WS_URL, {
        headers: { Cookie: this.cookie }
      });

      this.ws.on('open', () => {
        console.log('Conectat la Messenger WebSocket');
        resolve();
      });

      this.ws.on('message', (data) => {
        this.handleMessage(data);
      });

      this.ws.on('error', (err) => {
        console.error('WebSocket error:', err);
        reject(err);
      });

      this.ws.on('close', () => {
        console.log('WebSocket închis');
      });
    });
  }

  sendMessage(buffer) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(buffer);
      console.log('Trimis mesaj binar:', buffer);
    } else {
      console.error('WebSocket nu este conectat');
    }
  }

  nextRequestId() {
    return this.requestId++;
  }

  sendLsReq(tasks = []) {
    const payload = {
      epoch_id: this.epochId,
      tasks,
      version_id: this.versionId,
      request_id: this.nextRequestId(),
      type: 3
    };

    const messageBuffer = buildLsReqMessage('/ls_req', payload);
    this.sendMessage(messageBuffer);
  }

  handleMessage(data) {
    // Deocamdată doar log
    console.log('Mesaj primit:', data.toString());
  }
}
