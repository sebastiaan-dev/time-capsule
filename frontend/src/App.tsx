import { useEffect, useState } from "react";
import { CapsuleForm } from "./components/capsule-form";
import { Capsule } from "./types";
import { OpenedCapsule } from "./components/capsule";
import { getCapsules } from "./services";
import { ClosedCapsule } from "./components/closed-capsule";
import { Paginate } from "./components/paginate";
import { Button } from "./components/ui/button";

function App() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [closedCapsule, setClosedCapsule] = useState<{
    next_time: Date;
    total_count: number;
  } | null>(null);

  useEffect(() => {
    const updateCapsules = async () => {
      const { opened_capsules, closed_capsule } = await getCapsules();
      setCapsules(opened_capsules);
      setClosedCapsule(closed_capsule);
    };

    updateCapsules();
  }, []);

  return (
    <div className="flex flex-col gap-20 w-full">
      <div className="flex h-screen justify-center items-center">
        <CapsuleForm />
        <div className="absolute bottom-10">
          <Button>
            <a href="#listview">See what other people wrote.</a>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5 items-center pb-10">
        <h2 className="text-3xl font-semibold pb-10 pt-10" id="listview">
          A brief history
        </h2>
        {closedCapsule && <ClosedCapsule {...closedCapsule} />}
        {capsules.map((capsule) => (
          <OpenedCapsule {...capsule} />
        ))}
        <Paginate />
      </div>
    </div>
  );
}

export default App;
