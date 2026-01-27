import React, { useState, useEffect } from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  Avatar,
  Slide,
  Container
} from '@mui/material';
import {
  X,
  User,
  MapPin,
  GraduationCap,
  FileBadge,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Hash
} from 'lucide-react';
import { TransitionProps } from '@mui/material/transitions';

// --- Types ---
interface ResidentProfileModalProps {
  open: boolean;
  onClose: () => void;
  residentId?: string | number; // To fetch data in a real app
  initialData?: any; // For passing the clicked row data
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// --- Dummy Full Data ---
// This mimics a complete record fetched from the backend
const fullDummyData = {
  // Identity
  firstName: 'Carlos',
  middleName: 'Santos',
  lastName: 'Abad',
  suffix: '',
  sex: 'Male',
  dob: '2001-05-15',
  age: '23',
  placeOfBirth: 'Manila',
  mothersMaidenName: 'Maria Santos',
  civilStatus: 'Single',
  citizenship: 'Filipino',
  inhabitantType: 'Non-Migrant',
  religion: 'Roman Catholic',
  contactNumber: '0917-123-4567',
  email: 'carlos.abad@example.com',

  // Address
  unitRoom: 'Unit 4B',
  building: 'Sunshine Apts',
  lotBlock: 'Block 5',
  street: 'Mahogany St.',
  barangay: '619',
  city: 'Manila',
  householdRole: 'head',
  householdNumber: 'Household 1',
  occupancyStatus: 'Renter',
  householdHeadName: '', // If member

  // Socio-Economic
  hasEducation: 'yes',
  educationLevel: 'College',
  educationStatus: 'Graduate',
  isEmployed: 'yes',
  occupation: 'Software Engineer',
  employmentStatus: 'Regular',
  isVoter: 'yes',
  precinctNumber: '0123A',

  // Classification
  categories: ['Solo Parent', 'Youth']
};

const ResidentProfileModal: React.FC<ResidentProfileModalProps> = ({ open, onClose, residentId, initialData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState(fullDummyData);

  // Sync basic info from the row if available, but keep the detailed dummy data for the rest
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        firstName: initialData.firstName || prev.firstName,
        lastName: initialData.lastName || prev.lastName,
        age: initialData.age ? String(initialData.age) : prev.age,
        sex: initialData.gender || prev.sex,
        // In a real app, we would fetch the full details by ID here
      }));
    }
  }, [initialData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Logic to save would go here
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset data to initial state (mock reset)
    setFormData({ ...fullDummyData, ...initialData }); 
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Render Helpers ---

  const renderField = (label: string, field: keyof typeof fullDummyData, type: 'text' | 'select' | 'date' = 'text', options?: string[]) => {
    const value = formData[field];

    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{label}</InputLabel>
            <Select
              value={value}
              label={label}
              onChange={(e) => handleChange(field, e.target.value)}
            >
              {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
        );
      }
      return (
        <TextField
          fullWidth
          size="small"
          label={label}
          type={type === 'date' ? 'date' : 'text'}
          value={value}
          onChange={(e) => handleChange(field, e.target.value)}
          InputLabelProps={type === 'date' ? { shrink: true } : undefined}
        />
      );
    }

    // View Mode
    if (field === 'householdRole') {
        return (
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {label}
            </Typography>
            <Chip 
                label={value === 'head' ? 'HEAD OF FAMILY' : 'MEMBER'} 
                size="small"
                sx={{ 
                    fontWeight: 700,
                    borderRadius: 1,
                    bgcolor: value === 'head' ? '#4f46e5' : '#f3f4f6',
                    color: value === 'head' ? '#ffffff' : '#374151',
                    fontSize: '0.75rem',
                    height: 24
                }}
            />
          </Box>
        );
    }

    let displayValue: React.ReactNode = value;
    
    if (Array.isArray(value)) {
        displayValue = value.join(', ');
    } else if (!value) {
        displayValue = '-';
    } else if (typeof value === 'string') {
         // Capitalize first letter except for email
         if (field !== 'email') {
             displayValue = value.charAt(0).toUpperCase() + value.slice(1);
         }
    }

    return (
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={500} sx={{ color: '#1f2937', minHeight: '24px' }}>
          {displayValue}
        </Typography>
      </Box>
    );
  };

  const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Icon size={20} /> {title}
    </Typography>
  );

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <Box sx={{ bgcolor: '#f3f4f6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#2e0249', zIndex: 1100 }}>
          <Toolbar sx={{ height: 80 }}>
            <IconButton edge="start" color="inherit" onClick={onClose} sx={{ mr: 2 }}>
              <X />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Resident Profile
            </Typography>
            <Box>
                {isEditing ? (
                    <>
                        <Button 
                            color="inherit" 
                            onClick={handleCancelEdit} 
                            startIcon={<RotateCcw size={18} />} 
                            sx={{ mr: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            color="success" 
                            onClick={handleEditToggle} 
                            startIcon={<Save size={18} />}
                            sx={{ borderRadius: 2 }}
                        >
                            Save Changes
                        </Button>
                    </>
                ) : (
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleEditToggle} 
                        startIcon={<Edit2 size={18} />}
                        sx={{ borderRadius: 2, bgcolor: '#3b82f6' }}
                    >
                        Edit Information
                    </Button>
                )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ flex: 1, py: 4, overflowY: 'auto' }}>
            
            {/* Landscape Profile Header Card */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 3, 
                    borderRadius: 3, 
                    border: '1px solid #e5e7eb', 
                    mb: 3, 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 3,
                    bgcolor: 'white'
                }}
            >
                {/* Avatar & Name Group */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: { md: 1 }, width: '100%' }}>
                    <Avatar 
                        sx={{ width: 80, height: 80, bgcolor: '#e0e7ff', color: '#4f46e5', fontSize: 32 }}
                    >
                        {formData.firstName[0]}{formData.lastName[0]}
                    </Avatar>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography variant="h5" fontWeight="bold" color="#1f2937">
                                {formData.firstName} {formData.lastName}
                            </Typography>
                            <Chip 
                                label="Active" 
                                color="success" 
                                size="small" 
                                icon={<CheckCircle size={14} />} 
                                sx={{ fontWeight: 600 }}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Resident Registry Information
                        </Typography>
                    </Box>
                </Box>
                
                {/* Vertical Divider for Desktop */}
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                
                {/* Key Stats Horizontal Row */}
                <Box sx={{ display: 'flex', gap: { xs: 2, md: 6 }, flexWrap: 'wrap', width: { xs: '100%', md: 'auto' } }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Box sx={{ p: 1, bgcolor: '#f3f4f6', borderRadius: '50%' }}><Calendar size={18} className="text-gray-500" /></Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Age</Typography>
                            <Typography variant="body2" fontWeight="600">{formData.age} yrs</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Box sx={{ p: 1, bgcolor: '#f3f4f6', borderRadius: '50%' }}><User size={18} className="text-gray-500" /></Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Sex</Typography>
                            <Typography variant="body2" fontWeight="600">{formData.sex}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Box sx={{ p: 1, bgcolor: '#f3f4f6', borderRadius: '50%' }}><Phone size={18} className="text-gray-500" /></Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Phone</Typography>
                            <Typography variant="body2" fontWeight="600">{formData.contactNumber}</Typography>
                        </Box>
                    </Box>
                     <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Box sx={{ p: 1, bgcolor: '#f3f4f6', borderRadius: '50%' }}><Mail size={18} className="text-gray-500" /></Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Email</Typography>
                            <Typography variant="body2" fontWeight="600">{formData.email}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Detailed Info Tabs */}
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', overflow: 'hidden', minHeight: '60vh' }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ 
                        borderBottom: 1, 
                        borderColor: 'divider',
                        px: 2,
                        bgcolor: '#f9fafb',
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 64, fontSize: '1rem' }
                    }}
                >
                    <Tab label="Personal Info" icon={<User size={18} />} iconPosition="start" />
                    <Tab label="Residence" icon={<MapPin size={18} />} iconPosition="start" />
                    <Tab label="Socio-Economic" icon={<GraduationCap size={18} />} iconPosition="start" />
                    <Tab label="Classification" icon={<FileBadge size={18} />} iconPosition="start" />
                </Tabs>

                <Box sx={{ p: 4 }}>
                    {/* Tab 0: Personal Info */}
                    {tabValue === 0 && (
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12 }}>
                                <SectionTitle icon={User} title="Identity Information" />
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('First Name', 'firstName')}</Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Middle Name', 'middleName')}</Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Last Name', 'lastName')}</Grid>
                                    <Grid size={{ xs: 12, md: 1 }}>{renderField('Suffix', 'suffix', 'select', ['-', 'Jr.', 'Sr.', 'III'])}</Grid>
                                    
                                    <Grid size={{ xs: 12, md: 2 }}>{renderField('Sex', 'sex', 'select', ['Male', 'Female'])}</Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Date of Birth', 'dob', 'date')}</Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Place of Birth', 'placeOfBirth')}</Grid>
                                    
                                    <Grid size={{ xs: 12, md: 4 }}>{renderField("Mother's Maiden Name", 'mothersMaidenName')}</Grid>
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12 }}><Divider /></Grid>
                            <Grid size={{ xs: 12 }}>
                                <SectionTitle icon={Hash} title="Additional Details" />
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Civil Status', 'civilStatus', 'select', ['Single', 'Married', 'Widowed', 'Separated'])}</Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Citizenship', 'citizenship')}</Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Religion', 'religion')}</Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Inhabitant Type', 'inhabitantType', 'select', ['Non-Migrant', 'Migrant', 'Transient'])}</Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                    {/* Tab 1: Residence */}
                    {tabValue === 1 && (
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12 }}>
                                <SectionTitle icon={MapPin} title="Current Address" />
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 2 }}>{renderField('Unit/Room No.', 'unitRoom')}</Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Building Name', 'building')}</Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Lot/Block', 'lotBlock')}</Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>{renderField('Street', 'street')}</Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Barangay', 'barangay')}</Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('City', 'city')}</Grid>
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12 }}><Divider /></Grid>
                            <Grid size={{ xs: 12 }}>
                                <SectionTitle icon={FileBadge} title="Household Setup" />
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Role in Family', 'householdRole', 'select', ['head', 'member'])}</Grid>
                                    
                                    {formData.householdRole === 'head' ? (
                                        <>
                                            <Grid size={{ xs: 12, md: 3 }}>{renderField('Household Number', 'householdNumber')}</Grid>
                                            <Grid size={{ xs: 12, md: 3 }}>{renderField('Occupancy Status', 'occupancyStatus', 'select', ['Owner', 'Renter', 'Sharer'])}</Grid>
                                        </>
                                    ) : (
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 2, border: '1px solid #bfdbfe' }}>
                                                <Typography variant="caption" color="primary" fontWeight="bold">LINKED FAMILY HEAD</Typography>
                                                <Typography variant="body1">Carlos Abad (Household 1)</Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                    {/* Tab 2: Socio-Economic */}
                    {tabValue === 2 && (
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12 }}>
                                <SectionTitle icon={GraduationCap} title="Education & Employment" />
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Has Education', 'hasEducation', 'select', ['yes', 'no'])}</Grid>
                                    {formData.hasEducation === 'yes' && (
                                        <>
                                            <Grid size={{ xs: 12, md: 3 }}>{renderField('Highest Level', 'educationLevel')}</Grid>
                                            <Grid size={{ xs: 12, md: 3 }}>{renderField('Status', 'educationStatus')}</Grid>
                                        </>
                                    )}
                                    
                                    <Grid size={{ xs: 12 }}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Is Employed', 'isEmployed', 'select', ['yes', 'no'])}</Grid>
                                    {formData.isEmployed === 'yes' && (
                                        <>
                                            <Grid size={{ xs: 12, md: 3 }}>{renderField('Occupation', 'occupation')}</Grid>
                                            <Grid size={{ xs: 12, md: 3 }}>{renderField('Employment Status', 'employmentStatus')}</Grid>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12 }}><Divider /></Grid>
                            <Grid size={{ xs: 12 }}>
                                <SectionTitle icon={FileBadge} title="Voter Information" />
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 3 }}>{renderField('Registered Voter', 'isVoter', 'select', ['yes', 'no'])}</Grid>
                                    {formData.isVoter === 'yes' && (
                                        <Grid size={{ xs: 12, md: 3 }}>{renderField('Precinct Number', 'precinctNumber')}</Grid>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                    {/* Tab 3: Classification */}
                    {tabValue === 3 && (
                        <Box>
                            <SectionTitle icon={FileBadge} title="Special Categories" />
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Check all classifications that apply to this resident.
                            </Typography>

                            {isEditing ? (
                                <Grid container spacing={2}>
                                    {['PWD', 'Solo Parent', 'Senior Citizen', 'Indigent', '4Ps Beneficiary', 'Youth'].map(cat => {
                                        const isSelected = formData.categories.includes(cat);
                                        return (
                                            <Grid key={cat}>
                                                <Chip 
                                                    label={cat} 
                                                    onClick={() => {
                                                        const newCats = isSelected 
                                                            ? formData.categories.filter(c => c !== cat)
                                                            : [...formData.categories, cat];
                                                        handleChange('categories', newCats);
                                                    }}
                                                    color={isSelected ? 'primary' : 'default'}
                                                    variant={isSelected ? 'filled' : 'outlined'}
                                                    sx={{ borderRadius: 1 }}
                                                />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {formData.categories.map(cat => (
                                        <Chip key={cat} label={cat} color="primary" variant="outlined" />
                                    ))}
                                    {formData.categories.length === 0 && <Typography color="text.secondary">None</Typography>}
                                </Box>
                            )}
                        </Box>
                    )}

                </Box>
            </Paper>
        </Container>
      </Box>
    </Dialog>
  );
};

export default ResidentProfileModal;