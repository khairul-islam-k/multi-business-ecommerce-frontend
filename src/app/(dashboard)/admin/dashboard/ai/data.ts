export interface AiGeneration {
  id: string;
  tenant_id: string;
  user_id: string;
  module_type: string;
  prompt: string;
  generated_text: string;
  metadata_json: string | null;
  created_at: string;
}

const moduleTypes = [
  "product_description",
  "promo_text",
  "slogan",
  "email_copy",
  "ad_copy",
];
const products = [
  "Wireless Earbuds",
  "Smart Watch",
  "Running Shoes",
  "Organic Coffee",
  "Yoga Mat",
  "Travel Backpack",
  "Skin Cream",
  "LED Desk Lamp",
  "Water Bottle",
  "Phone Case",
];
const descriptions = [
  "Experience premium sound with our wireless earbuds featuring active noise cancellation and 30-hour battery life.",
  "Track your fitness goals with this sleek smart watch — heart rate, steps, sleep, all on your wrist.",
  "Lightweight and responsive running shoes designed for maximum comfort on every stride.",
  "Ethically sourced, single-origin coffee beans roasted to perfection for a rich, smooth flavor.",
  "Eco-friendly yoga mat with superior grip and cushioning for your daily practice.",
];
const promos = [
  "🔥 FLASH SALE: 50% off everything! Use code FLASH50. Today only!",
  "🎉 Buy 2, Get 1 FREE! Limited time offer on all accessories.",
  "💰 Save big this weekend — up to 40% off selected items!",
  "🚀 New arrivals just dropped! Shop the latest collection now.",
  "✨ VIP exclusive: Early access to our Spring Collection + free shipping!",
];
const slogans = [
  "Innovation meets everyday life.",
  "Quality you can trust, style you'll love.",
  "Built for tomorrow, designed for today.",
  "Where performance meets passion.",
  "Elevate your everyday.",
];

function rid() {
  return crypto.randomUUID();
}
function rdate(daysBack = 60) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString();
}
function r<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const mockAiGenerations: AiGeneration[] = Array.from(
  { length: 40 },
  (_, i) => {
    const module = r(moduleTypes);
    let prompt = "",
      text = "";
    if (module === "product_description") {
      const p = r(products);
      prompt = `Write a compelling product description for ${p}`;
      text = r(descriptions);
    } else if (module === "promo_text") {
      prompt = "Generate a promotional message for our weekend sale";
      text = r(promos);
    } else if (module === "slogan") {
      prompt = `Create a catchy slogan for ${r(products)}`;
      text = r(slogans);
    } else {
      prompt = `Generate ${module.replace("_", " ")} content`;
      text = r([...descriptions, ...promos, ...slogans]);
    }
    return {
      id: rid(),
      tenant_id: "t1",
      user_id: `user_${i % 5}`,
      module_type: module,
      prompt,
      generated_text: text,
      metadata_json: null,
      created_at: rdate(),
    };
  },
);
