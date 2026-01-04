/**
 * 애플리케이션 설정
 * 환경 변수에서 값을 가져오며, 기본값을 제공합니다.
 */

export const config = {
  // API 설정
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  
  // 회사 정보
  company: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || "베리굿 부동산",
    representative: process.env.NEXT_PUBLIC_COMPANY_REPRESENTATIVE || "문수진",
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "010-7503-6000",
    phoneAlt: process.env.NEXT_PUBLIC_COMPANY_PHONE_ALT || "00000000000",
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "충청남도 천안시 청당동",
    registration: process.env.NEXT_PUBLIC_COMPANY_REGISTRATION || "0000-0000-0000",
    registrationDisplay: process.env.NEXT_PUBLIC_COMPANY_REGISTRATION_DISPLAY || "000-0000-0000",
  },
} as const;

