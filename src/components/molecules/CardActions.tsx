import React from 'react';
import { Button } from '../atoms/common/Button.tsx';
import type { PaginationState } from '../../types/leaderboard';

interface CardActionsProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
}

export const CardActions: React.FC<CardActionsProps> = ({ 
  pagination, 
  onPageChange 
}) => {
  const { currentPage, totalPages } = pagination;

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          variant="secondary"
        >
          First
        </Button>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="secondary"
        >
          Previous
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="secondary"
        >
          Next
        </Button>
        <Button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          variant="secondary"
        >
          Last
        </Button>
      </div>
    </div>
  );
};
