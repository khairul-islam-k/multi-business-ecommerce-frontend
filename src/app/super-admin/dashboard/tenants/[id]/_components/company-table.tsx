import TableWrapper from "./table-wrapper";
import { mockCompanyData } from "../data";

const columns = [
  {
    title: "COMPANY",
    dataIndex: "company",
    render: (text: string) => <strong>{text}</strong>,
  },
  { title: "WEBSITES", dataIndex: "websites" },
  { title: "USERS", dataIndex: "users" },
];

export default function CompanyTable() {
  return <TableWrapper data={mockCompanyData} columns={columns} />;
}
