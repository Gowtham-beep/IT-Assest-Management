export type Role = "admin" | "it_staff" | "manager" | "employee";

export type AssetStatus = "available" | "assigned" | "in_repair" | "retired";

export type Asset = {
  id: string;
  asset_type: "laptop" | "monitor" | "dock" | "phone";
  brand: string;
  model: string;
  serial_number: string;
  status: AssetStatus;
  location?: string;
  created_at: string;
};

export type AssetRequest = {
  id: string;
  asset_type: string;
  justification: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  created_at: string;
};

export type DashboardStats = {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  inRepairAssets: number;
  pendingRequests: number;
};
