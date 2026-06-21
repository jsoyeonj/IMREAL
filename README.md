# IMREAL (I'm Real)

> 딥페이크 사전 보호 · 실시간 탐지 통합 보안 플랫폼

IMREAL은 딥페이크로 인한 디지털 성범죄, 사기, 채용 위조 등의 피해를
줄이기 위해 개발된 통합 보안 시스템입니다. 이미지·영상·실시간 화상회의를
아우르며, **사전 보호(노이즈·워터마킹)** 부터 **사후 탐지·신고** 까지
하나의 흐름으로 연결합니다.

## 핵심 기능

**모바일 앱**
- **DeepFake 탐지**: 이미지의 딥페이크 여부를 AI로 분석 (신뢰도·판정 제공)
- **이미지 보호**: Adversarial Noise로 생성형 AI의 학습·악용을 어렵게 처리
- **워터마크 추가**: 소유권·진위 입증용 보이지 않는 디지털 서명 삽입
- **딥페이크 알아보기**: 피해 사례·예방법 교육 콘텐츠

**웹**
- **실시간 화상회의 감시**: Zoom 화면을 주기적으로 캡처·분석, 딥페이크 감지 시 즉시 경고

## 아키텍처

| 컴포넌트 | 역할 | 기술 |
|---------|------|------|
| **Frontend (Mobile)** | 이미지·영상 탐지/보호 앱 | React Native, TypeScript, Expo |
| **Frontend (Web)** | 화상회의 실시간 감시 UI | React 18, Vite, React Router |
| **Backend** | 인증 · 세션 · 탐지 기록 관리 | Django 5.1, REST API, Celery + Redis |
| **AI Server** | 딥페이크 분석 · 보호 처리 | FastAPI, PyTorch |

## 기술 스택

- **Frontend**: React Native / TypeScript (Mobile), React 18 / Vite (Web)
- **Backend**: Django 5.1, FastAPI, REST API, Celery + Redis
- **AI**: PyTorch (Super-Resolution, Multi-Face Detection, Adversarial Noise, Invisible Watermarking)
- **Infra**: MySQL, AWS S3, Nginx, Docker, Gunicorn

## 프로젝트 구조
## 기술 스택

- **Frontend**: React Native / TypeScript (Mobile), React 18 / Vite (Web)
- **Backend**: Django 5.1, FastAPI, REST API, Celery + Redis
- **AI**: PyTorch (Super-Resolution, Multi-Face Detection, Adversarial Noise, Invisible Watermarking)
- **Infra**: MySQL, AWS S3, Nginx, Docker, Gunicorn
