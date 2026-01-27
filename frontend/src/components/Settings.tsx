import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  Avatar,
  Grid,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Input,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  InputAdornment,
  Switch
} from '@mui/material';
import { 
  Edit2, 
  Save, 
  X, 
  Camera, 
  Building2, 
  Info,
  Plus,
  Eye,
  Trash2,
  Upload,
  Calendar,
  UserCog,
  ShieldCheck,
  UserPlus,
  CircleDot,
  History,
  Search,
  UserCheck,
  UserMinus,
  Filter,
  Monitor
} from 'lucide-react';

interface BarangayInfo {
  name: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  telephone: string;
  email: string;
}

interface SystemInfo {
  name: string;
  description: string;
  version: string;
}

interface Official {
  id: string;
  name: string;
  position: string;
  imageUrl?: string;
  termStart?: string;
  termEnd?: string;
}

interface UserAccount {
  id: string;
  name: string;
  username: string;
  role: 'Admin' | 'Staff';
  status: 'Active' | 'Inactive';
  lastLogin?: string;
}

// Mock Residents for Selection
const mockResidents = [
  { id: 1, name: 'Abad, Carlos' },
  { id: 2, name: 'Bautista, Lica' },
  { id: 3, name: 'Castalias, Aries' },
  { id: 4, name: 'Cordero, Miguel' },
  { id: 5, name: 'Dela Cruz, Jasmine' },
  { id: 6, name: 'Enriquez, Ramon' },
  { id: 7, name: 'Flores, Katrina' },
  { id: 8, name: 'Gutierrez, Paolo' },
  { id: 9, name: 'Hernandez, Maria' },
  { id: 10, name: 'Ignacio, Leo' },
];

const initialOfficials: Official[] = [
  { id: '1', name: 'Hon. Michael King Cajucom', position: 'Chairman', imageUrl: 'https://picsum.photos/100/100?random=1', termStart: '2023-10-30', termEnd: '2026-10-30' },
  { id: '2', name: 'Hon. Reynaldo T. Maca', position: 'Secretary', imageUrl: 'https://picsum.photos/100/100?random=2', termStart: '2023-11-01', termEnd: '2026-10-30' },
  { id: '3', name: 'Hon. Jean L. Limpahan', position: 'Treasurer', imageUrl: 'https://picsum.photos/100/100?random=3', termStart: '2023-11-01', termEnd: '2026-10-30' },
  { id: '4', name: 'Hon. Laila D. Galvez', position: 'Kagawad', imageUrl: 'https://picsum.photos/100/100?random=4', termStart: '2023-10-30', termEnd: '2026-10-30' },
  { id: '5', name: 'Hon. Bladdy Mair F. Cambaliza', position: 'Kagawad', imageUrl: 'https://picsum.photos/100/100?random=5', termStart: '2023-10-30', termEnd: '2026-10-30' },
];

const initialUsers: UserAccount[] = [
  { id: '1', name: 'Michael King Cajucom', username: 'admin', role: 'Admin', status: 'Active', lastLogin: '2025-11-23 08:00 AM' },
  { id: '2', name: 'Reynaldo T. Maca', username: 'reynaldo_m', role: 'Staff', status: 'Active', lastLogin: '2025-11-22 09:15 AM' },
  { id: '3', name: 'Jean L. Limpahan', username: 'jean_l', role: 'Staff', status: 'Inactive', lastLogin: '2025-11-10 05:00 PM' },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // -- State for Barangay Info --
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [barangayInfo, setBarangayInfo] = useState<BarangayInfo>({
    name: 'Barangay 619',
    city: 'Manila',
    district: 'Sampaloc',
    address: 'Bata Street, Barangay 619, Zone 62, Bacood, Santa Mesa, Manila City, 1000, Metro Manila, Philippines',
    phone: '09xxxxxxxxx',
    telephone: '123-456',
    email: 'barangay619@gmail.com'
  });

  // -- State for System Info --
  const [isEditingSystem, setIsEditingSystem] = useState(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    name: 'Local-Based Resident Record Management System',
    description: 'The Local-Based Resident Record Management System is a digital platform designed to store and manage essential information about residents within Barangay 619. It allows authorized personnel to efficiently access and update resident records, ensuring accurate and organized data for internal administrative use. The system improves efficiency by centralizing information in a secure platform, making resident data management easier and more reliable.',
    version: '1.0'
  });

  // -- State for Barangay Officials --
  const [officials, setOfficials] = useState<Official[]>(initialOfficials);
  const [isAddOfficialOpen, setIsAddOfficialOpen] = useState(false);
  const [isViewOfficialOpen, setIsViewOfficialOpen] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);
  const [isEditingOfficial, setIsEditingOfficial] = useState(false);
  
  // -- State for User Accounts --
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('All'); // 'All' | 'Active' | 'Inactive'
  const [userFormData, setUserFormData] = useState<Partial<UserAccount>>({
    role: 'Staff',
    status: 'Active'
  });

  // Add Official Form State
  const [newOfficialResident, setNewOfficialResident] = useState<{id: number, name: string} | null>(null);
  const [newOfficialPosition, setNewOfficialPosition] = useState('');
  const [newOfficialImage, setNewOfficialImage] = useState<string | null>(null);
  const [newOfficialTermStart, setNewOfficialTermStart] = useState('');
  const [newOfficialTermEnd, setNewOfficialTermEnd] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Official Form State (Temporary holder for edits)
  const [editOfficialData, setEditOfficialData] = useState<Official | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // -- Handlers for Barangay Info --
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarangayInfo({ ...barangayInfo, [e.target.name]: e.target.value });
  };

  const saveInfo = () => setIsEditingInfo(false);
  const cancelInfo = () => setIsEditingInfo(false); 

  // -- Handlers for System Info --
  const handleSystemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSystemInfo({ ...systemInfo, [e.target.name]: e.target.value });
  };
  
  const saveSystem = () => setIsEditingSystem(false);
  const cancelSystem = () => setIsEditingSystem(false);

  // -- Handlers for Officials --
  
  const handleAddClick = () => {
    setNewOfficialResident(null);
    setNewOfficialPosition('');
    setNewOfficialImage(null);
    setNewOfficialTermStart('');
    setNewOfficialTermEnd('');
    setIsAddOfficialOpen(true);
  };

  const handleSaveNewOfficial = () => {
    if (newOfficialResident && newOfficialPosition) {
        const newOfficial: Official = {
            id: Date.now().toString(),
            name: `Hon. ${newOfficialResident.name}`, // Automatically adding Hon. prefix
            position: newOfficialPosition,
            imageUrl: newOfficialImage || 'https://via.placeholder.com/100',
            termStart: newOfficialTermStart,
            termEnd: newOfficialTermEnd
        };
        setOfficials([...officials, newOfficial]);
        setIsAddOfficialOpen(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit && editOfficialData) {
            setEditOfficialData({ ...editOfficialData, imageUrl: reader.result as string });
        } else {
            setNewOfficialImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewOfficial = (official: Official) => {
    setSelectedOfficial(official);
    setEditOfficialData(official);
    setIsEditingOfficial(false);
    setIsViewOfficialOpen(true);
  };

  const handleUpdateOfficial = () => {
    if (editOfficialData) {
        setOfficials(officials.map(off => off.id === editOfficialData.id ? editOfficialData : off));
        setSelectedOfficial(editOfficialData);
        setIsEditingOfficial(false);
    }
  };

  const handleDeleteOfficial = (id: string) => {
      setOfficials(officials.filter(o => o.id !== id));
      setIsViewOfficialOpen(false);
  };

  // -- Handlers for User Accounts --

  const handleOpenUserModal = (user?: UserAccount) => {
    if (user) {
      setSelectedUser(user);
      setUserFormData({ ...user });
    } else {
      setSelectedUser(null);
      setUserFormData({ role: 'Staff', status: 'Active' });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (userFormData.name && userFormData.username) {
      if (selectedUser) {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userFormData as UserAccount } : u));
      } else {
        const newUser: UserAccount = {
          ...userFormData as UserAccount,
          id: Date.now().toString(),
        };
        setUsers([...users, newUser]);
      }
      setIsUserModalOpen(false);
    }
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(u => 
        u.id === id 
            ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } 
            : u
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                         user.username.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesStatus = userStatusFilter === 'All' || user.status === userStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 4, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* Page Title & Subtitle */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2e0249', mb: 1 }}>
          System Settings
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Manage your barangay information, official roster, and system user accounts.
        </Typography>
      </Box>

      {/* Main Container */}
      <Paper 
        elevation={0} 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          borderRadius: 3, 
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          bgcolor: '#f8fafc' 
        }}
      >
        {/* Tabs Header */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', px: 3, pt: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': { 
                textTransform: 'none', 
                fontWeight: 'bold', 
                fontSize: '1rem',
                minHeight: 48
              }
            }}
          >
            <Tab label="General" />
            <Tab label="Barangay Officials" />
            <Tab label="User Accounts" />
          </Tabs>
        </Box>

        {/* Tab Content: General */}
        {activeTab === 0 && (
          <Box sx={{ p: 4, overflowY: 'auto', flex: 1 }}>
            <Grid container spacing={3}>
              {/* Left Column: Logo & Barangay Information */}
              <Grid size={{ xs: 12, lg: 8 }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white', height: '100%' }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4 }}>
                    {/* Logo Section */}
                    <Box sx={{ flexShrink: 0 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: '#1f2937' }}>Barangay Logo</Typography>
                      <Box sx={{ position: 'relative', width: 'fit-content', mx: { xs: 'auto', sm: '0' } }}>
                        <Avatar
                          src="https://media.discordapp.net/attachments/1438161259462787073/1439120214435561483/att.g_4t85zYhMdID5Q6sk8PT3DHrEtdAnWmgwuz9b1ET8k.jpg?ex=69326924&is=693117a4&hm=336d9adb9e14a6bec2875d0f0c81cc344377769c2a78645b696f159ecb1feb81&=&format=webp&width=519&height=519"
                          sx={{ 
                            width: 160, 
                            height: 160, 
                            border: '4px solid #f8fafc', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                          }}
                        />
                        <IconButton 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 8, 
                            right: 8, 
                            bgcolor: 'white', 
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            '&:hover': { bgcolor: '#f3f4f6' } 
                          }}
                        >
                          <Camera size={16} className="text-gray-600" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Barangay Information Section */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Building2 size={20} className="text-indigo-600" />
                            <Typography variant="h6" fontWeight="bold" color="#1f2937">Barangay Details</Typography>
                         </Box>
                         {!isEditingInfo ? (
                            <IconButton size="small" onClick={() => setIsEditingInfo(true)} sx={{ bgcolor: '#f1f5f9' }}>
                              <Edit2 size={16} />
                            </IconButton>
                         ) : (
                           <Box>
                             <Button size="small" onClick={cancelInfo} sx={{ mr: 1, color: '#6b7280', textTransform: 'none' }}>Cancel</Button>
                             <Button size="small" variant="contained" onClick={saveInfo} startIcon={<Save size={16} />} sx={{ textTransform: 'none' }}>Save</Button>
                           </Box>
                         )}
                      </Box>

                      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {isEditingInfo ? (
                              <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 12 }}>
                                      <TextField fullWidth label="Barangay Name" name="name" value={barangayInfo.name} onChange={handleInfoChange} size="small" />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                      <TextField fullWidth label="District" name="district" value={barangayInfo.district} onChange={handleInfoChange} size="small" />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                      <TextField fullWidth label="City / Municipality" name="city" value={barangayInfo.city} onChange={handleInfoChange} size="small" />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                      <TextField fullWidth multiline rows={2} label="Address" name="address" value={barangayInfo.address} onChange={handleInfoChange} size="small" />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                      <TextField fullWidth label="Phone Number" name="phone" value={barangayInfo.phone} onChange={handleInfoChange} size="small" />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                      <TextField fullWidth label="Telephone Number" name="telephone" value={barangayInfo.telephone} onChange={handleInfoChange} size="small" />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                      <TextField fullWidth label="Email Address" name="email" value={barangayInfo.email} onChange={handleInfoChange} size="small" />
                                    </Grid>
                              </Grid>
                          ) : (
                              <Stack spacing={2.5}>
                                  <Box display="flex" flexDirection="column">
                                      <Typography variant="caption" fontWeight="bold" sx={{ color: '#94a3b8', textTransform: 'uppercase', mb: 0.5 }}>Barangay Name</Typography>
                                      <Typography color="#1e293b" fontWeight="600">{barangayInfo.name}</Typography>
                                  </Box>
                                  <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" fontWeight="bold" sx={{ color: '#94a3b8', textTransform: 'uppercase', mb: 0.5 }}>City / Municipality</Typography>
                                        <Typography color="#1e293b" fontWeight="600">{barangayInfo.city}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" fontWeight="bold" sx={{ color: '#94a3b8', textTransform: 'uppercase', mb: 0.5 }}>District</Typography>
                                        <Typography color="#1e293b" fontWeight="600">{barangayInfo.district}</Typography>
                                    </Grid>
                                  </Grid>
                                  <Box display="flex" flexDirection="column">
                                      <Typography variant="caption" fontWeight="bold" sx={{ color: '#94a3b8', textTransform: 'uppercase', mb: 0.5 }}>Official Address</Typography>
                                      <Typography color="#1e293b" fontWeight="600">{barangayInfo.address}</Typography>
                                  </Box>
                                  <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" fontWeight="bold" sx={{ color: '#94a3b8', textTransform: 'uppercase', mb: 0.5 }}>Mobile Number</Typography>
                                        <Typography color="#1e293b" fontWeight="600">{barangayInfo.phone}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" fontWeight="bold" sx={{ color: '#94a3b8', textTransform: 'uppercase', mb: 0.5 }}>Telephone</Typography>
                                        <Typography color="#1e293b" fontWeight="600">{barangayInfo.telephone}</Typography>
                                    </Grid>
                                  </Grid>
                                  <Box display="flex" flexDirection="column">
                                      <Typography variant="caption" fontWeight="bold" sx={{ color: '#94a3b8', textTransform: 'uppercase', mb: 0.5 }}>Email Address</Typography>
                                      <Typography color="#1e293b" fontWeight="600">{barangayInfo.email}</Typography>
                                  </Box>
                              </Stack>
                          )}
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Right Column: System Information Sidebar */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Monitor size={20} className="text-indigo-600" />
                        <Typography variant="h6" fontWeight="bold" color="#1f2937">System Info</Typography>
                     </Box>
                     
                     {!isEditingSystem ? (
                          <IconButton size="small" onClick={() => setIsEditingSystem(true)} sx={{ bgcolor: '#f1f5f9' }}>
                            <Edit2 size={16} />
                          </IconButton>
                     ) : (
                       <Box>
                         <Button size="small" onClick={cancelSystem} sx={{ mr: 1, color: '#6b7280', textTransform: 'none' }}>Cancel</Button>
                         <Button size="small" variant="contained" onClick={saveSystem} startIcon={<Save size={16} />} sx={{ textTransform: 'none' }}>Save</Button>
                       </Box>
                     )}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    {isEditingSystem ? (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth label="System Name" name="name" value={systemInfo.name} onChange={handleSystemChange} size="small" />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth multiline rows={8} label="System Description" name="description" value={systemInfo.description} onChange={handleSystemChange} size="small" />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth label="Version" name="version" value={systemInfo.version} onChange={handleSystemChange} size="small" />
                            </Grid>
                        </Grid>
                    ) : (
                        <Stack spacing={3.5}>
                            <Box>
                                <Typography variant="caption" fontWeight="bold" sx={{ color: '#94a3b8', textTransform: 'uppercase', mb: 1, display: 'block' }}>System Name</Typography>
                                <Typography variant="body1" color="#1e293b" fontWeight="700" sx={{ lineHeight: 1.3 }}>{systemInfo.name}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" fontWeight="bold" sx={{ color: '#94a3b8', textTransform: 'uppercase', mb: 1, display: 'block' }}>About This System</Typography>
                                <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.6, textAlign: 'justify' }}>{systemInfo.description}</Typography>
                            </Box>
                            <Box sx={{ mt: 'auto' }}>
                                <Chip 
                                    label={`Version ${systemInfo.version}`} 
                                    size="small" 
                                    sx={{ fontWeight: 'bold', bgcolor: '#f1f5f9', color: '#475569', borderRadius: 1.5 }} 
                                />
                            </Box>
                        </Stack>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab Content: Officials */}
        {activeTab === 1 && (
          <Box sx={{ p: 5, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold" color="#1f2937">Current Officials</Typography>
                    <Typography variant="body2" color="text.secondary">Manage the list of current barangay officials.</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<Plus size={20} />}
                    onClick={handleAddClick}
                    sx={{ 
                        textTransform: 'none', 
                        fontWeight: 'bold', 
                        bgcolor: '#2e0249',
                        '&:hover': { bgcolor: '#4a0475' }
                    }}
                >
                    Add Official
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '80px' }}>Photo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Term</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', width: '100px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {officials.map((official) => (
                            <TableRow key={official.id} hover>
                                <TableCell>
                                    <Avatar src={official.imageUrl} sx={{ width: 40, height: 40 }} />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{official.name}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {official.position}
                                    </span>
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                    {official.termStart || 'N/A'} - {official.termEnd || 'N/A'}
                                </TableCell>
                                <TableCell align="center">
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        startIcon={<Eye size={16} />}
                                        onClick={() => handleViewOfficial(official)}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
          </Box>
        )}

        {/* Tab Content: User Accounts */}
        {activeTab === 2 && (
          <Box sx={{ p: 5, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h6" fontWeight="bold" color="#1f2937">System User Accounts</Typography>
                    <Typography variant="body2" color="text.secondary">Register and manage accounts for system administrators and staff.</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<UserPlus size={20} />}
                    onClick={() => handleOpenUserModal()}
                    sx={{ 
                        textTransform: 'none', 
                        fontWeight: 'bold', 
                        bgcolor: '#3b82f6',
                        '&:hover': { bgcolor: '#2563eb' }
                    }}
                >
                    Register New User
                </Button>
            </Box>

            {/* Search & Filter Bar for User Accounts */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search account by name or username..."
                size="small"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                sx={{ 
                    flex: 1,
                    maxWidth: 400,
                    '& .MuiOutlinedInput-root': { 
                        borderRadius: 2.5, 
                        bgcolor: 'white'
                    } 
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: userSearchQuery && (
                    <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setUserSearchQuery('')}>
                            <X size={16} />
                        </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                   <Filter size={16} /> Filter:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    sx={{ 
                      borderRadius: 2.5, 
                      bgcolor: 'white',
                      '& .MuiSelect-select': { py: 1 }
                    }}
                  >
                    <MenuItem value="All">All Status</MenuItem>
                    <MenuItem value="Active">Active Accounts</MenuItem>
                    <MenuItem value="Inactive">Inactive Accounts</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: 1 }} />
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                  Showing {filteredUsers.length} account{filteredUsers.length !== 1 ? 's' : ''}
              </Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>User Profile</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Last Login</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', width: '120px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: user.role === 'Admin' ? '#2e0249' : '#3b82f6', fontSize: 14 }}>
                                            {user.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight="600">{user.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>@{user.username}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        icon={<ShieldCheck size={14} />} 
                                        label={user.role} 
                                        size="small" 
                                        sx={{ 
                                            fontWeight: 'bold', 
                                            bgcolor: user.role === 'Admin' ? '#f5f3ff' : '#eff6ff', 
                                            color: user.role === 'Admin' ? '#6d28d9' : '#1d4ed8' 
                                        }} 
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.status} 
                                        size="small" 
                                        sx={{ 
                                            fontWeight: 'bold', 
                                            bgcolor: user.status === 'Active' ? '#dcfce7' : '#f1f5f9', 
                                            color: user.status === 'Active' ? '#166534' : '#64748b' 
                                        }} 
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94a3b8' }}>
                                        <History size={14} />
                                        <Typography variant="caption">{user.lastLogin || 'Never'}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Tooltip title="Edit Account">
                                            <IconButton size="small" onClick={() => handleOpenUserModal(user)}>
                                                <Edit2 size={16} className="text-blue-500" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={user.status === 'Active' ? "Deactivate Account" : "Activate Account"}>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleToggleUserStatus(user.id)}
                                                sx={{ 
                                                    color: user.status === 'Active' ? '#ef4444' : '#10b981',
                                                    '&:hover': { bgcolor: user.status === 'Active' ? '#fee2e2' : '#dcfce7' }
                                                }}
                                            >
                                                {user.status === 'Active' ? <UserMinus size={16} /> : <UserCheck size={16} />}
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body1" color="text.secondary">No matching accounts found for the current filters.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>

      {/* --- Dialogs --- */}

      {/* User Account Modal */}
      <Dialog 
        open={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {selectedUser ? 'Edit User Account' : 'Register New User'}
            <IconButton onClick={() => setIsUserModalOpen(false)} size="small"><X size={20} /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
                
                {/* 1. Name Selection / Entry */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Full Name</Typography>
                    <Autocomplete
                        options={mockResidents}
                        getOptionLabel={(option) => option.name}
                        value={mockResidents.find(r => r.name === userFormData.name) || null}
                        onChange={(event, newValue) => setUserFormData({...userFormData, name: newValue?.name || ''})}
                        renderInput={(params) => <TextField {...params} placeholder="Link to resident profile..." size="small" fullWidth />}
                    />
                </Box>

                {/* 2. Credentials */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Username</Typography>
                    <TextField 
                        fullWidth 
                        size="small" 
                        placeholder="Choose a unique username" 
                        value={userFormData.username || ''}
                        onChange={(e) => setUserFormData({...userFormData, username: e.target.value})}
                    />
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Password</Typography>
                    <TextField 
                        fullWidth 
                        size="small" 
                        type="password"
                        placeholder={selectedUser ? "Leave blank to keep current" : "Set initial password"} 
                    />
                </Box>
                
                {/* 3. Role & Status */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Account Role</InputLabel>
                            <Select 
                                label="Account Role" 
                                value={userFormData.role || 'Staff'}
                                onChange={(e) => setUserFormData({...userFormData, role: e.target.value as any})}
                            >
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Staff">Staff</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select 
                                label="Status" 
                                value={userFormData.status || 'Active'}
                                onChange={(e) => setUserFormData({...userFormData, status: e.target.value as any})}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsUserModalOpen(false)} sx={{ color: '#6b7280' }}>Cancel</Button>
            <Button 
                variant="contained" 
                onClick={handleSaveUser}
                disabled={!userFormData.name || !userFormData.username}
                sx={{ borderRadius: 2 }}
            >
                {selectedUser ? 'Update Account' : 'Create Account'}
            </Button>
        </DialogActions>
      </Dialog>

      {/* Official Dialogs (Add & View) */}
      <Dialog 
        open={isAddOfficialOpen} 
        onClose={() => setIsAddOfficialOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Add New Official
            <IconButton onClick={() => setIsAddOfficialOpen(false)} size="small"><X size={20} /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Select Resident</Typography>
                    <Autocomplete
                        options={mockResidents}
                        getOptionLabel={(option) => option.name}
                        value={newOfficialResident}
                        onChange={(event, newValue) => setNewOfficialResident(newValue)}
                        renderInput={(params) => <TextField {...params} placeholder="Search resident name..." size="small" fullWidth />}
                    />
                </Box>
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Position</Typography>
                    <TextField 
                        fullWidth 
                        size="small" 
                        placeholder="e.g. Captain, Kagawad, Secretary" 
                        value={newOfficialPosition}
                        onChange={(e) => setNewOfficialPosition(e.target.value)}
                    />
                </Box>
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Term Duration</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField 
                                fullWidth 
                                type="date" 
                                size="small" 
                                label="Term Start" 
                                InputLabelProps={{ shrink: true }}
                                value={newOfficialTermStart}
                                onChange={(e) => setNewOfficialTermStart(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField 
                                fullWidth 
                                type="date" 
                                size="small" 
                                label="Term End" 
                                InputLabelProps={{ shrink: true }}
                                value={newOfficialTermEnd}
                                onChange={(e) => setNewOfficialTermEnd(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Official Photo</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                            src={newOfficialImage || undefined} 
                            sx={{ width: 64, height: 64, bgcolor: '#f3f4f6' }}
                        />
                        <Button 
                            variant="outlined" 
                            component="label" 
                            startIcon={<Upload size={16} />}
                            size="small"
                        >
                            Upload Photo
                            <input 
                                type="file" 
                                hidden 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e)} 
                            />
                        </Button>
                    </Box>
                </Box>
            </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsAddOfficialOpen(false)} sx={{ color: '#6b7280' }}>Cancel</Button>
            <Button 
                variant="contained" 
                onClick={handleSaveNewOfficial}
                disabled={!newOfficialResident || !newOfficialPosition}
                sx={{ borderRadius: 2 }}
            >
                Add Official
            </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={isViewOfficialOpen} 
        onClose={() => setIsViewOfficialOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                 <Avatar src={editOfficialData?.imageUrl} sx={{ width: 32, height: 32 }} />
                 <Typography fontWeight="bold">Official Details</Typography>
            </Box>
            <IconButton onClick={() => setIsViewOfficialOpen(false)} size="small"><X size={20} /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
            {selectedOfficial && editOfficialData && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 1 }}>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar 
                                src={editOfficialData.imageUrl} 
                                sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '3px solid white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                            />
                            {isEditingOfficial && (
                                <IconButton 
                                    component="label"
                                    sx={{ 
                                        position: 'absolute', bottom: 16, right: -4, 
                                        bgcolor: 'white', border: '1px solid #e5e7eb', 
                                        width: 32, height: 32,
                                        '&:hover': { bgcolor: '#f9fafb' }
                                    }}
                                >
                                    <Camera size={16} />
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                                </IconButton>
                            )}
                        </Box>
                        <Typography variant="h6" fontWeight="bold">{selectedOfficial.name}</Typography>
                        {!isEditingOfficial ? (
                            <Chip label={selectedOfficial.position} color="primary" size="small" sx={{ mt: 1 }} />
                        ) : (
                             <TextField 
                                size="small" 
                                value={editOfficialData.position}
                                onChange={(e) => setEditOfficialData({...editOfficialData, position: e.target.value})}
                                sx={{ mt: 1, width: '200px' }}
                                placeholder="Position"
                             />
                        )}
                    </Box>
                    <Divider />
                    <Box>
                         <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Calendar size={18} className="text-gray-500" /> Term Duration
                         </Typography>
                         {isEditingOfficial ? (
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <TextField 
                                        fullWidth 
                                        size="small" 
                                        label="Start Date" 
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={editOfficialData.termStart || ''}
                                        onChange={(e) => setEditOfficialData({...editOfficialData, termStart: e.target.value})}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <TextField 
                                        fullWidth 
                                        size="small" 
                                        label="End Date" 
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={editOfficialData.termEnd || ''}
                                        onChange={(e) => setEditOfficialData({...editOfficialData, termEnd: e.target.value})}
                                    />
                                </Grid>
                            </Grid>
                         ) : (
                             <Box sx={{ display: 'flex', gap: 4 }}>
                                 <Box>
                                    <Typography variant="caption" color="text.secondary">Start Date</Typography>
                                    <Typography variant="body2" fontWeight="500">{selectedOfficial.termStart || 'Not set'}</Typography>
                                 </Box>
                                 <Box>
                                    <Typography variant="caption" color="text.secondary">End Date</Typography>
                                    <Typography variant="body2" fontWeight="500">{selectedOfficial.termEnd || 'Not set'}</Typography>
                                 </Box>
                             </Box>
                         )}
                    </Box>
                </Box>
            )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between', borderTop: '1px solid #f3f4f6' }}>
            <Button 
                startIcon={<Trash2 size={16} />} 
                color="error" 
                onClick={() => selectedOfficial && handleDeleteOfficial(selectedOfficial.id)}
            >
                Remove
            </Button>
            <Box>
                {isEditingOfficial ? (
                    <>
                         <Button onClick={() => setIsEditingOfficial(false)} sx={{ color: '#6b7280', mr: 1 }}>Cancel</Button>
                         <Button variant="contained" onClick={handleUpdateOfficial}>Save Changes</Button>
                    </>
                ) : (
                    <Button variant="contained" onClick={() => setIsEditingOfficial(true)} startIcon={<Edit2 size={16} />}>
                        Edit Info
                    </Button>
                )}
            </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;