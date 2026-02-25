import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import brgyLogo from "../assets/img/brgy_logo.jpg";

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth check to complete, then redirect
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      }, 1500); // Brief branding visibility before redirect

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "white",
      }}
    >
      <Box sx={{ textAlign: "center", maxWidth: 450, px: 4 }}>
        <img
          src={brgyLogo}
          alt="Barangay Logo"
          style={{
            display: "block",
            margin: "0 auto 24px auto",
            width: 180,
            height: 180,
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#1f2937",
            lineHeight: 1.4,
            fontSize: "1.2rem",
            letterSpacing: "0.02em",
            animation: "fadeIn 1s ease-in",
          }}
        >
          Local - Based Resident Record Management System
        </Typography>

        <Typography
          variant="caption"
          sx={{
            mt: 2,
            display: "block",
            color: "#94a3b8",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Barangay 619 • Zone 62
        </Typography>
      </Box>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default LoadingPage;
