import Link from "next/link";
import { Property } from "../lib/types";
import { API_BASE_URL } from "../lib/api";
import DealTypeBadge from "./DealTypeBadge";
import PriceDisplay from "./PriceDisplay";

interface PropertyCardProps {
  property: Property;
  variant?: "home" | "list";
}

export default function PropertyCard({ property, variant = "home" }: PropertyCardProps) {
  // 홈페이지와 목록 페이지의 스타일 차이
  const isHomeVariant = variant === "home";
  
  // 이미지 URL 생성
  const getImageUrl = () => {
    if (property.main_image) {
      return `${API_BASE_URL}${property.main_image}`;
    }
    // 목록 페이지는 "/no-image.png" 사용
    if (!isHomeVariant) {
      return "/no-image.png";
    }
    // 기본 이미지 (홈페이지의 특수 케이스)
    if (property.id === 3) {
      return "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop";
    }
    return "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&h=300&fit=crop";
  };

  return (
    <Link
      href={`/properties/${property.id}`}
      style={{
        textDecoration: "none",
        color: "#5ba1b1",
        border: "1px solid #d6d6d6",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
        transition: "all 0.2s ease",
        background: "white",
        width: isHomeVariant ? "calc(25% - 9px)" : "calc(25% - 9px)",
        minWidth: "220px",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 15px rgba(0,0,0,0.18)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 3px 8px rgba(0,0,0,0.12)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* 이미지 영역 */}
      <div
        style={{
          width: "100%",
          aspectRatio: isHomeVariant ? "3.5 / 2" : "4 / 3",
          overflow: "hidden",
          borderRadius: isHomeVariant ? 6 : 8,
          background: isHomeVariant ? "#f8f9fa" : "#f5f5f5",
          border: isHomeVariant ? "1px solid #e9ecef" : "none",
        }}
      >
        <img
          src={getImageUrl()}
          alt="매물 이미지"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* 텍스트 영역 */}
      <div style={{ 
        padding: isHomeVariant ? "8px 10px 8px 10px" : 16,
        background: "#ffffff",
        borderTop: isHomeVariant ? "1px solid #f1f3f4" : "none"
      }}>
        {/* 주소 */}
        <div
          style={{
            fontSize: isHomeVariant ? 14 : 16,
            fontWeight: 600,
            color: "#111",
            marginBottom: isHomeVariant ? 5 : 12,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {property.address}
        </div>

        {/* 거래유형 + 가격 */}
        <div style={{ 
          display: "flex", 
          alignItems: isHomeVariant ? "center" : "flex-start", 
          gap: 8,
          minHeight: isHomeVariant ? 32 : 50
        }}>
          {/* 거래유형 배지 */}
          <DealTypeBadge 
            dealType={property.deal_type || ""} 
            size={isHomeVariant ? "small" : "medium"}
            variant={isHomeVariant ? "compact" : "default"}
          />
          
          {/* 가격 표시 */}
          <div style={{ 
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <PriceDisplay 
              property={property} 
              variant={isHomeVariant ? "simple" : "full"}
              size={isHomeVariant ? "small" : "medium"}
            />
            
            {/* 매물 종류 (목록 페이지에만 표시) */}
            {!isHomeVariant && (
              <div style={{ 
                fontSize: 12, 
                color: "#666",
                marginTop: 6,
                lineHeight: 1.2
              }}>
                {property.type}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

