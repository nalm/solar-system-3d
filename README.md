# 🪐 3D 태양계 탐사선 (Interactive 3D Solar System Explorer)

Three.js 기반의 고성능 3D 태양계 실시간 인터랙티브 시뮬레이션입니다.  
어둡고 웅장한 우주적 미학과 부드러운 카메라 워크, 행성 공전/자전 시뮬레이션 및 교육용 상세 정보 패널을 제공합니다.

---

## 🚀 빠른 시작 (Quick Start)

### 방법 1. 단독 HTML 파일로 즉시 실행 (가장 간편)
외부 의존성 및 인터넷 연결 없이 단독으로 동작하는 완전 독립형 파일입니다.
* 파일 경로: `C:\Users\user\.gemini\antigravity\scratch\solar-system-3d\solar-system.html`  
  또는 `C:\Users\user\.gemini\antigravity\scratch\solar-system.html`
* 브라우저(Chrome, Edge, Whale 등)로 해당 파일을 더블 클릭하거나 드래그하여 바로 열 수 있습니다.

### 방법 2. Vite 개발 서버 실행
```bash
cd C:\Users\user\.gemini\antigravity\scratch\solar-system-3d
npm run dev
```
터미널에 표시되는 로컬 주소(예: `http://localhost:5173`)로 접속합니다.

### 방법 3. Python 내장 웹 서버 실행
```bash
cd C:\Users\user\.gemini\antigravity\scratch\solar-system-3d
python -m http.server 8080
```
브라우저에서 `http://localhost:8080/dist` 또는 `http://localhost:8080/solar-system.html` 접속

---

## ✨ 핵심 구현 기능

1. **공전 및 자전 시뮬레이션 (Keplerian Orbit & Axial Tilt)**
   - 중심 항성 **태양(Sun)**과 8대 행성(**수성, 금성, 지구, 화성, 목성, 토성, 천왕성, 해왕성**), 왜소행성 **명왕성(Pluto)** 탑재
   - **지구의 달(Moon)** 공전 시스템 및 화성-목성 사이 1,000개의 암석 조각으로 이루어진 **소행성대(Asteroid Belt)** 구현
   - 실제 행성의 **자전축 기울기(Axial Tilt)** 및 행성별 역자전(금성, 천왕성) 특성 반영

2. **조절 가능한 시뮬레이션 속도**
   - 부드러운 슬라이더(0.1x ~ 15.0x) 및 원터치 프리셋 버튼 (`0.25x`, `0.5x`, `1.0x`, `3.0x`, `6.0x`, `12x`) 제공
   - 프레임 레이트 독립적 델타 타임(`Clock.getDelta()`) 기반 설계로 모니터 주사율과 상관없이 일정한 속도 보장

3. **클릭 및 네비게이터를 통한 부드러운 카메라 초점 이동**
   - 3D 뷰에서 행성을 마우스로 클릭하거나, 하단 네비게이션 바에서 원하는 천체를 선택하면 카메라가 해당 행성으로 자연스럽게 글라이딩 이동
   - 초점 고정 시 **행성이 공전하는 궤적을 카메라가 함께 추적**하며, 마우스 드래그로 행성 주변 360도 자유 회전/줌 가능
   - '전체 보기(Overview)' 버튼을 통해 언제든 태양계 전체 조망 시점으로 복귀 가능

4. **실시간 3D 투영 레이블**
   - 행성 위에 항상 부드럽게 떠 있는 한글 이름표(태그)
   - 카메라 뒤편 천체는 자동 클리핑 처리되며, 라벨 클릭 시에도 즉시 해당 행성으로 초점 이동
   - 상단 버튼을 통해 원터치로 레이블 ON/OFF 토글 가능

5. **일시정지 및 시간 제어**
   - 상단 버튼 및 키보드 <kbd>Space</kbd>(스페이스바) 단축키를 통한 즉각적인 재생/일시정지 제어

6. **네온 궤도 트레일 (Orbit Lines)**
   - 미려한 발광 라인으로 행성들의 공전 궤도 원형 궤적 시각화 (ON/OFF 토글 지원)

7. **상세 한글 정보 패널 (Glassmorphic HUD)**
   - 행성 클릭 시 우측에서 슬라이드되는 사이버네틱 글래스모피즘 HUD 카드
   - 한글/영문 명칭, 행성 분류, 태양과의 거리, 지름 크기, 공전/자전 주기, 표면 온도, 보유 위성 수, 흥미로운 과학 상식 수록

8. **어둡고 웅장한 우주적 미학 (Cosmic Dark Aesthetics)**
   - 3,500개의 다채로운 별무리(Starfield) 및 은하 성운 먼지 입자 배경
   - 태양의 표면 플라즈마 텍스처, 흑점, 다중 레이어 코로나 발광(Corona Flare)
   - 지구 대기권 산란 글로우, 토성의 정교한 카시니 간극 고리 텍스처
   - 프로시저럴 캔버스 텍스처 엔진으로 외부 네트워크 요청 없이 100% 오프라인 렌더링 지원

---

## 🎮 조작법 (Controls)

| 조작 | 동작 |
| :--- | :--- |
| **마우스 좌클릭 + 드래그** | 시점 360도 회전 (Orbit Rotate) |
| **마우스 휠 스크롤** | 확대 / 축소 (Zoom In / Out) |
| **마우스 우클릭 / Shift + 드래그** | 시점 화면 이동 (Pan) |
| **행성 또는 라벨 좌클릭** | 해당 행성으로 부드러운 초점 이동 및 정보 패널 열기 |
| **스페이스바 (Space)** | 시뮬레이션 일시정지 / 재생 토글 |
| **ESC 키** | 열려 있는 정보 패널 닫기 |
| **하단 네비게이션 클릭** | 즉시 원하는 천체로 카메라 이동 |

---

## 📁 프로젝트 파일 구조

```
solar-system-3d/
├── solar-system.html          # 완전 독립형 단일 HTML 파일 (더블클릭 실행 가능)
├── index.html                 # 소스 HTML 템플릿
├── vite.config.js             # Vite 번들러 설정 (상대 경로 base)
├── package.json               # 의존성 설정 (Three.js, Vite)
├── src/
│   ├── main.js                # 앱 진입점 및 60FPS 렌더링 루프
│   ├── solarSystem.js         # Three.js 씬, 천체, 조명, 소행성대, 궤도
│   ├── textures.js            # 프로시저럴 캔버스 텍스처 생성기 (태양, 행성, 고리 등)
│   ├── cameraController.js    # 부드러운 보간 이동 및 공전 추적 카메라
│   ├── ui.js                  # 2D 라벨 투영, HUD 컨트롤, 정보 패널, 레이캐스터
│   ├── planetsData.js         # 천문학 데이터 및 한글 상세 설명
│   └── styles.css             # 글래스모피즘 다크 코스믹 테마 스타일
└── dist/                      # 프로덕션 빌드 결과물
    ├── index.html
    └── assets/
```
