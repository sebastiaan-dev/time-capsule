import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

interface OpenedCapsuleProps {
  title: string;
  message: string;
  createdAt: string;
  openedAt: string;
}

export const OpenedCapsule = ({
  title,
  message,
  createdAt,
  openedAt,
}: OpenedCapsuleProps) => {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <div className="flex flex-col gap-5">
          <CardTitle>{title}</CardTitle>
          <div className="flex justify-between">
            <CardDescription>
              Created on{" "}
              {new Date(createdAt).toLocaleString("en-US", {
                dateStyle: "long",
                timeZone: "UTC",
              })}
            </CardDescription>
            <CardDescription>
              Opened on{" "}
              {new Date(openedAt).toLocaleString("en-US", {
                dateStyle: "long",
                timeZone: "UTC",
              })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{message}</CardContent>
    </Card>
  );
};
