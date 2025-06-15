
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DisputeData } from '../types';

interface DisputesTableProps {
  disputes: DisputeData[];
}

const DisputesTable: React.FC<DisputesTableProps> = ({ disputes }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'investigating': return 'secondary';
      case 'resolved': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dispute Details</TableHead>
          <TableHead>Booking Info</TableHead>
          <TableHead>Parties</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {disputes?.map((dispute) => (
          <TableRow key={dispute.id}>
            <TableCell>
              <div>
                <div className="font-medium">{dispute.reason}</div>
                <div className="text-sm text-gray-500">
                  #{dispute.id.slice(0, 8)}...
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{dispute.venue_name || 'Unknown Venue'}</div>
                <div className="text-sm text-gray-500">
                  {dispute.booking_event_date ? formatDate(dispute.booking_event_date) : 'No date'}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="text-sm">
                  <strong>Guest:</strong> {dispute.guest_name || 'Unknown'}
                </div>
                <div className="text-sm">
                  <strong>Host:</strong> {dispute.host_business || dispute.host_name || 'Unknown'}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                ${Number(dispute.booking_total_price || 0).toLocaleString()}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusColor(dispute.status)}>
                {dispute.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(dispute.created_at)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Investigate
                </Button>
                <Button variant="outline" size="sm">
                  Resolve
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DisputesTable;
