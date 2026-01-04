# 컴포넌트 사용 가이드

이 문서는 프로젝트에서 사용 가능한 재사용 컴포넌트들의 사용법을 설명합니다.

---

## PropertyCard

매물 정보를 카드 형태로 표시하는 컴포넌트입니다.

### 사용법

```typescript
import PropertyCard from "@/components/PropertyCard";

<PropertyCard 
  property={property} 
  variant="home" | "list" 
/>
```

### Props

| Prop | Type | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `property` | `Property` | ✅ | - | 매물 정보 객체 |
| `variant` | `"home" \| "list"` | ❌ | `"home"` | 카드 스타일 변형 |

### 예시

```typescript
// 홈페이지용 (작은 카드)
<PropertyCard property={property} variant="home" />

// 목록 페이지용 (큰 카드)
<PropertyCard property={property} variant="list" />
```

---

## PriceDisplay

거래유형에 따라 가격을 자동으로 포맷팅하여 표시합니다.

### 사용법

```typescript
import PriceDisplay from "@/components/PriceDisplay";

<PriceDisplay 
  property={property} 
  variant="simple" | "full"
  size="small" | "medium" | "large"
/>
```

### Props

| Prop | Type | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `property` | `Property` | ✅ | - | 매물 정보 객체 |
| `variant` | `"simple" \| "full"` | ❌ | `"full"` | 가격 표시 형식 |
| `size` | `"small" \| "medium" \| "large"` | ❌ | `"medium"` | 텍스트 크기 |

### 동작 방식

- **매매/전세**: 단일 가격 표시
- **월세**: 보증금 + 월세 2줄 표시
- 자동으로 한국식 가격 포맷팅 (억, 천만, 백만, 만원)

### 예시

```typescript
// 작은 가격 표시
<PriceDisplay property={property} size="small" />

// 큰 가격 표시 (상세 페이지용)
<PriceDisplay property={property} size="large" variant="simple" />
```

---

## DealTypeBadge

거래유형(매매/전세/월세)에 따른 색상 배지를 표시합니다.

### 사용법

```typescript
import DealTypeBadge from "@/components/DealTypeBadge";

<DealTypeBadge 
  dealType="매매" 
  size="small" | "medium" | "large"
  variant="default" | "compact"
/>
```

### Props

| Prop | Type | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `dealType` | `string` | ✅ | - | 거래유형 (매매, 전세, 월세) |
| `size` | `"small" \| "medium" \| "large"` | ❌ | `"medium"` | 배지 크기 |
| `variant` | `"default" \| "compact"` | ❌ | `"default"` | 배지 스타일 |

### 색상 매핑

- **매매**: 빨간색 (#e74c3c)
- **전세**: 파란색 (#3498db)
- **월세**: 보라색 (#9b59b6)
- **기타**: 회색 (#34495e)

### 예시

```typescript
<DealTypeBadge dealType="매매" size="small" />
<DealTypeBadge dealType="전세" size="large" />
```

---

## CategoryFilter

카테고리 필터 버튼을 표시하는 컴포넌트입니다.

### 사용법

```typescript
import CategoryFilter from "@/components/CategoryFilter";
import { ALL_CATEGORIES } from "@/lib/categories";

<CategoryFilter
  categories={ALL_CATEGORIES}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  showDescription={true}
/>
```

### Props

| Prop | Type | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `categories` | `CategoryInfo[]` | ✅ | - | 카테고리 목록 |
| `selectedCategory` | `string` | ✅ | - | 선택된 카테고리 키 |
| `onCategoryChange` | `(key: string) => void` | ✅ | - | 카테고리 변경 핸들러 |
| `showDescription` | `boolean` | ❌ | `true` | 설명 표시 여부 |

### 예시

```typescript
const [selectedCategory, setSelectedCategory] = useState("ALL");

<CategoryFilter
  categories={ALL_CATEGORIES}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
/>
```

---

## CategorySection

홈페이지에서 카테고리별 매물 섹션을 표시합니다.

### 사용법

```typescript
import CategorySection from "@/components/CategorySection";

<CategorySection 
  category={category} 
  properties={properties} 
/>
```

### Props

| Prop | Type | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `category` | `CategoryInfo` | ✅ | - | 카테고리 정보 |
| `properties` | `Property[]` | ✅ | - | 해당 카테고리의 매물 목록 |

### 동작

- 매물이 없으면 자동으로 숨김
- 카테고리 헤더, 더보기 버튼, 매물 그리드 포함

### 예시

```typescript
{HOME_CATEGORIES.map((category) => {
  const properties = propertiesByCategory[category.key] || [];
  return (
    <CategorySection 
      key={category.key} 
      category={category} 
      properties={properties} 
    />
  );
})}
```

---

## PropertyImageGallery

매물 이미지를 슬라이더 형태로 표시하는 컴포넌트입니다.

### 사용법

```typescript
import PropertyImageGallery from "@/components/PropertyImageGallery";

<PropertyImageGallery 
  images={images} 
  height={400} 
/>
```

### Props

| Prop | Type | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `images` | `PropertyImage[]` | ✅ | - | 이미지 목록 |
| `height` | `number` | ❌ | `400` | 이미지 높이 (px) |

### 기능

- 이미지 슬라이더 (이전/다음 버튼)
- 썸네일 스트립
- 이미지 카운터 (현재/전체)
- 이미지가 없을 때 대체 UI

### 예시

```typescript
<PropertyImageGallery images={propertyImages} height={500} />
```

---

## LoadingSpinner

로딩 상태를 표시하는 컴포넌트입니다.

### 사용법

```typescript
import LoadingSpinner from "@/components/LoadingSpinner";

<LoadingSpinner message="로딩 중..." minHeight="50vh" />
```

### Props

| Prop | Type | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `message` | `string` | ❌ | `"로딩 중..."` | 표시할 메시지 |
| `minHeight` | `string` | ❌ | `"50vh"` | 최소 높이 |

### 예시

```typescript
if (loading) {
  return <LoadingSpinner message="데이터를 불러오는 중..." />;
}
```

---

## ErrorMessage

에러 메시지를 표시하는 컴포넌트입니다.

### 사용법

```typescript
import ErrorMessage from "@/components/ErrorMessage";

<ErrorMessage message="매물 정보를 찾을 수 없습니다." />
```

### Props

| Prop | Type | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `message` | `string` | ✅ | - | 에러 메시지 |
| `minHeight` | `string` | ❌ | `"50vh"` | 최소 높이 |

### 예시

```typescript
if (!property) {
  return <ErrorMessage message="매물 정보를 찾을 수 없습니다." />;
}
```

---

## PropertyFormField

폼 필드를 표시하는 컴포넌트입니다.

### 사용법

```typescript
import PropertyFormField from "@/components/PropertyFormField";

<PropertyFormField
  label="주소"
  name="address"
  type="text"
  placeholder="주소를 입력하세요"
  required
/>
```

### Props

| Prop | Type | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `label` | `string` | ✅ | - | 필드 라벨 |
| `name` | `string` | ✅ | - | 필드 이름 |
| `type` | `"text" \| "number" \| "date" \| "textarea" \| "select"` | ❌ | `"text"` | 입력 타입 |
| `placeholder` | `string` | ❌ | - | 플레이스홀더 |
| `required` | `boolean` | ❌ | `false` | 필수 여부 |
| `disabled` | `boolean` | ❌ | `false` | 비활성화 여부 |
| `defaultValue` | `string \| number` | ❌ | - | 기본값 |
| `options` | `FormFieldOption[]` | ❌ | - | select 타입용 옵션 |
| `step` | `string` | ❌ | - | number 타입용 step |
| `min` | `string \| number` | ❌ | - | 최소값 |
| `gridCols` | `number` | ❌ | - | 그리드 컬럼 수 |

### 예시

```typescript
// 텍스트 입력
<PropertyFormField
  label="주소"
  name="address"
  type="text"
  required
/>

// 숫자 입력
<PropertyFormField
  label="면적"
  name="area"
  type="number"
  step="0.1"
/>

// 셀렉트
<PropertyFormField
  label="거래유형"
  name="deal_type"
  type="select"
  options={[
    { value: "매매", label: "매매" },
    { value: "전세", label: "전세" },
    { value: "월세", label: "월세" }
  ]}
  required
/>

// 텍스트 영역
<PropertyFormField
  label="상세 설명"
  name="description"
  type="textarea"
  placeholder="매물에 대한 상세한 설명을 입력하세요"
/>
```

---

## 컴포넌트 조합 예시

### 매물 목록 페이지

```typescript
import PropertyCard from "@/components/PropertyCard";
import CategoryFilter from "@/components/CategoryFilter";
import { ALL_CATEGORIES } from "@/lib/categories";

export default function PropertyList() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [properties, setProperties] = useState<Property[]>([]);

  return (
    <div>
      <CategoryFilter
        categories={ALL_CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} variant="list" />
        ))}
      </div>
    </div>
  );
}
```

### 매물 상세 페이지

```typescript
import PropertyImageGallery from "@/components/PropertyImageGallery";
import DealTypeBadge from "@/components/DealTypeBadge";
import PriceDisplay from "@/components/PriceDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function PropertyDetail() {
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);

  if (loading) return <LoadingSpinner />;
  if (!property) return <ErrorMessage message="매물을 찾을 수 없습니다." />;

  return (
    <div>
      <PropertyImageGallery images={images} height={400} />
      
      <div>
        <DealTypeBadge dealType={property.deal_type || ""} size="large" />
        <PriceDisplay property={property} size="large" variant="simple" />
      </div>
    </div>
  );
}
```

---

## 스타일 커스터마이징

모든 컴포넌트는 인라인 스타일을 사용하므로, 필요시 컴포넌트를 수정하여 스타일을 변경할 수 있습니다.

컴포넌트 파일 위치: `client/components/`

---

## 참고사항

- 모든 컴포넌트는 TypeScript로 작성되어 타입 안정성을 보장합니다
- 컴포넌트는 재사용 가능하도록 설계되었습니다
- 새로운 컴포넌트 추가 시 이 문서를 업데이트해주세요

