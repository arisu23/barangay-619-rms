import { AuditTrailRepository } from "./audit.repository.js";

export class AuditTrailService {
    //Get paginated audit logs
    static async getAuditLogs(page: number = 1, limit: number = 50) {
        //Convert page number to database offset
        const offset = (page - 1) * limit;
        
        //Get logs and total count in parallel (optimization)
        const logs = await AuditTrailRepository.getAll(limit, offset);
        const total = await AuditTrailRepository.getTotalCount();

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNext,
                hasPrev,
            },
        };
    }

    //Search audit logs with filters
    static async searchAuditLogs(
        filters: {
            userId?: number | undefined;
            action?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            
        }
    ) {
        //Require at least one filter to prevent fetching everything
        if (!filters || Object.keys(filters).length === 0) {
            throw {
                status: 400,
                message: "At least one filter is required!"
            }
        }

        return await AuditTrailRepository.search(filters);
    }
}