"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import { Property } from "../../lib/types";
import Layout from "../../components/Layout";
import PropertyCard from "../../components/PropertyCard";

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
    key: "ALL",
    name: "전체",
    emoji: "🏢", 
    description: "모든 매물",
    color: "#34495e"
  },
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

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isInitialized, setIsInitialized] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    // 초기화: URL 파라미터 확인 후 데이터 가져오기
    const initializeComponent = async () => {
      // 1. URL 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get("category");
      
      let currentCategory = "ALL";
      if (categoryParam && CATEGORIES.find(c => c.key === categoryParam)) {
        currentCategory = categoryParam;
        setSelectedCategory(categoryParam);
      }
      
      // 2. 해당 카테고리의 데이터 가져오기
      try {
        let response;
        if (currentCategory === "ALL") {
          response = await api.get<Property[]>("/properties");
        } else {
          response = await api.get<Property[]>(`/properties/category/${currentCategory}`);
        }
        
        setProperties(response.data.filter((p) => p.status === "거래중"));
      } catch (error) {
        console.error("매물 데이터 로딩 실패:", error);
        setProperties([]);
      }
      
      setIsInitialized(true);
    };

    initializeComponent();
  }, []);

  useEffect(() => {
    // 카테고리가 변경되었을 때만 데이터 다시 가져오기 (초기화 이후)
    if (!isInitialized) return;
    
    const fetchProperties = async () => {
      try {
        let response;
        if (selectedCategory === "ALL") {
          response = await api.get<Property[]>("/properties");
        } else {
          response = await api.get<Property[]>(`/properties/category/${selectedCategory}`);
        }
        
        setProperties(response.data.filter((p) => p.status === "거래중"));
      } catch (error) {
        console.error("매물 데이터 로딩 실패:", error);
        setProperties([]);
      }
    };

    fetchProperties();
  }, [selectedCategory, isInitialized]);

  return (
    <Layout>
      <div style={{ background: "#fff", minHeight: "100vh", color: "#000" }}>
        <style dangerouslySetInnerHTML={{
          __html: `
            .property-address {
              font-size: 16px !important;
              font-weight: 600 !important;
              color: #111 !important;
            }
            .property-price {
              margin-top: 6px !important;
              font-size: 14px !important;
              color: #333 !important;
            }
          `
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
          {/* 헤더 - 홈 버튼 제거 (Layout의 Header 네비게이션 사용) */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, margin: 0 }}>매물 목록</h2>
          </div>

        {/* 카테고리 필터 */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16
          }}>
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.key;
              const isHovered = hoveredCategory === category.key;
              
              return (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  onMouseEnter={() => setHoveredCategory(category.key)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    border: `2px solid ${isSelected ? category.color : (isHovered ? category.color : "#e1e5e9")}`,
                    backgroundColor: isSelected ? category.color : (isHovered ? "#f8f9fa" : "#fff"),
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: isSelected ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ 
                    color: isSelected ? "white" : "#333",
                    fontWeight: "inherit"
                  }}>{category.emoji}</span>
                  <span style={{ 
                    color: isSelected ? "white" : "#333",
                    fontWeight: "inherit"
                  }}>{category.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* 선택된 카테고리 설명 */}
          {selectedCategory !== "ALL" && (
            <p style={{ 
              color: "#666", 
              fontSize: 14,
              margin: 0,
              fontStyle: "italic"
            }}>
              {CATEGORIES.find(c => c.key === selectedCategory)?.description} 매물을 보고 있습니다.
            </p>
          )}
        </div>

        {properties.length === 0 && (
          <p style={{ color: "#1b1f20ff" }}>현재 등록된 매물이 없습니다.</p>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "flex-start"
          }}
        >
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} variant="list" />
          ))}
        </div>
      </div>
    </div>
    </Layout>
  );
}
