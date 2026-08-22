import { type ComponentPropsWithoutRef } from 'react';

type ButtonVariant = 'primary' | 'success' | 'danger';
type ButtonProps = {
  el: 'button';
  variant: ButtonVariant;
  loading?: boolean;
} & ComponentPropsWithoutRef<'button'>;

export function Button(props: ButtonProps): React.JSX.Element {
  const { className, variant, loading, ...rest } = props;

  let variantClassNames = '';

  if (variant === 'primary') {
    variantClassNames =
      'bg-blue-600 text-white inline-block py-1 px-3.5 rounded-md cursor-pointer';
  } else if (variant === 'success') {
    variantClassNames =
      'bg-green-500 text-white inline-block py-1 px-3.5 rounded-md';
  } else if (variant === 'danger') {
    variantClassNames =
      'bg-red-500 text-white inline-block py-1 px-3.5 rounded-md';
  }

  return (
    <button className={`${variantClassNames} ${className}`} {...rest}>
      {loading ? (
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
