export interface SmsGateway {
  id: string;
  name: string;
  slug: string;
  status: string;
}

function rid() {
  return crypto.randomUUID();
}

export const mockGateways: SmsGateway[] = [
  { id: rid(), name: "Twilio", slug: "twilio", status: "active" },
  { id: rid(), name: "Vonage", slug: "vonage", status: "active" },
  { id: rid(), name: "AWS SNS", slug: "aws-sns", status: "inactive" },
  { id: rid(), name: "MessageBird", slug: "messagebird", status: "active" },
];
1;
