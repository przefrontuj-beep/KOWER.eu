import { Badge } from "@/components/ui/badge";
import type { ContentStatus } from "@/types/admin";

const labels: Record<ContentStatus, string> = {
  draft: "Szkic",
  published: "Opublikowane",
  hidden: "Ukryte",
};

export function StatusBadge({ status = "draft" }: { status?: ContentStatus }) {
  const variant =
    status === "published"
      ? "default"
      : status === "hidden"
        ? "destructive"
        : "secondary";

  return <Badge variant={variant}>{labels[status]}</Badge>;
}
