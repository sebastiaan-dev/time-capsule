import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginateProps {
  setStart: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const Paginate = ({ setStart, hasPrevious, hasNext }: PaginateProps) => {
  const handlePrevious = () => {
    setStart((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // TODO: we need a limit
  const handleNext = () => {
    setStart((prev) => prev + 1);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            style={{ visibility: hasPrevious ? "visible" : "hidden" }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            style={{ visibility: hasNext ? "visible" : "hidden" }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
