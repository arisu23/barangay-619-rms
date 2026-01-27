import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Tooltip,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Stack,
  Badge,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { 
  Search, 
  Plus, 
  Eye, 
  Archive as ArchiveIcon,
  Skull,
  PlaneTakeoff,
  Filter,
  Users,
  Home,
  ChevronDown,
  User,
  MapPin,
  UsersRound,
  X,
  Check,
  UserPlus,
  Crown,
  UserCheck,
  Info,
  AlertTriangle
} from 'lucide-react';
import AddResidentModal from './AddResidentModal';
import ResidentProfileModal from './ResidentProfileModal';

// --- Mock Data ---
const initialResidents = [
  { id: 1, lastName: 'Abad', firstName: 'Carlos', age: 23, gender: 'Male', status: 'Active', categories: ['OFW'] },
  { id: 2, lastName: 'Bautista', firstName: 'Lica', age: 37, gender: 'Female', status: 'Active', categories: ['Solo Parent', '4Ps'] },
  { id: 3, lastName: 'Castalias', firstName: 'Aries', age: 45, gender: 'Male', status: 'Active', categories: ['PWD'] },
  { id: 4, lastName: 'Cordero', firstName: 'Miguel', age: 23, gender: 'Male', status: 'Active', categories: ['IP'] },
  { id: 5, lastName: 'Dela Cruz', firstName: 'Jasmine', age: 22, gender: 'Female', status: 'Active', categories: ['Pregnant Woman'] },
  { id: 6, lastName: 'Enriquez', firstName: 'Ramon', age: 20, gender: 'Male', status: 'Active', categories: ['OSY'] },
  { id: 7, lastName: 'Flores', firstName: 'Katrina', age: 19, gender: 'Female', status: 'Active', categories: ['OSC'] },
  { id: 8, lastName: 'Gutierrez', firstName: 'Paolo', age: 51, gender: 'Male', status: 'Active', categories: [] },
  { id: 9, lastName: 'Hernandez', firstName: 'Maria', age: 23, gender: 'Female', status: 'Active', categories: ['Solo Parent'] },
  { id: 10, lastName: 'Ignacio', firstName: 'Leo', age: 33, gender: 'Male', status: 'Active', categories: ['PWD'] },
];

const initialHouseholds = [
  { id: 'HH-001', number: 'Household 1', street: 'Mahogany St.', head: 'Carlos Abad', members: 4, families: 1 },
  { id: 'HH-002', number: 'Household 2', street: 'Narra St.', head: 'Lica Bautista', members: 3, families: 1 },
  { id: 'HH-003', number: 'Household 3', street: 'Molave St.', head: 'Aries Castalias', members: 5, families: 2 },
  { id: 'HH-004', number: 'Household 4', street: 'Ipil-Ipil St.', head: 'Miguel Cordero', members: 2, families: 1 },
];

const initialFamiliesData: Record<string, any[]> = {
    'HH-001': [
        { id: 'FAM-001', head: 'Carlos Abad', members: [
            { id: 1, name: 'Carlos Abad', role: 'Head of Family', sex: 'Male', age: 23, status: 'Active' },
            { id: 11, name: 'Maria Abad', role: 'Spouse', sex: 'Female', age: 22, status: 'Active' },
            { id: 12, name: 'Jun Abad', role: 'Son', sex: 'Male', age: 2, status: 'Active' },
            { id: 13, name: 'Lina Abad', role: 'Daughter', sex: 'Female', age: 1, status: 'Active' }
        ]}
    ],
    'HH-002': [
        { id: 'FAM-002', head: 'Lica Bautista', members: [
            { id: 2, name: 'Lica Bautista', role: 'Head of Family', sex: 'Female', age: 37, status: 'Active' },
            { id: 14, name: 'Mark Bautista', role: 'Spouse', sex: 'Male', age: 38, status: 'Active' },
            { id: 15, name: 'Chloe Bautista', role: 'Daughter', sex: 'Female', age: 10, status: 'Active' }
        ]}
    ],
    'HH-003': [
        { id: 'FAM-003', head: 'Aries Castalias', members: [
            { id: 3, name: 'Aries Castalias', role: 'Head of Family', sex: 'Male', age: 45, status: 'Active' },
            { id: 16, name: 'Elena Castalias', role: 'Spouse', sex: 'Female', age: 42, status: 'Active' },
            { id: 17, name: 'Anton Castalias', role: 'Son', sex: 'Male', age: 15, status: 'Active' }
        ]},
        { id: 'FAM-004', head: 'Roberto Castalias', members: [
            { id: 18, name: 'Roberto Castalias', role: 'Head of Family', sex: 'Male', age: 40, status: 'Active' },
            { id: 19, name: 'Sonia Castalias', role: 'Spouse', sex: 'Female', age: 38, status: 'Active' }
        ]}
    ],
    'HH-004': [
        { id: 'FAM-005', head: 'Miguel Cordero', members: [
            { id: 4, name: 'Miguel Cordero', role: 'Head of Family', sex: 'Male', age: 23, status: 'Active' },
            { id: 20, name: 'Jasmine Dela Cruz', role: 'Common-law Partner', sex: 'Female', age: 22, status: 'Active' }
        ]}
    ]
};

const filterCategories = ['PWD', 'Solo Parent', 'Pregnant Woman', 'OSY', 'OSC', '4Ps', 'OFW', 'IP'];

interface ResidentRecordsProps {
  userRole: string;
}

const ResidentRecords: React.FC<ResidentRecordsProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [residents, setResidents] = useState(initialResidents);
  const [households, setHouseholds] = useState(initialHouseholds);
  const [familiesData, setFamiliesData] = useState(initialFamiliesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddHouseholdOpen, setIsAddHouseholdOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isHeadWarningOpen, setIsHeadWarningOpen] = useState(false);
  const [isResidentProfileOpen, setIsResidentProfileOpen] = useState(false);
  const [isFamilyDetailOpen, setIsFamilyDetailOpen] = useState(false);
  
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [residentToArchive, setResidentToArchive] = useState<any>(null);
  const [archiveStatus, setArchiveStatus] = useState<'Deceased' | 'Moved Out' | null>(null);
  const [preselectedHeadId, setPreselectedHeadId] = useState<string | undefined>(undefined);

  const [newHouseholdNum, setNewHouseholdNum] = useState('');
  const [newHouseholdStreet, setNewHouseholdStreet] = useState('');

  const [familyAnchorEl, setFamilyAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [activeHousehold, setActiveHousehold] = useState<any>(null);
  const [selectedFamily, setSelectedFamily] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const handleOpenAddModal = (headId?: string) => {
    setPreselectedHeadId(headId);
    setIsAddModalOpen(true);
  };

  const handleSaveResident = (data: any) => {
    const newResident = {
        id: Date.now(),
        lastName: data.lastName,
        firstName: data.firstName,
        age: parseInt(data.age) || 0,
        gender: data.sex,
        status: 'Active',
        categories: data.categories || []
    };
    setResidents([newResident, ...residents]);

    if (data.householdRole === 'member' && data.householdHeadId && activeHousehold) {
        const updatedFamilies = familiesData[activeHousehold.id].map(fam => {
            if (fam.id === data.householdHeadId) {
                const newMember = {
                    id: newResident.id,
                    name: `${data.firstName} ${data.lastName}`,
                    role: data.familyRole,
                    sex: data.sex,
                    age: newResident.age,
                    status: 'Active'
                };
                return { ...fam, members: [...fam.members, newMember] };
            }
            return fam;
        });
        setFamiliesData({ ...familiesData, [activeHousehold.id]: updatedFamilies });
        if (selectedFamily?.id === data.householdHeadId) {
            const updatedFam = updatedFamilies.find(f => f.id === data.householdHeadId);
            setSelectedFamily(updatedFam);
        }
    }
  };

  const handleOpenArchiveDialog = (resident: any) => {
    // Check if the resident is a Head of Family in any household
    let isHeadOfFamily = false;
    let hasOtherMembers = false;

    // Fix: Added type assertion to Object.values(familiesData) to fix 'Property forEach does not exist on type unknown' error.
    (Object.values(familiesData) as any[][]).forEach(householdFamilies => {
        householdFamilies.forEach(fam => {
            const memberRecord = fam.members.find((m: any) => m.id === resident.id);
            if (memberRecord && memberRecord.role.includes('Head')) {
                isHeadOfFamily = true;
                // Check if there are other ACTIVE members who could take over
                const otherActiveMembers = fam.members.filter((m: any) => m.id !== resident.id && m.status === 'Active');
                if (otherActiveMembers.length > 0) {
                    hasOtherMembers = true;
                }
            }
        });
    });

    if (isHeadOfFamily && hasOtherMembers) {
        setResidentToArchive(resident);
        setIsHeadWarningOpen(true);
        return;
    }

    setResidentToArchive(resident);
    setArchiveStatus(null);
    setIsArchiveDialogOpen(true);
  };

  const handleConfirmArchive = () => {
    if (residentToArchive && archiveStatus) {
        // Remove from main active registry
        setResidents(residents.filter(r => r.id !== residentToArchive.id));
        
        // Update familiesData state - keeping the record but updating status
        const updatedFamiliesData = { ...familiesData };
        Object.keys(updatedFamiliesData).forEach(hhId => {
            updatedFamiliesData[hhId] = updatedFamiliesData[hhId].map(fam => {
                const updatedMembers = fam.members.map((m: any) => {
                    if (m.id === residentToArchive.id) {
                        return { ...m, status: archiveStatus, role: 'Archived Member' };
                    }
                    return m;
                });
                return { ...fam, members: updatedMembers };
            });
        });
        setFamiliesData(updatedFamiliesData);
        
        setIsArchiveDialogOpen(false);
        // Refresh family detail if open
        if (selectedFamily) {
            // Fix: Added type assertion to Object.values(updatedFamiliesData) to fix 'Property id does not exist on type unknown' error.
            const refreshedFam = (Object.values(updatedFamiliesData) as any[][]).flat().find((f: any) => f.id === selectedFamily.id);
            setSelectedFamily(refreshedFam);
        }
    }
  };

  const handleAddHousehold = () => {
    if (newHouseholdNum && newHouseholdStreet) {
      const newHH = {
        id: `HH-${Date.now()}`,
        number: newHouseholdNum,
        street: newHouseholdStreet,
        head: 'None assigned',
        members: 0,
        families: 0
      };
      setHouseholds([...households, newHH]);
      setNewHouseholdNum('');
      setNewHouseholdStreet('');
      setIsAddHouseholdOpen(false);
    }
  };

  const handleManageFamilyClick = (event: React.MouseEvent<HTMLButtonElement>, household: any) => {
    setFamilyAnchorEl(event.currentTarget);
    setActiveHousehold(household);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = (category?: string) => {
    if (typeof category === 'string') {
        setSelectedCategory(category);
    }
    setFilterAnchorEl(null);
  };

  const handleViewFamilyDetail = (family: any) => {
    // Check if only one member exists and auto-promote to head if needed
    let updatedFamily = { ...family };
    const activeMembers = updatedFamily.members.filter((m: any) => m.status === 'Active');
    
    if (activeMembers.length === 1 && activeMembers[0].role !== 'Head of Family') {
        activeMembers[0].role = 'Head of Family';
        updatedFamily.head = activeMembers[0].name;
    }
    setSelectedFamily(updatedFamily);
    setIsFamilyDetailOpen(true);
    setFamilyAnchorEl(null);
  };

  const handleSetNewHead = (memberId: number) => {
    if (!selectedFamily || !activeHousehold) return;

    const targetMember = selectedFamily.members.find((m: any) => m.id === memberId);
    if (!targetMember || targetMember.status !== 'Active') return;

    const updatedMembers = selectedFamily.members.map((m: any) => {
        if (m.id === memberId) return { ...m, role: 'Head of Family' };
        if (m.role === 'Head of Family') return { ...m, role: 'Member' }; // Revert old head to general member
        return m;
    });

    const newHeadName = updatedMembers.find((m: any) => m.id === memberId)?.name || '';

    const updatedFamily = { ...selectedFamily, members: updatedMembers, head: newHeadName };
    setSelectedFamily(updatedFamily);

    // Update global familiesData state
    const updatedHouseholdFamilies = familiesData[activeHousehold.id].map(fam => 
        fam.id === selectedFamily.id ? updatedFamily : fam
    );
    setFamiliesData({ ...familiesData, [activeHousehold.id]: updatedHouseholdFamilies });
    
    // Also update household summary if the head of the whole household changed (if relevant)
    setHouseholds(households.map(hh => {
        if (hh.id === activeHousehold.id && hh.head === selectedFamily.head) {
            return { ...hh, head: newHeadName };
        }
        return hh;
    }));
  };

  const filteredResidents = residents.filter(r => {
    const matchesSearch = r.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           r.firstName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (r.categories && r.categories.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const filteredHouseholds = households.filter(h => 
    h.number.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.street.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', bgcolor: '#f3f4f6' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2e0249', mb: 0.5 }}>
                Resident Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Manage your local inhabitants and household registries.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            {activeTab === 1 && userRole === 'Admin' && (
                <Button 
                    variant="outlined" 
                    startIcon={<Home size={18} />} 
                    onClick={() => setIsAddHouseholdOpen(true)} 
                    sx={{ 
                        borderRadius: 3, fontWeight: 700, px: 3, py: 1.2, 
                        borderColor: '#2e0249', color: '#2e0249', textTransform: 'none',
                        '&:hover': { borderColor: '#4a0475', bgcolor: '#f5f3ff' }
                    }}
                >
                    Add Household
                </Button>
            )}
            <Button 
                variant="contained" 
                startIcon={<Plus size={18} />} 
                onClick={() => handleOpenAddModal()} 
                sx={{ 
                    borderRadius: 3, fontWeight: 700, px: 4, py: 1.2, 
                    bgcolor: '#2e0249', textTransform: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    '&:hover': { bgcolor: '#4a0475' }
                }}
            >
            Add Resident Record
            </Button>
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 4, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', px: 2 }}>
            <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                sx={{
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.95rem', minHeight: 64, px: 4 },
                    '& .Mui-selected': { color: '#2e0249' },
                    '& .MuiTabs-indicator': { backgroundColor: '#2e0249', height: 3 }
                }}
            >
                <Tab icon={<Users size={20} />} iconPosition="start" label="Resident Registry" />
                <Tab icon={<Home size={20} />} iconPosition="start" label="Household Registry" />
            </Tabs>
        </Box>

        <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'white' }}>
            <TextField
                placeholder={activeTab === 0 ? "Search resident by name..." : "Search household number..."}
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 400, '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: '#f9fafb' } }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search size={18} className="text-gray-400" />
                        </InputAdornment>
                    ),
                }}
            />
            {activeTab === 0 && (
                <Button 
                    variant="outlined" 
                    onClick={handleFilterClick}
                    startIcon={
                        <Badge variant="dot" invisible={selectedCategory === 'All'} color="primary">
                            <Filter size={18} />
                        </Badge>
                    }
                    endIcon={<ChevronDown size={14} />}
                    sx={{ 
                        borderRadius: 2.5, px: 2.5, textTransform: 'none', fontWeight: 600, 
                        borderColor: selectedCategory === 'All' ? '#e5e7eb' : '#2e0249', 
                        color: selectedCategory === 'All' ? '#64748b' : '#2e0249',
                        bgcolor: selectedCategory === 'All' ? 'transparent' : '#f5f3ff'
                    }}
                >
                    {selectedCategory === 'All' ? 'Filter Options' : `Filtering: ${selectedCategory}`}
                </Button>
            )}
            <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={() => setFilterAnchorEl(null)}>
                <MenuItem onClick={() => handleFilterMenuClose('All')}>All Residents</MenuItem>
                <Divider />
                {filterCategories.map((cat) => (
                    <MenuItem key={cat} onClick={() => handleFilterMenuClose(cat)}>{cat}</MenuItem>
                ))}
            </Menu>
        </Box>

        <TableContainer sx={{ flex: 1, overflow: 'auto', bgcolor: 'white' }} className="custom-scrollbar">
            {activeTab === 0 ? (
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800 }}>ID</TableCell>
                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800 }}>FULL NAME</TableCell>
                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800 }}>AGE</TableCell>
                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800 }}>GENDER</TableCell>
                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800 }}>STATUS</TableCell>
                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800 }}>CATEGORIES</TableCell>
                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, textAlign: 'center' }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredResidents.map((resident) => (
                            <TableRow key={resident.id} hover onClick={() => { setSelectedResident(resident); setIsResidentProfileOpen(true); }} sx={{ cursor: 'pointer' }}>
                                <TableCell>{resident.id}</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>{resident.lastName}, {resident.firstName}</TableCell>
                                <TableCell>{resident.age}</TableCell>
                                <TableCell>{resident.gender}</TableCell>
                                <TableCell><Chip label={resident.status} size="small" color={resident.status === 'Active' ? 'success' : 'default'} sx={{ fontWeight: 700 }} /></TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {resident.categories.map(cat => <Chip key={cat} label={cat} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />)}
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                        <IconButton size="small" color="primary"><Eye size={18} /></IconButton>
                                        <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleOpenArchiveDialog(resident); }}><ArchiveIcon size={18} /></IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800 }}>HOUSEHOLD NO.</TableCell>
                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800 }}>STREET</TableCell>
                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800 }}>FAMILIES</TableCell>
                            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, textAlign: 'center' }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredHouseholds.map((hh) => (
                            <TableRow key={hh.id} hover>
                                <TableCell sx={{ fontWeight: 700, color: '#2e0249' }}>{hh.number}</TableCell>
                                <TableCell>{hh.street}</TableCell>
                                <TableCell><Chip label={`${hh.families} Families`} size="small" sx={{ bgcolor: '#f3f4f6', fontWeight: 600 }} /></TableCell>
                                <TableCell align="center">
                                    <Button size="small" variant="outlined" startIcon={<UsersRound size={16} />} onClick={(e) => handleManageFamilyClick(e, hh)} sx={{ textTransform: 'none', borderRadius: 2 }}>Manage Families</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
        <Box sx={{ p: 2, borderTop: '1px solid #e5e7eb', bgcolor: 'white', display: 'flex', justifyContent: 'center' }}><Pagination count={10} color="primary" shape="rounded" /></Box>
      </Paper>

      <AddResidentModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSaveResident} initialHeadId={preselectedHeadId} householdOptions={households.map(h => ({ id: h.id, number: h.number, street: h.street }))} />
      <ResidentProfileModal open={isResidentProfileOpen} onClose={() => setIsResidentProfileOpen(false)} initialData={selectedResident} />

      {/* Household Creation Dialog */}
      <Dialog open={isAddHouseholdOpen} onClose={() => setIsAddHouseholdOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add New Household Registry</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField fullWidth label="Household Number" value={newHouseholdNum} onChange={(e) => setNewHouseholdNum(e.target.value)} />
            <TextField fullWidth label="Street Name" value={newHouseholdStreet} onChange={(e) => setNewHouseholdStreet(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsAddHouseholdOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddHousehold} sx={{ bgcolor: '#2e0249' }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Head of Family Archive Warning */}
      <Dialog open={isHeadWarningOpen} onClose={() => setIsHeadWarningOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1, maxWidth: 450 } }}>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, color: '#991b1b' }}>
            <AlertTriangle size={24} /> Restricted Action
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 700 }}>
              Cannot archive <strong>{residentToArchive?.firstName} {residentToArchive?.lastName}</strong>.
          </Typography>
          <Typography variant="body2" color="text.secondary">
              This resident is currently designated as a <strong>Head of Family</strong>. You cannot archive a family head while there are other members in the family record.
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#fff7ed', borderRadius: 2, border: '1px solid #ffedd5' }}>
              <Typography variant="caption" sx={{ color: '#9a3412', fontWeight: 800 }}>REQUIRED STEP:</Typography>
              <Typography variant="body2" sx={{ color: '#9a3412', mt: 0.5 }}>
                  Go to the <strong>Household Registry</strong>, find the relevant household, and transfer the headship to another active member before archiving this record.
              </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button fullWidth variant="contained" onClick={() => setIsHeadWarningOpen(false)} sx={{ bgcolor: '#0f172a' }}>I Understand</Button>
        </DialogActions>
      </Dialog>

      {/* Archive Reason Dialog */}
      <Dialog open={isArchiveDialogOpen} onClose={() => setIsArchiveDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Archive Resident Record?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>Reason for archiving <strong>{residentToArchive?.lastName}, {residentToArchive?.firstName}</strong>:</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button fullWidth variant={archiveStatus === 'Deceased' ? 'contained' : 'outlined'} color="error" startIcon={<Skull size={18} />} onClick={() => setArchiveStatus('Deceased')}>Deceased</Button>
            <Button fullWidth variant={archiveStatus === 'Moved Out' ? 'contained' : 'outlined'} color="info" startIcon={<PlaneTakeoff size={18} />} onClick={() => setArchiveStatus('Moved Out')}>Moved Out</Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsArchiveDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" disabled={!archiveStatus} onClick={handleConfirmArchive}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Families Context Menu */}
      <Menu anchorEl={familyAnchorEl} open={Boolean(familyAnchorEl)} onClose={() => setFamilyAnchorEl(null)}>
        {activeHousehold && (familiesData[activeHousehold.id] as any[])?.map((family) => (
            <MenuItem key={family.id} onClick={() => handleViewFamilyDetail(family)} sx={{ py: 1.5 }}>{family.head} ({family.members.filter((m:any) => m.status === 'Active').length} active)</MenuItem>
        ))}
      </Menu>

      {/* Family Detail Dialog */}
      <Dialog open={isFamilyDetailOpen} onClose={() => setIsFamilyDetailOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
         <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UsersRound size={24} className="text-indigo-600" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Family Detail: {selectedFamily?.head}</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
                <Button variant="contained" size="small" startIcon={<UserPlus size={16} />} onClick={() => handleOpenAddModal(selectedFamily?.id)} sx={{ bgcolor: '#2e0249', textTransform: 'none', borderRadius: 2 }}>Add Member</Button>
                <IconButton onClick={() => setIsFamilyDetailOpen(false)} size="small"><X size={20} /></IconButton>
            </Stack>
         </DialogTitle>
         <DialogContent sx={{ p: 0 }}>
            <TableContainer sx={{ maxHeight: '60vh' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>NAME</TableCell>
                            <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>ROLE</TableCell>
                            <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>SEX</TableCell>
                            <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>AGE</TableCell>
                            <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>STATUS</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedFamily?.members.map((m: any) => (
                            <TableRow key={m.id} hover sx={{ opacity: m.status !== 'Active' ? 0.6 : 1, bgcolor: m.status === 'Deceased' ? '#fff1f2' : m.status === 'Moved Out' ? '#f0f9ff' : 'transparent' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {m.role === 'Head of Family' && <Crown size={14} className="text-amber-500" />}
                                        {m.name}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={m.role} 
                                        size="small" 
                                        sx={{ 
                                            fontWeight: 700, 
                                            fontSize: '0.7rem',
                                            bgcolor: m.role === 'Head of Family' ? '#fef3c7' : '#f3f4f6',
                                            color: m.role === 'Head of Family' ? '#92400e' : '#64748b'
                                        }} 
                                    />
                                </TableCell>
                                <TableCell>{m.sex}</TableCell>
                                <TableCell>{m.age}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={m.status} 
                                        size="small" 
                                        variant={m.status === 'Active' ? 'filled' : 'outlined'}
                                        color={m.status === 'Active' ? 'success' : m.status === 'Deceased' ? 'error' : 'info'}
                                        sx={{ fontWeight: 800, fontSize: '0.65rem' }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {m.role !== 'Head of Family' && m.status === 'Active' && selectedFamily.members.filter((mem:any) => mem.status === 'Active').length > 1 ? (
                                        <Tooltip title="Set as Head of Family">
                                            <IconButton 
                                                size="small" 
                                                color="primary" 
                                                onClick={() => handleSetNewHead(m.id)}
                                                sx={{ '&:hover': { bgcolor: '#eff6ff' } }}
                                            >
                                                <UserCheck size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    ) : m.role === 'Head of Family' ? (
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#92400e' }}>Current Head</Typography>
                                    ) : m.status !== 'Active' ? (
                                        <Typography variant="caption" color="text.secondary">Archived</Typography>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">Default Head</Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {selectedFamily?.members.filter((m:any) => m.status === 'Active').length > 1 && (
                <Box sx={{ p: 2, bgcolor: '#fffbeb', borderTop: '1px solid #fef3c7' }}>
                    <Typography variant="caption" sx={{ color: '#92400e', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Info size={14} /> Only active members can be designated as the Head of Family.
                    </Typography>
                </Box>
            )}
         </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ResidentRecords;