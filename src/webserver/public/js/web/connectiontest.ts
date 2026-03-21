const startButton = document.getElementById('start') as HTMLButtonElement;
const logs = document.getElementById('logs') as HTMLDivElement;

const domain = window.location.hostname;
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const wsUrl = `${protocol}://${domain}:3000`;

const packet = {
  decode(data: ArrayBuffer) {
    const decoder = new TextDecoder();
    return decoder.decode(data);
  },
  encode(data: string) {
    const encoder = new TextEncoder();
    return encoder.encode(data);
  },
};

console.log = (message?: any, ...optionalParams: any[]) => {
  logs.style.display = 'block';
  const msg = [message, ...optionalParams].join(' ');
  const logEntry = document.createElement('div');
  logEntry.textContent = msg;
  logs.appendChild(logEntry);
};

console.error = (message?: any, ...optionalParams: any[]) => {
  logs.style.display = 'block';
  const msg = [message, ...optionalParams].join(' ');
  const logEntry = document.createElement('div');
  logEntry.style.color = 'red';
  logEntry.textContent = msg;
  logs.appendChild(logEntry);
};

console.warn = (message?: any, ...optionalParams: any[]) => {
  logs.style.display = 'block';
  const msg = [message, ...optionalParams].join(' ');
  const logEntry = document.createElement('div');
  logEntry.style.color = 'orange';
  logEntry.textContent = msg;
  logs.appendChild(logEntry);
};

startButton.onclick = () => {
  logs.innerHTML = '';
  logs.style.display = 'none';
  connectWebSocket();
};

function bufferForTypedArray(ta: Uint8Array) {
  if (ta.byteOffset === 0 && ta.byteLength === ta.buffer.byteLength) return ta.buffer;
  return ta.buffer.slice(ta.byteOffset, ta.byteOffset + ta.byteLength);
}

function sendJSON(ws: WebSocket, obj: any) {
  const json = JSON.stringify(obj);
  const u8 = packet.encode(json);
  const ab = bufferForTypedArray(u8) as any;

  try {
    ws.send(ab);
    return;
  } catch (e) {
    console.error('Failed to send WebSocket message:', e);
  }

  try {
    ws.send(new Blob([u8]));
    return;
  } catch (e) {
    console.error('Failed to send WebSocket message as Blob:', e);
  }

  try {
    ws.send(json);
  } catch (e) {
    console.error('Failed to send WebSocket message as string:', e);
  }
}

function connectWebSocket() {
  try {
    const websocket = new WebSocket(wsUrl);
    websocket.binaryType = "arraybuffer";

    websocket.addEventListener('open', () => {
      sendJSON(websocket, { type: 'PING', data: null });
    });

    websocket.addEventListener('message', (event: any) => {
      if (!(event.data instanceof ArrayBuffer)) {
        return;
      }
    });

    websocket.addEventListener('error', (event) => {
    });

    websocket.addEventListener('close', (event) => {
    });
  } catch (error) {
    console.error('WebSocket connection failed:', error);
  }
}
