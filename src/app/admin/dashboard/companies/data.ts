import { Company } from "./types";

export const mockCompanies: Company[] = [
  {
    id: "CMP-1001",
    companyName: "TechNova Solutions",
    industry: "Software",
    employees: "120",
    plan: "Pro",
    status: "Active",
    description: "A SaaS company building modern cloud solutions.",
  },
  {
    id: "CMP-1002",
    companyName: "GreenFields Agro",
    industry: "Agriculture",
    employees: "85",
    plan: "Basic",
    status: "Trial",
    description: "Focused on sustainable agriculture and farming tech.",
  },
  {
    id: "CMP-1003",
    companyName: "UrbanBuild Co.",
    industry: "Construction",
    employees: "230",
    plan: "Enterprise",
    status: "Active",
    description: "Large scale infrastructure and urban development.",
  },
  {
    id: "CMP-1004",
    companyName: "HealthFirst",
    industry: "Healthcare",
    employees: "150",
    plan: "Pro",
    status: "Inactive",
    description: "Private healthcare services and clinics.",
  },
  {
    id: "CMP-1005",
    companyName: "EduSmart",
    industry: "Education",
    employees: "60",
    plan: "Basic",
    status: "Trial",
    description: "EdTech platform for online learning.",
  },
];
