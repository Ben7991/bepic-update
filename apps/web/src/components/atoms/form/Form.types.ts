import type { RefObject } from 'react';

export type ImageUploaderProps = {
  className?: string;
  ref: RefObject<ImageUploadHandle | null>;
};

export type ImageUploadHandle = {
  onRemoveFile: VoidFunction;
  onGetFile: () => File | null;
};
