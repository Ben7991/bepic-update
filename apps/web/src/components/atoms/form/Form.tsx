import {
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
} from 'react';

export function Form(
  props: ComponentPropsWithoutRef<'form'>,
): React.JSX.Element {
  return <form {...props}>{props.children}</form>;
}

function Group({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>): React.JSX.Element {
  return (
    <div className={`${className}`} {...props}>
      {props.children}
    </div>
  );
}

function Label({
  className,
  ...props
}: ComponentPropsWithoutRef<'label'>): React.JSX.Element {
  return (
    <label className={`inline-block ${className}`} {...props}>
      {props.children}
    </label>
  );
}

type ControlProps = {
  hasError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & ComponentPropsWithRef<'input'>;

function Control({
  hasError,
  leftIcon,
  rightIcon,
  ...props
}: ControlProps): React.JSX.Element {
  const { className, ...rest } = props;
  return (
    <div
      className={`form-control border rounded-md flex items-center gap-2 ${hasError ? 'border-red-600!' : 'border-gray-300'} ${leftIcon || rightIcon ? 'px-3' : ''}  ${className}`}
    >
      {leftIcon}
      <input
        className={`${!(leftIcon || rightIcon) ? 'px-3' : ''} py-1.5 inline-block grow outline-none border-none`}
        {...rest}
      />
      {rightIcon}
    </div>
  );
}

function Error({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <small className="inline-block text-red-600">{children}</small>;
}

Form.Group = Group;
Form.Label = Label;
Form.Control = Control;
Form.Error = Error;
