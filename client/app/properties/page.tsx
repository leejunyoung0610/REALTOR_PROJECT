/**
 * 매물 목록 페이지
 * - 카테고리 필터
 * - 매물 카드 그리드
 * - URL 파라미터로 카테고리 필터링 지원
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import { Property } from "../../lib/types";
import Layout from "../../components/Layout";
import PropertyCard from "../../components/PropertyCard";
import CategoryFilter from "../../components/CategoryFilter";
import { ALL_CATEGORIES } from "../../lib/categories";

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 초기화: URL 파라미터 확인 후 데이터 가져오기
    const initializeComponent = async () => {
      // 1. URL 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get("category");
      
      let currentCategory = "ALL";
      if (categoryParam && ALL_CATEGORIES.find(c => c.key === categoryParam)) {
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
        <CategoryFilter
          categories={ALL_CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

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
