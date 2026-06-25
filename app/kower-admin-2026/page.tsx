import { redirect } from "next/navigation";

import { ADMIN_BASE_PATH } from "@/lib/admin/constants";

export default function AdminDashboardPage() {
  redirect(`${ADMIN_BASE_PATH}/strona-glowna`);
}
