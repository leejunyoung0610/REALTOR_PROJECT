# 환경 변수 설정 가이드

## 개요

이 프로젝트는 환경 변수를 사용하여 설정을 관리합니다. 개발, 스테이징, 프로덕션 환경에 따라 다른 값을 사용할 수 있습니다.

## 설정 방법

### 1. 환경 변수 파일 생성

프로젝트 루트(`client/`)에 `.env.local` 파일을 생성하세요.

```bash
cd client
cp .env.local.example .env.local
```

### 2. 환경 변수 값 설정

`.env.local` 파일을 열고 실제 값으로 수정하세요.

```env
# API 설정
NEXT_PUBLIC_API_URL=http://localhost:4000

# 회사 정보
NEXT_PUBLIC_COMPANY_NAME=베리굿 부동산
NEXT_PUBLIC_COMPANY_REPRESENTATIVE=문수진
NEXT_PUBLIC_COMPANY_PHONE=010-7503-6000
NEXT_PUBLIC_COMPANY_PHONE_ALT=00000000000
NEXT_PUBLIC_COMPANY_ADDRESS=충청남도 천안시 청당동
NEXT_PUBLIC_COMPANY_REGISTRATION=0000-0000-0000
```

## 환경 변수 목록

### API 설정

| 변수명 | 설명 | 기본값 | 필수 |
|--------|------|-------|------|
| `NEXT_PUBLIC_API_URL` | 백엔드 API 서버 URL | `http://localhost:4000` | ✅ |

### 회사 정보

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `NEXT_PUBLIC_COMPANY_NAME` | 회사명 | ✅ |
| `NEXT_PUBLIC_COMPANY_REPRESENTATIVE` | 대표자명 | ✅ |
| `NEXT_PUBLIC_COMPANY_PHONE` | 대표 전화번호 | ✅ |
| `NEXT_PUBLIC_COMPANY_PHONE_ALT` | 보조 전화번호 | ❌ |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | 회사 주소 | ✅ |
| `NEXT_PUBLIC_COMPANY_REGISTRATION` | 사업자 등록번호 | ✅ |

## 환경별 설정

### 개발 환경 (Development)

`.env.local` 파일 사용 (로컬 개발)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 프로덕션 환경 (Production)

배포 플랫폼(Vercel, Netlify 등)의 환경 변수 설정에서 추가하세요.

**Vercel 예시:**
1. 프로젝트 설정 → Environment Variables
2. 변수 추가
3. Production 환경에 적용

## 주의사항

### ⚠️ 보안

- `.env.local` 파일은 **절대 Git에 커밋하지 마세요**
- `.gitignore`에 이미 포함되어 있습니다
- 프로덕션 환경 변수는 배포 플랫폼에서만 관리하세요

### 🔄 변경 사항 반영

환경 변수를 변경한 후에는:
1. 개발 서버를 재시작하세요
2. 빌드 캐시를 클리어해야 할 수 있습니다: `rm -rf .next`

### 📝 네이밍 규칙

- Next.js에서 클라이언트에서 사용할 변수는 `NEXT_PUBLIC_` 접두사가 필요합니다
- 서버 전용 변수는 접두사 없이 사용할 수 있습니다

## 문제 해결

### 환경 변수가 적용되지 않을 때

1. 파일 이름 확인: `.env.local` (정확한 이름)
2. 서버 재시작: `npm run dev` 재실행
3. 빌드 캐시 삭제: `rm -rf .next`
4. 변수명 확인: `NEXT_PUBLIC_` 접두사 확인

### 타입 에러

환경 변수를 TypeScript에서 사용할 때는 타입 정의가 필요할 수 있습니다.

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
```

