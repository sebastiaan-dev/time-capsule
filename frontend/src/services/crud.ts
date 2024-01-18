import { Capsule, CapsuleClosed, CreateCapsuleDto } from "@/types";
import api from "./api";
import { Toast, ToasterToast } from "@/components/ui/use-toast";

export const createCapsule = async (
  toast: (props: Toast) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  },
  capsule: CreateCapsuleDto
): Promise<boolean> => {
  const { data } = await api.post("/timecapsule", capsule);

  if (data.code === 1000) {
    toast({
      title: "Success",
      description: "Time capsule created successfully.",
    });
    return true;
  }

  toast({ title: "Error", description: data.message });
  return false;
};

export const getCapsules = async (start: number, limit: number) => {
  const result = await api.get<{
    data: {
      opened_capsules: Capsule[];
      opened_count: number;
      closed_capsule: CapsuleClosed;
      closed_count: number;
      next_flag: boolean;
    };
  }>("/timecapsules", { params: { start, limit } });

  return result.data.data;
};
