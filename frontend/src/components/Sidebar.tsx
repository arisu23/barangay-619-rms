import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  Tooltip
} from '@mui/material';
import { 
  LayoutDashboard, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  Cloud,
  FileClock,
  Archive
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  userRole: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, userRole }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'residents', icon: ClipboardList, label: 'Residents' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'audit-trail', icon: FileClock, label: 'Audit Trail', restricted: true },
    { id: 'backup', icon: Cloud, label: 'Backup', restricted: true },
    { id: 'archive', icon: Archive, label: 'Archive' },
  ];

  // Filter items based on role
  const visibleMenuItems = menuItems.filter(item => {
    if (userRole === 'Staff' && item.restricted) return false;
    return true;
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 80,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 80,
          boxSizing: 'border-box',
          backgroundColor: '#2e0249',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          borderRight: 'none',
          boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
        },
      }}
    >
      {/* Brand / Logo Area */}
      <Box sx={{ mb: 4 }}>
         <img 
            src="https://media.discordapp.net/attachments/1438161259462787073/1439120214435561483/att.g_4t85zYhMdID5Q6sk8PT3DHrEtdAnWmgwuz9b1ET8k.jpg?ex=695deaa4&is=695c9924&hm=b446d732ad70181d19028d66a3dd7edc1bfc9bb3cf5b2da530a7cc11f6775a65&=&format=webp&width=519&height=519" 
            alt="Barangay 619 Logo" 
            className="w-12 h-12 rounded-full border-2 border-white/20 object-cover" 
        />
      </Box>

      {/* Navigation */}
      <List sx={{ width: '100%', px: 1 }}>
        {visibleMenuItems.map((item) => (
          <ListItemButton
            key={item.id}
            onClick={() => onNavigate(item.id)}
            sx={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              borderRadius: 2,
              py: 1.5,
              position: 'relative',
              backgroundColor: activePage === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            {/* Active Indicator Bar */}
            {activePage === item.id && (
                <Box sx={{ 
                    position: 'absolute', 
                    left: 0, 
                    top: '15%', 
                    bottom: '15%', 
                    width: '4px', 
                    backgroundColor: 'white', 
                    borderRadius: '0 4px 4px 0' 
                }} />
            )}

            <ListItemIcon sx={{ minWidth: 0, color: activePage === item.id ? 'white' : '#9ca3af', justifyContent: 'center' }}>
              <item.icon size={24} />
            </ListItemIcon>
            
            {/* Tooltip on Hover */}
            <Tooltip title={item.label} placement="right" arrow>
                <Box sx={{ position: 'absolute', inset: 0 }} />
            </Tooltip>

          </ListItemButton>
        ))}
      </List>

      {/* Bottom Actions - Settings hidden for Staff */}
      {userRole !== 'Staff' && (
        <Box sx={{ mt: 'auto' }}>
          <ListItemButton
              onClick={() => onNavigate('settings')}
              sx={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                p: 1.5,
                backgroundColor: activePage === 'settings' ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                },
              }}
          >
               <Settings size={24} className={activePage === 'settings' ? 'text-white' : 'text-gray-400'} />
               <Tooltip title="Settings" placement="right" arrow>
                  <Box sx={{ position: 'absolute', inset: 0 }} />
              </Tooltip>
          </ListItemButton>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;