import { Empty, Table, Typography, type TableProps } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { setQuery } from '../../app/features/filterSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';

interface Props<T> extends Omit<
  TableProps<T>,
  'rowKey' | 'columns' | 'dataSource'
> {
  size?: 'small' | 'middle' | 'large';
  rowKey: string | keyof T | ((record: T) => string);
  columns: ColumnsType<T>;
  dataSource?: T[];
  data?: T[];
  loading?: boolean;
  showTotal?: boolean; // optional total row title
  total?: number; // total total for pagination
  showSL?: boolean;
}

const AntTable = <T extends object>({
  size = 'small',
  rowKey,
  columns,
  dataSource = [],
  data,
  loading = false,
  showTotal = true,
  total,
  showSL = true,
  pagination,
  ...rest
}: Props<T>) => {
  const tableDataSource = dataSource && dataSource.length ? dataSource : (data || []);
  const { limit, skip } = useAppSelector((state) => state.filter);

  const dispatch = useAppDispatch();

  const onChange = (pagination: TablePaginationConfig) => {
    const current = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? 100;

    dispatch(
      setQuery({
        limit: pageSize,
        skip: (current - 1) * pageSize,
      }),
    );
  };
  const pageSizeOption = [100, 200, 300, 400, 500];

  const resolveRowKey = (record: T): string => {
    if (typeof rowKey === 'function') return rowKey(record);
    const rec = record as Record<string, unknown>;
    const keyStr = String(rowKey);
    if (rec && rec[keyStr] !== undefined) return String(rec[keyStr]);
    if (rec && rec.id !== undefined) return String(rec.id);
    return keyStr;
  };

  return (
    <Table<T>
      bordered
      loading={loading}
      size={size}
      rowKey={resolveRowKey as TableProps<T>['rowKey']}
      columns={[
        ...(showSL
          ? [
              {
                title: 'SL.',
                render: (_: string, __: object, index: number) =>
                  skip + index + 1,
                width: 60,
              },
            ]
          : []),
        ...columns,
      ]}
      dataSource={tableDataSource}
      scroll={{ x: 'max-content', y: 600 }}
      className="custom-scroll print-table"
      title={
        showTotal
          ? () => (
              <Typography.Text italic>
                Total Result Found <strong>{total || 0}</strong>. Now Showing{' '}
                <strong>{skip + 1}</strong> to{' '}
                <strong>{Math.min(skip + limit, total || 0)}</strong>.
              </Typography.Text>
            )
          : undefined
      }
      locale={{ emptyText: <Empty description="No Data" /> }}
      pagination={
        pagination !== undefined
          ? pagination
          : limit <= (total || 0)
            ? {
                current: Math.floor(skip / limit) + 1,
                pageSize: limit,
                total: total,
                showSizeChanger: true,
                pageSizeOptions: pageSizeOption,
              }
            : false
      }
      onChange={onChange}
      {...rest}
    />
  );
};

export default AntTable;
