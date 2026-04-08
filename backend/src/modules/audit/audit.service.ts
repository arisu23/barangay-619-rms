import { AuditTrailRepository } from "./audit.repository.js";

export class AuditTrailService {
  //Get paginated audit logs
  static async getAuditLogs(page: number = 1, limit: number = 50) {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 50;

    //Convert page number to database offset
    const offset = (safePage - 1) * safeLimit;

    //Get logs and total count in parallel (optimization)
    const logs = await AuditTrailRepository.getAll(safeLimit, offset);
    const total = await AuditTrailRepository.getTotalCount();

    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const hasNext = safePage < totalPages;
    const hasPrev = safePage > 1;

    return {
      logs,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  //Search audit logs with filters
  static async searchAuditLogs(filters: {
    userId?: number | undefined;
    action?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
  }) {
    //Require at least one filter to prevent fetching everything
    if (!filters || Object.keys(filters).length === 0) {
      throw {
        status: 400,
        message: "At least one filter is required!",
      };
    }

    return await AuditTrailRepository.search(filters);
  }
}
