import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { createCapsule } from "@/services";

export const CapsuleForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (!date) {
      return;
    }

    createCapsule({ title, message, date });
  };

  return (
    <div className="flex flex-col gap-5 w-[600px]">
      <h1 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Send a message to the future.
      </h1>
      <Input placeholder="Title" value={title} onChange={handleTitle} />
      <Textarea value={message} onChange={handleText} />
      <Calendar mode="single" selected={date} onSelect={setDate} />
      <div className="flex justify-end w-full">
        <Button onClick={handleSubmit}>Send</Button>
      </div>
    </div>
  );
};
