import StatisticCard from "@/components/super-admin/statistic-card";

export default function HomePage() {
  return (
    <div className="centered">
      <StatisticCard
        statistic={{
          label: "Revenue",
          value: "$12,430",
          change: "+12%",
          up: false,
        }}
      />
    </div>
  );
}
