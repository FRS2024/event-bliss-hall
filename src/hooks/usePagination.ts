import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[] | undefined;
  itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  paginatedData: T[];
  startIndex: number;
  endIndex: number;
  totalItems: number;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function usePagination<T>({
  data,
  itemsPerPage = 10,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset to page 1 if current page exceeds total pages (e.g., after filtering)
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));
  
  if (safeCurrentPage !== currentPage) {
    setCurrentPage(safeCurrentPage);
  }

  const paginatedData = useMemo(() => {
    if (!data) return [];
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, safeCurrentPage, itemsPerPage]);

  const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(safeCurrentPage * itemsPerPage, totalItems);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () => setCurrentPage(Math.min(safeCurrentPage + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage(Math.max(safeCurrentPage - 1, 1));

  const canGoNext = safeCurrentPage < totalPages;
  const canGoPrevious = safeCurrentPage > 1;

  return {
    currentPage: safeCurrentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    startIndex,
    endIndex,
    totalItems,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  };
}
