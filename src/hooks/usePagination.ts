import { useState, useMemo } from "react";

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedData: T[];
  setCurrentPage: (page: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  startIndex: number;
  endIndex: number;
}

export function usePagination<T>({
  data,
  itemsPerPage: initialItemsPerPage = 10,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(data.length / itemsPerPage)),
    [data.length, itemsPerPage]
  );

  // Reset to page 1 when data changes significantly
  const validCurrentPage = useMemo(() => {
    if (currentPage > totalPages) return totalPages;
    if (currentPage < 1) return 1;
    return currentPage;
  }, [currentPage, totalPages]);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  const paginatedData = useMemo(
    () => data.slice(startIndex, endIndex),
    [data, startIndex, endIndex]
  );

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  const handleSetItemsPerPage = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };

  return {
    currentPage: validCurrentPage,
    totalPages,
    paginatedData,
    setCurrentPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
    itemsPerPage,
    setItemsPerPage: handleSetItemsPerPage,
    startIndex,
    endIndex,
  };
}
