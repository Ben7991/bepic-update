import { useEffect, useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Save } from 'lucide-react';

import { Button } from '../../../components/atoms/button/Button';
import { Form } from '../../../components/atoms/form/Form';
import type { ImageUploadHandle } from '../../../components/atoms/form/Form.types';
import {
  generateFormDataForProductCreation,
  productSchema,
} from './Products.utils';
import type {
  Product,
  ProductFormProps,
  ProductInputs,
} from './Products.types';
import { mutate } from '../../../lib/http/http-request';
import type { ResponseWithDataAndMessage } from '../../../lib/utils/types.utils';
import { useToggle } from '../../../lib/hooks/use-toggle/useToggle';
import { useAppDispatch, useAppSelector } from '../../../store/index.util';
import type { AlertPopupProps } from '../../../components/molecules/alert-popup/AlertPopup';
import {
  addProduct,
  updateProduct,
} from '../../../store/slice/products/products.slice';
import { findItemById } from '../../../lib/utils/helpers.utils';

export function ProductForm({
  action,
  idInSearchParams,
  onHideModal,
  onSetAlertInfo,
  onShowAlert,
}: ProductFormProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [hasUploadedImage, setHasUploadedImage] = useState(true);
  const [hasParamsError, setHasParamsError] = useState(false);
  const { data: products } = useAppSelector((state) => state.product);
  const { show: isLoading, toggle: toggleLoading } = useToggle();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValues,
  } = useForm<ProductInputs>({
    resolver: yupResolver(productSchema),
    mode: 'onBlur',
  });
  const imageUploaderRef = useRef<ImageUploadHandle>(null);

  useEffect(() => {
    if (Number.isNaN(Number(idInSearchParams)) && !hasParamsError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasParamsError((prevValue) => !prevValue);
    } else {
      const preferredProduct = findItemById<Product>(
        products,
        idInSearchParams,
      );
      setValues({
        name: preferredProduct?.name,
        price: preferredProduct?.price?.toString(),
        point: preferredProduct?.point?.toString(),
      });
    }
  }, [idInSearchParams, products, setValues, hasParamsError]);

  const onSubmit: SubmitHandler<ProductInputs> = async (
    data,
  ): Promise<void> => {
    let file: File | null | undefined;

    if (action === 'create') {
      file = imageUploaderRef.current?.onGetFile();
    }

    if (!file && action === 'create') {
      setHasUploadedImage(false);
      return;
    }

    toggleLoading();
    setHasParamsError(true);

    let message = '',
      variant: AlertPopupProps['variant'] = 'success';

    const preferredProduct = findItemById<Product>(products, idInSearchParams);
    let result: ResponseWithDataAndMessage<Product> | undefined;

    try {
      result = await mutate<ResponseWithDataAndMessage<Product>>(
        preferredProduct ? 'PATCH' : 'POST',
        preferredProduct ? `products/${preferredProduct.id}` : 'products',
        preferredProduct
          ? JSON.stringify({
              ...data,
              price: Number(data.price),
              point: Number(data.point),
            })
          : generateFormDataForProductCreation(data, file as File),
      );

      if (preferredProduct) dispatch(updateProduct(result.data));
      else dispatch(addProduct(result.data));

      reset();
      message = result.message;
    } catch (error) {
      console.error('Error encountered: ', error);
      message = (error as Error).message;
      variant = 'danger';
    } finally {
      toggleLoading();
      onSetAlertInfo({ message, variant });
      onShowAlert();

      if (preferredProduct) onHideModal();
    }
  };

  return (
    // eslint-disable-next-line react-hooks/refs
    <Form onSubmit={handleSubmit(onSubmit)}>
      {action === 'create' && (
        <Form.Group>
          <Form.ImageUploader ref={imageUploaderRef} className="h-50" />
          {!hasUploadedImage && <Form.Error>Image is required</Form.Error>}
        </Form.Group>
      )}
      <Form.Group>
        <Form.Label htmlFor="name">Name</Form.Label>
        <Form.Control
          type="text"
          id="name"
          {...register('name')}
          hasError={Boolean(errors.name)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="price">Price</Form.Label>
        <Form.Control
          type="text"
          id="price"
          {...register('price')}
          hasError={Boolean(errors.price)}
        />
      </Form.Group>
      <Form.Group className="mb-5!">
        <Form.Label htmlFor="point">Point</Form.Label>
        <Form.Control
          type="number"
          id="point"
          {...register('point')}
          hasError={Boolean(errors.point)}
        />
      </Form.Group>
      <Button
        el="button"
        variant="primary"
        className="flex! items-center gap-1"
        loading={isLoading}
      >
        <Save width={16} height={16} />
        <span>Submit</span>
      </Button>
    </Form>
  );
}
