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
  createdAt: Date;
  openedAt: Date;
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
              Created on {createdAt.toISOString()}
            </CardDescription>
            <CardDescription>
              Opened on {openedAt.toISOString()}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{message}</CardContent>
    </Card>
  );
};
