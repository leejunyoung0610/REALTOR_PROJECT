interface LoadingSpinnerProps {
  message?: string;
  minHeight?: string;
}

export default function LoadingSpinner({ 
  message = "로딩 중...",
  minHeight = "50vh"
}: LoadingSpinnerProps) {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: minHeight,
      background: "#f8f9fa"
    }}>
      <div style={{ fontSize: 18, color: "#666" }}>{message}</div>
    </div>
  );
}

