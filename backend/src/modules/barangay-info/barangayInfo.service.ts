import { BarangayInfoRepository } from "./barangayInfo.repository.js";
import { AuditTrailRepository } from "../audit/audit.repository.js";

export class BarangayInfoService {

    //Get barangay info
    static async getInfo() {
        const info = await BarangayInfoRepository.get();
        if (!info) {
            throw { status: 404, message: "Barangay info not configured yet!" };
        }
        return info;
    }

    //Update barangay info
    static async updateInfo(
        data: {
            phoneNum: string | null;
            telNum: string | null;
            emailAd: string | null;
            barangayAddress: string | null;
        },
        userId: number
    ) {
        const oldInfo = await BarangayInfoRepository.get();

        await BarangayInfoRepository.upsert(data);

        //Audit log
        await AuditTrailRepository.log({
            userId,
            action: "UPDATE_BARANGAY_INFO",
            oldValue: oldInfo ? JSON.stringify(oldInfo) : undefined,
            newValue: JSON.stringify(data)
        });

        return true;
    }
}