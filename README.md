# 실시간 얼굴 → 아바타 애니메이션 (웹, 완전 자체 호스팅)

웹캠으로 얼굴을 인식해 표정·고개 움직임을 3D 아바타에 실시간 반영하는 단일 페이지 앱입니다.
**MediaPipe Face Landmarker**(랜드마크 + 52 ARKit 블렌드셰이프) → **aniface**(블렌드셰이프 → 모프 타깃 매핑) → **Three.js** 렌더링.

모든 라이브러리·WASM·모델을 `vendor/`에 두어 **외부 인터넷 없이(폐쇄망에서도) 동작**합니다. (단 모델 파일은 최초 1회 받아야 함 — 아래 1단계)

## 폴더 구조

```
index.html              # 앱 전체 (빌드 불필요)
setup-model.sh          # 얼굴 모델 다운로드 스크립트 (최초 1회)
Caddyfile               # HTTPS 정적 서버 설정 예시
models/                 # 아바타 GLB
  avatar-xaJd1is2QdMaYBnw2FzE.glb
  avatar-EnCDAMIOohA8cqtbw1Hg.glb   # Draco→meshopt 재인코딩본
vendor/                 # 로컬 의존성 (외부 CDN 불필요)
  three/                #   Three.js + 필요한 jsm (GLTFLoader/OrbitControls/meshopt/BufferGeometryUtils)
  mediapipe/            #   vision_bundle.mjs + wasm/  (+ 1단계에서 받을 face_landmarker.task)
  aniface/              #   aniface dist
```

## 배포 3단계

### 1) 얼굴 모델 받기 (최초 1회)

`vendor/mediapipe/`에 `face_landmarker.task`가 있어야 합니다. 프로젝트 폴더에서:

```bash
bash setup-model.sh
```

폐쇄망이라 서버에서 인터넷이 안 된다면, 인터넷 되는 PC에서 아래 파일을 받아 `vendor/mediapipe/face_landmarker.task`로 복사하세요:

```
https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task
```

### 2) HTTPS로 서빙 — ⚠️ 중요

원격(다른 기기)에서 접속하려면 **반드시 HTTPS**여야 합니다. 웹캠(`getUserMedia`)은 보안 컨텍스트(HTTPS 또는 localhost)에서만 동작합니다. **`http://서버주소`로 띄우면 카메라가 아예 안 잡힙니다.**

가장 쉬운 방법은 **Caddy**(단일 실행파일, 자동 HTTPS)입니다. 동봉된 `Caddyfile`을 쓰면:

```bash
# 설치: https://caddyserver.com/docs/install
caddy run        # 프로젝트 폴더에서 실행
```

- **공개 도메인**이 있으면 `Caddyfile`의 [A] 블록에 도메인을 넣어 주석 해제 → Let's Encrypt 인증서 자동.
- **내부망 IP/호스트**면 기본 [B] 블록이 `https://<서버IP>:8443`로 자체서명 HTTPS 제공. 접속 기기에서 인증서 경고를 1회 수락하면 카메라가 동작합니다.

> 같은 컴퓨터에서만(=`http://localhost:8000`) 테스트할 거면 HTTPS 없이도 됩니다: `python3 -m http.server 8000`. 단, .wasm MIME 문제로 일부 환경에서 느릴 수 있어 배포에는 Caddy를 권장합니다.

### 3) 접속

브라우저에서 서버 주소(예: `https://<서버IP>:8443`) → **시작하기** → 카메라 허용.

## 컨트롤

- **아바타** — 두 모델 중 선택.
- **구도(화면)** — 확대·상하 위치로 크롭 조절, ‘구도 고정’으로 그 구도 잠금(얼굴은 추적, 카메라는 고정).
- **표정 강도** — 전체 강도 + 입/미소/눈 깜빡임/눈썹/눈 크게 개별 배율(실시간).
- **부드러움(스무딩)** — 떨림 억제(EMA). 높일수록 안정적·느린 반응.
- **웹캠 미리보기 좌우반전** — 미리보기만 셀카처럼 반전.

## 동작 원리 (요약)

웹캠 프레임 → MediaPipe `FaceLandmarker`(VIDEO 모드)가 블렌드셰이프+머리 변환행렬 출력 → EMA 스무딩 → `aniface.processLandmarkData()`(manual 입력 모드) → ARKit 이름 매칭으로 GLB 모프 타깃 갱신 + `Head` 본 회전. MediaPipe 인스턴스를 하나만 유지해 아바타 전환을 빠르게 했고, 라이브러리에 없는 시간축 스무딩을 직접 끼워 넣었습니다.

## 커스터마이징

- **아바타 추가**: ARKit 모프 타깃 + 표준 휴머노이드 리그(`Head` 본)를 가진 GLB를 `models/`에 넣고 `index.html`의 `<select id="avatarSel">`에 `<option>` 추가. (이 아바타들은 정면이 기본이라 `rotation: 0`. RPM 등 일부는 `Math.PI`가 맞을 수 있음 — `buildAvatar()`의 `modelOptions.rotation`)
- **기본 표정 배율**: `gain` 객체. **카메라/조명**: `buildAvatar()`. **추적 FPS**: 상단 `DETECT_FPS`(기본 30).

## 참고: 아바타 2 재인코딩

업로드 원본 `avatar-EnCDAMIOohA8cqtbw1Hg.glb`는 **Draco 압축**이었는데 aniface 로더는 Draco 디코더를 설정하지 않아 그대로는 로드되지 않습니다. 메시·스킨·52 모프 타깃을 보존한 채 **meshopt로 재인코딩**(3.2MB→2.1MB)했습니다(aniface 기본 지원).

## 문제 해결

- **카메라가 안 잡힘 / `getUserMedia` 오류** → HTTP로 접속했을 확률이 큼. 주소가 `https://` 또는 `localhost`인지 확인.
- **“얼굴 인식 모델 로드 실패”** → 1단계 미실행. `vendor/mediapipe/face_landmarker.task` 존재 확인.
- **검은 화면/뒷모습** → 구도 고정을 끄고 드래그로 조정, 또는 `modelOptions.rotation` 조절.
- **인증서 경고**(자체서명) → 내부망에선 정상. 수락하면 됨. 경고 제거하려면 클라이언트에 Caddy 루트 CA 신뢰 등록.
- **`vendor/` 일부 404** → 서버 document root가 이 프로젝트 폴더인지 확인(상대경로 `./vendor`, `./models` 기준).

## 기술 스택

aniface 0.4.0 · @mediapipe/tasks-vision 0.10.22 · three 0.180.0 — 전부 `vendor/`에 로컬 동봉(런타임 외부 CDN 불필요).
