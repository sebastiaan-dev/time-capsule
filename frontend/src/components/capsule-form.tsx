import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const CapsuleForm = () => {
  return (
    <div className="flex flex-col gap-5 w-[600px]">
      <h1 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Send a message to the future.
      </h1>
      <Textarea />
      <div className="flex justify-end w-full">
        <Button>Send</Button>
      </div>
    </div>
  );
};
