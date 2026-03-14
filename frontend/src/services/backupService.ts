import api from "./api";
import type { BackupLog } from "../types";

export const backupService = {
  async createBackup(): Promise<{
    backupId: number;
    fileName: string;
    filePath: string;
  }> {
    const response = await api.post("/backup");
    return response.data.data;
  },

  async getLogs(): Promise<BackupLog[]> {
    const response = await api.get("/backup");
    return response.data.data;
  },

  async restoreBackup(
    file: File,
  ): Promise<{ backupId: number; message: string }> {
    const formData = new FormData();
    formData.append("backupFile", file);

    const response = await api.post("/backup/restore", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },

  async downloadBackup(backupId: number): Promise<Blob> {
    const response = await api.get(`/backup/${backupId}/download`, {
      responseType: "blob",
    });

    return response.data as Blob;
  },
};
