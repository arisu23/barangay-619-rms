import React, { useState, useEffect } from "react";
import type { Official } from "../types";
import { dashboardService } from "../services/dashboardService";
import { useBarangayLogo } from "../hooks/useBarangayLogo";

const OfficialsList: React.FC = () => {
  const { logoSrc } = useBarangayLogo();
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const data = await dashboardService.getOfficials();
        setOfficials(data);
      } catch {
        setError("Failed to load officials.");
      } finally {
        setLoading(false);
      }
    };
    fetchOfficials();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      {/* Header Card */}
      <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center space-x-4">
        <img
          src={logoSrc}
          alt="Barangay 619 Logo"
          className="w-12 h-12 drop-shadow-sm rounded-full"
        />
        <div>
          <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
            Barangay 619 Zone 62
          </p>
          <h3 className="font-bold text-gray-800 text-xl">Officials</h3>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {loading && (
          <p className="text-gray-400 text-sm text-center py-4">
            Loading officials...
          </p>
        )}
        {error && (
          <p className="text-red-400 text-sm text-center py-4">{error}</p>
        )}
        {!loading && !error && officials.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">
            No officials found.
          </p>
        )}
        {officials.map((official) => (
          <div
            key={official.OfficialID}
            className="flex flex-col p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-xs text-blue-600 font-bold uppercase mb-1">
              {official.Position}
            </span>
            <h4 className="text-sm font-medium text-gray-800">
              Hon. {official.FirstName} {official.LastName}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficialsList;
