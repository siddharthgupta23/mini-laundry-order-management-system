import React, { createContext, useContext, useReducer, useEffect } from "react";
import axiosInstance, { setAuthToken } from "../api/axios";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    setAuthToken(state.token);
  }, [state.token]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to refresh token silently
        const { data } = await axiosInstance.post("/auth/refresh");
        const token = data.data.accessToken;
        
        setAuthToken(token);

        // Get user profile
        const userRes = await axiosInstance.get("/auth/me");
        
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: userRes.data.data, token },
        });
      } catch (error) {
        dispatch({ type: "LOGOUT" });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await axiosInstance.post("/auth/login", { email, password });
    const token = data.data.accessToken;
    const user = {
      _id: data.data._id,
      name: data.data.name,
      email: data.data.email,
      phone: data.data.phone,
      role: data.data.role,
    };

    setAuthToken(token);
    dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
    return user;
  };

  const register = async (userData) => {
    const { data } = await axiosInstance.post("/auth/register", userData);
    const token = data.data.accessToken;
    const user = {
      _id: data.data._id,
      name: data.data.name,
      email: data.data.email,
      phone: data.data.phone,
      role: data.data.role,
    };

    setAuthToken(token);
    dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
    return user;
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      setAuthToken(null);
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
