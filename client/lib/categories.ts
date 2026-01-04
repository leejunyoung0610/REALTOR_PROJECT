// 카테고리 정보 타입
export interface CategoryInfo {
  key: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

// 카테고리 목록 (전체 포함)
export const ALL_CATEGORIES: CategoryInfo[] = [
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

// 홈페이지용 카테고리 (ALL 제외)
export const HOME_CATEGORIES: CategoryInfo[] = ALL_CATEGORIES.filter(c => c.key !== "ALL");

