export type CreateCapsuleDto = {
  title: string;
  message: string;
  date: Date;
};

export type Capsule = {
  title: string;
  message: string;
  openedAt: Date;
  createdAt: Date;
};

export type CapsuleClosed = {
  nextTime: Date;
};
