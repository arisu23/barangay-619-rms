import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
  Container,
  Divider,
  Stack,
  Tooltip,
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Zoom,
  TablePagination
} from '@mui/material';
import { 
  Download, 
  FileSpreadsheet, 
  BarChart4, 
  Users, 
  Home, 
  Vote,
  UsersRound,
  Accessibility, 
  Heart, 
  ShieldAlert, 
  UserSquare,
  X,
  TrendingUp,
  Printer,
  FileCheck,
  ClipboardList,
  Stamp,
  Calendar,
  Layers,
  ChevronRight,
  Maximize2,
  ChevronLeft,
  Search,
  FileText,
  FileDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// --- Mock Data ---
// Extended mock data for the detailed demographics breakdown
const residentsData = [
  { id: 1, lastName: 'Abad', firstName: 'Carlos', middleName: 'Santos', ext: '', pob: 'Manila', dob: '2001-05-15', age: 23, sex: 'Male', civilStatus: 'Single', citizenship: 'Filipino', occupation: 'Engineer', sector: 'Labor Force', household: 'HH-001', street: 'Mahogany St.', categories: ['OFW'] },
  { id: 2, lastName: 'Bautista', firstName: 'Lica', middleName: 'Marie', ext: '', pob: 'QC', dob: '1988-12-02', age: 37, sex: 'Female', civilStatus: 'Married', citizenship: 'Filipino', occupation: 'Teacher', sector: 'Solo Parent', household: 'HH-002', street: 'Narra St.', categories: ['Solo Parent', '4Ps'] },
  { id: 3, lastName: 'Castalias', firstName: 'Aries', middleName: 'P', ext: '', pob: 'Cebu', dob: '1979-03-24', age: 45, sex: 'Male', civilStatus: 'Single', citizenship: 'Filipino', occupation: 'Driver', sector: 'PWD', household: 'HH-003', street: 'Molave St.', categories: ['PWD'] },
  { id: 4, lastName: 'Dela Cruz', firstName: 'Juan', middleName: 'M', ext: 'Jr', pob: 'Manila', dob: '1995-07-10', age: 29, sex: 'Male', civilStatus: 'Married', citizenship: 'Filipino', occupation: 'Clerk', sector: 'Labor Force', household: 'HH-004', street: 'Ipil-Ipil St.', categories: [] },
  { id: 5, lastName: 'Gomez', firstName: 'Maria', middleName: 'L', ext: '', pob: 'Batangas', dob: '1955-08-20', age: 69, sex: 'Female', civilStatus: 'Widowed', citizenship: 'Filipino', occupation: 'Retired', sector: 'Senior Citizen', household: 'HH-005', street: 'Bata St.', categories: ['Senior Citizen', 'Indigent'] },
  { id: 6, lastName: 'Reyes', firstName: 'Fernando', middleName: 'D', ext: '', pob: 'Manila', dob: '1948-11-12', age: 76, sex: 'Male', civilStatus: 'Married', citizenship: 'Filipino', occupation: 'Retired', sector: 'Senior Citizen', household: 'HH-006', street: 'Mahogany St.', categories: ['Senior Citizen'] },
  { id: 7, lastName: 'Santos', firstName: 'Elena', middleName: 'F', ext: '', pob: 'QC', dob: '1990-01-30', age: 34, sex: 'Female', civilStatus: 'Single', citizenship: 'Filipino', occupation: 'Accountant', sector: 'Solo Parent', household: 'HH-007', street: 'Narra St.', categories: ['Solo Parent'] },
];

const ageBrackets = [
    { label: 'Under 5 years old', range: [0, 4] },
    { label: '5-9 years old', range: [5, 9] },
    { label: '10-14 years old', range: [10, 14] },
    { label: '15-19 years old', range: [15, 19] },
    { label: '20-24 years old', range: [20, 24] },
    { label: '25-29 years old', range: [25, 29] },
    { label: '30-34 years old', range: [30, 34] },
    { label: '35-39 years old', range: [35, 39] },
    { label: '40-44 years old', range: [40, 44] },
    { label: '45-49 years old', range: [45, 49] },
    { label: '50-54 years old', range: [50, 54] },
    { label: '55-59 years old', range: [55, 59] },
    { label: '60-64 years old', range: [60, 64] },
    { label: '65-69 years old', range: [65, 69] },
    { label: '70-74 years old', range: [70, 74] },
    { label: '75-79 years old', range: [75, 79] },
    { label: '80 years old and over', range: [80, 200] },
];

const sectorList = ['Labor Force', 'Unemployed', 'Out of School Children (OSC)', 'Out of School Youth (OSY)', 'Person with Disabilities (PWDs)', 'Overseas Filipino Workers (OFWs)', 'Solo Parents', 'Indigenous Peoples (IPs)'];

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#ec4899', '#6366f1'];

const ageGroupData = [
  { name: '0-14', value: 850 },
  { name: '15-24', value: 1200 },
  { name: '25-64', value: 1300 },
  { name: '65+', value: 217 },
];

const employmentData = [
  { name: 'Employed', value: 1500, color: '#3b82f6' },
  { name: 'Unemployed', value: 500, color: '#64748b' },
  { name: 'Self-Employed', value: 300, color: '#10b981' },
  { name: 'Student', value: 800, color: '#8b5cf6' },
  { name: 'Retired', value: 467, color: '#f59e0b' },
];

// --- Form Preview Components ---

const FormA_Preview = ({ residents }: { residents: any[] }) => (
    <Box sx={{ bgcolor: 'white', p: 6, minHeight: '11in', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>RBI FORM A (Revised 2024)</Typography>
        <Typography variant="h6" align="center" sx={{ fontWeight: 800, mt: 2, mb: 4, textTransform: 'uppercase' }}>
            Records of Barangay Inhabitants by Household
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6 }}><Typography variant="body2"><strong>REGION :</strong> NCR</Typography></Grid>
            <Grid size={{ xs: 6 }}><Typography variant="body2"><strong>PROVINCE:</strong> METRO MANILA</Typography></Grid>
            <Grid size={{ xs: 6 }}><Typography variant="body2"><strong>CITY/MUNICIPALITY:</strong> MANILA</Typography></Grid>
            <Grid size={{ xs: 6 }}><Typography variant="body2"><strong>BARANGAY :</strong> 619</Typography></Grid>
            <Grid size={{ xs: 6 }}><Typography variant="body2"><strong>HOUSEHOLD ADDRESS :</strong> BATA ST., BACOOD</Typography></Grid>
            <Grid size={{ xs: 6 }}><Typography variant="body2"><strong>NO. OF HOUSEHOLD MEMBERS:</strong> {residents.length}</Typography></Grid>
        </Grid>

        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 0 }}>
            <Table size="small">
                <TableHead sx={{ bgcolor: '#dcfce7' }}>
                    <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>NAME</TableCell>
                        <TableCell rowSpan={2} align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>PLACE OF BIRTH</TableCell>
                        <TableCell rowSpan={2} align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>DATE OF BIRTH</TableCell>
                        <TableCell rowSpan={2} align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>AGE</TableCell>
                        <TableCell rowSpan={2} align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>SEX</TableCell>
                        <TableCell rowSpan={2} align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>CIVIL STATUS</TableCell>
                        <TableCell rowSpan={2} align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>CITIZENSHIP</TableCell>
                        <TableCell rowSpan={2} align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>OCCUPATION</TableCell>
                        <TableCell rowSpan={2} align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0', fontSize: '10px' }}>CATEGORIES</TableCell>
                    </TableRow>
                    <TableRow sx={{ bgcolor: '#dcfce7' }}>
                        <TableCell sx={{ border: '1px solid #bbf7d0', fontSize: '10px', fontWeight: 'bold' }}>LAST NAME</TableCell>
                        <TableCell sx={{ border: '1px solid #bbf7d0', fontSize: '10px', fontWeight: 'bold' }}>FIRST NAME</TableCell>
                        <TableCell sx={{ border: '1px solid #bbf7d0', fontSize: '10px', fontWeight: 'bold' }}>MIDDLE NAME</TableCell>
                        <TableCell sx={{ border: '1px solid #bbf7d0', fontSize: '10px', fontWeight: 'bold' }}>EXT</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {residents.map((r, i) => (
                        <TableRow key={i}>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.lastName}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.firstName}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.middleName}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.ext || '-'}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.pob}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.dob}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.age}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.sex}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.civilStatus}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.citizenship}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.occupation}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}>{r.sector}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ textAlign: 'center', width: 200 }}>
                <Typography variant="caption" display="block" sx={{ borderTop: '1px solid black', pt: 0.5 }}>Name of Household/Head Member</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', width: 200 }}>
                <Typography variant="caption" display="block" sx={{ borderTop: '1px solid black', pt: 0.5 }}>Barangay Secretary</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', width: 200 }}>
                <Typography variant="caption" display="block" sx={{ borderTop: '1px solid black', pt: 0.5 }}>Punong Barangay</Typography>
            </Box>
        </Box>
    </Box>
);

const FormC_Preview = ({ residents }: { residents: any[] }) => {
    const getBracketCount = (min: number, max: number, sex?: string) => {
        return residents.filter(r => (sex ? r.sex === sex : true) && r.age >= min && r.age <= max).length;
    };

    const getSectorCount = (sector: string, sex?: string) => {
        return residents.filter(r => (sex ? r.sex === sex : true) && (r.sector === sector || (r.categories && r.categories.includes(sector)))).length;
    };

    const getCivilStatusCount = (status: string, sex?: string) => {
        return residents.filter(r => (sex ? r.sex === sex : true) && r.civilStatus === status).length;
    };

    const getCitizenshipCount = (citizenship: string, sex?: string) => {
        if (citizenship === 'Filipino') {
            return residents.filter(r => (sex ? r.sex === sex : true) && r.citizenship === 'Filipino').length;
        } else {
            return residents.filter(r => (sex ? r.sex === sex : true) && r.citizenship !== 'Filipino').length;
        }
    };

    return (
        <Box sx={{ bgcolor: 'white', p: 6, minHeight: '11in', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>RBI FORM C (Revised 2024)</Typography>
            <Typography variant="h6" align="center" sx={{ fontWeight: 800, mt: 1, textTransform: 'uppercase' }}>MONITORING REPORT</Typography>
            <Typography variant="body2" align="center" sx={{ mb: 4 }}>for 2nd Semester of CY 2025</Typography>

            <Grid container spacing={0.5} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12 }}><Typography variant="body2"><strong>REGION :</strong> NCR</Typography></Grid>
                <Grid size={{ xs: 12 }}><Typography variant="body2"><strong>PROVINCE:</strong> METRO MANILA</Typography></Grid>
                <Grid size={{ xs: 12 }}><Typography variant="body2"><strong>CITY/MUNICIPALITY:</strong> MANILA</Typography></Grid>
                <Grid size={{ xs: 12 }}><Typography variant="body2"><strong>BARANGAY :</strong> 619</Typography></Grid>
                <Grid size={{ xs: 12 }} sx={{ mt: 1 }}><Typography variant="body2"><strong>Total No. of Barangay Inhabitants:</strong> {residents.length}</Typography></Grid>
                <Grid size={{ xs: 12 }}><Typography variant="body2"><strong>Total No. of Households:</strong> 32</Typography></Grid>
                <Grid size={{ xs: 12 }}><Typography variant="body2"><strong>Total No. of Families:</strong> 127</Typography></Grid>
            </Grid>

            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 0 }}>
                <Table size="small">
                    <TableHead sx={{ bgcolor: '#dcfce7' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>INDICATORS</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>MALE</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>FEMALE</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>TOTAL</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0' }}>REMARKS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{ bgcolor: '#dcfce7' }}>
                            <TableCell colSpan={5} sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0', fontSize: '0.75rem' }}>Population by Age Bracket:</TableCell>
                        </TableRow>
                        {ageBrackets.map((bracket, i) => (
                            <TableRow key={i}>
                                <TableCell sx={{ pl: 4, border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>{bracket.label}</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #e2e8f0' }}>{getBracketCount(bracket.range[0], bracket.range[1], 'Male')}</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #e2e8f0' }}>{getBracketCount(bracket.range[0], bracket.range[1], 'Female')}</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{getBracketCount(bracket.range[0], bracket.range[1])}</TableCell>
                                <TableCell sx={{ border: '1px solid #e2e8f0' }}></TableCell>
                            </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: '#dcfce7' }}>
                            <TableCell colSpan={5} sx={{ fontWeight: 'bold', border: '1px solid #bbf7d0', fontSize: '0.75rem' }}>Population by Sector:</TableCell>
                        </TableRow>
                        {sectorList.map((sector, i) => (
                            <TableRow key={i}>
                                <TableCell sx={{ pl: 4, border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>{sector}</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #e2e8f0' }}>{getSectorCount(sector, 'Male')}</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #e2e8f0' }}>{getSectorCount(sector, 'Female')}</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{getSectorCount(sector)}</TableCell>
                                <TableCell sx={{ border: '1px solid #e2e8f0' }}></TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>Civil Status : Single</TableCell>
                            <TableCell align="center" sx={{ border: '1px solid #e2e8f0' }}>{getCivilStatusCount('Single', 'Male')}</TableCell>
                            <TableCell align="center" sx={{ border: '1px solid #e2e8f0' }}>{getCivilStatusCount('Single', 'Female')}</TableCell>
                            <TableCell align="center" sx={{ border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{getCivilStatusCount('Single')}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ pl: 4, fontWeight: 'bold', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>: Married</TableCell>
                            <TableCell align="center" sx={{ border: '1px solid #e2e8f0' }}>{getCivilStatusCount('Married', 'Male')}</TableCell>
                            <TableCell align="center" sx={{ border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{getCivilStatusCount('Married')}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>Citizenship : Filipino</TableCell>
                            <TableCell align="center" sx={{ border: '1px solid #e2e8f0' }}>{getCitizenshipCount('Filipino', 'Male')}</TableCell>
                            <TableCell align="center" sx={{ border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{getCitizenshipCount('Filipino')}</TableCell>
                            <TableCell sx={{ border: '1px solid #e2e8f0' }}></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ width: '45%' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Prepared by:</Typography>
                    <Box sx={{ mt: 5, borderTop: '1px solid black', pt: 0.5, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Hon. Reynaldo T. Maca</Typography>
                        <Typography variant="caption" display="block">Barangay Secretary</Typography>
                    </Box>
                </Box>
                <Box sx={{ width: '45%' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Submitted by:</Typography>
                    <Box sx={{ mt: 5, borderTop: '1px solid black', pt: 0.5, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Hon. Michael King Cajucom</Typography>
                        <Typography variant="caption" display="block">Punong Barangay</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const Certification_Preview = ({ inhabitantsCount }: { inhabitantsCount: number }) => (
    <Box sx={{ bgcolor: 'white', p: 10, minHeight: '11in', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box 
              sx={{ 
                width: 100, 
                height: 100, 
                border: '2px solid #ccc', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                fontSize: '12px',
                textAlign: 'center',
                color: '#666',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              BARANGAY<br/>LOGO
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 800 }}>Barangay 619, Zone 62, District VI</Typography>
            <Typography variant="body1" sx={{ fontWeight: 800 }}>City of Manila</Typography>
        </Box>

        <Typography variant="h4" align="center" sx={{ fontWeight: 900, mt: 4, mb: 10, letterSpacing: '0.1em' }}>CERTIFICATION</Typography>

        <Box sx={{ px: 4, mt: 4 }}>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify', lineHeight: 2, textIndent: '40px', fontSize: '1.1rem' }}>
                This is to certify that Barangay <strong>619</strong>, Zone <strong>62</strong>, District <strong>VI</strong>, Manila has a total of 
                <strong> {inhabitantsCount.toLocaleString()}</strong> registered barangay inhabitants for the <strong>2nd</strong> quarter of <strong>2025</strong> pursuant to 
                DILG Memorandum Circular 2008-144 re: Reiteration of Memorandum Circular No. 2005-69 
                dated July 21 2005 re: Maintenance and Updating of all Inhabitants of the Barangay.
            </Typography>

            <Typography variant="body1" sx={{ mt: 6, lineHeight: 2, textIndent: '40px', fontSize: '1.1rem' }}>
                Issued this <strong>{new Date().getDate()}th</strong> day of <strong>{new Date().toLocaleString('default', { month: 'long' })}</strong>, <strong>{new Date().getFullYear()}</strong> at the <u>address of the Barangay Hall</u>.
            </Typography>
        </Box>

        <Box sx={{ mt: 15, display: 'flex', justifyContent: 'flex-end', pr: 4 }}>
            <Box sx={{ textAlign: 'center', width: 350 }}>
                <Box sx={{ borderTop: '2px solid black', mt: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>Punong Barangay</Typography>
            </Box>
        </Box>
    </Box>
);

interface DetailedReportDialogProps {
  open: boolean;
  onClose: () => void;
  category: { id: string; label: string; value: string | number; icon: any; color: string; } | null;
}

const DetailedReportDialog: React.FC<DetailedReportDialogProps> = ({ open, onClose, category }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredResidents = useMemo(() => {
    if (!category) return [];
    
    // Logic to filter based on category id
    return residentsData.filter(r => {
        const matchesCategory = 
            category.id === 'inhabitants' ? true :
            category.id === 'voters' ? r.occupation !== 'Retired' : // Mock logic
            category.id === 'seniors' ? r.age >= 60 :
            category.id === 'pwd' ? r.categories.includes('PWD') :
            category.id === 'solo' ? r.categories.includes('Solo Parent') :
            category.id === 'indigent' ? r.categories.includes('Indigent') :
            true;

        const matchesSearch = 
            r.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.household.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });
  }, [category, searchQuery]);

  if (!category) return null;
  const Icon = category.icon;

  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Age', 'Gender', 'Household', 'Street'];
    const rows = filteredResidents.map(r => [r.firstName, r.lastName, r.age, r.sex, r.household, r.street]);
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${category.label.replace(/\s+/g, '_')}_Breakdown.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    // In a real environment we would use jspdf/html2canvas
    alert(`Exporting ${category.label} Breakdown to PDF...`);
    window.print(); // Fallback for simulation
  };

  return (
    <Dialog 
      fullScreen 
      open={open} 
      onClose={onClose} 
      TransitionComponent={Transition}
    >
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: '#1e293b', borderBottom: '1px solid #e2e8f0' }}>
          <Toolbar sx={{ height: 80, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton edge="start" onClick={onClose} sx={{ mr: 2, color: '#64748b' }}>
                <X />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${category.color}15`, color: category.color }}>
                        <Icon size={24} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {category.label} Demographics
                    </Typography>
                </Box>
            </Box>

            <Stack direction="row" spacing={2}>
                <Button 
                    variant="outlined" 
                    startIcon={<FileDown size={18} />} 
                    onClick={handleExportCSV}
                    sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
                >
                    Export CSV
                </Button>
                <Button 
                    variant="contained" 
                    startIcon={<Printer size={18} />} 
                    onClick={handleExportPDF}
                    sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700, bgcolor: category.color, '&:hover': { bgcolor: category.color, opacity: 0.9 } }}
                >
                    Print PDF
                </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
          <Grid container spacing={3}>
            {/* Summary Stat Card */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #e5e7eb', bgcolor: 'white' }}>
                <Box sx={{ p: 3, borderRadius: 3, bgcolor: `${category.color}15`, color: category.color }}>
                  <Icon size={48} strokeWidth={1.5} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b' }}>{filteredResidents.length}</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Found in {category.label}</Typography>
                </Box>
                <Box sx={{ flex: 1 }} />
                <TextField
                    placeholder="Search by name or household..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: 350, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={18} className="text-gray-400" />
                            </InputAdornment>
                        )
                    }}
                />
              </Paper>
            </Grid>

            {/* Data Table */}
            <Grid size={{ xs: 12 }}>
                <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb', overflow: 'hidden', bgcolor: 'white' }}>
                    <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, color: '#64748b' }}>NAME</TableCell>
                                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, color: '#64748b' }}>AGE</TableCell>
                                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, color: '#64748b' }}>SEX</TableCell>
                                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, color: '#64748b' }}>HOUSEHOLD</TableCell>
                                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, color: '#64748b' }}>STREET</TableCell>
                                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, color: '#64748b' }}>CIVIL STATUS</TableCell>
                                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, color: '#64748b' }}>CITIZENSHIP</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredResidents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((res) => (
                                    <TableRow key={res.id} hover>
                                        <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>{res.lastName}, {res.firstName}</TableCell>
                                        <TableCell>{res.age}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={res.sex} 
                                                size="small" 
                                                sx={{ 
                                                    fontWeight: 800, 
                                                    fontSize: '0.65rem',
                                                    bgcolor: res.sex === 'Male' ? '#eff6ff' : '#fdf2f8',
                                                    color: res.sex === 'Male' ? '#1d4ed8' : '#be185d'
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{res.household}</TableCell>
                                        <TableCell>{res.street}</TableCell>
                                        <TableCell>{res.civilStatus}</TableCell>
                                        <TableCell>{res.citizenship}</TableCell>
                                    </TableRow>
                                ))}
                                {filteredResidents.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                            <Typography variant="body1" color="text.secondary">No records found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={filteredResidents.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Dialog>
  );
};

const Reports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [yearFilter, setYearFilter] = useState('2025');
  const [semesterFilter, setSemesterFilter] = useState('2nd Semester');
  const [rbiTemplate, setRbiTemplate] = useState('Form A');
  const [selectedReport, setSelectedReport] = useState<{ id: string; label: string; value: string | number; icon: any; color: string; } | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const stats = [
    { id: 'inhabitants', label: 'Total Inhabitants', value: '3,567', icon: Users, color: '#3b82f6' },
    { id: 'household', label: 'Total Household', value: '32', icon: Home, color: '#8b5cf6' },
    { id: 'families', label: 'Families Recorded', value: '127', icon: UsersRound, color: '#f59e0b' },
    { id: 'voters', label: 'Registered Voters', value: '2,789', icon: Vote, color: '#10b981' },
    { id: 'seniors', label: 'Senior Citizens', value: '517', icon: Heart, color: '#ef4444' },
    { id: 'pwd', label: 'PWD Count', value: '50', icon: Accessibility, color: '#06b6d4' },
    { id: 'solo', label: 'Solo Parents', value: '120', icon: UserSquare, color: '#ec4899' },
    { id: 'indigent', label: 'Indigent Records', value: '320', icon: ShieldAlert, color: '#6366f1' },
  ];

  const templates = [
    { id: 'Form A', title: 'Form A (RBI Form By Household)', icon: ClipboardList, desc: 'Detailed household inhabitant registry.', color: '#4f46e5' },
    { id: 'Form C', title: 'Form C (RBI Population Bracketing)', icon: TrendingUp, desc: 'Population summary report.', color: '#0891b2' },
    { id: 'Cert', title: 'Certification', icon: Stamp, desc: 'Official population count certification.', color: '#be185d' },
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: '#f3f4f6', pointerEvents: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2e0249', mb: 1 }}>
            Barangay Reports
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Official analytics and RBI records management for Barangay 619 Zone 62.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ width: 140 }}>
                <InputLabel>Year</InputLabel>
                <Select
                    value={yearFilter}
                    label="Year"
                    onChange={(e) => setYearFilter(e.target.value)}
                    sx={{ borderRadius: 2, bgcolor: 'white' }}
                >
                    <MenuItem value="2025">2025</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                </Select>
            </FormControl>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ flex: 1, borderRadius: 4, border: '1px solid #e5e7eb', overflow: 'hidden', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', px: 2, flexShrink: 0 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': { 
                textTransform: 'none', 
                fontWeight: 700, 
                fontSize: '1rem',
                minHeight: 64,
                px: 5
              }
            }}
          >
            <Tab icon={<BarChart4 size={20} />} iconPosition="start" label="Demographics" />
            <Tab icon={<FileSpreadsheet size={20} />} iconPosition="start" label="RBI Registry" />
          </Tabs>
        </Box>

        {/* Tab content area */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {/* Tab 0: Demographics */}
          {tabValue === 0 && (
            <Box sx={{ p: 4, bgcolor: '#f8fafc', height: '100%', overflowY: 'auto' }}>
              <Grid container spacing={3} sx={{ mb: 6 }}>
                  {stats.map((stat, i) => (
                      <Grid size={{ xs: 12, md: 6 }} key={i}>
                          <Box 
                              onClick={() => setSelectedReport(stat)}
                              sx={{ 
                                  bgcolor: 'white',
                                  borderRadius: 3,
                                  p: 3.5,
                                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                  border: '1px solid #f3f4f6',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderColor: stat.color }
                              }}
                          >
                              <Box>
                                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: stat.color, textTransform: 'uppercase', mb: 1, display: 'block' }}>{stat.label}</Typography>
                                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b' }}>{stat.value}</Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>View Breakdown</Typography>
                              </Box>
                              <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: `${stat.color}15`, color: stat.color }}>
                                  <stat.icon size={36} strokeWidth={1.5} />
                              </Box>
                          </Box>
                      </Grid>
                  ))}
              </Grid>
              <Stack spacing={4}>
                  <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, height: 500 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Age Group Distribution</Typography>
                      <ResponsiveContainer width="100%" height="90%">
                          <BarChart data={ageGroupData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} />
                              <YAxis axisLine={false} tickLine={false} />
                              <RechartsTooltip cursor={{ fill: '#f8fafc' }} />
                              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                  {ageGroupData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, height: 500 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Employment Breakdown</Typography>
                      <ResponsiveContainer width="100%" height="90%">
                          <BarChart layout="vertical" data={employmentData}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={150} />
                              <RechartsTooltip />
                              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                  {employmentData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                  </Paper>
              </Stack>
            </Box>
          )}

          {/* Tab 1: RBI Registry Generator */}
          {tabValue === 1 && (
            <Box sx={{ display: 'flex', height: '100%', bgcolor: '#f1f5f9' }}>
              
              {/* Left Document Preview Area (Independent Scroll) */}
              <Box sx={{ flex: 1, p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', bgcolor: '#f1f5f9' }}>
                  <Box sx={{ width: '100%', maxWidth: '8.5in', mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                          Document Preview <span style={{ marginLeft: 8, color: '#cbd5e1' }}>|</span> Standard Letter (8.5" x 11")
                      </Typography>
                      <IconButton size="small" sx={{ color: '#64748b' }}>
                          <Maximize2 size={18} />
                      </IconButton>
                  </Box>

                  <Zoom in={true} key={rbiTemplate}>
                      <Box sx={{ width: '100%', maxWidth: '8.5in' }}>
                          {rbiTemplate === 'Form A' && <FormA_Preview residents={residentsData} />}
                          {rbiTemplate === 'Form C' && <FormC_Preview residents={residentsData} />}
                          {rbiTemplate === 'Cert' && <Certification_Preview inhabitantsCount={3567} />}
                      </Box>
                  </Zoom>

                  {/* Bottom padding for better scroll feel */}
                  <Box sx={{ height: 100, flexShrink: 0 }} />
              </Box>

              {/* Right Control Panel / Sidebar (Independent Scroll) */}
              <Box sx={{ width: 340, borderLeft: '1px solid #e2e8f0', p: 3, bgcolor: 'white', flexShrink: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Layers size={18} /> Select Template
                  </Typography>
                  
                  <Stack spacing={2} sx={{ mb: 4 }}>
                      {templates.map((tmpl) => (
                          <Card 
                              key={tmpl.id} 
                              elevation={0}
                              onClick={() => setRbiTemplate(tmpl.id)}
                              sx={{ 
                                  border: '2px solid', 
                                  borderColor: rbiTemplate === tmpl.id ? tmpl.color : '#f1f5f9',
                                  bgcolor: rbiTemplate === tmpl.id ? `${tmpl.color}05` : 'transparent',
                                  borderRadius: 3,
                                  transition: 'all 0.2s',
                                  '&:hover': { borderColor: rbiTemplate === tmpl.id ? tmpl.color : '#e2e8f0' }
                              }}
                          >
                              <CardActionArea sx={{ p: 2 }}>
                                  <Box sx={{ display: 'flex', gap: 2 }}>
                                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: rbiTemplate === tmpl.id ? tmpl.color : '#f1f5f9', color: rbiTemplate === tmpl.id ? 'white' : '#64748b' }}>
                                          <tmpl.icon size={24} />
                                      </Box>
                                      <Box sx={{ flex: 1 }}>
                                          <Typography variant="body1" fontWeight="bold" sx={{ color: '#1e293b' }}>{tmpl.title}</Typography>
                                          <Typography variant="caption" color="text.secondary">{tmpl.desc}</Typography>
                                      </Box>
                                      {rbiTemplate === tmpl.id && <ChevronLeft size={18} className="text-gray-400 mt-2" />}
                                  </Box>
                              </CardActionArea>
                          </Card>
                      ))}
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Calendar size={18} /> Configuration
                  </Typography>

                  <Stack spacing={3}>
                      <FormControl fullWidth size="small">
                          <InputLabel>Reporting Period</InputLabel>
                          <Select value={semesterFilter} label="Reporting Period" onChange={(e) => setSemesterFilter(e.target.value)}>
                              <MenuItem value="1st Semester">1st Semester (Jan-Jun)</MenuItem>
                              <MenuItem value="2nd Semester">2nd Semester (Jul-Dec)</MenuItem>
                          </Select>
                      </FormControl>
                      
                      <FormControl fullWidth size="small">
                          <InputLabel>Target Year</InputLabel>
                          <Select value={yearFilter} label="Target Year" onChange={(e) => setYearFilter(e.target.value)}>
                              <MenuItem value="2025">2025</MenuItem>
                              <MenuItem value="2024">2024</MenuItem>
                          </Select>
                      </FormControl>
                  </Stack>

                  <Box sx={{ mt: 'auto', pt: 4 }}>
                      <Stack spacing={2}>
                          <Button 
                              variant="contained" 
                              fullWidth 
                              startIcon={<Download size={18} />} 
                              sx={{ bgcolor: '#2e0249', fontWeight: 700, borderRadius: 2, py: 1.5 }}
                          >
                              Export as PDF
                          </Button>
                          <Button 
                              variant="outlined" 
                              fullWidth 
                              startIcon={<FileSpreadsheet size={18} />} 
                              sx={{ fontWeight: 700, borderRadius: 2, py: 1.5 }}
                          >
                              Download XLSX
                          </Button>
                      </Stack>
                  </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
      <DetailedReportDialog 
        open={Boolean(selectedReport)} 
        onClose={() => setSelectedReport(null)} 
        category={selectedReport} 
      />
    </Box>
  );
};

export default Reports;