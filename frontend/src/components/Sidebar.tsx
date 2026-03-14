import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Settings,
  Cloud,
  FileClock,
  Archive,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useBarangayLogo } from "../hooks/useBarangayLogo";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { logoSrc } = useBarangayLogo();

  const menuItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      id: "residents",
      path: "/residents",
      icon: ClipboardList,
      label: "Residents",
    },
    { id: "reports", path: "/reports", icon: BarChart3, label: "Reports" },
    {
      id: "audit-trail",
      path: "/audit-trail",
      icon: FileClock,
      label: "Audit Trail",
      restricted: true,
    },
    {
      id: "backup",
      path: "/backup",
      icon: Cloud,
      label: "Backup",
      restricted: true,
    },
    { id: "archive", path: "/archive", icon: Archive, label: "Archive" },
  ];

  // Filter items based on role
  const visibleMenuItems = menuItems.filter((item) => {
    if (user?.role === "Staff" && item.restricted) return false;
    return true;
  });

  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    setLogoutOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 80,
          boxSizing: "border-box",
          backgroundColor: "#2e0249",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 3,
          borderRight: "none",
          boxShadow: "4px 0 10px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Brand / Logo Area */}
      <Box sx={{ mb: 4 }}>
        <img
          src={logoSrc}
          alt="Barangay 619 Logo"
          className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
        />
      </Box>

      {/* Navigation */}
      <List sx={{ width: "100%", px: 1 }}>
        {visibleMenuItems.map((item) => (
          <ListItemButton
            key={item.id}
            onClick={() => navigate(item.path)}
            sx={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
              borderRadius: 2,
              py: 1.5,
              position: "relative",
              backgroundColor:
                location.pathname === item.path
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.05)",
              },
            }}
          >
            {/* Active Indicator Bar */}
            {location.pathname === item.path && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "15%",
                  bottom: "15%",
                  width: "4px",
                  backgroundColor: "white",
                  borderRadius: "0 4px 4px 0",
                }}
              />
            )}

            <ListItemIcon
              sx={{
                minWidth: 0,
                color: location.pathname === item.path ? "white" : "#9ca3af",
                justifyContent: "center",
              }}
            >
              <item.icon size={24} />
            </ListItemIcon>

            {/* Tooltip on Hover */}
            <Tooltip title={item.label} placement="right" arrow>
              <Box sx={{ position: "absolute", inset: 0 }} />
            </Tooltip>
          </ListItemButton>
        ))}
      </List>

      {/* Bottom Actions */}
      <Box
        sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1 }}
      >
        {/* Settings - Admin only */}
        {user?.role === "Admin" && (
          <ListItemButton
            onClick={() => navigate("/settings")}
            sx={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              p: 1.5,
              position: "relative",
              backgroundColor:
                location.pathname === "/settings"
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.05)",
              },
            }}
          >
            <Settings
              size={24}
              className={
                location.pathname === "/settings"
                  ? "text-white"
                  : "text-gray-400"
              }
            />
            <Tooltip title="Settings" placement="right" arrow>
              <Box sx={{ position: "absolute", inset: 0 }} />
            </Tooltip>
          </ListItemButton>
        )}

        {/* Logout button */}
        <ListItemButton
          onClick={() => setLogoutOpen(true)}
          sx={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            p: 1.5,
            position: "relative",
            "&:hover": {
              backgroundColor: "rgba(255,100,100,0.15)",
            },
          }}
        >
          <LogOut size={24} className="text-gray-400" />
          <Tooltip title="Logout" placement="right" arrow>
            <Box sx={{ position: "absolute", inset: 0 }} />
          </Tooltip>
        </ListItemButton>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setLogoutOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleLogout} variant="contained" color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Sidebar;
