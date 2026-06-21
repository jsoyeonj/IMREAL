# IMREAL Frontend

> 딥페이크 사전 보호 · 탐지 통합 보안 서비스의 프론트엔드

IMREAL의 프론트엔드는 두 가지로 구성됩니다.
**모바일 앱(React Native)** 은 이미지·영상의 딥페이크 탐지와 보호를,
**웹(React + Vite)** 은 Zoom 등 화상회의 실시간 딥페이크 감시를 담당합니다.

## 모바일 앱 (React Native)

홈 화면에서 4가지 핵심 기능을 카드 형태로 제공합니다.

| 기능 | 설명 | 경로 |
|------|------|------|
| **DeepFake 탐지** | 이미지로부터 딥페이크 여부 분석 | `/deepfake/detection` |
| **이미지 보호** | AI 학습 차단용 보호 노이즈 삽입 | `/protection/image-protection` |
| **워터마크 추가** | 보이지 않는 디지털 워터마크 삽입 | `/watermark/add-watermark` |
| **딥페이크 알아보기** | 최신 뉴스 · 교육 콘텐츠 | `/news/news-list` |

- 갤러리/카메라로 이미지 선택 → AI 분석(신뢰도 0~100점, 안전/의심/위험 판정)
- 보호·워터마크 처리 결과는 S3 저장 후 다운로드·공유 가능
- 검사 내역은 "내 탐지 기록"에 시간순으로 저장

### 기술 스택
- React Native, TypeScript, Expo (expo-router)
- expo-image-picker, expo-media-library, FileSystem, Sharing

## 웹 (React + Vite)

Zoom 화면을 주기적으로 캡처해 실시간으로 딥페이크를 감시합니다.

- **실시간 화면 캡처**: `getDisplayMedia` API로 화면을 5초마다 자동 캡처
- **딥페이크 탐지 연동**: 캡처 이미지를 백엔드로 전송, AI 서버가 30초 주기로 분석
- **실시간 경고**: 딥페이크 감지 시 즉시 알림 (이전 알림 자동 교체로 UI 정돈)
- **세션 관리**: 면접 세션 시작·종료 및 캡처 통계 집계
- **탐지 기록 조회**: 세션별 안전/의심 판정과 신뢰도 점수 확인
- **인증 & 라우트 보호**: 토큰 기반 로그인/회원가입, ProtectedRoute 접근 제어

### 기술 스택
- React 18, Vite 5
- React Router DOM 6 (SPA 라우팅 / 라우트 가드)
- Browser APIs: Screen Capture, Canvas, Notification
