# API 문서

## 개요

이 문서는 부동산 매물 관리 시스템의 백엔드 API 엔드포인트를 설명합니다.

**Base URL**: `http://localhost:4000` (개발 환경)  
**Content-Type**: `application/json`  
**이미지 업로드**: `multipart/form-data`

---

## 공통 응답 형식

### 성공 응답
```json
{
  "id": 1,
  "type": "아파트",
  "address": "충남 천안시...",
  ...
}
```

### 에러 응답
```json
{
  "error": "에러 메시지",
  "details": "상세 에러 정보 (선택적)"
}
```

### HTTP 상태 코드
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `404`: 리소스를 찾을 수 없음
- `500`: 서버 에러

---

## 매물 관리 API

### 1. 매물 목록 조회

전체 매물 목록을 조회합니다.

**엔드포인트**: `GET /properties`

**요청 예시**:
```bash
GET http://localhost:4000/properties
```

**응답 예시**:
```json
[
  {
    "id": 1,
    "type": "아파트",
    "category": "RESIDENTIAL",
    "address": "충남 천안시 서북구 불당동",
    "price": 300000000,
    "deal_type": "매매",
    "status": "거래중",
    "main_image": "/uploads/image1.jpg",
    ...
  }
]
```

---

### 2. 카테고리별 매물 조회

특정 카테고리의 매물을 조회합니다.

**엔드포인트**: `GET /properties/category/:category`

**경로 파라미터**:
- `category`: 카테고리 키 (`RESIDENTIAL`, `COMMERCIAL`, `INDUSTRIAL`, `LAND`)

**쿼리 파라미터**:
- `limit` (선택): 반환할 최대 개수

**요청 예시**:
```bash
GET http://localhost:4000/properties/category/RESIDENTIAL?limit=8
```

**응답 예시**:
```json
[
  {
    "id": 1,
    "type": "아파트",
    "category": "RESIDENTIAL",
    ...
  }
]
```

---

### 3. 추천매물 조회

추천매물 목록을 조회합니다 (최대 6개).

**엔드포인트**: `GET /properties/featured`

**요청 예시**:
```bash
GET http://localhost:4000/properties/featured
```

**응답 예시**:
```json
[
  {
    "id": 1,
    "is_featured": true,
    ...
  }
]
```

---

### 4. 매물 상세 조회

특정 매물의 상세 정보를 조회합니다.

**엔드포인트**: `GET /properties/:id`

**경로 파라미터**:
- `id`: 매물 ID

**요청 예시**:
```bash
GET http://localhost:4000/properties/1
```

**응답 예시**:
```json
{
  "id": 1,
  "type": "아파트",
  "category": "RESIDENTIAL",
  "address": "충남 천안시 서북구 불당동",
  "price": 300000000,
  "deposit": null,
  "monthly_rent": null,
  "deal_type": "매매",
  "area": 84.5,
  "rooms": 3,
  "bathrooms": 2,
  "description": "매물 설명...",
  "status": "거래중",
  "main_image": "/uploads/image1.jpg",
  ...
}
```

---

### 5. 매물 등록

새로운 매물을 등록합니다.

**엔드포인트**: `POST /properties`

**요청 본문**:
```json
{
  "realtor_id": 1,
  "type": "아파트",
  "category": "RESIDENTIAL",
  "deal_type": "매매",
  "price": 300000000,
  "deposit": null,
  "monthly_rent": null,
  "area": 84.5,
  "rooms": 3,
  "bathrooms": 2,
  "address": "충남 천안시 서북구 불당동",
  "description": "매물 설명...",
  "maintenance_fee": 100000,
  "direction": "남향",
  "floor_info": "5층/15층",
  "usage_type": "주거용",
  "parking": "가능",
  "elevator": true,
  "move_in_date": "2024-02-01"
}
```

**필수 필드**:
- `realtor_id`: 중개사 ID
- `type`: 매물 종류 (아파트, 빌라, 원룸 등)
- `address`: 주소
- `deal_type`: 거래유형 (매매, 전세, 월세)

**거래유형별 필수 필드**:
- **매매**: `price` 필수
- **전세**: `price` 필수
- **월세**: `deposit`, `monthly_rent` 필수

**응답 예시**:
```json
{
  "id": 1,
  "type": "아파트",
  ...
}
```

---

### 6. 매물 수정

기존 매물 정보를 수정합니다.

**엔드포인트**: `PUT /properties/:id`

**경로 파라미터**:
- `id`: 매물 ID

**요청 본문**:
```json
{
  "type": "아파트",
  "price": 350000000,
  "address": "수정된 주소",
  ...
}
```

**응답 예시**:
```json
{
  "id": 1,
  "type": "아파트",
  "price": 350000000,
  ...
}
```

---

### 7. 매물 삭제

매물을 삭제합니다. 연결된 이미지도 함께 삭제됩니다.

**엔드포인트**: `DELETE /properties/:id`

**경로 파라미터**:
- `id`: 매물 ID

**요청 예시**:
```bash
DELETE http://localhost:4000/properties/1
```

**응답 예시**:
```json
{
  "message": "매물 삭제 완료"
}
```

---

### 8. 추천매물 설정/해제

매물을 추천매물로 설정하거나 해제합니다 (최대 8개).

**엔드포인트**: `PATCH /properties/:id/featured`

**경로 파라미터**:
- `id`: 매물 ID

**요청 본문**:
```json
{
  "is_featured": true
}
```

**응답 예시**:
```json
{
  "message": "추천매물로 설정 완료"
}
```

**에러 응답** (8개 초과 시):
```json
{
  "error": "추천매물은 최대 8개까지만 설정할 수 있습니다."
}
```

---

### 9. 매물 상태 변경

매물의 거래 상태를 변경합니다.

**엔드포인트**: `PATCH /properties/:id/status`

**경로 파라미터**:
- `id`: 매물 ID

**요청 본문**:
```json
{
  "status": "거래완료"
}
```

**허용 값**: `"거래중"`, `"거래완료"`

**응답 예시**:
```json
{
  "id": 1,
  "status": "거래완료",
  ...
}
```

---

## 이미지 관리 API

### 10. 매물 이미지 목록 조회

특정 매물의 이미지 목록을 조회합니다.

**엔드포인트**: `GET /properties/:id/images`

**경로 파라미터**:
- `id`: 매물 ID

**요청 예시**:
```bash
GET http://localhost:4000/properties/1/images
```

**응답 예시**:
```json
[
  {
    "id": 1,
    "image_url": "/uploads/image1.jpg",
    "is_main": true
  },
  {
    "id": 2,
    "image_url": "/uploads/image2.jpg",
    "is_main": false
  }
]
```

---

### 11. 매물 이미지 업로드

매물에 이미지를 업로드합니다 (최대 5개).

**엔드포인트**: `POST /properties/:id/images`

**Content-Type**: `multipart/form-data`

**경로 파라미터**:
- `id`: 매물 ID

**요청 본문**:
- `images`: 파일 배열 (FormData)

**요청 예시** (JavaScript):
```javascript
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);

fetch('http://localhost:4000/properties/1/images', {
  method: 'POST',
  body: formData
});
```

**응답 예시**:
```json
{
  "message": "이미지 업로드 완료"
}
```

**참고**: 첫 번째 이미지가 자동으로 대표 이미지로 설정됩니다.

---

### 12. 매물 이미지 삭제

매물의 특정 이미지를 삭제합니다.

**엔드포인트**: `DELETE /properties/:propertyId/images/:imageId`

**경로 파라미터**:
- `propertyId`: 매물 ID
- `imageId`: 이미지 ID

**요청 예시**:
```bash
DELETE http://localhost:4000/properties/1/images/5
```

**응답 예시**:
```json
{
  "message": "이미지 삭제 완료"
}
```

---

### 13. 대표 이미지 설정

특정 이미지를 매물의 대표 이미지로 설정합니다.

**엔드포인트**: `PATCH /properties/:propertyId/images/:imageId/main`

**경로 파라미터**:
- `propertyId`: 매물 ID
- `imageId`: 이미지 ID

**요청 예시**:
```bash
PATCH http://localhost:4000/properties/1/images/3/main
```

**응답 예시**:
```json
{
  "message": "대표 이미지 설정 완료"
}
```

---

## 유틸리티 API

### 14. DB 연결 테스트

데이터베이스 연결 상태를 확인합니다.

**엔드포인트**: `GET /db-test`

**요청 예시**:
```bash
GET http://localhost:4000/db-test
```

**응답 예시**:
```json
{
  "now": "2024-01-05T12:00:00.000Z",
  "propertyTableExists": true
}
```

---

## 거래유형별 필드 규칙

### 매매 (deal_type: "매매")
- ✅ `price`: 필수 (매매가)
- ❌ `deposit`: NULL
- ❌ `monthly_rent`: NULL

### 전세 (deal_type: "전세")
- ✅ `price`: 필수 (전세금)
- ❌ `monthly_rent`: NULL
- `deposit`: 선택적

### 월세 (deal_type: "월세")
- ✅ `deposit`: 필수 (보증금)
- ✅ `monthly_rent`: 필수 (월세)
- ❌ `price`: NULL

---

## 카테고리 매핑

### RESIDENTIAL (주거용)
- 아파트, 빌라, 원룸, 투룸, 오피스텔

### COMMERCIAL (상업용)
- 상가, 사무실

### INDUSTRIAL (산업용)
- 공장, 창고

### LAND (토지)
- 토지

---

## 에러 처리

### 일반적인 에러

**400 Bad Request**: 잘못된 요청
```json
{
  "error": "필수 값 누락 (realtor_id, type, address, deal_type)"
}
```

**404 Not Found**: 리소스를 찾을 수 없음
```json
{
  "error": "매물을 찾을 수 없음"
}
```

**500 Internal Server Error**: 서버 에러
```json
{
  "error": "매물 조회 실패",
  "details": "상세 에러 메시지"
}
```

---

## 클라이언트 사용 예시

### Axios 사용

```typescript
import api from '@/lib/api';

// 매물 목록 조회
const properties = await api.get('/properties');

// 매물 등록
const newProperty = await api.post('/properties', {
  realtor_id: 1,
  type: '아파트',
  deal_type: '매매',
  price: 300000000,
  address: '충남 천안시...'
});

// 이미지 업로드
const formData = new FormData();
formData.append('images', file);
await api.post(`/properties/${propertyId}/images`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

---

## 참고사항

1. **이미지 파일**: `server/uploads/` 디렉토리에 저장됩니다.
2. **추천매물**: 최대 8개까지만 설정 가능합니다.
3. **거래 상태**: `"거래중"` 또는 `"거래완료"`만 허용됩니다.
4. **카테고리 자동 매핑**: `category`가 없으면 `type`에 따라 자동으로 설정됩니다.

