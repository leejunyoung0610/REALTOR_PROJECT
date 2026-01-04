"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api, { API_BASE_URL } from "../../../lib/api";
import { Property, PropertyImage } from "../../../lib/types";

export default function PropertyDetail() {
  const params = useParams();
  const propertyId = params.id;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        // 매물 정보와 이미지를 동시에 가져오기
        const [propertyRes, imagesRes] = await Promise.all([
          api.get<Property>(`/properties/${propertyId}`),
          api.get<PropertyImage[]>(`/properties/${propertyId}/images`)
        ]);
        
        setProperty(propertyRes.data);
        setImages(imagesRes.data);
        setLoading(false);
      } catch (error) {
        console.error("매물 정보 로딩 실패:", error);
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

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

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        background: "#f8f9fa"
      }}>
        <div style={{ fontSize: 18, color: "#666" }}>로딩 중...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        background: "#f8f9fa"
      }}>
        <div style={{ fontSize: 18, color: "#666" }}>매물 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #eee", padding: "16px 0", background: "#fff" }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <Link href="/" style={{ fontSize: 24, color: "#5ba1b1", textDecoration: "none", fontWeight: "bold" }}>
            베리굿 부동산
          </Link>
          
          <nav style={{ display: "flex", gap: 20, fontSize: 14, color: "#5ba1b1" }}>
            <Link href="/" style={{ color: "#5ba1b1", textDecoration: "none" }}>홈</Link>
            <Link href="/properties" style={{ color: "#5ba1b1", textDecoration: "none" }}>매물보기</Link>
            <a href="tel:010-1234-5678" style={{ color: "#5ba1b1", textDecoration: "none" }}>전화문의</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 40 }}>
          
          {/* Left: Images Slider */}
          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            {images.length > 0 ? (
              <div style={{ position: "relative" }}>
                <div style={{ width: "100%", height: 500, position: "relative", overflow: "hidden" }}>
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
                        }}
                      >
                        ›
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  <div style={{
                    position: "absolute",
                    bottom: 15,
                    right: 15,
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: 20,
                    fontSize: 14,
                  }}>
                    {currentImageIndex + 1} / {images.length}
                  </div>
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
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                width: "100%",
                height: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f5f5",
                color: "#999",
                fontSize: 16,
              }}>
                이미지가 없습니다
              </div>
            )}
          </div>

          {/* Right: Property Information */}
          <div>
            {/* Property Header */}
            <div style={{
              background: "#fff",
              borderRadius: 12,
              padding: 25,
              marginBottom: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                marginBottom: 12,
                gap: 12,
              }}>
                <span style={{
                  background: property.deal_type === "매매" ? "#28a745" : "#007bff",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  {property.deal_type}
                </span>
                <span style={{
                  background: "#6c757d",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  {property.type}
                </span>
              </div>
              
              <h1 style={{ 
                fontSize: 22, 
                color: "#2c3e50", 
                marginBottom: 15,
                fontWeight: 600,
              }}>
                {property.address}
              </h1>
              
              <div style={{ 
                fontSize: 24, 
                color: "#e74c3c", 
                fontWeight: 700,
                marginBottom: 8,
              }}>
                {property.deal_type === "매매" ? "매매" : "전세"} {property.price.toLocaleString()}원
              </div>
              
              {property.monthly_rent && (
                <div style={{ 
                  fontSize: 18, 
                  color: "#3498db", 
                  fontWeight: 600,
                }}>
                  월세 {property.monthly_rent.toLocaleString()}원
                </div>
              )}
            </div>

            {/* Property Details */}
            <div style={{
              background: "#fff",
              borderRadius: 12,
              padding: 25,
              marginBottom: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ 
                fontSize: 18, 
                color: "#2c3e50", 
                marginBottom: 20,
                borderBottom: "2px solid #5ba1b1",
                paddingBottom: 8,
              }}>
                📋 매물 정보
              </h3>
              
              <div style={{ display: "grid", gap: 12 }}>
                {property.area && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>면적</span>
                    <span style={{ fontWeight: 600 }}>{property.area}㎡</span>
                  </div>
                )}
                
                {property.rooms !== null && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>방 개수</span>
                    <span style={{ fontWeight: 600 }}>{property.rooms}개</span>
                  </div>
                )}
                
                {property.bathrooms !== null && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>욕실 개수</span>
                    <span style={{ fontWeight: 600 }}>{property.bathrooms}개</span>
                  </div>
                )}
                
                {property.maintenance_fee && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>관리비</span>
                    <span style={{ fontWeight: 600 }}>{property.maintenance_fee.toLocaleString()}원</span>
                  </div>
                )}
                
                {property.direction && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>방향</span>
                    <span style={{ fontWeight: 600 }}>{property.direction}</span>
                  </div>
                )}
                
                {property.floor_info && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>층정보</span>
                    <span style={{ fontWeight: 600 }}>{property.floor_info}</span>
                  </div>
                )}
                
                {property.usage_type && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>용도</span>
                    <span style={{ fontWeight: 600 }}>{property.usage_type}</span>
                  </div>
                )}
                
                {property.parking && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>주차</span>
                    <span style={{ fontWeight: 600 }}>{property.parking}</span>
                  </div>
                )}
                
                {property.elevator !== null && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>엘리베이터</span>
                    <span style={{ fontWeight: 600 }}>{property.elevator ? "있음" : "없음"}</span>
                  </div>
                )}
                
                {property.move_in_date && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>입주가능일</span>
                    <span style={{ fontWeight: 600 }}>
                      {new Date(property.move_in_date).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: 25,
                marginBottom: 20,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ 
                  fontSize: 18, 
                  color: "#2c3e50", 
                  marginBottom: 15,
                  borderBottom: "2px solid #5ba1b1",
                  paddingBottom: 8,
                }}>
                  📝 상세 설명
                </h3>
                <p style={{ 
                  color: "#555", 
                  lineHeight: "1.6",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}>
                  {property.description}
                </p>
              </div>
            )}

            {/* Contact */}
            <div style={{
              background: "#fff",
              borderRadius: 12,
              padding: 25,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ 
                fontSize: 18, 
                color: "#2c3e50", 
                marginBottom: 15,
                borderBottom: "2px solid #5ba1b1",
                paddingBottom: 8,
              }}>
                📞 문의하기
              </h3>
              
              <div style={{ textAlign: "center" }}>
                <div style={{ 
                  fontSize: 16, 
                  color: "#2c3e50", 
                  marginBottom: 12,
                  fontWeight: 600,
                }}>
                  베리굿 부동산
                </div>
                
                <a
                  href="tel:010-1234-5678"
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #28a745, #218838)",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    boxShadow: "0 3px 10px rgba(40,167,69,0.3)",
                  }}
                >
                  📞 010-1234-5678
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
