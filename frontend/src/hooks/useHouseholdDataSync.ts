import { useEffect } from "react";

export const HOUSEHOLD_DATA_UPDATED_EVENT = "household-data-updated";

export const broadcastHouseholdDataUpdated = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(HOUSEHOLD_DATA_UPDATED_EVENT));
};

export const useHouseholdDataRefresh = (
  onRefresh: () => void | Promise<void>,
) => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleHouseholdUpdate = () => {
      void onRefresh();
    };

    window.addEventListener(
      HOUSEHOLD_DATA_UPDATED_EVENT,
      handleHouseholdUpdate,
    );

    return () => {
      window.removeEventListener(
        HOUSEHOLD_DATA_UPDATED_EVENT,
        handleHouseholdUpdate,
      );
    };
  }, [onRefresh]);
};
