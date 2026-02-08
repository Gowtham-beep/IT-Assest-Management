import { z } from "zod";

export const roleSchema = z.enum(["admin", "it_staff", "manager", "employee"]);
export const assetStatusSchema = z.enum(["available", "assigned", "in_repair", "retired"]);
export const assetTypeSchema = z.enum(["laptop", "monitor", "dock", "phone"]);
export const requestStatusSchema = z.enum(["pending", "approved", "rejected", "fulfilled"]);

export const registerTenantSchema = z.object({
  companyName: z.string().min(2),
  subdomain: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const createAssetSchema = z.object({
  assetType: assetTypeSchema,
  brand: z.string().min(1),
  model: z.string().min(1),
  serialNumber: z.string().min(1),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().nonnegative().optional(),
  warrantyExpiry: z.string().optional(),
  status: assetStatusSchema.default("available"),
  location: z.string().optional(),
  notes: z.string().optional()
});

export const updateAssetSchema = createAssetSchema.partial();

export const assignAssetSchema = z.object({
  userId: z.string().uuid(),
  expectedReturnDate: z.string().optional(),
  conditionNotes: z.string().optional()
});

export const createRequestSchema = z.object({
  requestedFor: z.string().uuid(),
  assetType: assetTypeSchema,
  justification: z.string().min(3)
});

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: roleSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  department: z.string().optional()
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });
