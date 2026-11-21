import {
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  theme,
  Typography,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import CommonButton from '../../common/Button/CommonButton';
import PrintHeader from '../../common/print/PrintHeader';
import { useQueryParams } from '../../common/hooks/useQueryParams';
import DynamicBreadcrumb from '../../common/ui/DynamicBreadcrumb';
import { cleanQuery } from '../../common/utils/cleanQuery';
import { datePresets } from '../../common/utils/constant';
import useDebounce from '../../common/utils/debounced';
import { exportToExcel } from '../../common/utils/exportToExcel';
import { dateForPost } from '../../common/utils/helper.function';

import type { TableProps } from 'antd';

export interface IExportExcelConfig<T extends object = Record<string, unknown>> {
  data: T[];
  fileName: string;
  columns?: TableProps<T>['columns'];
  summary?: Partial<Record<Extract<keyof T, string> | (string & {}), unknown>>;
}

interface Props<T extends object = Record<string, unknown>> {
  children: ReactNode;
  title: string;
  options?: {
    showSearch?: boolean;
    showDateRange?: boolean;
    showExcel?: boolean;
    showPrint?: boolean;
    defaultMonth?: boolean;
    defaultDateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  };
  buttonText?: string;
  onClick?: () => void;
  additionalFilter?: ReactNode;
  exportExcel?: IExportExcelConfig<T>;
}

type AuditQuery = {
  limit: number;
  skip: number;
  search?: string;
  from_date?: string;
  to_date?: string;
};

function ReportContainer<T extends object = Record<string, unknown>>({
  children,
  title,
  options,
  additionalFilter,
  exportExcel,
}: Props<T>) {
  const {
    showSearch = false,
    showDateRange = true,
    showExcel = true,
    showPrint = true,
    defaultMonth = false,
    defaultDateRange,
  } = options || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, setQuery } = useQueryParams<AuditQuery>();
  const [search, seSearch] = useState(searchParams.get('search'));
  const debouncedValue = useDebounce(search);

  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  // Handle default date range if specified in options and not yet present in URL params
  useEffect(() => {
    if (defaultMonth && !query.from_date && !query.to_date) {
      setQuery({
        from_date: dateForPost(dayjs().startOf('month')),
        to_date: dateForPost(dayjs().endOf('month')),
      });
    } else if (defaultDateRange && !query.from_date && !query.to_date) {
      setQuery({
        from_date: dateForPost(defaultDateRange[0]),
        to_date: dateForPost(defaultDateRange[1]),
      });
    }
  }, [
    defaultMonth,
    defaultDateRange,
    query.from_date,
    query.to_date,
    setQuery,
  ]);

  useEffect(() => {
    setSearchParams((prev) => {
      const prevObj: Record<string, string> = {};
      prev.forEach((value, key) => {
        prevObj[key] = value;
      });

      const updated = cleanQuery({
        ...prevObj,
        search: encodeURIComponent(debouncedValue || ''),
      });

      return updated;
    });
  }, [debouncedValue, setSearchParams]);

  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();

  return (
    <div>
      <Flex
        align='center'
        justify='space-between'
        style={{ margin: '24px 16px 0px 24px' }}
        wrap
      >
        <Typography.Title style={{ margin: 0 }} level={2}>
          {title}
        </Typography.Title>
        <DynamicBreadcrumb />
      </Flex>

      <Content
        style={{
          margin: '24px 16px',
          padding: 16,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Flex wrap gap={8}>
          <Row style={{ flexGrow: 1 }} align={'middle'} gutter={[8, 8]}>
            {showSearch && (
              <Col xs={24} sm={8} lg={6}>
                <Input
                  onChange={(e) => seSearch(e.target.value)}
                  name={'search'}
                  value={search || ''}
                  placeholder='Search'
                />
              </Col>
            )}
            {showDateRange && (
              <Col xs={24} sm={8} lg={6}>
                <Form.Item label={'Date'} required layout='vertical'>
                  <DatePicker.RangePicker
                    onChange={(e) =>
                      setQuery({
                        from_date: dateForPost(e?.[0]),
                        to_date: dateForPost(e?.[1]),
                      })
                    }
                    value={
                      searchParams.get('from_date') &&
                      searchParams.get('to_date')
                        ? [
                            dayjs(searchParams.get('from_date')),
                            dayjs(searchParams.get('to_date')),
                          ]
                        : query.from_date && query.to_date
                          ? [dayjs(query.from_date), dayjs(query.to_date)]
                          : null
                    }
                    presets={datePresets}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            )}
            {additionalFilter}
          </Row>

          {showExcel && (
            <CommonButton
              onClick={() =>
                exportToExcel(
                  exportExcel?.data || [],
                  exportExcel?.fileName || title.replace(/\s+/g, '_'),
                  exportExcel?.columns as Parameters<typeof exportToExcel>[2],
                  exportExcel?.summary,
                  colorPrimary,
                )
              }
              text='Export Excel'
              icon='vscode-icons:file-type-excel'
            />
          )}
          {showPrint && (
            <CommonButton
              onClick={handlePrint}
              text='Print'
              icon='material-symbols-light:print-outline'
            />
          )}
        </Flex>

        <div style={{ marginTop: 20 }} ref={contentRef}>
          <div className="print-header" style={{ display: 'none', marginBottom: 20 }}>
            <PrintHeader />
            <div style={{ textAlign: 'center', margin: '20px 0 10px 0' }}>
              <span
                style={{
                  display: 'inline-block',
                  border: '1px solid #999',
                  padding: '6px 24px',
                  fontSize: '18px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: '#000',
                  letterSpacing: '1px'
                }}
              >
                {title}
              </span>
            </div>
          </div>

          {children}

          <div className="print-footer" style={{ display: 'none', textAlign: 'center', marginTop: 40 }}>
            <p style={{ margin: 0, color: '#555', fontSize: '12px' }}>
              Printed on: {dayjs().format('DD MMM YYYY, hh:mm A')}
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
              This document is generated by <strong>RSARTECH</strong>
            </p>
          </div>
        </div>
      </Content>
    </div>
  );
}

export default ReportContainer;
