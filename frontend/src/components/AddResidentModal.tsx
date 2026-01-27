
import React, { useState, useEffect } from 'react';
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  InputLabel,
  Chip,
  Collapse,
  Paper,
  SelectChangeEvent,
  IconButton,
  Container,
  Slide,
  AppBar,
  Toolbar,
  Divider,
  InputAdornment,
  FormHelperText,
  Dialog
} from '@mui/material';
import { 
  X, 
  User, 
  Home, 
  GraduationCap, 
  FileBadge, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  MapPin,
  Briefcase,
  Hash,
  Info,
  School,
  BriefcaseBusiness,
  Ban,
  Vote,
  UsersRound,
  Lock
} from 'lucide-react';
import { TransitionProps } from '@mui/material/transitions';

export interface HouseholdOption {
    id: string;
    number: string;
    street: string;
}

interface AddResidentModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  householdOptions?: HouseholdOption[];
  initialHeadId?: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// --- Constants / Dropdown Contents ---
const citizenships = [
  'Filipino', 'American', 'Chinese', 'Japanese', 'Korean', 'Spanish', 'Other'
];

const familyHeadsList = [
    { id: 'FAM-001', name: 'Abad, Carlos', householdNumber: 'Household 1', street: 'Mahogany St.' },
    { id: 'FAM-002', name: 'Bautista, Lica', householdNumber: 'Household 2', street: 'Narra St.' },
    { id: 'FAM-003', name: 'Castalias, Aries', householdNumber: 'Household 3', street: 'Molave St.' },
    { id: 'FAM-004', name: 'Roberto Castalias', householdNumber: 'Household 3', street: 'Molave St.' },
    { id: 'FAM-005', name: 'Miguel Cordero', householdNumber: 'Household 4', street: 'Ipil-Ipil St.' },
];

const familyRoles = [
    'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister', 
    'Grandson', 'Granddaughter', 'Grandparent', 'Nephew', 'Niece', 
    'In-law', 'Relative', 'Househelp', 'Other'
];

const educationLevels = [
  'Pre-Elementary', 'Elementary', 'High School', 'Senior High School', 
  'Vocational', 'College', 'Post Graduate', 'Doctorate'
];

// Initial State
const initialFormData = {
  // Step 1: Personal
  philsysId: '',
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  sex: '',
  dob: '',
  age: '',
  placeOfBirth: '',
  mothersMaidenNameLast: '',
  mothersMaidenNameFirst: '',
  mothersMaidenNameMiddle: '',
  civilStatus: '',
  citizenship: 'Filipino',
  inhabitantType: '',
  religion: '',
  contactNumber: '',
  email: '',
  
  // Step 2: Residence
  unitRoom: '',
  building: '',
  lotBlock: '',
  street: '',
  barangay: '619',
  city: 'Manila',
  householdRole: 'head', // head | member
  householdNumber: '', // If head
  occupancyStatus: '', // If head
  householdHeadId: '', // If member (links to existing head)
  familyRole: '', // Relation to head (e.g., Spouse, Child)

  // Step 3: Socio-Economic
  hasEducation: 'no', // yes | no
  educationLevel: '',
  educationStatus: '',
  isEmployed: 'no', // yes | no
  occupation: '',
  employmentStatus: '',
  isVoter: 'no', // yes | no
  precinctNumber: '',

  // Step 4: Classification
  categories: [] as string[],
};

const AddResidentModal: React.FC<AddResidentModalProps> = ({ open, onClose, onSave, householdOptions = [], initialHeadId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);

  // Sync contextual data if opened from "Add Member" button
  useEffect(() => {
    if (open) {
      if (initialHeadId) {
        const head = familyHeadsList.find(h => h.id === initialHeadId);
        setFormData({
          ...initialFormData,
          householdRole: 'member',
          householdHeadId: initialHeadId,
          street: head?.street || '',
          householdNumber: head?.householdNumber || '',
        });
        setActiveStep(0);
      } else {
        setFormData(initialFormData);
        setActiveStep(0);
      }
    }
  }, [open, initialHeadId]);

  const steps = [
    { label: 'Personal Info', icon: <User size={20} /> },
    { label: 'Residence', icon: <Home size={20} /> },
    { label: 'Socio-Economic', icon: <GraduationCap size={20} /> },
    { label: 'Classification', icon: <FileBadge size={20} /> },
    { label: 'Review', icon: <CheckCircle size={20} /> },
  ];

  // --- Handlers ---
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-calculate Age
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dob]);

  // Handle Category Chips
  const toggleCategory = (category: string) => {
    setFormData(prev => {
      const exists = prev.categories.includes(category);
      if (exists) {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  const isStepValid = () => true; // Requested clickable

  const handleSubmit = () => {
    if (onSave) {
        onSave(formData);
    }
    onClose();
  };

  // --- Render Sections ---

  const renderStep1 = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
        Personal Information
      </Typography>
      
      <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 3, mb: 3, bgcolor: 'white' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <User size={18} /> Identity Details
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField required fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField required fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Suffix</InputLabel>
              <Select name="suffix" value={formData.suffix} label="Suffix" onChange={handleSelectChange}>
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Jr.">Jr.</MenuItem>
                <MenuItem value="Sr.">Sr.</MenuItem>
                <MenuItem value="III">III</MenuItem>
                <MenuItem value="IV">IV</MenuItem>
                <MenuItem value="V">V</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
                <InputLabel>Sex</InputLabel>
                <Select name="sex" value={formData.sex} label="Sex" onChange={handleSelectChange}>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField 
                required fullWidth type="date" label="Date of Birth" name="dob" 
                value={formData.dob} onChange={handleChange} 
                InputLabelProps={{ shrink: true }} 
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField fullWidth label="Age" value={formData.age} InputProps={{ readOnly: true }} sx={{ bgcolor: '#f9fafb' }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth label="Place of Birth" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12 }}>
             <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
             <Typography variant="body2" sx={{ my: 2, color: 'text.secondary', fontWeight: 'bold' }}>Mother's Maiden Name</Typography>
             <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth label="Last Name" name="mothersMaidenNameLast" value={formData.mothersMaidenNameLast} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth label="First Name" name="mothersMaidenNameFirst" value={formData.mothersMaidenNameFirst} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth label="Middle Name" name="mothersMaidenNameMiddle" value={formData.mothersMaidenNameMiddle} onChange={handleChange} placeholder="Optional" />
                </Grid>
             </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 3, bgcolor: 'white' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Hash size={18} /> Additional Details
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Civil Status</InputLabel>
              <Select name="civilStatus" value={formData.civilStatus} label="Civil Status" onChange={handleSelectChange}>
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Widowed">Widowed</MenuItem>
                <MenuItem value="Separated">Separated</MenuItem>
                <MenuItem value="Live-in">Live-in</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
                <InputLabel>Inhabitant Type</InputLabel>
                <Select name="inhabitantType" value={formData.inhabitantType} label="Inhabitant Type" onChange={handleSelectChange}>
                    <MenuItem value="Non-Migrant">Non-Migrant (Born in Barangay)</MenuItem>
                    <MenuItem value="Migrant">Migrant (Moved in)</MenuItem>
                    <MenuItem value="Transient">Transient (Temporary)</MenuItem>
                </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Citizenship</InputLabel>
              <Select name="citizenship" value={formData.citizenship} label="Citizenship" onChange={handleSelectChange}>
                  {citizenships.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Mobile Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="09xxxxxxxxx" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
        Residence & Household
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 12 }}>
             <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 3, bgcolor: initialHeadId ? '#f8fafc' : 'white', height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapPin size={18} /> Current Address {initialHeadId && <Chip label="Locked to Family Head" size="small" icon={<Lock size={12}/>} sx={{ ml: 1, bgcolor: '#e0e7ff', color: '#4338ca' }} />}
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField fullWidth label="Unit/Room No." name="unitRoom" value={formData.unitRoom} onChange={handleChange} InputProps={{ readOnly: !!initialHeadId }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <TextField fullWidth label="Building Name" name="building" value={formData.building} onChange={handleChange} InputProps={{ readOnly: !!initialHeadId }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Lot/Block/Phase" name="lotBlock" value={formData.lotBlock} onChange={handleChange} InputProps={{ readOnly: !!initialHeadId }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField required fullWidth label="Street/Alley/Zone" name="street" value={formData.street} onChange={handleChange} InputProps={{ readOnly: !!initialHeadId }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Barangay" name="barangay" value={formData.barangay} InputProps={{ readOnly: true }} sx={{ bgcolor: '#f9fafb' }} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="City" name="city" value={formData.city} InputProps={{ readOnly: true }} sx={{ bgcolor: '#f9fafb' }} />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 12 }}>
            <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 3, bgcolor: 'white', height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Home size={18} /> Household Setup
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                    <FormLabel component="legend" sx={{ mb: 1, display: 'block' }}>Role in Family</FormLabel>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {['head', 'member'].map((role) => (
                            <Paper
                                key={role}
                                onClick={() => !initialHeadId && setFormData(prev => ({ ...prev, householdRole: role }))}
                                variant="outlined"
                                sx={{ 
                                    flex: 1,
                                    p: 2, 
                                    cursor: initialHeadId ? 'default' : 'pointer',
                                    borderRadius: 2,
                                    textAlign: 'center',
                                    bgcolor: formData.householdRole === role ? 'primary.light' : 'transparent',
                                    borderColor: formData.householdRole === role ? 'primary.main' : 'divider',
                                    color: formData.householdRole === role ? 'primary.dark' : 'text.secondary',
                                    transition: 'all 0.2s',
                                    opacity: initialHeadId && formData.householdRole !== role ? 0.4 : 1,
                                    position: 'relative',
                                    '&:hover': { borderColor: initialHeadId ? 'divider' : 'primary.main' }
                                }}
                            >
                                <Typography fontWeight="bold">{role === 'head' ? 'Head of Family' : 'Member'}</Typography>
                                {initialHeadId && formData.householdRole === role && <Lock size={12} style={{ position: 'absolute', top: 8, right: 8, opacity: 0.5 }} />}
                            </Paper>
                        ))}
                    </Box>
                </Box>

                {formData.householdRole === 'head' ? (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                             <FormControl fullWidth>
                                <InputLabel>Physical Household Number</InputLabel>
                                <Select 
                                    name="householdNumber" 
                                    value={formData.householdNumber} 
                                    label="Physical Household Number" 
                                    onChange={(e) => {
                                        handleSelectChange(e);
                                        const hh = householdOptions.find(h => h.number === e.target.value);
                                        if (hh) {
                                            setFormData(prev => ({ ...prev, street: hh.street }));
                                        }
                                    }}
                                >
                                    {householdOptions.length > 0 ? householdOptions.map((hh) => (
                                        <MenuItem key={hh.id} value={hh.number}>
                                            {hh.number} ({hh.street})
                                        </MenuItem>
                                    )) : (
                                        <MenuItem disabled>No households available</MenuItem>
                                    )}
                                </Select>
                                <FormHelperText sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <span className="flex items-center gap-1"><Info size={14} /> Multiple families can share one household number.</span>
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Occupancy Status</InputLabel>
                                <Select name="occupancyStatus" value={formData.occupancyStatus} label="Occupancy Status" onChange={handleSelectChange}>
                                    <MenuItem value="Owner">Owner</MenuItem>
                                    <MenuItem value="Renter">Renter</MenuItem>
                                    <MenuItem value="Sharer">Sharer</MenuItem>
                                    <MenuItem value="Boarder">Boarder</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth disabled={!!initialHeadId}>
                                <InputLabel>Select Family Head</InputLabel>
                                <Select 
                                    name="householdHeadId" 
                                    value={formData.householdHeadId} 
                                    label="Select Family Head" 
                                    onChange={(e) => {
                                        handleSelectChange(e);
                                        const head = familyHeadsList.find(h => h.id === e.target.value);
                                        if (head) {
                                            setFormData(prev => ({ 
                                                ...prev, 
                                                street: head.street,
                                                householdNumber: head.householdNumber
                                            }));
                                        }
                                    }}
                                >
                                    {familyHeadsList.map((head) => (
                                        <MenuItem key={head.id} value={head.id}>
                                            {head.name} ({head.householdNumber})
                                        </MenuItem>
                                    ))}
                                </Select>
                                {initialHeadId ? (
                                    <FormHelperText sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <span className="flex items-center gap-1 text-indigo-600 font-bold"><Lock size={14} /> Automatically selected from family context.</span>
                                    </FormHelperText>
                                ) : (
                                    <FormHelperText sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <span className="flex items-center gap-1"><Info size={14} /> Link this resident to a specific family head.</span>
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Family Role / Relation to Head</InputLabel>
                                <Select 
                                    name="familyRole" 
                                    value={formData.familyRole} 
                                    label="Family Role / Relation to Head" 
                                    onChange={handleSelectChange}
                                >
                                    {familyRoles.map((role) => (
                                        <MenuItem key={role} value={role}>{role}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <span className="flex items-center gap-1"><UsersRound size={14} /> Specify relationship to the chosen head.</span>
                                </FormHelperText>
                            </FormControl>
                        </Grid>

                        {formData.householdHeadId && (
                            <Grid size={{ xs: 12 }}>
                                 <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Typography variant="caption" color="text.secondary">Family Head Address:</Typography>
                                    <Typography variant="body2" fontWeight="500">
                                        {familyHeadsList.find(h => h.id === formData.householdHeadId)?.street || 'N/A'}, Barangay 619, Manila
                                    </Typography>
                                 </Box>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep3 = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
        Socio-Economic Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
             <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 3, bgcolor: 'white', height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GraduationCap size={18} /> Education
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {['no', 'yes'].map(val => (
                        <Paper
                            key={val}
                            onClick={() => setFormData(prev => ({ ...prev, hasEducation: val }))}
                            variant="outlined"
                            sx={{
                                flex: 1, p: 2, cursor: 'pointer', borderRadius: 2, textAlign: 'center',
                                bgcolor: formData.hasEducation === val ? 'primary.light' : 'transparent',
                                borderColor: formData.hasEducation === val ? 'primary.main' : 'divider'
                            }}
                        >
                            <Typography fontWeight="bold">{val === 'yes' ? 'Has Education' : 'No Education'}</Typography>
                        </Paper>
                    ))}
                </Box>
                
                <Collapse in={formData.hasEducation === 'yes'}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Highest Level Attained</InputLabel>
                            <Select name="educationLevel" value={formData.educationLevel} label="Highest Level Attained" onChange={handleSelectChange}>
                                {educationLevels.map(lvl => <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select name="educationStatus" value={formData.educationStatus} label="Status" onChange={handleSelectChange}>
                                <MenuItem value="Enrolled">Enrolled</MenuItem>
                                <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                                <MenuItem value="Graduate">Graduate</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Collapse>
            </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 3, bgcolor: 'white', height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BriefcaseBusiness size={18} /> Employment
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {['no', 'yes'].map(val => (
                         <Paper
                            key={val}
                            onClick={() => setFormData(prev => ({ ...prev, isEmployed: val }))}
                            variant="outlined"
                            sx={{
                                flex: 1, p: 2, cursor: 'pointer', borderRadius: 2, textAlign: 'center',
                                bgcolor: formData.isEmployed === val ? 'primary.light' : 'transparent',
                                borderColor: formData.isEmployed === val ? 'primary.main' : 'divider'
                            }}
                        >
                            <Typography fontWeight="bold">{val === 'yes' ? 'Employed' : 'Unemployed'}</Typography>
                        </Paper>
                    ))}
                </Box>

                <Collapse in={formData.isEmployed === 'yes'}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                        <TextField fullWidth label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
                         <FormControl fullWidth>
                            <InputLabel>Employment Type</InputLabel>
                            <Select name="employmentStatus" value={formData.employmentStatus} label="Employment Type" onChange={handleSelectChange}>
                                <MenuItem value="Regular">Regular / Permanent</MenuItem>
                                <MenuItem value="Contractual">Contractual</MenuItem>
                                <MenuItem value="Self-Employed">Self-Employed</MenuItem>
                                <MenuItem value="Job Order">Job Order (JO)</MenuItem>
                                <MenuItem value="Seasonal">Seasonal</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Collapse>
            </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 3, bgcolor: 'white', height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Vote size={18} /> Voter Registration
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {['no', 'yes'].map(val => (
                        <Paper
                            key={val}
                            onClick={() => setFormData(prev => ({ ...prev, isVoter: val }))}
                            variant="outlined"
                            sx={{
                                flex: 1, p: 2, cursor: 'pointer', borderRadius: 2, textAlign: 'center',
                                bgcolor: formData.isVoter === val ? 'primary.light' : 'transparent',
                                borderColor: formData.isVoter === val ? 'primary.main' : 'divider'
                            }}
                        >
                            <Typography fontWeight="bold">{val === 'yes' ? 'Registered' : 'Non-Voter'}</Typography>
                        </Paper>
                    ))}
                </Box>

                <Collapse in={formData.isVoter === 'yes'}>
                    <Box sx={{ pt: 1 }}>
                        <TextField 
                            fullWidth
                            label="Precinct Number" 
                            name="precinctNumber" 
                            value={formData.precinctNumber} 
                            onChange={handleChange} 
                            placeholder="e.g., 0123A"
                        />
                    </Box>
                </Collapse>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep4 = () => {
    const categoriesList = [
      'PWD', 'Solo Parent', 'Senior Citizen', 'Indigent', 
      'Pregnant', 'Lactating Mother', 'OSY (Out of School Youth)', 
      '4Ps Beneficiary', 'OFW', 'Indigenous People'
    ];

    return (
      <Box>
         <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
            Classifications
        </Typography>

        <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
                <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 3, bgcolor: 'white', height: '100%' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FileBadge size={18} /> Special Categories
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Select all classifications that apply.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                        {categoriesList.map((cat) => {
                            const selected = formData.categories.includes(cat);
                            return (
                                <Chip 
                                    key={cat}
                                    label={cat}
                                    onClick={() => toggleCategory(cat)}
                                    color={selected ? "primary" : "default"}
                                    variant={selected ? "filled" : "outlined"}
                                    sx={{ 
                                        borderRadius: 2, 
                                        px: 1, 
                                        py: 2.5,
                                        fontSize: '0.9rem',
                                        border: selected ? 'none' : '1px solid #e5e7eb',
                                        bgcolor: selected ? 'primary.main' : 'white',
                                        '&:hover': { bgcolor: selected ? 'primary.dark' : 'grey.50' }
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Paper>
            </Grid>
        </Grid>
      </Box>
    );
  };

  const renderStep5 = () => (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="text-green-600" size={32} />
            </div>
            <Typography variant="h5" fontWeight="bold">Review Registration</Typography>
            <Typography color="text.secondary">Please verify the information before submitting.</Typography>
        </Box>

        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
            <Box sx={{ bgcolor: 'grey.50', px: 3, py: 2, borderBottom: '1px solid #e5e7eb' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">IDENTITY</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Full Name</Typography>
                        <Typography variant="body1" fontWeight="500">{`${formData.lastName}, ${formData.firstName} ${formData.middleName} ${formData.suffix}`}</Typography>
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <Typography variant="caption" color="text.secondary">Sex</Typography>
                        <Typography variant="body1" fontWeight="500">{formData.sex}</Typography>
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <Typography variant="caption" color="text.secondary">Age</Typography>
                        <Typography variant="body1" fontWeight="500">{formData.age}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Birthdate</Typography>
                        <Typography variant="body1" fontWeight="500">{formData.dob}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Place of Birth</Typography>
                        <Typography variant="body1" fontWeight="500">{formData.placeOfBirth || '-'}</Typography>
                    </Grid>
                     <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">Mother's Maiden Name</Typography>
                        <Typography variant="body1" fontWeight="500">
                            {`${formData.mothersMaidenNameLast}, ${formData.mothersMaidenNameFirst} ${formData.mothersMaidenNameMiddle}`}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Paper>

        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
            <Box sx={{ bgcolor: 'grey.50', px: 3, py: 2, borderBottom: '1px solid #e5e7eb' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">ADDRESS & HOUSEHOLD</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">Address</Typography>
                        <Typography variant="body1" fontWeight="500">
                            {`${formData.unitRoom ? formData.unitRoom + ', ' : ''} ${formData.building ? formData.building + ', ' : ''} ${formData.street}, ${formData.barangay}, ${formData.city}`}
                        </Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">Household Role</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                             <Typography variant="body1" fontWeight="500">
                                {formData.householdRole === 'head' ? 'Head of Family' : `Member (${formData.familyRole || 'No Role Set'})`}
                             </Typography>
                             
                             {formData.householdRole === 'member' && formData.householdHeadId && (
                                <Chip 
                                    label={`Family of: ${familyHeadsList.find(h => h.id === formData.householdHeadId)?.name || 'Unknown'}`} 
                                    size="small" 
                                    color="info" 
                                    variant="outlined" 
                                />
                             )}
                        </Box>
                    </Grid>
                    
                    {formData.householdRole === 'head' && (
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="caption" color="text.secondary">Physical Household No.</Typography>
                            <Typography variant="body1" fontWeight="500">{formData.householdNumber}</Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Paper>
    </Box>
  );

  return (
    <Dialog 
        fullScreen 
        open={open} 
        onClose={onClose} 
        TransitionComponent={Transition}
        PaperProps={{ sx: { bgcolor: '#f3f4f6' } }}
    >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: '#2e0249', color: 'white' }}>
                <Toolbar sx={{ height: 80 }}>
                    <IconButton edge="start" color="inherit" onClick={onClose} sx={{ mr: 2 }}>
                        <X />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        {initialHeadId ? 'Add Family Member' : 'New Resident Registration'}
                    </Typography>
                    
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                         {steps.map((step, index) => (
                             <Box key={step.label} sx={{ display: 'flex', alignItems: 'center', opacity: activeStep === index ? 1 : 0.5 }}>
                                <Box 
                                    sx={{ 
                                        width: 24, height: 24, borderRadius: '50%', 
                                        bgcolor: activeStep >= index ? 'white' : 'transparent', 
                                        border: '1px solid white',
                                        color: '#2e0249',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontWeight: 'bold', mr: 1
                                    }}
                                >
                                    {index + 1}
                                </Box>
                                <Typography variant="body2" color="inherit">{step.label}</Typography>
                                {index < steps.length - 1 && <Box sx={{ width: 20, height: 1, bgcolor: 'white', mx: 2 }} />}
                             </Box>
                         ))}
                    </Box>
                </Toolbar>
            </AppBar>

            <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 5 } }}>
                <Container maxWidth="xl">
                    {activeStep === 0 && renderStep1()}
                    {activeStep === 1 && renderStep2()}
                    {activeStep === 2 && renderStep3()}
                    {activeStep === 3 && renderStep4()}
                    {activeStep === 4 && renderStep5()}
                </Container>
            </Box>

            <Paper elevation={3} sx={{ p: 2, borderTop: '1px solid #e5e7eb', zIndex: 10 }}>
                <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button 
                        disabled={activeStep === 0} 
                        onClick={handleBack}
                        startIcon={<ChevronLeft />}
                        size="large"
                        sx={{ px: 4, borderRadius: 2 }}
                    >
                        Back
                    </Button>
                    
                    {activeStep === steps.length - 1 ? (
                         <Button 
                            variant="contained" 
                            color="success" 
                            size="large"
                            onClick={handleSubmit}
                            startIcon={<CheckCircle />}
                            sx={{ px: 4, borderRadius: 2, py: 1.5 }}
                        >
                            Submit Registration
                        </Button>
                    ) : (
                         <Button 
                            variant="contained" 
                            onClick={handleNext} 
                            disabled={!isStepValid()}
                            endIcon={<ChevronRight />}
                            size="large"
                            sx={{ px: 4, borderRadius: 2, py: 1.5, bgcolor: '#2e0249', '&:hover': { bgcolor: '#4a0475' } }}
                        >
                            Next Step
                        </Button>
                    )}
                </Container>
            </Paper>
        </Box>
    </Dialog>
  );
};

export default AddResidentModal;
