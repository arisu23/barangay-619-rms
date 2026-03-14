import { ReportRepository } from "./report.repository.js";

export class ReportService {
  //Get demographics summary (all 8 stat cards + chart data)
  static async getDemographicsSummary() {
    const [
      inhabitants,
      households,
      families,
      voters,
      seniors,
      pwd,
      soloParent,
      indigent,
      ageGroups,
      employment,
    ] = await Promise.all([
      ReportRepository.getTotalInhabitants(),
      ReportRepository.getTotalHouseholds(),
      ReportRepository.getTotalFamilies(),
      ReportRepository.getRegisteredVoters(),
      ReportRepository.getSeniorCitizens(),
      ReportRepository.getCategoryCount("PWD"),
      ReportRepository.getCategoryCount("Solo Parent"),
      ReportRepository.getCategoryCount("4Ps"),
      ReportRepository.getAgeGroupDistribution(),
      ReportRepository.getEmploymentBreakdown(),
    ]);

    return {
      stats: {
        inhabitants,
        households,
        families,
        voters,
        seniors,
        pwd,
        soloParent,
        indigent,
      },
      charts: {
        ageGroups,
        employment,
      },
    };
  }

  //Get detailed resident list by category
  static async getDemographicsByCategory(
    category: string,
    search: string = "",
    page: number = 1,
    limit: number = 10,
  ) {
    return ReportRepository.getResidentsByCategory(
      category,
      search,
      page,
      limit,
    );
  }

  //Get RBI Form A data
  static async getFormAData(householdId?: number) {
    return ReportRepository.getFormAData(householdId);
  }

  //Get RBI Form C data
  static async getFormCData() {
    return ReportRepository.getFormCData();
  }
}
