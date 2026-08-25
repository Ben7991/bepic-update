import { type ComponentPropsWithoutRef } from 'react';
import { Link, type LinkProps } from 'react-router';

type Variant = 'primary' | 'danger';
type ButtonProps = {
  el: 'button';
  variant: Variant;
  loading?: boolean;
} & ComponentPropsWithoutRef<'button'>;

type AnchorProps = {
  el: 'link';
  variant: Variant;
} & LinkProps;

export function Button(props: ButtonProps | AnchorProps): React.JSX.Element {
  let variantClassNames = '';

  if (props.variant === 'primary') {
    variantClassNames =
      'bg-blue-600 hover:bg-blue-700 text-white inline-block py-1 px-3 rounded-md cursor-pointer';
  } else if (props.variant === 'danger') {
    variantClassNames =
      'bg-red-500 hover:bg-red-700 text-white inline-block py-1 px-3 rounded-md';
  }

  if (props.el === 'link') {
    return (
      <Link to={props.to} className={`${variantClassNames} ${props.className}`}>
        {props.children}
      </Link>
    );
  }

  const { className, ...rest } = props;

  return (
    <button className={`${variantClassNames} ${className}`} {...rest}>
      {props.loading ? (
        <div className="flex items-center gap-2">
          <div className="block w-5 h-5 border-4 border-white border-b-4 border-b-gray-400 rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        props.children
      )}
    </button>
  );
}
