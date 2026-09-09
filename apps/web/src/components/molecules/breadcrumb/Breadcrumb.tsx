import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

import type { BreadcrumbProps, BreadcrumbItemProps } from './Breadcrumb.types';


export function Breadcrumb({ className, children }: BreadcrumbProps): React.JSX.Element {
  return (
    <section className={className}>
      <div className="flex gap-1.5 items-center">
        {children}
      </div>
    </section>
  );
}

function Item({children, path}: BreadcrumbItemProps): React.JSX.Element {
  if (!path) {
    return <span className='text-black font-semibold'>{children}</span>
  }

  return (
    <Link to={path} className='text-gray-500'>{children}</Link>
  );
}

function Separator(): React.JSX.Element {
  return (
    <ChevronRight width={16} height={16} />
  )
}

Breadcrumb.Item = Item;
Breadcrumb.Separator = Separator;