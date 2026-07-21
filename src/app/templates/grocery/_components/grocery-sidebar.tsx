import Link from "next/link";
import {
  Apple,
  Beef,
  Coffee,
  Cookie,
  Fish,
  Milk,
  ShoppingBasket,
  Wheat,
} from "lucide-react";

const categories = [
  {
    label: "All Categories",
    href: "/products",
    icon: ShoppingBasket,
  },
  {
    label: "Fruits & Vegetables",
    href: "/products?category=fruits-vegetables",
    icon: Apple,
  },
  {
    label: "Meat",
    href: "/products?category=meat",
    icon: Beef,
  },
  {
    label: "Fish",
    href: "/products?category=fish",
    icon: Fish,
  },
  {
    label: "Dairy Products",
    href: "/products?category=dairy",
    icon: Milk,
  },
  {
    label: "Bakery",
    href: "/products?category=bakery",
    icon: Wheat,
  },
  {
    label: "Snacks",
    href: "/products?category=snacks",
    icon: Cookie,
  },
  {
    label: "Beverages",
    href: "/products?category=beverages",
    icon: Coffee,
  },
];

export default function GrocerySidebar() {
  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-[var(--store-border)] bg-[var(--store-bg-1)] lg:block">
      <div className="sticky top-0 p-5">
        <h2 className="mb-4 text-lg font-bold text-[var(--store-text-primary)]">
          Categories
        </h2>

        <nav className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.label}
                href={category.href}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--store-text-secondary)] transition hover:bg-[var(--store-primary)]/10 hover:text-[var(--store-primary)]"
              >
                <Icon size={19} />

                <span>{category.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}