import { message } from "antd";
import { useState, useMemo, useCallback } from "react";

import { mockFeatures } from "../data";
import { mockTenants } from "../../data";
import { mockModules } from "../../../packages/data";

export default function useTenantDetail(id: string) {
  const tenant = useMemo(
    () => mockTenants.find((t) => t.id === id) || mockTenants[0],
    [id],
  );

  const [modules, setModules] = useState(() =>
    mockModules.map((m) => ({ ...m, enabled: Math.random() > 0.3 })),
  );

  const [featureState, setFeatureState] = useState(mockFeatures);

  const toggleModule = useCallback(
    (id: string) => {
      setModules((prev) =>
        prev.map((m) => {
          if (m.id === id) {
            const updated = { ...m, enabled: !m.enabled };
            message.success(
              `${m.name} ${updated.enabled ? "enabled" : "disabled"}`,
            );
            return updated;
          }
          return m;
        }),
      );
    },
    [message],
  );

  const toggleFeature = useCallback(
    (group: string, index: number) => {
      setFeatureState((prev) => {
        const updated = prev[group].map((item, i) => {
          if (i === index) {
            const next = { ...item, enabled: !item.enabled };
            message.success(
              `${item.name} ${next.enabled ? "enabled" : "disabled"}`,
            );
            return next;
          }
          return item;
        });

        return { ...prev, [group]: updated };
      });
    },
    [message],
  );

  return { tenant, modules, featureState, toggleModule, toggleFeature };
}
