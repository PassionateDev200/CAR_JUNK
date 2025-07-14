/** route: src/contexts/AdminContext.jsx */
"use client";
import { createContext, useContext, useReducer, useEffect } from "react";

const AdminContext = createContext();
const AdminDispatchContext = createContext();

const initialState = {
  admin: null,
  stats: {
    totalQuotes: 0,
    pendingQuotes: 0,
    scheduledPickups: 0,
    totalRevenue: 0,
  },
  notifications: [],
  loading: false,
};

function adminReducer(state, action) {
  switch (action.type) {
    case "SET_ADMIN":
      return { ...state, admin: action.payload };
    case "SET_STATS":
      return { ...state, stats: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    default:
      return state;
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("/api/admin/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_ADMIN", payload: data.admin });
      }
    } catch (error) {
      console.error("Failed to load admin data:", error);
    }
  };

  return (
    <AdminContext.Provider value={state}>
      <AdminDispatchContext.Provider value={dispatch}>
        {children}
      </AdminDispatchContext.Provider>
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
export const useAdminDispatch = () => useContext(AdminDispatchContext);
