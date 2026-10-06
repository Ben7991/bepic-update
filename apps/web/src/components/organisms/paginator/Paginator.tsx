import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';

import { Alert } from '../../molecules/alert/Alert';
import { useOutsideClick } from '../../../lib/hooks/use-outside-click/useOutsideClick';
import {
  constructPaginationString,
  extractPaginationFromQueryParams,
} from '../../../lib/utils/helpers.utils';

type PaginatorProps = {
  className?: string;
  count: number;
};

export function Paginator({
  className,
  count,
}: PaginatorProps): React.JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [showMenu, setShowMenu] = useState(false);

  useOutsideClick((): void => {
    setShowMenu(false);
  });

  const handlePrevious = (): void => {
    const pagination = extractPaginationFromQueryParams(searchParams);
    pagination.page -= 1;
    navigate(`${pathname}?${constructPaginationString(pagination)}`);
  };

  const handleNext = (): void => {
    const pagination = extractPaginationFromQueryParams(searchParams);

    if (!pagination.page) pagination.page = 2;
    else pagination.page += 1;

    navigate(`${pathname}?${constructPaginationString(pagination)}`);
  };

  const handlePerPage = (perPage: number): void => {
    const pagination = extractPaginationFromQueryParams(searchParams);
    pagination.perPage = perPage;
    if (pagination.page) pagination.page = 1;
    navigate(`${pathname}?${constructPaginationString(pagination)}`);
    setShowMenu(false);
  };

  const page = Number(searchParams.get('page') ?? 1);
  const perPage = Number(searchParams.get('perPage') ?? 15);
  const perPages = [15, 30, 50, 100];

  if (Number.isNaN(page) || Number.isNaN(perPage)) {
    return (
      <Alert variant="danger">
        <Alert.Message>Invalid page or per page</Alert.Message>
      </Alert>
    );
  }

  return (
    <div
      className={`flex flex-col gap-3 mt-5 md:flex-row md:gap-0 md:justify-between md:items-center ${className}`}
    >
      <p>
        Showing {page === 1 ? page : perPage * page + 1 - perPage} -{' '}
        {perPage * page > count ? count : perPage * page} of {count}
      </p>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-4 relative">
          <button
            onClick={(event) => {
              event.stopPropagation();
              setShowMenu((prevState) => !prevState);
            }}
            className="flex items-center justify-between gap-3 bg-white border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-md"
          >
            <span>{perPage} perpage</span>
            <span>
              {showMenu ? (
                <ChevronUp width={16} height={16} />
              ) : (
                <ChevronDown width={16} height={16} />
              )}
            </span>
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div className="absolute left-0 bottom-10 bg-white p-1 rounded-md border border-gray-200 flex flex-col gap-1 w-35.75">
                {perPages.map((item) => (
                  <button
                    key={item.toString()}
                    onClick={() => handlePerPage(item)}
                    className="flex items-center justify-between py-0.5 px-2 hover:bg-gray-100 rounded-md"
                  >
                    <span>{item} perpage</span>
                    {perPage === item && <Check width={16} height={16} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="flex items-center gap-1 border border-gray-200 bg-white hover:bg-gray-50 px-2 py-0.5 rounded-md disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <ChevronLeft width={16} height={16} />
          <span>Previous</span>
        </button>
        <button
          onClick={handleNext}
          disabled={perPage * page > count}
          className="flex items-center gap-1 border border-gray-200 bg-white hover:bg-gray-50 px-2 py-0.5 rounded-md disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <span>Next</span>
          <ChevronRight width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
