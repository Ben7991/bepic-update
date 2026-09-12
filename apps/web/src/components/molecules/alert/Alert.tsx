import { CircleCheckBig, CircleX, X } from 'lucide-react';

import type { AlertVariant, ChildrenOnlyProps } from '../../../lib/utils/types.utils';
import { Headline } from '../../atoms/headline/Headline';

export type AlertProps = {
  variant?: AlertVariant;
  headline: string;
  children: React.ReactNode;
  onHide?: VoidFunction;
};

export function Alert({
  variant,
  children,
  headline,
  onHide,
}: AlertProps): React.JSX.Element {
  const isSuccess = variant === 'success';

  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-md ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="flex items-start gap-2">
        <span className='mt-1'>
          {isSuccess ? (
            <CircleCheckBig className="text-green-700" />
          ) : (
            <CircleX className="text-red-700" />
          )}
        </span>
        <div className='space-y-1'>
          <Headline tag='h4' className='text-red-700!'>{headline}</Headline>
          {children}
        </div>
      </div>
      {onHide && (
        <button
          className="hover:text-red-600"
          onClick={onHide}
          type="button"
        >
          <X width={16} height={16} />
        </button>
      )}
    </div>
  );
}

function Message({children}: ChildrenOnlyProps): React.JSX.Element {
  return (
    <p className='text-red-700'>{children}</p>
  );
}

Alert.Message = Message;
