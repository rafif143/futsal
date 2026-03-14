'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Prev
      </Button>

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 text-gray-600 font-medium">
              ...
            </span>
          );
        }

        return (
          <Button
            key={page}
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page as number)}
            className={
              currentPage === page
                ? 'bg-[#1F7A63] hover:bg-[#16624F] text-white border-2 border-[#1F7A63] font-semibold min-w-[40px]'
                : 'bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-medium min-w-[40px]'
            }
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
