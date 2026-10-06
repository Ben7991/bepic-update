import {
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type DragEvent,
} from 'react';
import type { ImageUploaderProps } from './Form.types';
import { FileUp } from 'lucide-react';

export function Form(
  props: ComponentPropsWithoutRef<'form'>,
): React.JSX.Element {
  return <form {...props}>{props.children}</form>;
}

function Group({
  isLastGroup,
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & {
  isLastGroup?: boolean;
}): React.JSX.Element {
  return (
    <div className={`${isLastGroup ? 'mb-5' : 'mb-3'} ${className}`} {...props}>
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
        className={`${!(leftIcon || rightIcon) ? 'px-3' : ''} py-1 inline-block grow outline-none border-none`}
        {...rest}
      />
      {rightIcon}
    </div>
  );
}

function Error({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <small className="inline-block text-red-600">{children}</small>;
}

function ImageUploader({
  className,
  ref,
}: ImageUploaderProps): React.JSX.Element {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    onRemoveFile: () => {
      setImagePath(null);
      setFile(null);
    },
    onGetFile: () => file,
  }));

  const showFile = (file: File): void => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImagePath(reader.result as string);
      setFile(file);
    });
    reader.readAsDataURL(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    showFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    showFile(file);
  };

  return (
    <div
      className={`cursor-pointer border-2 border-gray-200 border-dashed bg-gray-100 rounded-md flex items-center justify-center overflow-hidden ${className}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onClick={() => fileUploadRef.current?.click()}
    >
      {!imagePath ? (
        <div className="basis-[80%] flex flex-col items-center gap-1">
          <FileUp />
          <p>Click or drag and drop your image preferred image</p>
        </div>
      ) : (
        <img
          src={imagePath}
          alt="File upload"
          className="w-full h-full object-cover"
        />
      )}
      <input type="file" ref={fileUploadRef} onChange={handleChange} hidden />
    </div>
  );
}

Form.Group = Group;
Form.Label = Label;
Form.Control = Control;
Form.Error = Error;
Form.ImageUploader = ImageUploader;
