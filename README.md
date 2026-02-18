# HopperDeck

윈도우에서 가져온 프로젝트를 리눅스/WSL 환경에서 실행할 수 있게 정리한 기준 README.

## 빠른 시작
```bash
npm ci
npm run dev
```

## 검증 명령어
```bash
npm run lint
npm run build
```

## 테스트 서버 워크플로
```bash
# 1) 개발 모드 테스트 서버 (http://localhost:3100)
npm run test:server

# 2) 운영 빌드 기준 테스트 서버
npm run test:server:prod
```

- 테스트 서버 기본 바인딩: `0.0.0.0:3100`
- 포트 충돌 시: `npm run test:server -- --port 3200`

## 문서
- [Architecture Review](./architecture_review.md)
- [Project Architecture](./docs/architecture.md)
