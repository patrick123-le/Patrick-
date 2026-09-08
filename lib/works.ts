import worksData from "@/content/works.json";
import type { Work } from "@/lib/types";

export const works = (worksData as Work[]).map((work, index) => ({
  ...work,
  number: index + 1,
}));
