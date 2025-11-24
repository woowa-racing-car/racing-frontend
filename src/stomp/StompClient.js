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

// ---- 추가: 대기열 ----
const publishQueue = [];

// ---- publish 보장 함수 ----
export function safePublish(destination, body = null) {
  const client = getClient();
  const payload = { destination, body };

  // 연결 안 되어 있으면 → 큐에 저장 후 return
  if (!client || !client.connected) {
    console.log("[STOMP] not connected → queued:", destination);
    publishQueue.push(payload);
    return;
  }

  // 연결되어 있으면 바로 publish
  client.publish(payload);
}

// ---- connect 수정 ----
export function connectStomp(wsUrl, token) {
  if (_client && _wsUrl === wsUrl) return _client;

  _wsUrl = wsUrl;
  _token = token;

  const socket = new SockJS(wsUrl);

  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    console.log("[STOMP] connected");

    // ⭐ 큐 비워서 순차적으로 publish 실행
    while (publishQueue.length > 0) {
      const msg = publishQueue.shift();
      console.log("[STOMP] sending queued:", msg.destination);
      client.publish(msg);
    }
  };

  _client = client;
  client.activate();
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