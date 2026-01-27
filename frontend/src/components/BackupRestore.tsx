
import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Alert,
} from '@mui/material';
import { 
  CloudUpload, 
  RotateCcw, 
  Search, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  X,
  History,
  Download
} from 'lucide-react';

interface BackupLog {
  id: string;
  fileName: string;
  dateTime: string;
  status: 'Success' | 'Failed';
  filePath: string;
  type: 'Backup' | 'Restore';
}

const mockBackupLogs: BackupLog[] = [
  { id: '1', fileName: 'BRMS_FULL_20251101.bak', dateTime: '2025-11-01 08:30 AM', status: 'Success', filePath: 'E:/Backups/BRMS/', type: 'Backup' },
  { id: '2', fileName: 'BRMS_SYSTEM_20251105.bak', dateTime: '2025-11-05 02:15 PM', status: 'Success', filePath: 'D:/ExternalDrive/BRMS/', type: 'Backup' },
  { id: '3', fileName: 'BRMS_FULL_20251110.bak', dateTime: '2025-11-10 11:00 AM', status: 'Failed', filePath: 'E:/Backups/BRMS/', type: 'Restore' },
  { id: '4', fileName: 'BRMS_MANUAL_20251115.bak', dateTime: '2025-11-15 04:45 PM', status: 'Success', filePath: 'F:/BRMS_Recovery/', type: 'Backup' },
];

const BackupRestore: React.FC = () => {
  const [logs, setLogs] = useState<BackupLog[]>(mockBackupLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeAction, setActiveAction] = useState<'backup' | 'restore' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartBackup = () => {
    setIsBackupDialogOpen(false);
    setActiveAction('backup');
    setIsProgressDialogOpen(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finishAction('backup');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.bak')) {
        setErrorMessage('Invalid file type. Please select a .bak backup file.');
        return;
      }
      setIsRestoreDialogOpen(true);
    }
  };

  const handleStartRestore = () => {
    setIsRestoreDialogOpen(false);
    setActiveAction('restore');
    setIsProgressDialogOpen(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finishAction('restore');
          return 100;
        }
        return prev + 8;
      });
    }, 120);
  };

  const finishAction = (type: 'backup' | 'restore') => {
    setTimeout(() => {
      setIsProgressDialogOpen(false);
      const now = new Date();
      const timestamp = now.toLocaleString();
      const newLog: BackupLog = {
        id: Date.now().toString(),
        fileName: `BRMS_${type.toUpperCase()}_${now.toISOString().slice(0, 10).replace(/-/g, '')}.bak`,
        dateTime: timestamp,
        status: 'Success',
        filePath: type === 'backup' ? 'E:/Backups/BRMS/' : 'System Recovery',
        type: type === 'backup' ? 'Backup' : 'Restore'
      };
      setLogs([newLog, ...logs]);
      setSuccessMessage(`${type === 'backup' ? 'Backup created' : 'System restored'} successfully!`);
    }, 500);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.fileName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.filePath.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 4, height: '100%', overflowY: 'auto', bgcolor: '#f8fafc' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2e0249', mb: 1 }}>
          Backup & Restore
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Secure and recover your system data.
        </Typography>
      </Box>

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(null)} sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Action Cards - Spread to occupy horizontal space */}
      <Grid container spacing={3} sx={{ mb: 5, width: '100%' }}>
        {/* Fix: Replaced 'item' and 'xs'/'md' with 'size' prop for Grid2 compatibility */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              width: '100%', // Maximize width
              borderRadius: 4, 
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }
            }}
          >
            <Box sx={{ p: 3, borderRadius: 3, bgcolor: '#eff6ff', color: '#3b82f6' }}>
              <Database size={48} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>Full System Backup</Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5, lineHeight: 1.6 }}>Create a manual snapshot of all resident records and system data to an external drive for safety.</Typography>
              <Button 
                variant="contained" 
                startIcon={<Download size={18} />}
                onClick={() => setIsBackupDialogOpen(true)}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800, px: 4, py: 1 }}
              >
                Generate Backup
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Fix: Replaced 'item' and 'xs'/'md' with 'size' prop for Grid2 compatibility */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              width: '100%', // Maximize width
              borderRadius: 4, 
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }
            }}
          >
            <Box sx={{ p: 3, borderRadius: 3, bgcolor: '#fef2f2', color: '#ef4444' }}>
              <RotateCcw size={48} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>Restore from File</Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5, lineHeight: 1.6 }}>Recover your system to a previous state using a valid backup file (.bak) from your storage.</Typography>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<CloudUpload size={18} />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800, px: 4, py: 1, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
              >
                Upload & Restore
              </Button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".bak" onChange={handleFileSelect} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* History Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
            <History size={24} className="text-gray-400" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Operation Logs</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField 
              placeholder="Search by filename..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 320, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, ml: 0.5 }}>Status</Typography>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ borderRadius: 2, bgcolor: 'white' }}
                  >
                    <MenuItem value="All">All Status</MenuItem>
                    <MenuItem value="Success">Success</MenuItem>
                    <MenuItem value="Failed">Failed</MenuItem>
                  </Select>
                </FormControl>
            </Box>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                <TableCell sx={{ fontWeight: 700, borderRadius: '12px 0 0 0' }}>File Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, borderRadius: '0 12px 0 0' }}>Storage Path</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileText size={18} className="text-blue-500" />
                      {log.fileName}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{log.dateTime}</TableCell>
                  <TableCell>
                    <Chip label={log.type} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1.5, borderColor: log.type === 'Backup' ? '#3b82f6' : '#ec4899', color: log.type === 'Backup' ? '#3b82f6' : '#ec4899' }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={log.status} size="small" sx={{ fontWeight: 700, borderRadius: 1.5, bgcolor: log.status === 'Success' ? '#dcfce7' : '#fee2e2', color: log.status === 'Success' ? '#166534' : '#991b1b' }} />
                  </TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.875rem' }}>{log.filePath}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialogs */}
      <Dialog open={isBackupDialogOpen} onClose={() => setIsBackupDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Backup?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748b' }}>This will package all current resident data into a backup file.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setIsBackupDialogOpen(false)} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleStartBackup} sx={{ fontWeight: 700, borderRadius: 2 }}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isRestoreDialogOpen} onClose={() => setIsRestoreDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#ef4444' }}>Confirm Restoration?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748b', mb: 2 }}>Warning: This will overwrite all existing data.</Typography>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>Please ensure you have a backup.</Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setIsRestoreDialogOpen(false)} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleStartRestore} sx={{ fontWeight: 700, borderRadius: 2 }}>Restore Now</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isProgressDialogOpen} PaperProps={{ sx: { borderRadius: 3, width: 400, p: 3 } }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Processing...</Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 12, borderRadius: 6, mb: 2, bgcolor: '#f1f5f9' }} />
          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>{progress}% Complete</Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default BackupRestore;
