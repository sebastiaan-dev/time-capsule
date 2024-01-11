import { Capsule } from "@/types";
import api from "./api";

export const createCapsule = async (capsule: Capsule) => {
  return api.post("/capsule", capsule);
};

export const getCapsules = async () => {
  return {
    opened_capsules: [
      {
        title: "This is an opened capsule!",
        message: "I have got a cool story to tell you! I am a capsule!",
        createdAt: new Date(2021, 8, 1),
        openedAt: new Date(2021, 8, 2),
      },
      {
        title: "This is an opened capsule!",
        message: "I have got a cool story to tell you! I am a capsule!",
        createdAt: new Date(2021, 8, 1),
        openedAt: new Date(2021, 8, 2),
      },
      {
        title: "This is an opened capsule!",
        message: "I have got a cool story to tell you! I am a capsule!",
        createdAt: new Date(2021, 8, 1),
        openedAt: new Date(2021, 8, 2),
      },
    ],
    closed_capsule: {
      next_time: new Date(2025, 8, 1),
      total_count: 1,
    },
  };
  // return api.get<{
  //   opened_capsules: Capsule[];
  //   closed_capsule: { next_time: Date; total_count: number };
  // }>("/capsules");
};
