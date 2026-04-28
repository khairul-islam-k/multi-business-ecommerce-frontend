import { Card, Timeline } from "antd";

import { mockStatusLogs } from "../../data";
import { OrderStatusBadge } from "../../_components/badge";

export function OrderTimeline({ orderId }: { orderId: string }) {
  const logs = mockStatusLogs.filter((log) => log.order_id === orderId);

  console.log(mockStatusLogs);

  return (
    <Card title="Status Timeline">
      {logs.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          No timeline events yet.
        </div>
      ) : (
        <Timeline>
          {logs.map((log: any) => (
            <Timeline.Item key={log.id}>
              <div className="flex items-center justify-between mb-1">
                <OrderStatusBadge status={log.new_status} />
                {log.old_status && (
                  <span className="text-gray-500 text-xs">
                    from {log.old_status}
                  </span>
                )}
              </div>
              <div className="text-gray-500 text-sm">{log.note}</div>
              <div className="text-gray-400 text-xs mt-1">
                {log.changed_by} - {new Date(log.changed_at).toDateString()}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </Card>
  );
}
