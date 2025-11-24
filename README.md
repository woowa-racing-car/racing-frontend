# 🏎️ Woowa Racing Car – Frontend

실시간 멀티플레이 레이싱 게임의 프론트엔드입니다.

**React + Vite** 기반으로 **STOMP WebSocket**, **JWT 인증**, **멀티페이지 UI**, **고품질 에셋**을 조합해 백엔드와 1:1로 맞물리는 화면을 제공합니다.

---

## 📁 1. 프로젝트 구조

```
src
├── App.jsx                  # 전역 라우팅 및 UserProvider 주입
├── assets/                  # 폰트, PNG/SVG, 인트로/레이싱 영상
├── components/CommonHeader.jsx
├── context/UserContext.jsx  # JWT 사용자 상태 + 코인 동기화
├── data/cars.js             # 차종 메타데이터
├── pages
│   ├── MainPage.jsx         # 메인 랜딩
│   ├── main/*               # 인트로, 사인보드, 입력 컴포넌트
│   ├── mypage/*             # 보유 차량/아이템 뷰
│   ├── price-entry/*        # 입장료 선택
│   ├── room-list/*          # 방 목록/생성 UI
│   ├── race/*               # 실시간 레이스 씬
│   ├── start/*              # 카 선택 및 스타트 애니메이션
│   └── result/*             # 경기 결과 페이지
└── stomp/StompClient.js     # SockJS + STOMP 연결 유틸

```

---

## 👤 2. 팀원 & 역할

### **유아름 – Frontend / UI·UX**

🔗 https://github.com/yooaknow

### **1) 전체 UI/UX 구조 설계**

- 로그인 → 인트로 → 시작 → 대기방 → 레이스 → 결과까지 **전체 사용자 플로우 설계**
- 16:9 기준 반응형 구조, **컬러·버튼·카드 등 게임 디자인 톤앤매너 확립**
- Header·Modal·Button 등 **공통 UI 컴포넌트/스타일 가이드 제작**

### **2) 로그인/회원가입 & 전역 레이아웃 구현**

- 로그인/회원가입 **모달 UI 제작**, input/error/button 스타일 통일
- CommonHeader 구성 및 **닉네임·코인 표시 영역 구현**
- 페이지 이동 시 Header 유지되도록 **전역 레이아웃 구조 재정비**

### **3) 레이싱 페이지 UI 전체 구현 (핵심 작업)**

- 상단(유저·코인) / 중앙(트랙) / 하단(아이템 슬롯) **3단 레이아웃 전체 구성**
- Car.jsx 컴포넌트 제작
    - transform 이동
    - RED/BLUE/GREEN 자동차 스타일링
    - 이름표 가독성 개선(boxShadow·overlay)
- 폭탄/부스트/방패 **아이템 UI & 클릭 이벤트/연동 포인트 구현**

### **4) 인트로 트랜지션 구현**

- 로그인 성공 → 인트로 영상 → `/start` 자동 이동
- preload 전략으로 영상 로딩 시 **검은 화면 제거**
- 인트로 전용 페이지 레이아웃 구성

### **5) 레이싱 구조 고도화 & 결과 페이지 구현**

- race price 파라미터 추가 → **방 생성 후 해당 레이스 페이지로 자동 이동**
- RaceManager 초기 구조 정리 및 자동차 데이터 관리 개선
- 결과 페이지 UI 개발
    - 1~3등 카드 구성
    - 순차 등장 애니메이션
    - 나가기 버튼 UX + 페이드인

### **6) UI 리소스 & 애니메이션 통합 관리**

- 자동차·코인·버튼·카드·레이싱/인트로 영상 등 **리소스 정리 및 최적화**
- 페이지별 애니메이션을 CSS keyframe 기반으로 **일관되게 통합**
- 페이지 전환 시 자연스러운 UX 흐름 관리

---

## 🛠️ 3. 기술 스택

- **Frontend Framework**: React 19
- **Routing**: React Router DOM 7
- **Build Tool**: Vite 7 + SWC
- **Network**: Axios, @stomp/stompjs, sockjs-client
- **UI 스타일링**:
    - Bootstrap 5, react-bootstrap
    - TailwindCSS(부분 적용)
    - CSS Modules
- **Code Quality**: ESLint 9, React Hooks/Refresh 플러그인
- **Infra**: Vercel(Frontend), AWS Backend API

---

## 🎨 4. 프론트엔드 상세

### **4-1. 라우팅 & 최상위 구조**

`App.jsx`에서 `UserProvider`를 루트에 감싸고 전 경로를 선언적으로 관리합니다.

```jsx
export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* ... */}
          <Route path="/result" element={<GameResultPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

```

---

### **4-2. 사용자 상태 & 인증**

- UserContext가 JWT 기반으로 `/api/v1/mypage`에서 사용자 정보/코인을 조회
- 로그인 전 메인 페이지는 API 호출 없이 즉시 렌더링
- updateUser·updateCoin으로 결과 반영

```jsx
const [user, setUser] = useState({ name: "", coin: 0, isLoaded: false });
// ...
await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/mypage`, {
  headers: { Authorization: `${token}` },
});

```

---

### **4-3. STOMP WebSocket 연동**

- SockJS 기반 STOMP Client 생성
- `/sub/rooms`, `/sub/room`, `/user/sub/*` 구독
- `/pub/*`으로 방 생성/참가/퇴장/게임 시작 이벤트 발행

```jsx
const client = new Client({
  webSocketFactory: () => new SockJS(wsUrl),
  reconnectDelay: 5000,
});

```

---

### **4-4. 주요 화면 플로우**

1. **Intro/Main** – 인트로 영상, 로그인/회원가입 UI
2. **MyPage** – 보유 차량/아이템 카드 UI
3. **Price Entry & Room List** – 입장료 선택, 실시간 방 목록
4. **Race & Result** – STOMP tick 기반 자동차 이동 & 결과 페이지 전환

---

### **4-5. UI 자산 & 애니메이션**

- Giants 전역 폰트
- SVG 40여 개 + MP4 영상 에셋
- CSS keyframe + Tailwind 유틸로 다양한 트랜지션 구현

---

### **4-6. API & 상호작용**

- `import.meta.env.VITE_BASE_URL` 기준 REST 호출
- JWT는 localStorage 관리 → WebSocket에도 동일 토큰 사용
- 공통 응답(success/data/error) 규약에 따라 파싱

---

### **4-7. 빌드 & 실행**

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview

```

### 환경 변수

```
VITE_BASE_URL=https://api.wracing.com
VITE_WS_URL=https://api.wracing.com/ws-stomp

```