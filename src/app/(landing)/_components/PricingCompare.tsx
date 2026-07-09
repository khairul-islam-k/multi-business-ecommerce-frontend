import { Fragment } from "react";
import { Check, Minus } from "lucide-react";

type Row = {
  feature: string;
  values: (boolean | string)[];
};

const plans = ["Starter", "Growth", "Business", "Scale"];

const groups: { title: string; rows: Row[] }[] = [
  {
    title: "Core platform",
    rows: [
      { feature: "Stores included", values: ["1", "3", "10", "Unlimited"] },
      {
        feature: "Monthly orders",
        values: ["500", "5,000", "25,000", "Unlimited"],
      },
      {
        feature: "Sales channels",
        values: ["2", "All", "All + WhatsApp API", "All + Custom"],
      },
      { feature: "Team members", values: ["2", "10", "25", "Unlimited"] },
    ],
  },
  {
    title: "AI & automation",
    rows: [
      { feature: "AI inbox replies", values: [true, true, true, true] },
      { feature: "Advanced AI training", values: [false, true, true, true] },
      { feature: "Custom AI models", values: [false, false, true, true] },
      { feature: "Marketing automation", values: [false, true, true, true] },
      { feature: "Abandoned-cart flows", values: [false, true, true, true] },
    ],
  },
  {
    title: "Integrations & data",
    rows: [
      { feature: "Native integrations", values: [true, true, true, true] },
      { feature: "API & webhook access", values: [false, false, true, true] },
      { feature: "Custom integrations", values: [false, false, false, true] },
      {
        feature: "Data export",
        values: ["CSV", "CSV", "CSV + API", "CSV + API"],
      },
    ],
  },
  {
    title: "Support & security",
    rows: [
      { feature: "Email support", values: [true, true, true, true] },
      { feature: "Priority support", values: [false, true, true, true] },
      {
        feature: "Dedicated success manager",
        values: [false, false, true, true],
      },
      { feature: "SLA & onboarding", values: [false, false, false, true] },
      { feature: "Single sign-on (SSO)", values: [false, false, false, true] },
      { feature: "24/7 premium support", values: [false, false, false, true] },
    ],
  },
];

const Cell = ({
  value,
  featured,
}: {
  value: boolean | string;
  featured?: boolean;
}) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check
        className={`h-5 w-5 mx-auto ${featured ? "text-primary" : "text-foreground"}`}
        strokeWidth={3}
      />
    ) : (
      <Minus className="h-5 w-5 mx-auto text-muted-foreground/40" />
    );
  }
  return (
    <span
      className={`text-sm ${featured ? "font-semibold text-foreground" : "text-foreground/80"}`}
    >
      {value}
    </span>
  );
};

export const PricingCompare = () => {
  return (
    <section className="py-20 sm:py-28 bg-accent/30">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            Compare plans
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Everything in <span className="text-gradient">every plan</span>,
            side by side.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Compare features across all plans to find the perfect fit for your
            business.
          </p>
        </div>

        <div className="mt-14 max-w-6xl mx-auto rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="p-5 font-display text-sm font-bold w-[34%]">
                    Features
                  </th>
                  {plans.map((p, i) => (
                    <th
                      key={p}
                      className={`p-5 text-center font-display text-sm font-bold ${
                        i === 1 ? "text-primary" : ""
                      }`}
                    >
                      {p}
                      {i === 1 && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <Fragment key={g.title}>
                    <tr className="bg-muted/40">
                      <td
                        colSpan={5}
                        className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        {g.title}
                      </td>
                    </tr>
                    {g.rows.map((row) => (
                      <tr
                        key={row.feature}
                        className="border-t border-border/60 hover:bg-accent/20"
                      >
                        <td className="p-4 text-sm font-medium">
                          {row.feature}
                        </td>
                        {row.values.map((v, i) => (
                          <td
                            key={i}
                            className={`p-4 text-center ${i === 1 ? "bg-primary/5" : ""}`}
                          >
                            <Cell value={v} featured={i === 1} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
