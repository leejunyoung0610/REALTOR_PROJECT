# 부동산 매물 관리 시스템

부동산 매물을 등록, 조회, 관리할 수 있는 웹 애플리케이션입니다.

## 📋 프로젝트 개요

이 프로젝트는 부동산 중개사가 매물을 효율적으로 관리하고 고객에게 제공할 수 있는 시스템입니다.

### 주요 기능

#### 공개 페이지 (Public)
- **홈페이지**: 카테고리별 매물 미리보기
- **매물 목록**: 카테고리 필터링 및 매물 검색
- **매물 상세**: 상세 정보, 이미지 갤러리, 문의하기

#### 관리자 페이지 (Admin)
- **매물 관리**: 등록, 수정, 삭제
- **상태 관리**: 거래중/거래완료 전환
- **추천매물 설정**: 추천매물 지정/해제
- **이미지 관리**: 업로드, 삭제, 대표이미지 설정

## 🛠 기술 스택

- **프레임워크**: Next.js 16.1.1 (App Router)
- **언어**: TypeScript 5
- **UI 라이브러리**: React 19.2.3
- **HTTP 클라이언트**: Axios 1.13.2
- **스타일링**: 인라인 스타일 (CSS-in-JS)
- **백엔드**: Express.js (별도 서버)

## 📁 프로젝트 구조

```
client/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 홈페이지
│   ├── properties/        # 매물 관련 페이지
│   │   ├── page.tsx       # 매물 목록
│   │   └── [id]/
│   │       └── page.tsx   # 매물 상세
│   └── admin/             # 관리자 페이지
│       ├── page.tsx       # 관리자 메인
│       └── properties/
│           ├── new/        # 매물 등록
│           └── [id]/      # 매물 수정
├── components/             # 재사용 가능한 컴포넌트
│   ├── PropertyCard.tsx   # 매물 카드
│   ├── PriceDisplay.tsx   # 가격 표시
│   ├── DealTypeBadge.tsx  # 거래유형 배지
│   ├── CategoryFilter.tsx # 카테고리 필터
│   └── ...                # 기타 컴포넌트
├── lib/                    # 유틸리티 및 설정
│   ├── api.ts             # API 클라이언트
│   ├── types.ts           # TypeScript 타입 정의
│   ├── priceUtils.ts      # 가격 포맷팅 유틸
│   └── categories.ts      # 카테고리 상수
└── public/                 # 정적 파일
```

자세한 페이지 구조는 [app/README.md](./app/README.md)를 참고하세요.

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- PostgreSQL 데이터베이스 (백엔드 서버 필요)

### 설치

1. **의존성 설치**
   ```bash
   cd client
   npm install
   ```

2. **환경 변수 설정**
   
   `.env.local` 파일을 생성하고 다음 내용을 추가하세요:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_COMPANY_NAME=베리굿 부동산
   NEXT_PUBLIC_COMPANY_PHONE=010-7503-6000
   NEXT_PUBLIC_COMPANY_PHONE_ALT=00000000000
   NEXT_PUBLIC_COMPANY_ADDRESS=충청남도 천안시 청당동
   NEXT_PUBLIC_COMPANY_REGISTRATION=0000-0000-0000
   NEXT_PUBLIC_COMPANY_REPRESENTATIVE=문수진
   ```
   
   자세한 내용은 [환경 변수 설정 가이드](./docs/ENV_SETUP.md)를 참고하세요.

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   
   [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 빌드

프로덕션 빌드를 생성하려면:

```bash
npm run build
npm start
```

## 📚 주요 컴포넌트

### PropertyCard
매물 정보를 카드 형태로 표시하는 컴포넌트입니다.

```typescript
import PropertyCard from "@/components/PropertyCard";

<PropertyCard 
  property={property} 
  variant="home" | "list" 
/>
```

### PriceDisplay
거래유형에 따라 가격을 자동으로 포맷팅하여 표시합니다.

```typescript
import PriceDisplay from "@/components/PriceDisplay";

<PriceDisplay 
  property={property} 
  variant="simple" | "full"
  size="small" | "medium" | "large"
/>
```

### DealTypeBadge
거래유형(매매/전세/월세)에 따른 색상 배지를 표시합니다.

```typescript
import DealTypeBadge from "@/components/DealTypeBadge";

<DealTypeBadge 
  dealType="매매" 
  size="small" | "medium" | "large"
/>
```

더 많은 컴포넌트 사용 예시는 [컴포넌트 가이드](./docs/COMPONENTS.md)를 참고하세요.

## 🔌 API 연동

API 엔드포인트는 `lib/api.ts`에서 관리됩니다.

기본 설정:
- Base URL: 환경 변수 `NEXT_PUBLIC_API_URL` 사용
- 기본값: `http://localhost:4000`

자세한 API 문서는 [API 문서](./docs/API.md)를 참고하세요.

## 🧪 개발

### 코드 스타일

- TypeScript 사용
- ESLint 설정 포함
- 컴포넌트는 함수형 컴포넌트 사용
- 인라인 스타일 사용 (CSS-in-JS)

### 주요 디렉토리

- `app/`: Next.js 페이지 및 라우트
- `components/`: 재사용 가능한 React 컴포넌트
- `lib/`: 유틸리티 함수 및 설정

## 📖 문서

- [페이지 구조 설명](./app/README.md)
- [API 문서](./docs/API.md)
- [환경 변수 설정](./docs/ENV_SETUP.md)
- [컴포넌트 가이드](./docs/COMPONENTS.md)
- [배포 가이드](./docs/DEPLOYMENT.md)

## 🐛 문제 해결

### 빌드 에러
- 환경 변수가 제대로 설정되었는지 확인
- `npm install`을 다시 실행해보세요

### API 연결 오류
- 백엔드 서버가 실행 중인지 확인
- `NEXT_PUBLIC_API_URL` 환경 변수를 확인하세요

## 📝 라이선스

이 프로젝트는 비공개 프로젝트입니다.

## 👥 기여

프로젝트 개선 제안이나 버그 리포트는 이슈로 등록해주세요.
