const logos = [
  "Lumio",
  "Zentro",
  "Nordica",
  "Pulse&Co",
  "Maven",
  "Habitat",
  "Aerial",
  "Northwind",
];

export const SocialProof = () => {
  return (
    <section className="border-y border-border bg-background py-12">
      <div className="container mx-auto">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted by 10,000+ businesses worldwide
        </p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-8 gap-y-6 items-center">
          {logos.map((name) => (
            <div
              key={name}
              className="text-center font-display text-lg sm:text-xl font-bold text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
