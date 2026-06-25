import { redirect } from "next/navigation";
import { ADMIN_BASE_PATH } from "@/lib/admin/constants";

export default function DisabledAdminRoutePage() {
  redirect(ADMIN_BASE_PATH);
}
