interface User {
  username: string;
}

interface DevToken {
  expTime: string;
  id: string;
  isActive: true;
  maxCalls: number | null;
  remainCalls: number | null;
  maxQpm: number | null;
  nowQpm: number;
  value: string;
}

type CallBack = (error?: Error) => void;

declare type UserInfo = User | "";
declare module "lodash.pick";
