export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  category: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "ion-1",
    name: "Ion-1 Headphones",
    tagline: "Active Noise Cancellation · 40h Battery",
    price: 349,
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop",
  },
  {
    id: "pulse-2",
    name: "Pulse Watch S2",
    tagline: "OLED Display · Biometric Tracking",
    price: 299,
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop",
  },
  {
    id: "nexus-kb",
    name: "Nexus Keyboard",
    tagline: "Mechanical · Wireless · Aluminum",
    price: 189,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop",
  },
  {
    id: "vox-mini",
    name: "Vox Mini Speaker",
    tagline: "Bluetooth 5.3 · 24h Battery",
    price: 129,
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop",
  },
  {
    id: "lens-pro",
    name: "Lens Pro Camera",
    tagline: "4K HDR · Stabilized Sensor",
    price: 899,
    category: "Imaging",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop",
  },
  {
    id: "core-hub",
    name: "Core Hub",
    tagline: "USB-C Dock · 10 Ports",
    price: 159,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&auto=format&fit=crop",
  },
  {
    id: "buds-air",
    name: "Buds Air Pro",
    tagline: "True wireless · ANC",
    price: 199,
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop",
  },
  {
    id: "ring-fit",
    name: "Ring Fit Tracker",
    tagline: "Sleep & heart-rate · 7-day battery",
    price: 249,
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1617625802921-71acb6c6b9b8?w=800&auto=format&fit=crop",
  },
];