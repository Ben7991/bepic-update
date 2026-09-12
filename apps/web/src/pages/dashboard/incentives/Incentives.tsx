import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search, SquarePen, Trash2 } from 'lucide-react';

import { get } from '../../../lib/http/http-request';
import type { Incentive } from './Incentive.types';
import type { ResponseWithRecord } from '../../../lib/utils/types.utils';
import { Form } from '../../../components/atoms/form/Form';
import { Button } from '../../../components/atoms/button/Button';
import { Breadcrumb } from '../../../components/molecules/breadcrumb/Breadcrumb';
import { DataTable } from '../../../components/organisms/data-table/DataTable';
import { Modal } from '../../../components/organisms/modal/Modal';
import { IncentiveForm } from './Incentive.partials';
import { useAppDispatch, useAppSelector } from '../../../store/index.util';
import {
  loadIncentives,
  setIncentiveError,
} from '../../../store/slice/incentives/incentive.slice';
import { useAlertPopup } from '../../../lib/hooks/use-alert-popup/useAlertPopup';
import { AlertPopup } from '../../../components/molecules/alert-popup/AlertPopup';
import { makeFirstLetterUppercase } from '../../../lib/utils/helpers.utils';

export default function Incentives(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const incentiveState = useAppSelector((state) => state.incentive);
  const {
    alertInfo,
    hideAlert,
    setAlertInfo,
    showAlert,
    state: alertState,
  } = useAlertPopup();

  useEffect(() => {
    const fetchIncentives = async () => {
      try {
        const result = await get<ResponseWithRecord<Incentive>>('incentives');
        dispatch(
          loadIncentives({
            ...result,
            status: 'fullfilled',
          }),
        );
      } catch (error) {
        console.error('Failed to load incentives: ', error);
        dispatch(
          setIncentiveError({
            errorMessage: (error as Error).message,
          }),
        );
      }
    };

    fetchIncentives();
  }, [dispatch]);

  const hideModal = (): void => {
    navigate(basePathname);
  };

  const action = searchParams.get('action');
  const idInSearchParams = searchParams.get('id');
  const basePathname = '/dashboard/incentives';

  return (
    <>
      <AlertPopup
        show={alertState}
        variant={alertInfo?.variant}
        headline="Login"
        message={alertInfo?.message}
        onToggle={hideAlert}
      />
      <Breadcrumb className="mt-4">
        <Breadcrumb.Item path="/dashboard">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>Incentives</Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 my-4 md:mb-6">
        <Form.Control
          type="search"
          placeholder="Search for incentives ..."
          className="basis-full  md:basis-5/12 lg:basis-4/12 2xl:basis-3/12"
          leftIcon={<Search width={16} height={16} className="text-gray-400" />}
        />
        <Button
          el="button"
          type="button"
          variant="primary"
          className="flex! items-center gap-2"
          onClick={() => navigate(`${basePathname}?action=create`)}
        >
          Add Incentive
        </Button>
      </div>
      <DataTable columnHeadlines={['Date Added', 'Point', 'Award', 'Action']}>
        {incentiveState.data.map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>
              {new Date(item.createdAt).toLocaleString()}
            </DataTable.Cell>
            <DataTable.Cell>{item.point}</DataTable.Cell>
            <DataTable.Cell>{item.award}</DataTable.Cell>
            <DataTable.Cell>
              <DataTable.Actions>
                <DataTable.Action
                  className="flex! items-center gap-2"
                  onClick={() =>
                    navigate(`${basePathname}?action=edit&id=${item.id}`)
                  }
                >
                  <SquarePen width={16} height={16} />
                  <span>Edit</span>
                </DataTable.Action>
                <DataTable.Action
                  className="flex! items-center gap-2 text-red-500"
                  onClick={() =>
                    navigate(`${basePathname}?action=delete&id=${item.id}`)
                  }
                >
                  <Trash2 width={16} height={16} />
                  <span>Delete</span>
                </DataTable.Action>
              </DataTable.Actions>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
      <Modal
        title={`${makeFirstLetterUppercase(action ?? undefined)} Incentive`}
        state={Boolean(action)}
        onToggle={hideModal}
      >
        <IncentiveForm
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
