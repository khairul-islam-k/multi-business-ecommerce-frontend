export type Plan = {
  name: string;
  desc: string;
  monthly?: string;
  yearly?: string;
  custom?: boolean;
  included: string[];
  excluded?: string[];
  current?: boolean;
};
