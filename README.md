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

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

### 환경 변수

```
VITE_BASE_URL=https://api.wracing.com
VITE_WS_URL=https://api.wracing.com/ws-stomp

```

### 5. 피드백 적용

# <1주차 피드백 적용>

### 작은 도전 유지

싱글톤 GameManager를 시도했다가 테스트 격리 문제를 발견하고, 결국 React 함수형 컴포넌트로 유지하는 방향으로 전환했다. 새로운 시도를 해보고 실제로 문제를 겪으며 더 좋은 구조로 돌아올 수 있었다.

### ✔ 디버거 적극 활용

STOMP 이벤트 흐름을 분석할 때 `console.log`를 찍기보다 브레이크포인트 기반 디버깅을 사용해 흐름을 명확히 파악했다.

### ✔ 의도를 드러내는 이름 짓기

chooseImage, safePublish처럼 역할이 바로 보이는 이름으로 함수 네이밍을 개선했다.

---

# <2주차 피드백 적용>

### 함수 분리 원칙 적용

STOMP 처리 로직을 chooseImage / chooseColor / safePublish / subscribeRoomAndTickAndEvent 등으로 나눠 각 함수가 한 가지 역할만 수행하도록 구성했다.

### ✔ 상수화로 하드코딩 제거

RaceTrack의 화면·트랙 값들을 SCREEN_WIDTH, TRACK_LENGTH 같은 의미 있는 상수로 분리해 가독성과 유지보수성을 높였다.

### ✔ 공용 컴포넌트 분리

MainInput을 독립된 입력 컴포넌트로 만들고, 입력/레이블 스타일을 한 곳에서 관리하도록 하여 테스트 용이성과 재사용성을 확보했다.

---

# ✅ <3주차 피드백 적용>

###  15라인 초과 함수 인지 및 분리 계획

subscribeRoomAndTickAndEvent, useEffect 내부가 15줄을 넘고 여러 책임을 한꺼번에 수행하는 점을 확인했다.
→ subscribeRoom / subscribeTick / subscribeEvent로 분리하고, useEffect도 초기화·구독·클린업 단계로 나누는 리팩터링 방향을 잡았다.

### 예외 처리 보완 필요성 확인

STOMP 메시지 파싱 실패, memberId가 NaN이 되는 상황 등 예외 상황을 방어하기 위한 기본값·검증 로직이 필요함을 발견했다.

### UI 로직과 비즈니스 로직 분리 필요

RaceManager가 STOMP 연결(도메인)과 UI 렌더링을 함께 담당하고 있고, RaceTrack도 내 차 찾기(도메인)와 그리기(UI) 로직이 혼재되어 있음을 확인.

→ 게임 진행은 훅(useRaceSession 등), UI는 컴포넌트에서 렌더만 담당하도록 SRP 기반 구조 분리 계획을 세웠다.