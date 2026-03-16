import { redirect } from "next/navigation";

export default function HomePage() {
  return redirect("/super-admin/sign-in");
}
