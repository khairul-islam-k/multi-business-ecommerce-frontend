export const metadata = {
  title: "About — Voltix",
  description:
    "Voltix designs and curates premium electronics from a small studio in Stockholm.",
};

const stats = [
  {
    value: "2018",
    label: "Founded",
  },
  {
    value: "120k+",
    label: "Happy customers",
  },
  {
    value: "42",
    label: "Countries shipped",
  },
  {
    value: "4.9★",
    label: "Average rating",
  },
];

export default function ElectronicAboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <main>
        <section className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <p className="mb-3 text-xs uppercase tracking-widest text-blue-600">
            Our story
          </p>

          <h1 className="mb-8 text-5xl font-bold leading-[0.95] text-gray-900 md:text-7xl">
            We pick the gear,
            <br />
            you enjoy the music.
          </h1>

          <div className="grid gap-10 text-lg leading-relaxed text-gray-500 md:grid-cols-2">
            <p>
              Voltix started in 2018 with a simple idea: most online tech stores
              try to sell you everything. We`d rather sell you the right thing.
            </p>

            <p>
              Every product in our catalog is tested by our team for at least
              two weeks before we list it. If we wouldn`t use it ourselves, you
              won't find it here.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="aspect-[21/9] overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&auto=format&fit=crop"
              alt="Voltix studio"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
                  {stat.value}
                </div>

                <div className="text-xs uppercase tracking-widest text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}