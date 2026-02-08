export const roles = ["admin", "it_staff", "manager", "employee"] as const;
export const assetStatuses = ["available", "assigned", "in_repair", "retired"] as const;
export const requestStatuses = ["pending", "approved", "rejected", "fulfilled"] as const;
export const assetTypes = ["laptop", "monitor", "dock", "phone"] as const;

export type Role = (typeof roles)[number];
export type AssetStatus = (typeof assetStatuses)[number];
export type RequestStatus = (typeof requestStatuses)[number];
export type AssetType = (typeof assetTypes)[number];
