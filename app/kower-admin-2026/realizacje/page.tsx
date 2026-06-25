import { redirect } from "next/navigation";

import { ADMIN_BASE_PATH } from "@/lib/admin/constants";

export default function RealizationsAdminPage() {
  redirect(`${ADMIN_BASE_PATH}/strona-glowna`);
}
