# 페이지 구조 설명

## 공개 페이지 (Public Pages)

### `/` - 홈페이지
- **파일**: `app/page.tsx`
- **컴포넌트**: `Home`
- **기능**: 
  - Hero 섹션
  - 카테고리별 매물 미리보기
  - 전체 매물 보기 링크

### `/properties` - 매물 목록 페이지
- **파일**: `app/properties/page.tsx`
- **컴포넌트**: `PropertyList`
- **기능**:
  - 카테고리 필터
  - 매물 카드 그리드
  - URL 파라미터로 카테고리 필터링 지원

### `/properties/[id]` - 매물 상세 페이지
- **파일**: `app/properties/[id]/page.tsx`
- **컴포넌트**: `PropertyDetail`
- **기능**:
  - 이미지 갤러리 (슬라이더)
  - 매물 상세 정보
  - 가격 및 거래유형 표시
  - 회사 정보 및 문의하기

## 관리자 페이지 (Admin Pages)

### `/admin` - 관리자 메인 페이지
- **파일**: `app/admin/page.tsx`
- **컴포넌트**: `AdminHome`
- **기능**:
  - 전체 매물 목록
  - 매물 상태 관리 (거래중/거래완료)
  - 추천매물 설정
  - 매물 수정/삭제
  - 매물 등록 버튼

### `/admin/properties/new` - 매물 등록 페이지
- **파일**: `app/admin/properties/new/page.tsx`
- **컴포넌트**: `NewProperty`
- **기능**:
  - 매물 정보 입력 폼
  - 이미지 업로드
  - 카테고리별 매물 종류 선택

### `/admin/properties/[id]` - 매물 수정 페이지
- **파일**: `app/admin/properties/[id]/page.tsx`
- **컴포넌트**: `EditProperty`
- **기능**:
  - 매물 정보 수정 폼
  - 이미지 관리 (업로드/삭제/대표이미지 설정)
  - 매물 삭제 기능

## 파일 구조

```
app/
├── page.tsx                    # 홈페이지
├── properties/
│   ├── page.tsx               # 매물 목록
│   └── [id]/
│       └── page.tsx            # 매물 상세
└── admin/
    ├── page.tsx                # 관리자 메인
    └── properties/
        ├── new/
        │   └── page.tsx        # 매물 등록
        └── [id]/
            └── page.tsx        # 매물 수정
```

