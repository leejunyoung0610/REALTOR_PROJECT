import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  onConsultationClick?: () => void;
}

export default function Layout({ children, onConsultationClick }: LayoutProps) {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      background: "#fff"
    }}>
      <Header onConsultationClick={onConsultationClick} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
