export type CreateCapsuleDto = {
  title: string;
  message: string;
  date: Date;
};

export type Capsule = {
  title: string;
  message: string;
  openedAt: string;
  createdAt: string;
};

export type CapsuleClosed = {
  next_time: string;
};
