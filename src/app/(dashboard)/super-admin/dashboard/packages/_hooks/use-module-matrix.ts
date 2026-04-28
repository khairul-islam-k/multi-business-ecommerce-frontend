import { useState } from "react";
import { mockModules } from "../data";

export default function useModuleMatrix(packages: any[]) {
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>(
    Object.fromEntries(
      mockModules.map((m) => [
        m.id,
        Object.fromEntries(packages.map((p) => [p.name, true])),
      ]),
    ),
  );

  const toggle = (moduleId: string, packageName: string, value: boolean) => {
    setMatrix((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [packageName]: value,
      },
    }));
  };

  return { matrix, toggle };
}
