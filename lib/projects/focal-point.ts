import type { FocalPoint } from "@/types/project";

const focalPointMap: Record<FocalPoint, string> = {
  center: "center center",
  left: "left center",
  right: "right center",
  top: "center top",
  bottom: "center bottom",
};

export function getFocalPointObjectPosition(focalPoint: FocalPoint = "center") {
  return focalPointMap[focalPoint];
}
