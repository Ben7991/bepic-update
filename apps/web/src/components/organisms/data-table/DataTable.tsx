import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';

import type { ChildrenOnlyProps } from '../../../lib/utils/types.utils';
import css from './DataTable.module.css';
import { useOutsideClick } from '../../../lib/hooks/use-outside-click/useOutsideClick';

type DataTableProps = {
  columnHeadlines: Array<string>;
  children: React.ReactNode;
};

export function DataTable({
  columnHeadlines,
  children,
}: DataTableProps): React.JSX.Element {
  return (
    <div>
      <table className={`${css.table} border-collapse`}>
        <thead>
          <tr>
            {columnHeadlines.map((headline, index) => (
              <th key={`${headline}-${index}`}>{headline}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Row({ children }: ChildrenOnlyProps): React.JSX.Element {
  return <tr>{children}</tr>;
}

function Cell({ children }: ChildrenOnlyProps): React.JSX.Element {
  return <td>{children}</td>;
}

function Actions({ children }: ChildrenOnlyProps): React.JSX.Element {
  const [show, setShow] = useState(false);

  const hide = (): void => {
    setShow(false);
  }
  
  useOutsideClick(hide);

  return (
    <div className="relative w-fit">
      <button
        onClick={(event) => {
          event.stopPropagation();
          setShow(!show);
        }}
      >
        <EllipsisVertical />
      </button>
      {show && (
        <div className="absolute flex flex-col bg-white w-50 right-0 border p-1 border-gray-200 shadow-md rounded-md overflow-hidden z-10">
          {children}
        </div>
      )}
    </div>
  );
}

type ActionProps = {
  className?: string;
  onClick?: VoidFunction;
} & ChildrenOnlyProps;

function Action({
  className,
  children,
  onClick,
}: ActionProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`block py-1 px-3 w-full hover:bg-gray-100 ${className}`}
    >
      {children}
    </button>
  );
}

DataTable.Row = Row;
DataTable.Cell = Cell;
DataTable.Actions = Actions;
DataTable.Action = Action;
