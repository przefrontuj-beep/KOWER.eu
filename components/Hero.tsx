"use client";

import { HeroWithWallText } from "./HeroWithWallText";
import { HeroImageOnly } from "./HeroImageOnly";
import type { HomepageSettings } from "@/types/admin";

interface HeroProps {
  variant?: "wallText" | "imageOnly";
  settings?: HomepageSettings;
}

export function Hero({ variant = "wallText", settings }: HeroProps) {
  if (variant === "imageOnly") {
    return <HeroImageOnly />;
  }

  return <HeroWithWallText settings={settings} />;
}

export default Hero;
