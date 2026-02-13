import { DashboardRepository } from "./dashboard.repository.js";

export class DashboardService {

    //Get all dashboard statistics in one call
    static async getDashboardStats() {

        //Fetch all stats in parallel for performance
        const [
            totalPopulation,
            registeredVoters,
            gender,
            totalHouseholds,
            totalFamilies,
            ageClassification,
            pwdCount,
            employment,
            newResidents,
            movedOut,
            deceased
        ] = await Promise.all([
            DashboardRepository.getTotalPopulation(),
            DashboardRepository.getRegisteredVoters(),
            DashboardRepository.getGenderCount(),
            DashboardRepository.getTotalHouseholds(),
            DashboardRepository.getTotalFamilies(),
            DashboardRepository.getAgeClassification(),
            DashboardRepository.getPWDCount(),
            DashboardRepository.getEmploymentCount(),
            DashboardRepository.getNewResidents(),
            DashboardRepository.getMovedOutResidents(),
            DashboardRepository.getDeceasedResidents()
        ]);

        return {
            //Stat cards (matches frontend StatData array order)
            stats: {
                totalPopulation,
                registeredVoters,
                male: gender.male,
                female: gender.female,
                totalHouseholds,
                totalFamilies
            },

            //Pie chart data (matches frontend chartData array)
            classification: {
                children: ageClassification.children,
                youth: ageClassification.youth,
                seniorCitizen: ageClassification.seniorCitizen,
                pwd: pwdCount,
                employed: employment.employed,
                unemployed: employment.unemployed
            },

            //Log cards (matches frontend logData array)
            logs: {
                newResidents,
                movedOut,
                deceased
            }
        };
    }
}