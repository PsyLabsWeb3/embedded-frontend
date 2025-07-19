export interface LeaderboardItem {
  position: number;
  walletAddress: string;
  points: number;
}

export interface LeaderboardResponse {
  data: LeaderboardItem[];
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface StatItem {
  icon: string;
  value: string;
  color: string;
}
