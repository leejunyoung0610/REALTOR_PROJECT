"use client";

import { useState, useEffect } from "react";
import api from "../lib/api";
import { Consultation } from "../lib/types";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "view";
  consultation?: Consultation | null;
}

export default function ConsultationModal({
  isOpen,
  onClose,
  mode = "create",
  consultation = null,
}: ConsultationModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 전화번호 형식 검증 함수
  const validatePhoneNumber = (phone: string): boolean => {
    const numbersOnly = phone.replace(/-/g, "");
    if (!/^\d+$/.test(numbersOnly)) {
      return false;
    }
    const mobilePattern = /^(010|011|016|017|018|019)\d{7,8}$/;
    const landlinePattern = /^(02|031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064)\d{6,8}$/;
    return mobilePattern.test(numbersOnly) || landlinePattern.test(numbersOnly);
  };

  // 읽기 모드일 때 consultation 데이터로 초기화
  useEffect(() => {
    if (mode === "view" && consultation) {
      setName(consultation.name);
      setContact(consultation.contact);
      setMessage(consultation.message);
    } else {
      setName("");
      setContact("");
      setMessage("");
      setPrivacyAgreed(false);
    }
    setError("");
  }, [mode, consultation, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "view") {
      onClose();
      return;
    }

    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (!contact.trim()) {
      setError("연락처를 입력해주세요.");
      return;
    }

    // 전화번호 형식 검증
    if (!validatePhoneNumber(contact.trim())) {
      setError("올바른 전화번호 형식을 입력해주세요.\n예: 010-1234-5678, 02-1234-5678");
      return;
    }

    if (!message.trim()) {
      setError("상담 내용을 입력해주세요.");
      return;
    }

    if (!privacyAgreed) {
      setError("개인정보 수집·이용 동의에 체크해주세요.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const requestData = {
        name: name.trim(),
        contact: contact.trim(),
        message: message.trim(),
      };
      
      console.log("상담 문의 전송 시도:", requestData);
      
      await api.post("/consultations", requestData);

      alert("상담 문의가 성공적으로 전송되었습니다.");
      setName("");
      setContact("");
      setMessage("");
      setPrivacyAgreed(false);
      onClose();
    } catch (err: any) {
      console.error("상담 문의 전송 실패:", err);
      console.error("에러 응답:", err.response?.data);
      
      let errorMessage = "상담 문의 전송에 실패했습니다. 다시 시도해주세요.";
      
      if (err.response?.data) {
        if (err.response.data.error) {
          errorMessage = err.response.data.error;
          if (err.response.data.details) {
            errorMessage += ` (${err.response.data.details})`;
          }
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 30,
          width: "90%",
          maxWidth: 500,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2c3e50", margin: 0 }}>
            📧 간편 상담 문의
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              color: "#999",
              cursor: "pointer",
              padding: 0,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 이름과 연락처 (2열) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {/* 이름 */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error && error.includes("이름")) {
                    setError("");
                  }
                }}
                placeholder="이름을 입력해주세요"
                disabled={mode === "view"}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: error && error.includes("이름") ? "1px solid #dc3545" : "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: "border-box",
                  background: mode === "view" ? "#f5f5f5" : "#fff",
                  color: mode === "view" ? "#666" : "#333",
                }}
              />
            </div>

            {/* 연락처 */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                연락처
              </label>
              <input
                type="tel"
                value={contact}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d-]/g, "");
                  setContact(value);
                  if (error && error.includes("연락처")) {
                    setError("");
                  }
                }}
                placeholder="연락처를 입력해주세요"
                disabled={mode === "view"}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: error && error.includes("연락처") || error.includes("전화번호") ? "1px solid #dc3545" : "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: 14,
                  boxSizing: "border-box",
                  background: mode === "view" ? "#f5f5f5" : "#fff",
                  color: mode === "view" ? "#666" : "#333",
                }}
              />
            </div>
          </div>

          {/* 상담 내용 */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#333",
              }}
            >
              내용
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error && error.includes("내용")) {
                  setError("");
                }
              }}
              placeholder="상담 내용을 입력해주세요"
              disabled={mode === "view"}
              rows={6}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: error && error.includes("내용") ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box",
                background: mode === "view" ? "#f5f5f5" : "#fff",
                color: mode === "view" ? "#666" : "#333",
              }}
            />
          </div>

          {/* 개인정보 동의 (생성 모드일 때만) */}
          {mode === "create" && (
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  color: "#666",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  style={{
                    width: 18,
                    height: 18,
                    cursor: "pointer",
                  }}
                />
                <span>개인정보 수집·이용 동의</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("개인정보 수집·이용 약관 내용을 여기에 표시합니다.");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#5ba1b1",
                    fontSize: 12,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                    marginLeft: "auto",
                  }}
                >
                  내용 보기
                </button>
              </label>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "#fee",
                border: "1px solid #fcc",
                borderRadius: 8,
                color: "#c33",
                fontSize: 14,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          {/* 제출 버튼 (생성 모드일 때만 표시) */}
          {mode === "create" && (
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "14px",
                background: submitting
                  ? "#ccc"
                  : "linear-gradient(135deg, #28a745, #218838)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {submitting ? "전송 중..." : "상담문의 남기기"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

