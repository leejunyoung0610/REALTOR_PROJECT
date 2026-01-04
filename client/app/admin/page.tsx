"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import { Property } from "../../lib/types";
import DealTypeBadge from "../../components/DealTypeBadge";
import PriceDisplay from "../../components/PriceDisplay";

export default function AdminHome() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    api.get<Property[]>("/properties").then((res) => {
      setProperties(res.data);
    });
  }, []);

  const deleteProperty = async (propertyId: number, address: string) => {
    if (!confirm(`"${address}" 매물을 완전히 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.\n- 매물 정보가 삭제됩니다\n- 연결된 모든 이미지가 삭제됩니다`)) {
      return;
    }

    try {
      await api.delete(`/properties/${propertyId}`);
      alert("매물이 성공적으로 삭제되었습니다.");
      
      // 매물 목록 새로고침
      const res = await api.get<Property[]>("/properties");
      setProperties(res.data);
    } catch (error) {
      console.error("매물 삭제 실패:", error);
      alert("매물 삭제에 실패했습니다.");
    }
  };

  const toggleFeatured = async (propertyId: number, currentFeatured: boolean, address: string) => {
    const action = currentFeatured ? "해제" : "설정";
    if (!confirm(`"${address}" 매물을 추천매물에서 ${action}하시겠습니까?`)) {
      return;
    }

    try {
      await api.patch(`/properties/${propertyId}/featured`, {
        is_featured: !currentFeatured
      });
      
      alert(`추천매물 ${action}이 완료되었습니다.`);
      
      // 매물 목록 새로고침
      const res = await api.get<Property[]>("/properties");
      setProperties(res.data);
    } catch (error: unknown) {
      console.error("추천매물 설정 실패:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { error: string } } };
        if (axiosError.response?.data?.error) {
          alert(axiosError.response.data.error);
        } else {
          alert("추천매물 설정에 실패했습니다.");
        }
      } else {
        alert("추천매물 설정에 실패했습니다.");
      }
    }
  };

  return (
    <div style={{ 
      background: "#f8f9fa", 
      minHeight: "100vh", 
      color: "#333" 
    }}>
      <div style={{ 
        maxWidth: 1000, 
        margin: "0 auto", 
        padding: 20 
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: 30,
          marginBottom: 20
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
            <div>
              <h1 style={{ 
                fontSize: 32, 
                color: "#2c3e50", 
                marginBottom: 5,
                borderBottom: "3px solid #5ba1b1",
                paddingBottom: 10,
                display: "inline-block"
              }}>
                🏢 매물 관리 (관리자)
              </h1>
              <p style={{ color: "#666", fontSize: 16, margin: 0 }}>
                전체 {properties.length}개의 매물이 등록되어 있습니다
              </p>
            </div>

            {/* 매물 등록 버튼 */}
            <Link href="/admin/properties/new">
              <button
                style={{
                  padding: "12px 20px",
                  background: "linear-gradient(135deg, #28a745, #218838)",
                  color: "#fff",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 600,
                  boxShadow: "0 3px 10px rgba(40,167,69,0.3)",
                  transition: "all 0.3s ease"
                }}
              >
                ➕ 매물 등록
              </button>
            </Link>
          </div>

          {/* 매물 없을 때 */}
          {properties.length === 0 ? (
            <div style={{ 
              textAlign: "center" as const,
              padding: 60,
              background: "#f8f9fa",
              borderRadius: 12,
              border: "1px solid #e9ecef"
            }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>🏠</div>
              <h3 style={{ color: "#6c757d", marginBottom: 10, fontSize: 20 }}>
                등록된 매물이 없습니다
              </h3>
              <p style={{ color: "#6c757d", margin: 0 }}>
                첫 번째 매물을 등록해보세요!
              </p>
            </div>
          ) : (
            /* 매물 리스트 */
            <div style={{ marginTop: 10 }}>
              <div style={{ 
                display: "grid", 
                gap: 15 
              }}>
                {properties.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 20,
                      background: "#fff",
                      border: "1px solid #e9ecef",
                      borderRadius: 12,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {/* 왼쪽: 매물 정보 */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 8, gap: 8 }}>
                        <span style={{ 
                          background: p.status === "거래중" 
                            ? "linear-gradient(135deg, #28a745, #218838)" 
                            : "linear-gradient(135deg, #6c757d, #5a6268)",
                          color: "#fff", 
                          padding: "4px 12px", 
                          borderRadius: 20, 
                          fontSize: 12,
                          fontWeight: 600
                        }}>
                          {p.status === "거래중" ? "🟢" : "⚪"} {p.status}
                        </span>
                        
                        {/* 거래유형 배지 */}
                        <DealTypeBadge 
                          dealType={p.deal_type || ""} 
                          size="medium"
                        />
                        
                        <strong style={{ 
                          fontSize: 18, 
                          color: "#2c3e50" 
                        }}>
                          {p.address}
                        </strong>
                      </div>
                      
                      {/* 가격 표시 */}
                      <div style={{ 
                        color: "#5ba1b1", 
                        fontSize: 16,
                        fontWeight: 600,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        marginTop: 4
                      }}>
                        <PriceDisplay 
                          property={p} 
                          variant="full"
                          size="medium"
                        />
                      </div>
                      <div style={{ 
                        color: "#666", 
                        fontSize: 14,
                        marginTop: 4
                      }}>
                        📍 {p.type} | {p.deal_type} | ID: {p.id}
                      </div>
                    </div>

                    {/* 오른쪽: 액션 버튼 */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link href={`/admin/properties/${p.id}`}>
                        <button style={{
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: 8,
                          background: "linear-gradient(135deg, #5ba1b1, #4a8a99)",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 600,
                          boxShadow: "0 2px 6px rgba(91,161,177,0.3)",
                          transition: "all 0.2s ease"
                        }}>
                          ✏️ 수정
                        </button>
                      </Link>

                      <button
                        style={{
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: 8,
                          background: p.is_featured
                            ? "linear-gradient(135deg, #ff6b6b, #ee5a52)"
                            : "linear-gradient(135deg, #ff9f43, #ee5a24)",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 600,
                          boxShadow: p.is_featured
                            ? "0 2px 6px rgba(255,107,107,0.3)"
                            : "0 2px 6px rgba(255,159,67,0.3)",
                          transition: "all 0.2s ease"
                        }}
                        onClick={() => toggleFeatured(p.id, p.is_featured || false, p.address)}
                      >
                        {p.is_featured ? "⭐ 해제" : "⭐ 추천"}
                      </button>

                      <button
                        style={{
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: 8,
                          background: p.status === "거래중"
                            ? "linear-gradient(135deg, #ffc107, #e0a800)"
                            : "linear-gradient(135deg, #28a745, #218838)",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 600,
                          boxShadow: p.status === "거래중"
                            ? "0 2px 6px rgba(255,193,7,0.3)"
                            : "0 2px 6px rgba(40,167,69,0.3)",
                          transition: "all 0.2s ease"
                        }}
                        onClick={() =>
                          api
                            .patch(`/properties/${p.id}/status`, {
                              status:
                                p.status === "거래중" ? "거래완료" : "거래중",
                            })
                            .then(() => location.reload())
                        }
                      >
                        {p.status === "거래중" ? "✅ 완료" : "🔄 재개"}
                      </button>

                      <button
                        style={{
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: 8,
                          background: "linear-gradient(135deg, #dc3545, #c82333)",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 600,
                          boxShadow: "0 2px 6px rgba(220,53,69,0.3)",
                          transition: "all 0.2s ease"
                        }}
                        onClick={() => deleteProperty(p.id, p.address)}
                      >
                        🗑️ 삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
