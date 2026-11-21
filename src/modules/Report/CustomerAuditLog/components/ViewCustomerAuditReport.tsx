import { Card } from 'antd';
import type { ICustomerAuditLogList } from '../types/customerAuditLogTypes';

const ViewCustomerAuditReport = ({
  record,
}: {
  record: ICustomerAuditLogList;
}) => {
  let content = '{}';
  try {
    const raw = record.details || record.changes;
    if (raw) {
      if (typeof raw === 'object') {
        content = JSON.stringify(raw, null, 2);
      } else if (typeof raw === 'string') {
        try {
          content = JSON.stringify(JSON.parse(raw), null, 2);
        } catch {
          content = raw;
        }
      }
    }
  } catch {
    content = '{}';
  }

  return (
    <Card style={{ background: '#f6f8fa' }}>
      <pre style={{ margin: 0, maxHeight: '60vh', overflow: 'auto' }}>
        <code>{content}</code>
      </pre>
    </Card>
  );
};

export default ViewCustomerAuditReport;

