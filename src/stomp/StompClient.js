// src/stomp/StompClient.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let _client = null;
let _wsUrl = null;
let _token = null;

export function getClient() {
  return _client;
}

export function connectStomp(wsUrl, token, onConnected) {
  // 이미 연결된 client가 있고 url/token이 같다면 재사용
  if (_client && _wsUrl === wsUrl) {
    if (onConnected) onConnected();
    return _client;
  }

  _wsUrl = wsUrl;
  _token = token;

  const socket = new SockJS(wsUrl);

  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => {
      // 개발용 로그
      // console.log("[STOMP DEBUG]", str);
    },
  });

  client.onConnect = (frame) => {
    // strophe / stomp connected
    console.log("[STOMP] connected");
    if (typeof onConnected === "function") onConnected(frame);
  };

  client.onStompError = (frame) => {
    console.error("[STOMP ERROR]", frame);
  };

  client.onWebSocketClose = (evt) => {
    console.log("[STOMP] websocket closed", evt);
  };

  // activate 시 연결 시도
  client.activate();

  _client = client;
  return client;
}

// optional helper to disconnect (테스트/cleanup용)
export function disconnectStomp() {
  if (_client) {
    _client.deactivate();
    _client = null;
    _wsUrl = null;
    _token = null;
  }
}
