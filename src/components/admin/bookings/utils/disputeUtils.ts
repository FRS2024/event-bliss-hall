
import { DisputeData, DisputeMetrics } from '../types';

export const calculateDisputeMetrics = (disputes: DisputeData[] = []): DisputeMetrics => {
  const pending = disputes.filter(d => d.status === 'pending').length;
  const investigating = disputes.filter(d => d.status === 'investigating').length;
  const resolved = disputes.filter(d => d.status === 'resolved').length;
  const totalAmount = disputes.reduce((sum, dispute) => sum + Number(dispute.booking_total_price || 0), 0);

  return {
    pending,
    investigating,
    resolved,
    totalAmount
  };
};
