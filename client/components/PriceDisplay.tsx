import { Property } from "../lib/types";
import { getPriceDisplay, formatPrice, formatPriceSimple } from "../lib/priceUtils";

interface PriceDisplayProps {
  property: Property;
  variant?: "simple" | "full";
  size?: "small" | "medium" | "large";
}

export default function PriceDisplay({ 
  property, 
  variant = "full",
  size = "medium"
}: PriceDisplayProps) {
  const priceDisplay = getPriceDisplay(property);
  
  // 크기별 스타일
  const sizeStyles = {
    small: {
      fontSize: 15,
      fontWeight: 700,
    },
    medium: {
      fontSize: variant === "simple" ? 13 : 14,
      fontWeight: 600,
    },
    large: {
      fontSize: variant === "simple" ? 24 : 28,
      fontWeight: 700,
    },
  };

  const style = sizeStyles[size];
  const formatFunc = variant === "simple" ? formatPriceSimple : formatPrice;

  // 월세인 경우 (보증금 + 월세)
  if (property.deal_type === "월세" && priceDisplay.primary && priceDisplay.secondary) {
    return (
      <>
        <div style={{ 
          fontSize: style.fontSize,
          fontWeight: style.fontWeight, 
          color: size === "large" ? "#2c3e50" : "#333",
          lineHeight: 1.2,
          margin: 0,
          padding: 0
        }}>
          보증금 {formatFunc(priceDisplay.primary.value)}
        </div>
        <div style={{ 
          fontSize: style.fontSize,
          fontWeight: style.fontWeight, 
          color: size === "large" ? "#2c3e50" : "#333",
          lineHeight: 1.2,
          margin: 0,
          padding: 0,
          marginTop: size === "large" ? 2 : 1
        }}>
          월세 {formatFunc(priceDisplay.secondary.value)}
        </div>
      </>
    );
  }
  
  // 매매/전세인 경우 (단일 가격)
  if (priceDisplay.primary) {
    return (
      <div style={{ 
        fontSize: style.fontSize,
        fontWeight: style.fontWeight, 
        color: size === "large" ? "#2c3e50" : "#333",
        lineHeight: size === "large" ? 1.2 : 1.4,
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        minHeight: size === "large" ? undefined : (property.deal_type === "월세" ? 44 : 22)
      }}>
        {formatFunc(priceDisplay.primary.value)}
      </div>
    );
  }

  // 가격 정보가 없는 경우
  return (
    <div style={{ 
      fontSize: size === "small" ? 12 : 14, 
      color: "#999",
      lineHeight: size === "large" ? 1.2 : 1.4,
      margin: 0,
      padding: 0,
      display: "flex",
      alignItems: "center",
      minHeight: size === "large" ? undefined : (property.deal_type === "월세" ? 44 : 22)
    }}>
      가격 정보 없음
    </div>
  );
}

