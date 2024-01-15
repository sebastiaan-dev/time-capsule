import { Capsule, CapsuleClosed, CreateCapsuleDto } from "@/types";
import api from "./api";

export const createCapsule = async (capsule: CreateCapsuleDto) => {
  return api.post("/timecapsule", capsule);
};

export const getCapsules = async (start: number, limit: number) => {
  const result = await api.get<{
    opened_capsules: Capsule[];
    opened_count: number;
    closed_capsule: CapsuleClosed;
    closed_count: number;
  }>("/timecapsules", { params: { start, limit } });

  return result.data;
};

// return {
//   opened_capsules: [
//     {
//       title: "This is an opened capsule!",
//       message: "I have got a cool story to tell you! I am a capsule!",
//       createdAt: new Date(2021, 8, 1),
//       openedAt: new Date(2021, 8, 2),
//     },
//     {
//       title: "This is an opened capsule!",
//       message: "I have got a cool story to tell you! I am a capsule!",
//       createdAt: new Date(2021, 8, 1),
//       openedAt: new Date(2021, 8, 2),
//     },
//     {
//       title: "This is an opened capsule!",
//       message: "I have got a cool story to tell you! I am a capsule!",
//       createdAt: new Date(2021, 8, 1),
//       openedAt: new Date(2021, 8, 2),
//     },
//   ],
//   closed_capsule: {
//     next_time: new Date(2025, 8, 1),
//     total_count: 1,
//   },
// };
