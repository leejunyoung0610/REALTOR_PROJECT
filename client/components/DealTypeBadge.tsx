interface DealTypeBadgeProps {
  dealType: string;
  size?: "small" | "medium" | "large";
  variant?: "default" | "compact";
}

export default function DealTypeBadge({ 
  dealType, 
  size = "medium",
  variant = "default"
}: DealTypeBadgeProps) {
  // 거래유형별 색상 매핑
  const getBackgroundColor = (type: string): string => {
    switch (type) {
      case "매매":
        return "#e74c3c";
      case "전세":
        return "#3498db";
      case "월세":
        return "#9b59b6";
      default:
        return "#34495e";
    }
  };

  // 크기별 스타일
  const sizeStyles = {
    small: {
      padding: "4px 7px",
      fontSize: 11,
      minWidth: 34,
      height: 22,
      borderRadius: 4,
    },
    medium: {
      padding: "4px 8px",
      fontSize: 12,
      minWidth: 36,
      borderRadius: 6,
    },
    large: {
      padding: "8px 16px",
      fontSize: 16,
      minWidth: 60,
      borderRadius: 8,
    },
  };

  const style = sizeStyles[size];
  const backgroundColor = getBackgroundColor(dealType);

  return (
    <span
      style={{
        background: backgroundColor,
        color: "white",
        padding: style.padding,
        borderRadius: style.borderRadius,
        fontSize: style.fontSize,
        fontWeight: 700,
        minWidth: style.minWidth,
        textAlign: "center",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(variant === "compact" && size === "small" && { height: style.height }),
        ...(variant === "default" && size === "medium" && { alignSelf: "flex-start" }),
      }}
    >
      {dealType}
    </span>
  );
}

