interface ErrorMessageProps {
  message: string;
  minHeight?: string;
}

export default function ErrorMessage({ 
  message,
  minHeight = "50vh"
}: ErrorMessageProps) {
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

