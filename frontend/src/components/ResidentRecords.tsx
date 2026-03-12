import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
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
  Tooltip,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Divider,
  Stack,
  Badge,
} from "@mui/material";
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
  UsersRound,
  X,
  Crown,
  UserCheck,
  Info,
  AlertTriangle,
} from "lucide-react";
import AddResidentModal from "./AddResidentModal";
import ResidentProfileModal from "./ResidentProfileModal";
import { residentService } from "../services/residentService";
import { householdService } from "../services/householdService";
import { familyService } from "../services/familyService";
import { notify } from "../utils/notify";
import type {
  ResidentListItem,
  HouseholdListItem,
  FamilyRecord,
} from "../types";

interface ResidentFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  sex: string;
  dateOfBirth?: string;
  birthDate?: string;
  placeOfBirth?: string;
  civilStatus?: string;
  citizenship?: string;
  religion?: string;
  contactNumber?: string;
  email?: string;
  inhabitantType?: string;
  mothersMaidenSurname?: string;
  mothersMaidenFirstName?: string;
  mothersMaidenMiddleName?: string;
  householdId?: string | number;
  unitRoomFloor?: string;
  buildingName?: string;
  lotBlockPhase?: string;
  houseNumber?: string;
  street?: string;
  barangay?: string;
  municipality?: string;
}

// Helper: calculate age from date of birth
const calculateAge = (dateOfBirth?: string): number => {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const filterCategories = [
  "PWD",
  "Solo Parent",
  "Pregnant Woman",
  "OSY",
  "OSC",
  "4Ps",
  "OFW",
  "IP",
];

const ResidentRecords: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [residents, setResidents] = useState<ResidentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [households, setHouseholds] = useState<HouseholdListItem[]>([]);
  const [isHouseholdsLoading, setIsHouseholdsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddHouseholdOpen, setIsAddHouseholdOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isHeadWarningOpen, setIsHeadWarningOpen] = useState(false);
  const [isResidentProfileOpen, setIsResidentProfileOpen] = useState(false);
  const [isFamilyDetailOpen, setIsFamilyDetailOpen] = useState(false);

  const [selectedResident, setSelectedResident] =
    useState<ResidentListItem | null>(null);
  const [residentToArchive, setResidentToArchive] =
    useState<ResidentListItem | null>(null);
  const [archiveStatus, setArchiveStatus] = useState<
    "Deceased" | "Moved Out" | null
  >(null);
  const [preselectedHeadId, setPreselectedHeadId] = useState<
    string | undefined
  >(undefined);

  const [newHouseholdNum, setNewHouseholdNum] = useState("");
  const [newHouseholdStreet, setNewHouseholdStreet] = useState("");

  const [familyAnchorEl, setFamilyAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [activeHousehold, setActiveHousehold] =
    useState<HouseholdListItem | null>(null);
  const [familyRecords, setFamilyRecords] = useState<FamilyRecord[]>([]);
  const [isFamilyLoading, setIsFamilyLoading] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchQuery("");
    setSelectedCategory("All");
  };

  // Fetch residents from API
  const fetchResidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await residentService.getAll();
      setResidents(data);
    } catch {
      notify.error("Failed to load residents.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch households from API
  const fetchHouseholds = useCallback(async () => {
    setIsHouseholdsLoading(true);
    try {
      const data = await householdService.getAll();
      setHouseholds(data);
    } catch {
      notify.error("Failed to load households.");
    } finally {
      setIsHouseholdsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchResidents();
    fetchHouseholds();
  }, [fetchResidents, fetchHouseholds]);

  // Debounced backend search
  useEffect(() => {
    if (activeTab !== 0) return;
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        fetchResidents();
        return;
      }
      setIsLoading(true);
      try {
        const data = await residentService.search({ name: searchQuery });
        setResidents(data);
      } catch {
        notify.error("Search failed.");
      } finally {
        setIsLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, fetchResidents]);

  const handleOpenAddModal = (headId?: string) => {
    setPreselectedHeadId(headId);
    setIsAddModalOpen(true);
  };

  const handleSaveResident = async (
    rawData: Record<string, string | string[]>,
  ) => {
    const data = rawData as unknown as ResidentFormData;
    try {
      const payload = {
        firstName: data.firstName,
        middleName: data.middleName || "",
        lastName: data.lastName,
        suffix: data.suffix || "",
        sex: data.sex,
        dateOfBirth: data.dateOfBirth || data.birthDate || "",
        placeOfBirth: data.placeOfBirth || "",
        civilStatus: data.civilStatus || "",
        citizenship: data.citizenship || "",
        religion: data.religion || "",
        contactNumber: data.contactNumber || "",
        email: data.email || "",
        inhabitantType: data.inhabitantType || "Resident",
        mothersMaidenSurname: data.mothersMaidenSurname || "",
        mothersMaidenFirstName: data.mothersMaidenFirstName || "",
        mothersMaidenMiddleName: data.mothersMaidenMiddleName || "",
        householdId: data.householdId ? Number(data.householdId) : undefined,
        address: {
          unitRoomFloor: data.unitRoomFloor || "",
          buildingName: data.buildingName || "",
          lotBlockPhase: data.lotBlockPhase || "",
          houseNumber: data.houseNumber || "",
          street: data.street || "",
          barangay: data.barangay || "Barangay 619",
          municipality: data.municipality || "Manila",
        },
      };

      await residentService.create(payload);
      notify.success("Resident added successfully!");
      await fetchResidents();
      setIsAddModalOpen(false);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to add resident.";
      notify.error(message);
    }
  };

  const handleOpenArchiveDialog = (resident: ResidentListItem) => {
    setResidentToArchive(resident);
    setArchiveStatus(null);
    setIsArchiveDialogOpen(true);
  };

  const handleConfirmArchive = () => {
    if (residentToArchive && archiveStatus) {
      setResidents(
        residents.filter((r) => r.ResidentID !== residentToArchive.ResidentID),
      );
      setIsArchiveDialogOpen(false);
    }
  };

  const handleAddHousehold = async () => {
    if (!newHouseholdNum.trim()) {
      notify.error("Household number is required.");
      return;
    }
    try {
      await householdService.createNumber({
        householdNumberName: newHouseholdNum,
      });
      notify.success("Household number created successfully!");
      setNewHouseholdNum("");
      setNewHouseholdStreet("");
      setIsAddHouseholdOpen(false);
      await fetchHouseholds();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to create household number.";
      notify.error(message);
    }
  };

  const handleManageFamilyClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
    household: HouseholdListItem,
  ) => {
    setFamilyAnchorEl(event.currentTarget);
    setActiveHousehold(household);
    setIsFamilyLoading(true);
    try {
      const records = await familyService.getByHousehold(household.HouseholdID);
      setFamilyRecords(records);
    } catch {
      notify.error("Failed to load family data.");
      setFamilyRecords([]);
    } finally {
      setIsFamilyLoading(false);
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = (category?: string) => {
    if (typeof category === "string") {
      setSelectedCategory(category);
    }
    setFilterAnchorEl(null);
  };

  const handleViewFamilyDetail = () => {
    setIsFamilyDetailOpen(true);
    setFamilyAnchorEl(null);
  };

  const handleSetNewHead = async (_residentId: number) => {
    if (!activeHousehold) return;

    // Find the current primary head's FamilyHeadID
    const currentHead = familyRecords.find(
      (r) => r.HeadType === "Primary" && r.RelationshipToFamilyHead === null,
    );
    if (!currentHead) {
      notify.error("No current head found.");
      return;
    }

    try {
      await familyService.changeHead(
        activeHousehold.HouseholdID,
        currentHead.FamilyHeadID,
      );
      notify.success("Household head changed successfully!");
      // Refresh family data
      const records = await familyService.getByHousehold(
        activeHousehold.HouseholdID,
      );
      setFamilyRecords(records);
      await fetchHouseholds();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to change head.";
      notify.error(message);
    }
  };

  // Residents are now fetched from API — no client-side name filtering needed
  // Category filtering is deferred to a future phase
  const filteredResidents = residents;

  const filteredHouseholds = households.filter(
    (h) =>
      h.householdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.Street_Alley_Zone.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box
      sx={{
        p: 4,
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f3f4f6",
      }}
    >
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#2e0249", mb: 0.5 }}
          >
            Resident Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your local inhabitants and household registries.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          {activeTab === 1 && user?.role === "Admin" && (
            <Button
              variant="outlined"
              startIcon={<Home size={18} />}
              onClick={() => setIsAddHouseholdOpen(true)}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                px: 3,
                py: 1.2,
                borderColor: "#2e0249",
                color: "#2e0249",
                textTransform: "none",
                "&:hover": { borderColor: "#4a0475", bgcolor: "#f5f3ff" },
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
              borderRadius: 3,
              fontWeight: 700,
              px: 4,
              py: 1.2,
              bgcolor: "#2e0249",
              textTransform: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              "&:hover": { bgcolor: "#4a0475" },
            }}
          >
            Add Resident Record
          </Button>
        </Stack>
      </Box>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "white",
            px: 2,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                minHeight: 64,
                px: 4,
              },
              "& .Mui-selected": { color: "#2e0249" },
              "& .MuiTabs-indicator": { backgroundColor: "#2e0249", height: 3 },
            }}
          >
            <Tab
              icon={<Users size={20} />}
              iconPosition="start"
              label="Resident Registry"
            />
            <Tab
              icon={<Home size={20} />}
              iconPosition="start"
              label="Household Registry"
            />
          </Tabs>
        </Box>

        <Box
          sx={{
            p: 2.5,
            display: "flex",
            gap: 2,
            alignItems: "center",
            bgcolor: "white",
          }}
        >
          <TextField
            placeholder={
              activeTab === 0
                ? "Search resident by name..."
                : "Search household number..."
            }
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: 400,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                bgcolor: "#f9fafb",
              },
            }}
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
                <Badge
                  variant="dot"
                  invisible={selectedCategory === "All"}
                  color="primary"
                >
                  <Filter size={18} />
                </Badge>
              }
              endIcon={<ChevronDown size={14} />}
              sx={{
                borderRadius: 2.5,
                px: 2.5,
                textTransform: "none",
                fontWeight: 600,
                borderColor: selectedCategory === "All" ? "#e5e7eb" : "#2e0249",
                color: selectedCategory === "All" ? "#64748b" : "#2e0249",
                bgcolor: selectedCategory === "All" ? "transparent" : "#f5f3ff",
              }}
            >
              {selectedCategory === "All"
                ? "Filter Options"
                : `Filtering: ${selectedCategory}`}
            </Button>
          )}
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={() => setFilterAnchorEl(null)}
          >
            <MenuItem onClick={() => handleFilterMenuClose("All")}>
              All Residents
            </MenuItem>
            <Divider />
            {filterCategories.map((cat) => (
              <MenuItem key={cat} onClick={() => handleFilterMenuClose(cat)}>
                {cat}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <TableContainer
          sx={{ flex: 1, overflow: "auto", bgcolor: "white" }}
          className="custom-scrollbar"
        >
          {activeTab === 0 ? (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 800 }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 800 }}>
                    FULL NAME
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 800 }}>
                    AGE
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 800 }}>
                    GENDER
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 800 }}>
                    STATUS
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 800 }}>
                    CATEGORIES
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "#f8fafc",
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  >
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Loading residents...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResidents.map((resident) => (
                    <TableRow
                      key={resident.ResidentID}
                      hover
                      onClick={() => {
                        setSelectedResident(resident);
                        setIsResidentProfileOpen(true);
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{resident.ResidentID}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {resident.LastName}, {resident.FirstName}
                      </TableCell>
                      <TableCell>
                        {calculateAge(resident.DateOfBirth)}
                      </TableCell>
                      <TableCell>{resident.Sex}</TableCell>
                      <TableCell>
                        <Chip
                          label={resident.ResidentStatus}
                          size="small"
                          color={
                            resident.ResidentStatus === "Active"
                              ? "success"
                              : "default"
                          }
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                        >
                          {/* Category tags - deferred to future phase */}
                          <Typography variant="caption" color="text.secondary">
                            —
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          <IconButton size="small" color="primary">
                            <Eye size={18} />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenArchiveDialog(resident);
                            }}
                          >
                            <ArchiveIcon size={18} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 800 }}>
                    HOUSEHOLD NO.
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 800 }}>
                    STREET
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 800 }}>
                    FAMILIES
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "#f8fafc",
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  >
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isHouseholdsLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Loading households...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredHouseholds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No households found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHouseholds.map((hh) => (
                    <TableRow key={hh.HouseholdID} hover>
                      <TableCell sx={{ fontWeight: 700, color: "#2e0249" }}>
                        {hh.householdNumber}
                      </TableCell>
                      <TableCell>{hh.Street_Alley_Zone}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${hh.memberCount} Members`}
                          size="small"
                          sx={{ bgcolor: "#f3f4f6", fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<UsersRound size={16} />}
                          onClick={(e) => handleManageFamilyClick(e, hh)}
                          sx={{ textTransform: "none", borderRadius: 2 }}
                        >
                          Manage Families
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e5e7eb",
            bgcolor: "white",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination count={10} color="primary" shape="rounded" />
        </Box>
      </Paper>

      <AddResidentModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveResident}
        initialHeadId={preselectedHeadId}
        householdOptions={households.map((h) => ({
          id: String(h.HouseholdID),
          number: h.householdNumber,
          street: h.Street_Alley_Zone,
        }))}
      />
      <ResidentProfileModal
        open={isResidentProfileOpen}
        onClose={() => {
          setIsResidentProfileOpen(false);
          fetchResidents();
        }}
        residentId={selectedResident?.ResidentID}
        onUpdated={fetchResidents}
      />

      {/* Household Creation Dialog */}
      <Dialog
        open={isAddHouseholdOpen}
        onClose={() => setIsAddHouseholdOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Add New Household Registry
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Household Number"
              value={newHouseholdNum}
              onChange={(e) => setNewHouseholdNum(e.target.value)}
            />
            <TextField
              fullWidth
              label="Street Name"
              value={newHouseholdStreet}
              onChange={(e) => setNewHouseholdStreet(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsAddHouseholdOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddHousehold}
            sx={{ bgcolor: "#2e0249" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Head of Family Archive Warning */}
      <Dialog
        open={isHeadWarningOpen}
        onClose={() => setIsHeadWarningOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1, maxWidth: 450 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            color: "#991b1b",
          }}
        >
          <AlertTriangle size={24} /> Restricted Action
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 700 }}>
            Cannot archive{" "}
            <strong>
              {residentToArchive?.FirstName} {residentToArchive?.LastName}
            </strong>
            .
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This resident is currently designated as a{" "}
            <strong>Head of Family</strong>. You cannot archive a family head
            while there are other members in the family record.
          </Typography>
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "#fff7ed",
              borderRadius: 2,
              border: "1px solid #ffedd5",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#9a3412", fontWeight: 800 }}
            >
              REQUIRED STEP:
            </Typography>
            <Typography variant="body2" sx={{ color: "#9a3412", mt: 0.5 }}>
              Go to the <strong>Household Registry</strong>, find the relevant
              household, and transfer the headship to another active member
              before archiving this record.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setIsHeadWarningOpen(false)}
            sx={{ bgcolor: "#0f172a" }}
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>

      {/* Archive Reason Dialog */}
      <Dialog
        open={isArchiveDialogOpen}
        onClose={() => setIsArchiveDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Archive Resident Record?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Reason for archiving{" "}
            <strong>
              {residentToArchive?.LastName}, {residentToArchive?.FirstName}
            </strong>
            :
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant={archiveStatus === "Deceased" ? "contained" : "outlined"}
              color="error"
              startIcon={<Skull size={18} />}
              onClick={() => setArchiveStatus("Deceased")}
            >
              Deceased
            </Button>
            <Button
              fullWidth
              variant={archiveStatus === "Moved Out" ? "contained" : "outlined"}
              color="info"
              startIcon={<PlaneTakeoff size={18} />}
              onClick={() => setArchiveStatus("Moved Out")}
            >
              Moved Out
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsArchiveDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={!archiveStatus}
            onClick={handleConfirmArchive}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Families Context Menu */}
      <Menu
        anchorEl={familyAnchorEl}
        open={Boolean(familyAnchorEl)}
        onClose={() => setFamilyAnchorEl(null)}
      >
        {isFamilyLoading ? (
          <MenuItem disabled sx={{ py: 1.5 }}>
            Loading...
          </MenuItem>
        ) : familyRecords.length === 0 ? (
          <MenuItem disabled sx={{ py: 1.5 }}>
            No family records
          </MenuItem>
        ) : (
          <MenuItem onClick={handleViewFamilyDetail} sx={{ py: 1.5 }}>
            <UsersRound size={16} style={{ marginRight: 8 }} />
            View Family Members ({familyRecords.length} records)
          </MenuItem>
        )}
      </Menu>

      {/* Family Detail Dialog */}
      <Dialog
        open={isFamilyDetailOpen}
        onClose={() => setIsFamilyDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            borderBottom: "1px solid #f3f4f6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <UsersRound size={24} className="text-indigo-600" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Family Detail: {activeHousehold?.householdNumber}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => setIsFamilyDetailOpen(false)}
              size="small"
            >
              <X size={20} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <TableContainer sx={{ maxHeight: "60vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, bgcolor: "#f8fafc" }}>
                    NAME
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, bgcolor: "#f8fafc" }}>
                    ROLE
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, bgcolor: "#f8fafc" }}>
                    AGE
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 800, bgcolor: "#f8fafc" }}
                  >
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {familyRecords.map((m) => {
                  const role =
                    m.RelationshipToFamilyHead === null
                      ? `Head (${m.HeadType})`
                      : m.RelationshipToFamilyHead;
                  const isHead = m.RelationshipToFamilyHead === null;
                  const isPrimary = isHead && m.HeadType === "Primary";
                  return (
                    <TableRow key={`${m.FamilyHeadID}-${m.ResidentID}`} hover>
                      <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {isPrimary && (
                            <Crown size={14} className="text-amber-500" />
                          )}
                          {m.FirstName} {m.LastName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={role}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            bgcolor: isPrimary
                              ? "#fef3c7"
                              : isHead
                                ? "#e0f2fe"
                                : "#f3f4f6",
                            color: isPrimary
                              ? "#92400e"
                              : isHead
                                ? "#0369a1"
                                : "#64748b",
                          }}
                        />
                      </TableCell>
                      <TableCell>{calculateAge(m.DateOfBirth)}</TableCell>
                      <TableCell align="center">
                        {!isHead && familyRecords.length > 1 ? (
                          <Tooltip title="Set as Head of Family">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleSetNewHead(m.ResidentID)}
                              sx={{ "&:hover": { bgcolor: "#eff6ff" } }}
                            >
                              <UserCheck size={18} />
                            </IconButton>
                          </Tooltip>
                        ) : isPrimary ? (
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 800, color: "#92400e" }}
                          >
                            Current Head
                          </Typography>
                        ) : isHead ? (
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, color: "#0369a1" }}
                          >
                            Secondary Head
                          </Typography>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {familyRecords.length > 1 && (
            <Box
              sx={{ p: 2, bgcolor: "#fffbeb", borderTop: "1px solid #fef3c7" }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#92400e",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Info size={14} /> Click the checkmark icon to transfer
                headship. The system will automatically assign the next oldest
                active member.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ResidentRecords;
