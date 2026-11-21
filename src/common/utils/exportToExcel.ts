import { message } from 'antd';
import * as xlsx from 'xlsx-js-style';

export interface ExcelColumn<T = unknown> {
  title?: string;
  dataIndex?: string;
  key?: string;
  render?: (value: unknown, record: T, index: number) => unknown;
}

interface ValidExcelColumn<T> {
  title: string;
  dataIndex?: string;
  key?: string;
  render?: (value: unknown, record: T, index: number) => unknown;
}

export const exportToExcel = <T extends object>(
  data: T[],
  fileName: string,
  columns?: ExcelColumn<T>[] | ExcelColumn<unknown>[],
  summary?: Record<string, unknown>,
  primaryColorHex?: string
) => {
  if (!data || data.length === 0) {
    message.error('Nothing to export');
    return;
  }

  let exportData: Record<string, unknown>[] = [];
  const themeColor = (primaryColorHex || '#1677FF').replace('#', '').toUpperCase();

  const validColumns: ValidExcelColumn<T>[] = (columns || []).filter(
    (col): col is ValidExcelColumn<T> =>
      typeof col.title === 'string' && Boolean(col.dataIndex || col.key)
  );

  if (validColumns.length > 0) {
    exportData = data.map((item) => {
      const rowData: Record<string, unknown> = {};
      const itemRecord = item as Record<string, unknown>;
      validColumns.forEach((col) => {
        const val = col.dataIndex ? itemRecord[col.dataIndex] : undefined;

        if (col.render) {
          try {
            const renderedValue = col.render(val, item, 0);
            if (typeof renderedValue === 'string' || typeof renderedValue === 'number') {
              rowData[col.title] = renderedValue;
              return;
            }
            if (!renderedValue || typeof renderedValue === 'boolean') {
              rowData[col.title] = '';
              return;
            }
            if (
              renderedValue &&
              typeof renderedValue === 'object' &&
              'props' in (renderedValue as Record<string, unknown>)
            ) {
              const children = (renderedValue as { props?: { children?: unknown } }).props?.children;
              if (typeof children === 'string' || typeof children === 'number') {
                rowData[col.title] = children;
                return;
              }
              if (Array.isArray(children)) {
                rowData[col.title] = children.join('');
                return;
              }
            }
          } catch {
            // Ignore render error and fallback
          }
        }

        if (val !== undefined && val !== null) {
          if (Array.isArray(val)) {
            rowData[col.title] = val.join(', ');
          } else {
            rowData[col.title] = val;
          }
        } else {
          rowData[col.title] = '';
        }
      });
      return rowData;
    });

    if (summary) {
      const summaryRow: Record<string, unknown> = {};
      validColumns.forEach((col) => {
        const key = col.dataIndex || col.key;
        if (key && summary[key] !== undefined) {
          summaryRow[col.title] = summary[key];
        } else {
          summaryRow[col.title] = '';
        }
      });
      exportData.push(summaryRow);
    }
  } else {
    exportData = data.map((item) => ({ ...(item as Record<string, unknown>) }));
    if (summary) {
      exportData.push(summary);
    }
  }

  const ws = xlsx.utils.json_to_sheet(exportData);

  const range = xlsx.utils.decode_range(ws['!ref'] || 'A1');
  const hasSummary = Boolean(summary);
  const lastRow = range.e.r;

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = xlsx.utils.encode_cell(cell_address);
      const cell = ws[cell_ref];

      if (!cell) continue;

      if (R === 0) {
        cell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: themeColor } },
          alignment: { horizontal: 'left', vertical: 'center' },
        };
      } else if (hasSummary && R === lastRow) {
        cell.s = {
          font: { bold: true },
          border: {
            top: { style: 'medium', color: { rgb: themeColor } },
          },
          alignment: { horizontal: 'left', vertical: 'center' },
        };
      } else {
        cell.s = {
          alignment: { horizontal: 'left', vertical: 'center' },
        };
      }
    }
  }

  if (validColumns.length > 0) {
    const wscols = validColumns.map((col) => {
      const titleLength = col.title.length;
      let maxDataLength = titleLength;

      exportData.forEach((row) => {
        const cellValue = row[col.title];
        if (cellValue !== null && cellValue !== undefined) {
          const cellLength = String(cellValue).length;
          if (cellLength > maxDataLength) maxDataLength = cellLength;
        }
      });

      return { wch: Math.min(Math.max(maxDataLength + 2, 15), 50) };
    });
    ws['!cols'] = wscols;
  }

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
  xlsx.writeFile(wb, `${fileName}.xlsx`);
};
