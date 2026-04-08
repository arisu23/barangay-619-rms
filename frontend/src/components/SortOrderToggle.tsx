import React from "react";
import { Button } from "@mui/material";
import { ArrowUpDown } from "lucide-react";

export type SortOrder = "asc" | "desc";

interface SortOrderToggleProps {
  order: SortOrder;
  onToggle: () => void;
  label?: string;
}

const SortOrderToggle: React.FC<SortOrderToggleProps> = ({
  order,
  onToggle,
  label = "Order",
}) => {
  const orderLabel = order === "asc" ? "Ascending" : "Descending";

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={onToggle}
      startIcon={<ArrowUpDown size={16} />}
      sx={{
        textTransform: "none",
        borderRadius: 2,
        fontWeight: 700,
        minWidth: 170,
      }}
    >
      {label}: {orderLabel}
    </Button>
  );
};

export default SortOrderToggle;
