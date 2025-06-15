
export interface DisputeData {
  id: string;
  content_id: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  flagged_by: string | null;
  admin_id: string | null;
  booking_event_date: string | null;
  booking_total_price: number | null;
  booking_guest_count: number | null;
  venue_name: string | null;
  guest_name: string | null;
  host_name: string | null;
  host_business: string | null;
}

export interface DisputeMetrics {
  pending: number;
  investigating: number;
  resolved: number;
  totalAmount: number;
}
