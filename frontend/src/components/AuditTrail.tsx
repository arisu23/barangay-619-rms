
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  IconButton,
  Popover,
  TextField,
  Typography,
  FormControl,
  InputAdornment,
  Pagination
} from '@mui/material';
import { 
  Calendar, 
  Search, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

// Mock Data
const auditLogs = [
  { id: 58, user: 'Admin123', date: '2025-11-20', timestamp: '08:30 AM', action: 'Add', oldRecord: '1234', newRecord: 'Add a new resident' },
  { id: 59, user: 'Staff222', date: '2025-11-21', timestamp: '09:15 AM', action: 'Log In', oldRecord: '2222', newRecord: 'Log In' },
  { id: 60, user: 'Staff222', date: '2025-11-21', timestamp: '05:00 PM', action: 'Log Out', oldRecord: '2222', newRecord: 'Log Out' },
  { id: 61, user: 'Staff789', date: '2025-11-22', timestamp: '08:00 AM', action: 'Log In', oldRecord: '6789', newRecord: 'Log In' },
  { id: 62, user: 'Staff789', date: '2025-11-22', timestamp: '09:45 AM', action: 'Add', oldRecord: '6789', newRecord: 'Add' },
  { id: 63, user: 'Staff789', date: '2025-11-22', timestamp: '10:30 AM', action: 'Edit', oldRecord: '6789', newRecord: 'Edit' },
  { id: 64, user: 'Staff789', date: '2025-11-22', timestamp: '11:00 AM', action: 'Update', oldRecord: '6789', newRecord: 'Update' },
  { id: 65, user: 'Staff789', date: '2025-11-22', timestamp: '02:00 PM', action: 'Download PDF', oldRecord: '6789', newRecord: 'Download PDF' },
  { id: 66, user: 'Staff789', date: '2025-11-22', timestamp: '03:30 PM', action: 'Add', oldRecord: '6789', newRecord: 'Add' },
  { id: 67, user: 'Admin123', date: '2025-11-22', timestamp: '04:00 PM', action: 'Download CSV', oldRecord: '1234', newRecord: 'Download CSV' },
  { id: 68, user: 'Admin123', date: '2025-11-23', timestamp: '08:00 AM', action: 'Edit', oldRecord: '1234', newRecord: 'Edit' },
  { id: 69, user: 'Staff678', date: '2025-11-23', timestamp: '08:15 AM', action: 'Update', oldRecord: '6789', newRecord: 'Update' },
  { id: 70, user: 'Admin123', date: '2025-11-23', timestamp: '05:00 PM', action: 'Log Out', oldRecord: '1234', newRecord: 'Log Out' },
];

// --- Custom Calendar Component ---
interface CustomCalendarProps {
  initialStart: Date | null;
  initialEnd: Date | null;
  onApply: (start: Date | null, end: Date | null) => void;
  onClose: () => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ initialStart, initialEnd, onApply, onClose }) => {
  // Default view to November 2025 as per mock data/screenshot
  const [viewDate, setViewDate] = useState(new Date(2025, 10, 1)); 
  const [start, setStart] = useState<Date | null>(initialStart);
  const [end, setEnd] = useState<Date | null>(initialEnd);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    // 0 = Sun, 1 = Mon ... 6 = Sat. We want Mon=0, Sun=6
    let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isSameDate = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getDate() === d2.getDate();
  };

  const isBetween = (date: Date, d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    const target = date.getTime();
    const startT = d1.getTime();
    const endT = d2.getTime();
    return target > Math.min(startT, endT) && target < Math.max(startT, endT);
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    
    let newStart = start;
    let newEnd = end;

    if (!start || (start && end)) {
        newStart = clickedDate;
        newEnd = null;
    } else {
        if (clickedDate < start) {
            newEnd = start;
            newStart = clickedDate;
        } else {
            newEnd = clickedDate;
        }
    }

    setStart(newStart);
    setEnd(newEnd);
    
    // Auto-apply selection for immediate feedback
    onApply(newStart, newEnd);
  };

  const handleReset = () => {
      setStart(null);
      setEnd(null);
      onApply(null, null);
  };

  const renderDays = () => {
    const totalDays = getDaysInMonth(viewDate);
    const startOffset = getFirstDayOfMonth(viewDate);
    const days = [];

    // Empty cells for offset
    for (let i = 0; i < startOffset; i++) {
      days.push(<Box key={`empty-${i}`} sx={{ width: 36, height: 36 }} />);
    }

    // Days
    for (let d = 1; d <= totalDays; d++) {
      const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const isStart = isSameDate(currentDate, start);
      const isEnd = isSameDate(currentDate, end);
      const inRange = isBetween(currentDate, start, end);
      
      let bgcolor = 'transparent';
      let color = '#374151';
      
      if (isStart || isEnd) {
          bgcolor = '#6366f1'; // Indigo 500
          color = 'white';
      } else if (inRange) {
          bgcolor = '#c7d2fe'; // Indigo 200 (lighter)
          color = '#374151';
      }

      // Visual tweaks for connecting the range
      const isRangeStart = isStart && end;
      const isRangeEnd = isEnd && start;

      days.push(
        <Box 
            key={d} 
            onClick={() => handleDayClick(d)}
            sx={{ 
                width: 36, 
                height: 36, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1,
            }}
        >
            {/* Background for range connectivity */}
            {inRange && <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#c7d2fe' }} />}
            {isRangeStart && <Box sx={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: '50%', bgcolor: '#c7d2fe', zIndex: -1 }} />}
            {isRangeEnd && <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: '50%', bgcolor: '#c7d2fe', zIndex: -1 }} />}

            {/* The Circle */}
            <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                bgcolor: (isStart || isEnd) ? '#4f46e5' : 'transparent',
                color: color,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: (isStart || isEnd) ? 'bold' : 'normal',
                '&:hover': {
                    bgcolor: (isStart || isEnd) ? '#4338ca' : '#f3f4f6'
                }
            }}>
                {d}
            </Box>
        </Box>
      );
    }
    return days;
  };

  return (
    <Box sx={{ p: 2, width: 320 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
                {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Typography>
            <Box>
                <IconButton size="small" onClick={handlePrevMonth}><ChevronLeft size={16} /></IconButton>
                <IconButton size="small" onClick={handleNextMonth}><ChevronRight size={16} /></IconButton>
            </Box>
        </Box>

        {/* Days of Week */}
        <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between' }}>
            {daysOfWeek.map(day => (
                <Typography key={day} variant="caption" sx={{ width: 36, textAlign: 'center', color: '#6b7280', fontWeight: 'bold' }}>
                    {day}
                </Typography>
            ))}
        </Box>

        {/* Grid */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 0.5, justifyContent: 'flex-start' }}>
            {renderDays()}
        </Box>

        {/* Footer Actions - Reset moved to right, Apply removed */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
            <Button 
                onClick={handleReset}
                sx={{ textTransform: 'none', color: '#1f2937', fontWeight: 'bold' }}
            >
                Reset
            </Button>
        </Box>
    </Box>
  );
};

// --- Main Component ---

const AuditTrail: React.FC = () => {
    const [userFilter, setUserFilter] = useState('All Users');
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    
    // Date Range State (Date objects)
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleClickCalendar = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseCalendar = () => {
        setAnchorEl(null);
    };

    const handleApplyDateRange = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);
        // Do not close automatically so user can select range interactively
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
    };

    const openCalendar = Boolean(anchorEl);

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Page Title & Subtitle */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#2e0249', mb: 1 }}>
                    System Logs
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Monitor and track all user activities, record updates, and system events.
                </Typography>
            </Box>

            {/* Header / Filter Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                
                {/* Left Side Filters */}
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                    
                    {/* Date Range Picker Button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight="600">Date Range:</Typography>
                        <IconButton 
                            onClick={handleClickCalendar}
                            sx={{ 
                                bgcolor: 'white', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: 2,
                                width: 40,
                                height: 40,
                                '&:hover': { bgcolor: '#f9fafb' }
                            }}
                        >
                            <Calendar size={20} className="text-gray-600" />
                        </IconButton>
                        
                        {/* Display Selected Date Range Text */}
                        {(startDate || endDate) && (
                            <Typography variant="body2" fontWeight="bold" color="primary">
                                {formatDate(startDate) || '...'} <span style={{ color: '#9ca3af' }}>to</span> {formatDate(endDate) || '...'}
                            </Typography>
                        )}

                        {/* Custom Calendar Popover */}
                        <Popover
                            open={openCalendar}
                            anchorEl={anchorEl}
                            onClose={handleCloseCalendar}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } }}
                        >
                            <CustomCalendar 
                                initialStart={startDate}
                                initialEnd={endDate}
                                onApply={handleApplyDateRange}
                                onClose={handleCloseCalendar}
                            />
                        </Popover>
                    </Box>

                    {/* User Filter */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                         <Typography variant="body2" color="text.secondary" fontWeight="600">User:</Typography>
                         <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                                value={userFilter}
                                onChange={(e) => setUserFilter(e.target.value)}
                                displayEmpty
                                sx={{ bgcolor: 'white', borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' } }}
                                renderValue={(selected) => {
                                    if (!selected || selected === 'All Users') {
                                        return <Typography color="text.secondary">All Users</Typography>;
                                    }
                                    return selected;
                                }}
                            >
                                <MenuItem value="All Users">All Users</MenuItem>
                                <MenuItem value="Staff">Staff</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                            </Select>
                         </FormControl>
                    </Box>
                    
                    {/* Search Field (Replaced Button) */}
                    <TextField
                        placeholder="Search logs..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ 
                            width: 250, 
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': { borderRadius: 2 } 
                        }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Search size={18} className="text-gray-400" />
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />
                </Box>
                
                {/* Reset Button (Moved to Right Side, Export Removed) */}
                <Button 
                    variant="contained" 
                    sx={{ 
                        bgcolor: '#0f172a', 
                        color: 'white', 
                        fontWeight: 'bold', 
                        textTransform: 'none', 
                        borderRadius: 2, 
                        '&:hover': { bgcolor: '#1e293b' } 
                    }}
                    onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                        setUserFilter('All Users');
                        setSearchQuery('');
                    }}
                >
                    Reset
                </Button>
            </Box>

            {/* Table Section */}
            <Paper elevation={0} sx={{ flex: 1, overflow: 'hidden', border: '1px solid #e0e0e0', borderRadius: 3, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
                 <TableContainer sx={{ flex: 1, overflow: 'auto' }} className="custom-scrollbar">
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#f3f4f6', fontWeight: 'bold', color: '#374151' }}>Id</TableCell>
                                <TableCell sx={{ backgroundColor: '#f3f4f6', fontWeight: 'bold', color: '#374151' }}>User</TableCell>
                                <TableCell sx={{ backgroundColor: '#f3f4f6', fontWeight: 'bold', color: '#374151' }}>Date</TableCell>
                                <TableCell sx={{ backgroundColor: '#f3f4f6', fontWeight: 'bold', color: '#374151' }}>Timestamp</TableCell>
                                <TableCell sx={{ backgroundColor: '#f3f4f6', fontWeight: 'bold', color: '#374151' }}>Action</TableCell>
                                <TableCell sx={{ backgroundColor: '#f3f4f6', fontWeight: 'bold', color: '#374151' }}>Old Record</TableCell>
                                <TableCell sx={{ backgroundColor: '#f3f4f6', fontWeight: 'bold', color: '#374151' }}>New Record</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {auditLogs.filter(log => {
                                // Basic client-side filtering logic
                                if (userFilter !== 'All Users' && !log.user.includes(userFilter)) return false;
                                if (searchQuery && !Object.values(log).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase()))) return false;
                                
                                // Date Range Filter
                                if (startDate) {
                                    const logDate = new Date(log.date);
                                    if (logDate < startDate) return false;
                                }
                                if (endDate) {
                                    const logDate = new Date(log.date);
                                    if (logDate > endDate) return false;
                                }

                                return true;
                            }).map((log) => (
                                <TableRow key={log.id} hover>
                                    <TableCell>{log.id}</TableCell>
                                    <TableCell>{log.user}</TableCell>
                                    <TableCell>{log.date}</TableCell>
                                    <TableCell>{log.timestamp}</TableCell>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell>{log.oldRecord}</TableCell>
                                    <TableCell>{log.newRecord}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </TableContainer>
                 
                 {/* Pagination - Matching Resident Records Style */}
                 <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, borderTop: '1px solid #f3f4f6' }}>
                    <Pagination count={Math.ceil(auditLogs.length / 10)} color="primary" shape="rounded" />
                 </Box>
            </Paper>
        </Box>
    );
};

export default AuditTrail;
