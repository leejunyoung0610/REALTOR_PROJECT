# 배포 가이드

## 개요

이 문서는 부동산 매물 관리 시스템을 프로덕션 환경에 배포하는 방법을 설명합니다.

---

## 배포 전 체크리스트

- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 연결 설정 확인
- [ ] API 서버 실행 확인
- [ ] 빌드 테스트 완료
- [ ] 프로덕션 환경 변수 설정

---

## Vercel 배포 (권장)

### 1. 프로젝트 준비

```bash
cd client
npm run build
```

빌드가 성공하면 배포 준비가 완료된 것입니다.

### 2. Vercel에 프로젝트 연결

1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 연결 또는 프로젝트 업로드

### 3. 환경 변수 설정

Vercel 대시보드에서:
1. 프로젝트 설정 → Environment Variables
2. 다음 변수들을 추가:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_COMPANY_NAME=베리굿 부동산
NEXT_PUBLIC_COMPANY_REPRESENTATIVE=문수진
NEXT_PUBLIC_COMPANY_PHONE=010-7503-6000
NEXT_PUBLIC_COMPANY_PHONE_ALT=00000000000
NEXT_PUBLIC_COMPANY_ADDRESS=충청남도 천안시 청당동
NEXT_PUBLIC_COMPANY_REGISTRATION=0000-0000-0000
NEXT_PUBLIC_COMPANY_REGISTRATION_DISPLAY=000-0000-0000
```

3. 각 환경(Production, Preview, Development)에 적용

### 4. 빌드 설정

**Build Command**: `npm run build`  
**Output Directory**: `.next`  
**Install Command**: `npm install`

### 5. 배포

Vercel이 자동으로 배포를 시작합니다. 배포가 완료되면 URL이 제공됩니다.

---

## Netlify 배포

### 1. 프로젝트 준비

```bash
cd client
npm run build
```

### 2. Netlify 설정

1. [Netlify](https://www.netlify.com)에 로그인
2. "Add new site" → "Import an existing project"
3. 저장소 연결

### 3. 빌드 설정

**Build command**: `npm run build`  
**Publish directory**: `.next`

### 4. 환경 변수 설정

Netlify 대시보드에서:
1. Site settings → Environment variables
2. 환경 변수 추가 (Vercel과 동일)

---

## 수동 배포 (서버)

### 1. 빌드 생성

```bash
cd client
npm install
npm run build
```

### 2. 서버 설정

**Node.js 서버 사용 시**:

```bash
# PM2 사용 예시
npm install -g pm2
pm2 start npm --name "realtor-app" -- start
pm2 save
pm2 startup
```

**Nginx 리버스 프록시 설정**:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 환경 변수 설정

서버에 `.env.production` 파일 생성:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_COMPANY_NAME=베리굿 부동산
...
```

---

## Docker 배포

### 1. Dockerfile 생성

`client/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. next.config.ts 수정

```typescript
const nextConfig = {
  output: 'standalone',
  // ... 기타 설정
};
```

### 3. 빌드 및 실행

```bash
docker build -t realtor-app .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  realtor-app
```

---

## 백엔드 서버 배포

### Express.js 서버 배포

1. **서버 빌드**:
   ```bash
   cd server
   npm install --production
   ```

2. **환경 변수 설정**:
   ```env
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_NAME=realtor_db
   DB_USER=your-user
   DB_PASSWORD=your-password
   PORT=4000
   ```

3. **PM2로 실행**:
   ```bash
   pm2 start index.js --name "realtor-api"
   ```

---

## 환경별 설정

### Development (개발)
- API URL: `http://localhost:4000`
- 환경 변수: `.env.local`

### Staging (스테이징)
- API URL: `https://staging-api.example.com`
- 환경 변수: 배포 플랫폼에서 설정

### Production (프로덕션)
- API URL: `https://api.example.com`
- 환경 변수: 배포 플랫폼에서 설정

---

## 성능 최적화

### 1. 이미지 최적화

Next.js Image 컴포넌트 사용 권장:
```typescript
import Image from 'next/image';

<Image 
  src={imageUrl} 
  alt="매물 이미지"
  width={400}
  height={300}
/>
```

### 2. 정적 파일 최적화

`public/` 디렉토리의 파일은 자동으로 최적화됩니다.

### 3. 빌드 최적화

```bash
# 프로덕션 빌드
npm run build

# 빌드 분석
ANALYZE=true npm run build
```

---

## 모니터링

### Vercel Analytics

Vercel 배포 시 Analytics 자동 활성화 가능

### 에러 추적

Sentry 등 에러 추적 도구 통합 권장

---

## 문제 해결

### 빌드 실패

1. 환경 변수 확인
2. 의존성 재설치: `rm -rf node_modules && npm install`
3. 빌드 캐시 삭제: `rm -rf .next`

### API 연결 오류

1. `NEXT_PUBLIC_API_URL` 확인
2. CORS 설정 확인 (백엔드)
3. 네트워크 연결 확인

### 이미지 로드 실패

1. 이미지 경로 확인
2. 서버 업로드 디렉토리 권한 확인
3. 정적 파일 서빙 설정 확인

---

## 보안 체크리스트

- [ ] 환경 변수에 민감한 정보 포함하지 않기
- [ ] API 키는 서버 사이드에서만 사용
- [ ] HTTPS 사용 (프로덕션)
- [ ] CORS 설정 확인
- [ ] SQL Injection 방지 (백엔드)
- [ ] 파일 업로드 검증 (백엔드)

---

## 참고 자료

- [Next.js 배포 문서](https://nextjs.org/docs/deployment)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [Netlify 배포 가이드](https://docs.netlify.com)

