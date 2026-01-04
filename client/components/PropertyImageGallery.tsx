"use client";

import React, { useState } from "react";
import { PropertyImage } from "../lib/types";
import { API_BASE_URL } from "../lib/api";

interface PropertyImageGalleryProps {
  images: PropertyImage[];
  height?: number;
}

export default function PropertyImageGallery({ 
  images, 
  height = 400 
}: PropertyImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  if (images.length === 0) {
    return (
      <div style={{
        width: "100%",
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        color: "#999",
        fontSize: 16,
      }}>
        이미지가 없습니다
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* 메인 이미지 */}
      <div style={{ 
        width: "100%", 
        height: height, 
        position: "relative", 
        overflow: "hidden" 
      }}>
        <img
          src={`${API_BASE_URL}${images[currentImageIndex].image_url}`}
          alt="매물 이미지"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: "absolute",
                left: 15,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.6)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 45,
                height: 45,
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              ‹
            </button>
            
            <button
              onClick={nextImage}
              style={{
                position: "absolute",
                right: 15,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.6)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 45,
                height: 45,
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              ›
            </button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div style={{
            position: "absolute",
            bottom: 15,
            right: 15,
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "6px 12px",
            borderRadius: 20,
            fontSize: 14,
            zIndex: 1,
          }}>
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div style={{ 
          display: "flex", 
          gap: 8, 
          padding: 15,
          overflowX: "auto",
          background: "#f8f9fa"
        }}>
          {images.map((image, index) => (
            <img
              key={image.id}
              src={`${API_BASE_URL}${image.image_url}`}
              alt={`썸네일 ${index + 1}`}
              style={{
                width: 80,
                height: 60,
                objectFit: "cover",
                borderRadius: 6,
                cursor: "pointer",
                border: index === currentImageIndex ? "2px solid #5ba1b1" : "2px solid transparent",
                opacity: index === currentImageIndex ? 1 : 0.7,
                transition: "all 0.2s ease",
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

