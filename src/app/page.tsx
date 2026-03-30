import Link from "next/link";
import { Button } from "antd";

export default function HomePage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold">OneComm's Static UI</h1>

      <div className="flex items-center justify-center gap-2">
        <Link href="/super-admin/sign-in">
          <Button type="primary">View Super Admin UI</Button>
        </Link>
        <Link href="/admin/sign-in">
          <Button type="primary">View Admin UI</Button>
        </Link>
      </div>
    </div>
  );
}
