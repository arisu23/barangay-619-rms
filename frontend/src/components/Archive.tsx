import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Paper,
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
  Chip,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from "@mui/material";
import { Search, RotateCcw, UserX, Eye, Calendar } from "lucide-react";
import { archiveService } from "../services/archiveService";
import { notify } from "../utils/notify";
import type {
  ArchivedResident as ArchivedResidentApi,
  ResidentHistoryEntry,
} from "../types";

// --- Mock Archived Data ---
const initialArchivedResidents = [
  {
    id: 101,
    lastName: "Villanueva",
    firstName: "Rico",
    age: 78,
    gender: "Male",
    reason: "Deceased",
    dateArchived: "2024-05-10",
  },
  {
    id: 102,
    lastName: "Santos",
    firstName: "Emily",
    age: 29,
    gender: "Female",
    reason: "Moved Out",
    dateArchived: "2024-08-15",
  },
  {
    id: 103,
    lastName: "Reyes",
    firstName: "Arthur",
    age: 45,
    gender: "Male",
    reason: "Moved Out",
    dateArchived: "2024-11-20",
  },
  {
    id: 104,
    lastName: "Pascual",
    firstName: "Simeon",
    age: 82,
    gender: "Male",
    reason: "Deceased",
    dateArchived: "2025-01-05",
  },
  {
    id: 106,
    lastName: "Mendoza",
    firstName: "Feliza",
    age: 31,
    gender: "Female",
    reason: "Moved Out",
    dateArchived: "2025-02-12",
  },
];

interface ArchivedResidentRow {
  id: number;
  lastName: string;
  firstName: string;
  age?: number;
  gender: string;
  reason: string;
  dateArchived: string;
}

const mapArchivedResident = (
  resident: ArchivedResidentApi,
): ArchivedResidentRow => ({
  id: resident.ResidentID,
  lastName: resident.LastName,
  firstName: resident.FirstName,
  gender: resident.Sex,
  reason: resident.ResidentStatus === "MovedOut" ? "Moved Out" : "Deceased",
  dateArchived: resident.DateofDeath
    ? new Date(resident.DateofDeath).toLocaleDateString("en-CA")
    : "-",
});

const Archive: React.FC = () => {
  const [archivedResidents, setArchivedResidents] = useState<
    ArchivedResidentRow[]
  >(initialArchivedResidents);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [history, setHistory] = useState<ResidentHistoryEntry[]>([]);
  const [residentToRestore, setResidentToRestore] =
    useState<ArchivedResidentRow | null>(null);

  const fetchArchivedResidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await archiveService.getArchivedResidents();
      setArchivedResidents(data.map(mapArchivedResident));
    } catch {
      notify.error("Failed to load archived residents.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchivedResidents();
  }, [fetchArchivedResidents]);

  const handleViewHistory = async (resident: ArchivedResidentRow) => {
    setResidentToRestore(resident);
    setIsHistoryDialogOpen(true);
    setIsHistoryLoading(true);

    try {
      const data = await archiveService.getResidentHistory(resident.id);
      setHistory(data);
    } catch {
      notify.error("Failed to load resident history.");
      setHistory([]);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleConfirmRestore = async () => {
    if (residentToRestore) {
      try {
        const result = await archiveService.restoreResident(
          residentToRestore.id,
        );
        notify.success(result.message || "Resident restored successfully.");
        await fetchArchivedResidents();
        setIsRestoreDialogOpen(false);
        setResidentToRestore(null);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to restore resident.";
        notify.error(message);
      }
    }
  };

  const filteredResidents = archivedResidents.filter((r) => {
    const matchesSearch =
      r.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.firstName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = reasonFilter === "All" || r.reason === reasonFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredResidents.length / rowsPerPage),
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, reasonFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedResidents = filteredResidents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const getStatusColor = (reason: string) => {
    switch (reason) {
      case "Deceased":
        return { bg: "#fee2e2", text: "#991b1b" };
      case "Moved Out":
        return { bg: "#eff6ff", text: "#1e40af" };
      default:
        return { bg: "#f1f5f9", text: "#475569" };
    }
  };

  return (
    <Box sx={{ p: 4, height: "100%", overflowY: "auto", bgcolor: "#f8fafc" }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: "#2e0249", mb: 1 }}
        >
          Archive Records
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Management for deceased or moved out resident records.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          bgcolor: "white",
          width: "100%",
        }}
      >
        {/* Expanded Search and Filter Row */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextField
            placeholder="Search by name..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              maxWidth: 600,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f9fafb",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} className="text-blue-500" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              sx={{ borderRadius: 2, bgcolor: "#fff" }}
              displayEmpty
            >
              <MenuItem value="All">All Categories</MenuItem>
              <MenuItem value="Deceased">Deceased</MenuItem>
              <MenuItem value="Moved Out">Moved Out</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ flex: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: 600 }}
          >
            {filteredResidents.length} Results Found
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          elevation={0}
          variant="outlined"
          sx={{ borderRadius: 3, width: "100%" }}
        >
          <Table stickyHeader sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell
                  sx={{ fontWeight: 700, color: "#374151", width: "30%" }}
                >
                  Full Name
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: "#374151", width: "20%" }}
                >
                  Age/Gender
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: "#374151", width: "20%" }}
                >
                  Archive Reason
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: "#374151", width: "15%" }}
                >
                  Date Archived
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 700, color: "#374151", width: "15%" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">
                      Loading archived residents...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedResidents.map((row) => {
                  const style = getStatusColor(row.reason);
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                        {row.lastName}, {row.firstName}
                      </TableCell>
                      <TableCell sx={{ color: "#64748b" }}>
                        {row.age
                          ? `${row.age} yrs • ${row.gender}`
                          : row.gender}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.reason.toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            borderRadius: 1,
                            bgcolor: style.bg,
                            color: style.text,
                            fontSize: "0.65rem",
                            letterSpacing: "0.05em",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#94a3b8" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Calendar size={14} />
                          {row.dateArchived}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="View History">
                            <IconButton
                              size="small"
                              onClick={() => handleViewHistory(row)}
                              sx={{
                                color: "#6366f1",
                                "&:hover": { bgcolor: "#e0e7ff" },
                              }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Restore to Active">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setResidentToRestore(row);
                                setIsRestoreDialogOpen(true);
                              }}
                              sx={{
                                color: "#10b981",
                                "&:hover": { bgcolor: "#dcfce7" },
                              }}
                            >
                              <RotateCcw size={18} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {!isLoading && filteredResidents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <UserX size={48} className="text-gray-200 mb-2" />
                    <Typography variant="body1" color="text.secondary">
                      No records found matching your filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 2,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <Pagination
            count={totalPages}
            color="primary"
            shape="rounded"
            page={page}
            onChange={(_event, value) => setPage(value)}
          />
        </Box>
      </Paper>

      <Dialog
        open={isRestoreDialogOpen}
        onClose={() => setIsRestoreDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 400 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <RotateCcw size={20} className="text-green-600" />
          Restore Resident Record?
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Are you sure you want to restore{" "}
            <strong>{residentToRestore?.firstName}</strong> to the active list?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setIsRestoreDialogOpen(false)}
            sx={{ color: "#64748b", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmRestore}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
          >
            Confirm Restore
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 560, width: "100%" } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Resident History: {residentToRestore?.lastName},{" "}
          {residentToRestore?.firstName}
        </DialogTitle>
        <DialogContent dividers>
          {isHistoryLoading ? (
            <Typography color="text.secondary">Loading history...</Typography>
          ) : history.length === 0 ? (
            <Typography color="text.secondary">
              No history records found.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {history.map((item) => (
                <Paper
                  key={item.HistoryID}
                  variant="outlined"
                  sx={{ p: 1.5, borderRadius: 2, borderColor: "#e2e8f0" }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: "#1e293b" }}
                  >
                    {item.ChangeType}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {new Date(item.ChangeDate).toLocaleDateString("en-CA")} •{" "}
                    {item.changedBy || "System"}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Archive;
