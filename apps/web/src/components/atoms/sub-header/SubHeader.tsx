import type { ChildrenOnlyProps } from '../../../lib/utils/types.utils';

export function SubHeader({ children }: ChildrenOnlyProps): React.JSX.Element {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 my-4 md:mb-6">
      {children}
    </div>
  );
}
