"use client";

import React from "react";
import { CategoryInfo } from "../lib/categories";

interface CategoryFilterProps {
  categories: CategoryInfo[];
  selectedCategory: string;
  onCategoryChange: (categoryKey: string) => void;
  showDescription?: boolean;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  showDescription = true,
}: CategoryFilterProps) {
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 16
      }}>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.key;
          const isHovered = hoveredCategory === category.key;
          
          return (
            <button
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
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
      {showDescription && selectedCategory !== "ALL" && (
        <p style={{ 
          color: "#666", 
          fontSize: 14,
          margin: 0,
          fontStyle: "italic"
        }}>
          {categories.find(c => c.key === selectedCategory)?.description} 매물을 보고 있습니다.
        </p>
      )}
    </div>
  );
}

