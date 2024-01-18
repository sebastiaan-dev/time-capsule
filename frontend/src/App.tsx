import { useEffect, useState } from "react";
import { CapsuleForm } from "./components/capsule-form";
import { Capsule, CapsuleClosed } from "./types";
import { OpenedCapsule } from "./components/capsule";
import { getCapsules } from "./services";
import { ClosedCapsule } from "./components/closed-capsule";
import { Paginate } from "./components/paginate";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [closedCapsule, setClosedCapsule] = useState<CapsuleClosed | null>(
    null
  );
  const [closedCount, setClosedCount] = useState<number | null>(null);
  const [next, setNext] = useState<boolean>(false);
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    const updateCapsules = async () => {
      const { opened_capsules, closed_capsule, closed_count, next_flag } =
        await getCapsules(start, limit);

      setCapsules(opened_capsules);
      setClosedCapsule(closed_capsule);
      setClosedCount(closed_count);
      setNext(next_flag);
    };

    updateCapsules();
  }, [start, limit]);

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
        {closedCapsule && (
          <ClosedCapsule {...closedCapsule} count={closedCount} />
        )}
        {capsules.map((capsule) => (
          <OpenedCapsule key={capsule.title} {...capsule} />
        ))}
        <Paginate
          {...{ setStart, setLimit, hasPrevious: start > 0, hasNext: next }}
        />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
