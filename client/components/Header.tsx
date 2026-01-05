"use client";

import Link from "next/link";

interface HeaderProps {
  onConsultationClick?: () => void;
}

export default function Header({ onConsultationClick }: HeaderProps) {
  return (
    <header
      style={{
        borderBottom: "1px solid #eee",
        padding: "16px 0",
        background: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link 
          href="/"
          style={{ 
            textDecoration: "none",
            color: "#5ba1b1",
            fontSize: 30,
            fontWeight: "bold"
          }}
        >
          베리굿 부동산
        </Link>

        <nav style={{ display: "flex", gap: 20, fontSize: 14, color: "#5ba1b1" }}>
          <Link href="/properties" style={{ 
            color: "#5ba1b1", 
            textDecoration: "none",
            transition: "color 0.2s ease"
          }}>
            매물보기
          </Link>
          <button
            onClick={onConsultationClick}
            style={{ 
              color: "#5ba1b1", 
              textDecoration: "none",
              transition: "color 0.2s ease",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              padding: 0
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#4a8a99";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#5ba1b1";
            }}
          >
            간편상담
          </button>
          <a 
            href="tel:010-1234-5678" 
            style={{ 
              color: "#5ba1b1", 
              textDecoration: "none",
              transition: "color 0.2s ease"
            }}
          >
            전화문의
          </a>
        </nav>
      </div>
    </header>
  );
}
