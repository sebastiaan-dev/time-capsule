import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { createCapsule } from "@/services";
import { useToast } from "./ui/use-toast";
import { DatePicker } from "./date-picker";

export const CapsuleForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (!date) {
      return;
    }

    const succeeded = await createCapsule(toast, { title, message, date });
    if (succeeded) {
      setTitle("");
      setMessage("");
      setDate(new Date());
    }
  };

  return (
    <div className="flex flex-col gap-5 w-[600px]">
      <h1 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Send a message to the future.
      </h1>
      <Input placeholder="Title" value={title} onChange={handleTitle} />
      <Textarea
        placeholder="Your story..."
        value={message}
        onChange={handleText}
      />
      <DatePicker date={date} setDate={setDate} />
      <div className="flex justify-end w-full">
        <Button onClick={handleSubmit}>Send</Button>
      </div>
    </div>
  );
};
