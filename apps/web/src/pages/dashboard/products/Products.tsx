import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { SquarePen } from 'lucide-react';

import { Button } from '../../../components/atoms/button/Button';
import { SubHeader } from '../../../components/atoms/sub-header/SubHeader';
import { Breadcrumb } from '../../../components/molecules/breadcrumb/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../../../store/index.util';
import type { ResponseWithRecord } from '../../../lib/utils/types.utils';
import type { Product } from './Products.types';
import { get } from '../../../lib/http/http-request';
import { DataTable } from '../../../components/organisms/data-table/DataTable';
import {
  constructPaginationString,
  extractPaginationFromQueryParams,
  makeDigitHumanReadable,
  makeFirstLetterUppercase,
} from '../../../lib/utils/helpers.utils';
import {
  loadProducts,
  setProductError,
} from '../../../store/slice/products/products.slice';
import { Paginator } from '../../../components/organisms/paginator/Paginator';
import { Modal } from '../../../components/organisms/modal/Modal';
import { ProductForm } from './Products.partials';
import { AlertPopup } from '../../../components/molecules/alert-popup/AlertPopup';
import { useAlertPopup } from '../../../lib/hooks/use-alert-popup/useAlertPopup';
import { PRODUCT_COLUMNS_HEADING } from './Products.utils';

export default function Products(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const productState = useAppSelector((state) => state.product);
  const {
    alertInfo,
    hideAlert,
    setAlertInfo,
    showAlert,
    state: alertState,
  } = useAlertPopup();

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const result = await get<ResponseWithRecord<Product>>(
          `products?${searchParams.toString()}`,
        );
        dispatch(
          loadProducts({
            ...result,
            status: 'fullfilled',
          }),
        );
      } catch (error) {
        console.log('Failed to load products: ', error);
        dispatch(
          setProductError({
            errorMessage: (error as Error).message,
          }),
        );
      }
    };

    fetchProducts();
  }, [dispatch, searchParams]);

  const hideModal = (): void => {
    const pagination = extractPaginationFromQueryParams(searchParams);
    const params = constructPaginationString(pagination);
    navigate(`${pathname}${params ? '?' + params : ''}`);
  };

  const handleDataTableAction = (
    action: 'edit' | 'delete',
    id: number,
  ): void => {
    const pagination = extractPaginationFromQueryParams(searchParams);
    const params = constructPaginationString(pagination);
    navigate(
      `${pathname}?action=${action}&id=${id}${params ? '&' + params : ''}`,
    );
  };

  const action = searchParams.get('action');
  const idInSearchParams = searchParams.get('id');

  return (
    <>
      <AlertPopup
        show={alertState}
        variant={alertInfo?.variant}
        headline="Login"
        message={alertInfo?.message}
        onToggle={hideAlert}
      />
      <SubHeader>
        <Breadcrumb>
          <Breadcrumb.Item path="/dashboard">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>Products</Breadcrumb.Item>
        </Breadcrumb>
        <Button
          el="button"
          type="button"
          variant="primary"
          className="flex! items-center gap-2"
          onClick={() => navigate(`${pathname}?action=create`)}
        >
          Add Product
        </Button>
      </SubHeader>
      <DataTable columnHeadlines={PRODUCT_COLUMNS_HEADING}>
        {productState.data.map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>
              {new Date(item.createdAt).toLocaleString()}
            </DataTable.Cell>
            <DataTable.Cell>
              {new Date(item.updatedAt).toLocaleString()}
            </DataTable.Cell>
            <DataTable.Cell>
              <div className="flex items-center gap-1">
                <img
                  src={`${import.meta.env.VITE_BASE_SERVER}/${item.image}`}
                  alt={item.name}
                  className="w-12 rounded-sm"
                />
                <span>{item.name}</span>
              </div>
            </DataTable.Cell>
            <DataTable.Cell>
              {makeDigitHumanReadable(item.point)}
            </DataTable.Cell>
            <DataTable.Cell>
              ${makeDigitHumanReadable(item.price)}
            </DataTable.Cell>
            <DataTable.Cell>
              <DataTable.Action
                className="w-fit! py-2 rounded-md"
                onClick={() => handleDataTableAction('edit', item.id)}
              >
                <SquarePen width={16} height={16} />
              </DataTable.Action>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
      <Paginator count={productState.count} />
      <Modal
        title={`${makeFirstLetterUppercase(action ?? undefined)} Product`}
        state={Boolean(action)}
        onToggle={hideModal}
      >
        <ProductForm
          action={action}
          idInSearchParams={idInSearchParams}
          onShowAlert={showAlert}
          onSetAlertInfo={setAlertInfo}
          onHideModal={hideModal}
        />
      </Modal>
    </>
  );
}
