"use client";

import {
  Button,
  Card,
  Divider,
  Input,
  List,
  Select,
  Tag,
  Typography,
} from "antd";
import { MessageCircle, Send, Settings, UserRound } from "lucide-react";
import { ReactNode, useState } from "react";

import { useSwal } from "@/hooks/use-swal";

const { Text } = Typography;

type OrderNote = {
  id: string;
  order_id: string;
  note_type: "internal" | "customer" | "system";
  created_by: string;
  created_at: string;
  note: string;
};

const mockNotes: OrderNote[] = [];

const noteTypeConfig: Record<
  OrderNote["note_type"],
  { icon: ReactNode; label: string; color: string }
> = {
  internal: { icon: <Settings />, label: "Internal", color: "blue" },
  customer: { icon: <UserRound />, label: "Customer", color: "green" },
  system: { icon: <MessageCircle />, label: "System", color: "gray" },
};

export function OrderNotesPanel({ orderId }: { orderId: string }) {
  const notes = mockNotes.filter((note) => note.order_id === orderId);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("internal");
  const swal = useSwal();

  const handleAdd = () => {
    if (!newNote.trim()) return;
    swal.success("Note added");
    setNewNote("");
  };

  return (
    <Card title="Notes">
      {/* Add Note */}
      <div className="space-y-2 mb-4">
        <div className="flex items-end gap-2">
          <Select
            value={noteType}
            onChange={(v) => setNoteType(v)}
            style={{ width: 140 }}
          >
            <Select.Option value="internal">Internal</Select.Option>
            <Select.Option value="customer">Customer</Select.Option>
            <Select.Option value="system">System</Select.Option>
          </Select>
          <Input
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button
            type="primary"
            icon={<Send />}
            onClick={handleAdd}
            disabled={!newNote.trim()}
          >
            Add
          </Button>
        </div>
      </div>

      <Divider />

      {/* Notes List */}
      <List
        dataSource={notes}
        locale={{ emptyText: "No notes yet." }}
        renderItem={(note) => {
          const config = noteTypeConfig[note.note_type];
          return (
            <List.Item key={note.id} className="p-2 bg-gray-50 rounded mb-2">
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      "var(--dashboard-sidebar-active-background-color)",
                    color: "var(--dashboard-primary-color)",
                  }}
                >
                  {config.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Text strong>{note.created_by}</Text>
                    <Tag color={config.color} style={{ fontSize: 10 }}>
                      {config.label}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 10 }}>
                      {new Date(note.created_at).toDateString()}
                    </Text>
                  </div>
                  <Text>{note.note}</Text>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
}
