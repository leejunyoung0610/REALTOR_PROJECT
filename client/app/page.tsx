"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import { Property } from "../lib/types";
import Layout from "../components/Layout";
import PropertyCard from "../components/PropertyCard";

// 카테고리 정보 타입
interface CategoryInfo {
  key: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

// 카테고리 목록
const CATEGORIES: CategoryInfo[] = [
  {
    key: "COMMERCIAL",
    name: "상가",
    emoji: "🏪", 
    description: "상가, 사무실",
    color: "#e67e22"
  },
  {
    key: "RESIDENTIAL", 
    name: "아파트·주택",
    emoji: "🏠",
    description: "아파트, 빌라, 원룸, 투룸, 오피스텔",
    color: "#3498db"
  },
  {
    key: "INDUSTRIAL",
    name: "공장·창고", 
    emoji: "🏭",
    description: "공장, 창고",
    color: "#95a5a6"
  },
  {
    key: "LAND",
    name: "토지",
    emoji: "🌍",
    description: "토지",
    color: "#27ae60"
  }
];

export default function Home() {
  const [propertiesByCategory, setPropertiesByCategory] = useState<{[key: string]: Property[]}>({});

  useEffect(() => {
    // 각 카테고리별로 매물 데이터 가져오기
    const fetchPropertiesByCategory = async () => {
      const categoryData: {[key: string]: Property[]} = {};
      
      for (const category of CATEGORIES) {
        try {
          const response = await api.get<Property[]>(`/properties/category/${category.key}?limit=8`);
          categoryData[category.key] = response.data; // limit이 서버에서 적용됨
        } catch (error) {
          console.error(`${category.name} 카테고리 데이터 로딩 실패:`, error);
          categoryData[category.key] = [];
        }
      }
      
      setPropertiesByCategory(categoryData);
    };

    fetchPropertiesByCategory();
  }, []);
  

  return (
    <Layout>
      <div style={{ background: "#fff", color: "#5ba1b1" }}>
        {/* Hero */}
        <section
          style={{
            height: 420,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1560185127-6ed189bf02f4)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        <div
          style={{
            height: "100%",
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "0 20px",
              color: "#fff",
            }}
          >
            <h1 style={{ fontSize: 42, marginBottom: 12 }}>
              베리굿 부동산
            </h1>
            <p style={{ fontSize: 18 }}>
              천안 지역 아파트 · 원룸 · 상가 전문 중개
            </p>

            <Link href="/properties">
              <button
                style={{
                  marginTop: 32,
                  padding: "14px 24px",
                  fontSize: 16,
                  background: "#1e3a8a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                매물 바로보기
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "60px 0", background: "#f8f9fa" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          <h2 style={{ fontSize: 28, marginBottom: 40, color: "#2c3e50", textAlign: "center" }}>
            매물 카테고리별 보기
          </h2>

          {CATEGORIES.map((category) => {
            const properties = propertiesByCategory[category.key] || [];
            
            if (properties.length === 0) {
              return null; // 해당 카테고리에 매물이 없으면 표시하지 않음
            }

            return (
              <div key={category.key} style={{ marginBottom: 60 }}>
                {/* 카테고리 헤더 */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginBottom: 24 
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 32 }}>{category.emoji}</span>
                    <div>
                      <h3 style={{ 
                        fontSize: 24, 
                        margin: 0, 
                        color: category.color,
                        fontWeight: 700
                      }}>
                        {category.name}
                      </h3>
                      <p style={{ 
                        fontSize: 14, 
                        color: "#666", 
                        margin: 0,
                        marginTop: 4
                      }}>
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* 매물 더보기 버튼 */}
                  <Link
                    href={`/properties?category=${category.key}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 16px",
                      backgroundColor: category.color,
                      color: "white",
                      textDecoration: "none",
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      (e.target as HTMLElement).style.opacity = "0.8";
                    }}
                    onMouseOut={(e) => {
                      (e.target as HTMLElement).style.opacity = "1";
                    }}
                  >
                    매물 더보기 →
                  </Link>
                </div>

                {/* 매물 그리드 */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    justifyContent: "flex-start"
                  }}
                >
                  {properties.map((p) => (
                    <PropertyCard key={p.id} property={p} variant="home" />
                  ))}
                </div>
              </div>
            );
          })}

          {/* 전체 매물 보기 버튼 */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              href="/properties"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                backgroundColor: "#5ba1b1",
                color: "white",
                textDecoration: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease",
                border: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "#4a8a98";
              }}
              onMouseOut={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "#5ba1b1";
              }}
            >
              전체 매물 보러가기 →
            </Link>
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
