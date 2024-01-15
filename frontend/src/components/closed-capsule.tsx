import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { Badge } from "@/components/ui/badge";

interface ClosedCapsuleProps {
  next_time: string;
  count: number | null;
}

export const ClosedCapsule = ({ next_time }: ClosedCapsuleProps) => {
  const renderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    completed,
  }) => {
    if (completed) {
      // Render a completed state
      return <>Unlocking...</>;
    } else {
      // Render a countdown
      return (
        <span>
          {days} days, {hours} hours and {minutes} minutes
        </span>
      );
    }
  };

  return (
    <>
      <Badge variant={"secondary"}>200 upcoming</Badge>
      <Card className="w-[600px] gap-10">
        <CardHeader>
          <div className="flex flex-col gap-5 text-center pt-4">
            <CardTitle>Next capsule unlocks in</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center text-xl font-semibold pb-10 pt-10">
            <Countdown date={new Date(next_time)} renderer={renderer} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};
