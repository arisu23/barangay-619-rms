import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useBarangayLogo } from "../hooks/useBarangayLogo";
import { notify } from "../utils/notify";

const LoginPage: React.FC = () => {
  const { logoSrc } = useBarangayLogo();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username, password);
      notify.success("Login successful! Welcome back.");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Left Panel: Branding */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "#2e0249", // Dark purple matching the sidebar/theme
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          p: 6,
          textAlign: "center",
        }}
      >
        <img
          src={logoSrc}
          alt="Barangay Logo"
          style={{
            width: 220,
            height: 220,
            marginBottom: 32,
            borderRadius: "50%",
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 600, maxWidth: 350, mb: 1 }}>
          Local-Based
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, maxWidth: 350 }}>
          Resident Record Management System
        </Typography>
      </Box>

      {/* Right Panel: Login Form */}
      <Box
        sx={{
          flex: 1.2,
          bgcolor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              textAlign: "center",
              color: "#2e0249",
              mb: 8,
            }}
          >
            Welcome
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 700, color: "#374151" }}
              >
                Username
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#f8fafc",
                    borderRadius: 2,
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} className="text-gray-400" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 700, color: "#374151" }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#f8fafc",
                    borderRadius: 2,
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                borderRadius: 2,
                bgcolor: "#3b82f6", // Bright blue as per screenshot
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  bgcolor: "#2563eb",
                },
                boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.5)",
              }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
