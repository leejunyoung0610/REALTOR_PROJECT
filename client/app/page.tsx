"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import { Property } from "../lib/types";
import Layout from "../components/Layout";
import PropertyCard from "../components/PropertyCard";
import ConsultationModal from "../components/ConsultationModal";

// 카테고리 정보 타입
interface CategoryInfo {
  key: string;
  name: string;
  color: string;
  hoverColor: string;
}

// 카테고리 목록 (각 카테고리별 색상 정의)
const CATEGORIES: CategoryInfo[] = [
  {
    key: "COMMERCIAL",
    name: "상가",
    color: "#e67e22",
    hoverColor: "#d35400"
  },
  {
    key: "RESIDENTIAL", 
    name: "아파트·주택",
    color: "#3498db",
    hoverColor: "#2980b9"
  },
  {
    key: "INDUSTRIAL",
    name: "공장·창고",
    color: "#95a5a6",
    hoverColor: "#7f8c8d"
  },
  {
    key: "LAND",
    name: "토지",
    color: "#27ae60",
    hoverColor: "#229954"
  }
];

export default function Home() {
  const [propertiesByCategory, setPropertiesByCategory] = useState<{[key: string]: Property[]}>({});
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  useEffect(() => {
    // 각 카테고리별로 매물 데이터 가져오기
    const fetchPropertiesByCategory = async () => {
      const categoryData: {[key: string]: Property[]} = {};
      
      for (const category of CATEGORIES) {
        try {
          // 추천매물만 가져오기 (featured=true 파라미터 추가)
          const response = await api.get<Property[]>(`/properties/category/${category.key}?limit=8&featured=true`);
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
    <Layout onConsultationClick={() => setIsConsultationModalOpen(true)}>
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
      <section style={{ padding: "50px 0", background: "#fff" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 80px",
          }}
        >
          {CATEGORIES.map((category) => {
            const properties = propertiesByCategory[category.key] || [];
            
            if (properties.length === 0) {
              return null; // 해당 카테고리에 매물이 없으면 표시하지 않음
            }

            return (
              <div key={category.key} style={{ marginBottom: 50 }}>
                {/* 카테고리 헤더 */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginBottom: 20,
                  paddingBottom: 12,
                  borderBottom: `2px solid ${category.color}`
                }}>
                  <h3 style={{ 
                    fontSize: 26, 
                    margin: 0, 
                    color: category.color,
                    fontWeight: 600,
                    letterSpacing: "-0.5px"
                  }}>
                    {category.name}
                  </h3>
                  
                  {/* 매물 더보기 버튼 */}
                  <Link
                    href={`/properties?category=${category.key}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      backgroundColor: "transparent",
                      color: category.color,
                      textDecoration: "none",
                      borderRadius: 4,
                      fontSize: 14,
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                      border: `1px solid ${category.color}`
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = category.color;
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLElement).style.color = category.color;
                    }}
                  >
                    더보기
                    <span style={{ fontSize: 12 }}>→</span>
                  </Link>
                </div>

                {/* 매물 그리드 - 한 줄에 4개씩, 총 8개만 표시 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 20,
                    marginBottom: 40
                  }}
                >
                  {properties.slice(0, 8).map((p) => (
                    <PropertyCard key={p.id} property={p} variant="home" />
                  ))}
                </div>
              </div>
            );
          })}

          {/* 전체 매물 보기 버튼 */}
          <div style={{ textAlign: "center", marginTop: 30, paddingTop: 30, borderTop: "1px solid #e9ecef" }}>
            <Link
              href="/properties"
              style={{
                display: "inline-block",
                padding: "14px 40px",
                backgroundColor: "#2c3e50",
                color: "white",
                textDecoration: "none",
                borderRadius: 4,
                fontSize: 15,
                fontWeight: 600,
                transition: "all 0.2s ease",
                letterSpacing: "0.5px"
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#1a252f";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#2c3e50";
              }}
            >
              전체 매물 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 간편 상담 문의 섹션 - 작고 타이트하게 */}
      <section style={{ padding: "30px 0", background: "#f8f9fa" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 80px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: "20px 30px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ 
                fontSize: 16, 
                fontWeight: 600, 
                color: "#2c3e50", 
                margin: 0,
                marginBottom: 4
              }}>
                간편 상담 문의
              </h3>
              <p style={{ 
                fontSize: 13, 
                color: "#666",
                margin: 0 
              }}>
                빠르고 쉽게 문의하세요
              </p>
            </div>

            <button
              onClick={() => setIsConsultationModalOpen(true)}
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #28a745, #218838)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #218838, #1e7e34)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #28a745, #218838)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              문의하기
            </button>
          </div>
        </div>
      </section>
      </div>

      {/* 간편 상담 문의 모달 */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        mode="create"
      />
    </Layout>
  );
}
