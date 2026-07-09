import { Card, Timeline } from "antd";

import { OrderStatusBadge } from "../../_components/badge";

type StatusLog = {
  id: string;
  order_id: string;
  old_status?: Parameters<typeof OrderStatusBadge>[0]["status"];
  new_status: Parameters<typeof OrderStatusBadge>[0]["status"];
  note?: string;
  changed_by?: string;
  changed_at: string;
};

const mockStatusLogs: StatusLog[] = [];

export function OrderTimeline({ orderId }: { orderId: string }) {
  const logs = mockStatusLogs.filter((log) => log.order_id === orderId);

  return (
    <Card title="Status Timeline">
      {logs.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          No timeline events yet.
        </div>
      ) : (
        <Timeline>
          {logs.map((log) => (
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
