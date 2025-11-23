// src/stomp/StompClient.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let _client = null;
let _wsUrl = null;
let _token = null;

const subscriptions = {}; 

export function getClient() {
  return _client;
}

export function getWsUrl() {
  return _wsUrl;
}

export function subscribe(destination, callback) {
  if (!_client || !_client.connected) {
    console.warn("[STOMP] Cannot subscribe: not connected");
    return;
  }

  // 중복 구독 방지
  if (subscriptions[destination]) {
    console.log("[STOMP] Already subscribed:", destination);
    return subscriptions[destination];
  }

  // 실제 STOMP 구독
  const sub = _client.subscribe(destination, (msg) => {
    const body = JSON.parse(msg.body);
    callback?.(body);
  });

  // ⭐ 자동으로 subscriptions에 저장
  subscriptions[destination] = sub;

  console.log("[STOMP] Subscribed:", destination);
  return sub;
}

export function connectStomp(wsUrl, token, onConnected) {
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
  });

  client.onConnect = (frame) => {
    console.log("[STOMP] connected");

    if (typeof onConnected === "function") onConnected(frame);
  };

  client.onStompError = (frame) => {
    console.error("[STOMP ERROR]", frame);
  };

  client.onWebSocketClose = (evt) => {
    console.log("[STOMP] websocket closed", evt);
  };

  client.activate(); // 연결 시도

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