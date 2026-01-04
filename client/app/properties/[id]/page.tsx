/**
 * 매물 상세 페이지
 * - 이미지 갤러리 (슬라이더)
 * - 매물 상세 정보
 * - 가격 및 거래유형 표시
 * - 회사 정보 및 문의하기
 */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";
import { Property, PropertyImage } from "../../../lib/types";
import Layout from "../../../components/Layout";
import DealTypeBadge from "../../../components/DealTypeBadge";
import PriceDisplay from "../../../components/PriceDisplay";
import PropertyImageGallery from "../../../components/PropertyImageGallery";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ErrorMessage from "../../../components/ErrorMessage";

export default function PropertyDetail() {
  const params = useParams();
  const propertyId = params.id;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
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


  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="로딩 중..." />
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <ErrorMessage message="매물 정보를 찾을 수 없습니다." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ background: "#f8f9fa" }}>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        
        {/* 메인 콘텐츠 - 2컬럼 레이아웃 */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 40 }}>
          
          {/* 왼쪽: 이미지 + 매물 정보 (1자 배치) */}
          <div>
            {/* 이미지 섹션 */}
            <div style={{ 
              background: "#fff", 
              borderRadius: 12, 
              overflow: "hidden", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              marginBottom: 30
            }}>
              <PropertyImageGallery images={images} height={400} />
            </div>

            {/* 매물 정보 섹션 - 이미지 바로 아래 */}
            <div style={{
              background: "#fff",
              borderRadius: 12,
              padding: 30,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ 
                fontSize: 20, 
                color: "#2c3e50", 
                marginBottom: 25,
                borderBottom: "2px solid #5ba1b1",
                paddingBottom: 10,
              }}>
                매물 상세 정보
              </h3>
              
              {/* 매물 정보 2컬럼 배치 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {property.area && (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef"
                  }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>면적</span>
                    <span style={{ fontWeight: 600, color: "#2c3e50" }}>{property.area}㎡</span>
                  </div>
                )}
                
                {property.rooms !== null && (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef"
                  }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>방 개수</span>
                    <span style={{ fontWeight: 600, color: "#2c3e50" }}>{property.rooms}개</span>
                  </div>
                )}
                
                {property.bathrooms !== null && (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef"
                  }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>욕실 개수</span>
                    <span style={{ fontWeight: 600, color: "#2c3e50" }}>{property.bathrooms}개</span>
                  </div>
                )}
                
                {property.maintenance_fee && (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef"
                  }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>관리비</span>
                    <span style={{ fontWeight: 600, color: "#2c3e50" }}>{property.maintenance_fee.toLocaleString()}원</span>
                  </div>
                )}
                
                {property.direction && (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef"
                  }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>방향</span>
                    <span style={{ fontWeight: 600, color: "#2c3e50" }}>{property.direction}</span>
                  </div>
                )}
                
                {property.floor_info && (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef"
                  }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>층정보</span>
                    <span style={{ fontWeight: 600, color: "#2c3e50" }}>{property.floor_info}</span>
                  </div>
                )}
                
                {property.usage_type && (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef"
                  }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>용도</span>
                    <span style={{ fontWeight: 600, color: "#2c3e50" }}>{property.usage_type}</span>
                  </div>
                )}
                
                {property.parking && (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef"
                  }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>주차</span>
                    <span style={{ fontWeight: 600, color: "#2c3e50" }}>{property.parking}</span>
                  </div>
                )}
                
                {property.elevator !== null && (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef"
                  }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>엘리베이터</span>
                    <span style={{ fontWeight: 600, color: "#2c3e50" }}>{property.elevator ? "있음" : "없음"}</span>
                  </div>
                )}
                
                {property.move_in_date && (
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f8f9fa",
                    borderRadius: 8,
                    border: "1px solid #e9ecef"
                  }}>
                    <span style={{ color: "#666", fontWeight: 500 }}>입주가능일</span>
                    <span style={{ fontWeight: 600, color: "#2c3e50" }}>
                      {new Date(property.move_in_date).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽: 매물 헤더 + 설명 + 연락처 (1자 배치) */}
          <div>
            {/* Property Header */}
            <div style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20, // 25에서 20으로 축소
              marginBottom: 15, // 20에서 15로 축소
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              {/* 매물번호 */}
              <div style={{
                display: "inline-block",
                padding: "4px 12px",
                border: "1px solid #666",
                borderRadius: 4,
                fontSize: 12,
                color: "#666",
                marginBottom: 15,
              }}>
                매물번호 {property.id}
              </div>

              {/* 매물 종류 키워드들 */}
              <div style={{ 
                fontSize: 16,
                color: "#666",
                marginBottom: 15,
                lineHeight: 1.4,
              }}>
                {[
                  property.deal_type,
                  property.area && `${property.area}㎡`,
                  property.direction && `${property.direction}향`,
                  property.floor_info,
                  property.parking && "주차가능"
                ].filter(Boolean).join(' • ')}
              </div>

              {/* 거래유형과 가격 - 부동산 사이트 스타일 */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                marginBottom: 15,
                gap: 12,
              }}>
                {/* 거래유형 배지 - 색상 구분 */}
                <DealTypeBadge 
                  dealType={property.deal_type || ""} 
                  size="large"
                />
                
                {/* 가격 표시 - 월세는 2줄, 나머지는 1줄 */}
                <div style={{ 
                  flex: 1,
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "center",
                }}>
                  <PriceDisplay 
                    property={property} 
                    variant="simple"
                    size="large"
                  />
                </div>
              </div>

              {/* 주소 */}
              <div style={{ 
                fontSize: 16, 
                color: "#666", 
                marginBottom: 15,
              }}>
                {property.address}
              </div>

              {/* 기본 정보 아이콘과 함께 */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: 8, 
                marginBottom: 20,
                fontSize: 14,
                color: "#666"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span>🏠</span>
                  <span>{property.type}</span>
                </div>
                
                {property.area && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span>📏</span>
                    <span>건축 {property.area}㎡</span>
                  </div>
                )}
                
                {property.floor_info && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span>🏢</span>
                    <span>총고 {property.floor_info}</span>
                  </div>
                )}
                
                {property.direction && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span>🧭</span>
                    <span>지상 : {property.direction} / 지하 : {property.direction}</span>
                  </div>
                )}
              </div>

              {/* 매물 문의하기 버튼 */}
              <button
                onClick={() => {
                  // TODO: 매물 문의 로직 구현 예정
                  alert('매물 문의 기능은 곧 구현될 예정입니다.');
                }}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                💬 매물 문의하기
              </button>
            </div>

            {/* Description */}
            {property.description && (
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20, // 25에서 20으로 축소
                marginBottom: 15, // 20에서 15로 축소
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ 
                  fontSize: 18, 
                  color: "#2c3e50", 
                  marginBottom: 12, // 15에서 12로 축소
                  borderBottom: "2px solid #5ba1b1",
                  paddingBottom: 8,
                }}>
                  상세 설명
                </h3>
                <p style={{ 
                  color: "#555", 
                  lineHeight: "1.6",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  fontSize: 16,
                }}>
                  {property.description}
                </p>
              </div>
            )}

            {/* Company Info */}
            <div style={{
              background: "#fff",
              borderRadius: 12,
              padding: 16, // 20에서 16으로 더 축소
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              {/* 메인 제목 */}
              <div style={{ textAlign: "center", marginBottom: 12 }}> {/* 16에서 12로 축소 */}
                <h3 style={{ 
                  fontSize: 18, // 20에서 18로 축소
                  color: "#2c3e50", 
                  marginBottom: 4, // 5에서 4로 축소
                  fontWeight: 700,
                }}>
                  문수진 공인중개사
                </h3>
                
                {/* 전화번호들 */}
                <div style={{ marginBottom: 12 }}> {/* 16에서 12로 축소 */}
                  <a
                    href="tel:00000000000"
                    style={{
                      fontSize: 18,
                      color: "#28a745",
                      textDecoration: "none",
                      fontWeight: 600,
                      marginRight: 15,
                    }}
                  >
                    00000000000
                  </a>
                  <span style={{ color: "#666", fontSize: 16 }}>|</span>
                  <a
                    href="tel:01075036000"
                    style={{
                      fontSize: 18,
                      color: "#28a745",
                      textDecoration: "none",
                      fontWeight: 600,
                      marginLeft: 15,
                    }}
                  >
                    010-7503-6000
                  </a>
                </div>
              </div>

              {/* 구분선 */}
              <div style={{ 
                borderTop: "1px solid #e9ecef", 
                margin: "12px 0", // 16px 0에서 12px 0으로 축소
              }}></div>

              {/* 사업자 정보 */}
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}> {/* 14에서 13으로 축소 */}
                <h4 style={{ 
                  fontSize: 15, // 16에서 15로 축소
                  color: "#2c3e50", 
                  marginBottom: 8, // 10에서 8로 축소
                  fontWeight: 600,
                }}>
                  배리굿부동산
                </h4>
                
                <div style={{ marginBottom: 4 }}> {/* 6에서 4로 축소 */}
                  <span style={{ fontWeight: 500, color: "#555", width: 70, display: "inline-block" }}>대표자</span> {/* width 80에서 70으로 축소 */}
                  <span>문수진</span>
                </div>
                
                <div style={{ marginBottom: 4 }}> {/* 6에서 4로 축소 */}
                  <span style={{ fontWeight: 500, color: "#555", width: 70, display: "inline-block" }}>소재지</span>
                  <span>충청남도 천안시 청당동</span>
                </div>
                
                <div style={{ marginBottom: 4 }}> {/* 6에서 4로 축소 */}
                  <span style={{ fontWeight: 500, color: "#555", width: 70, display: "inline-block" }}>등록번호</span>
                  <span>0000-0000-0000</span>
                </div>
                
                <div>
                  <span style={{ fontWeight: 500, color: "#555", width: 70, display: "inline-block" }}>대표번호</span>
                  <span>000-0000-0000</span>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}
