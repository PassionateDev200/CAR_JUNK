/** route: src/lib/adminAuth.js */
import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import { connectToDatabase } from "@/lib/mongodb";

export async function verifyAdminToken(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectToDatabase();
    const admin = await Admin.findById(decoded.adminId).select("-password");

    if (!admin || !admin.isActive) {
      throw new Error("Invalid admin");
    }

    return admin;
  } catch (error) {
    throw new Error("Authentication failed");
  }
}

export function requirePermission(permission) {
  return async (request) => {
    const admin = await verifyAdminToken(request);

    if (
      !admin.permissions.includes(permission) &&
      admin.role !== "super_admin"
    ) {
      throw new Error("Insufficient permissions");
    }

    return admin;
  };
}
