import Link from "next/link";
import { config } from "../lib/config";

export default function Header() {
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
          {config.company.name}
        </Link>

        <nav style={{ display: "flex", gap: 20, fontSize: 14, color: "#5ba1b1" }}>
          <Link href="/properties" style={{ 
            color: "#5ba1b1", 
            textDecoration: "none",
            transition: "color 0.2s ease"
          }}>
            매물보기
          </Link>
          <Link href="/map" style={{ 
            color: "#5ba1b1", 
            textDecoration: "none",
            transition: "color 0.2s ease" 
          }}>
            가격지도
          </Link>
          <a 
            href={`tel:${config.company.phone.replace(/-/g, '')}`}
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
