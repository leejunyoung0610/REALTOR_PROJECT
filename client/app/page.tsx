"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import { Property } from "../lib/types";
import Layout from "../components/Layout";
import { HOME_CATEGORIES } from "../lib/categories";
import CategorySection from "../components/CategorySection";

export default function Home() {
  const [propertiesByCategory, setPropertiesByCategory] = useState<{[key: string]: Property[]}>({});

  useEffect(() => {
    // 각 카테고리별로 매물 데이터 가져오기
    const fetchPropertiesByCategory = async () => {
      const categoryData: {[key: string]: Property[]} = {};
      
      for (const category of HOME_CATEGORIES) {
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

          {HOME_CATEGORIES.map((category) => {
            const properties = propertiesByCategory[category.key] || [];
            return (
              <CategorySection 
                key={category.key} 
                category={category} 
                properties={properties} 
              />
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
