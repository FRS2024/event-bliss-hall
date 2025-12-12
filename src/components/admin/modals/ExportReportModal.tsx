import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';

interface ExportReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ExportType = 'users' | 'venues' | 'bookings' | 'overview';

const ExportReportModal: React.FC<ExportReportModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [exportType, setExportType] = React.useState<ExportType>('overview');
  const [includeFields, setIncludeFields] = React.useState({
    users: true,
    venues: true,
    bookings: true,
    revenue: true,
  });
  const [isExporting, setIsExporting] = React.useState(false);

  const { data: exportData, refetch } = useQuery({
    queryKey: ['admin-export-data', exportType],
    queryFn: async () => {
      switch (exportType) {
        case 'users':
          const { data: users } = await supabase
            .from('profiles')
            .select('id, full_name, business_name, phone, user_role, created_at, is_suspended')
            .order('created_at', { ascending: false });
          return users;
        case 'venues':
          const { data: venues } = await supabase
            .from('venues')
            .select('id, name, city, address, category, capacity, price_per_hour, price_per_day, is_active, created_at')
            .order('created_at', { ascending: false });
          return venues;
        case 'bookings':
          const { data: bookings } = await supabase
            .from('bookings')
            .select('id, event_date, guest_count, total_price, status, created_at')
            .order('created_at', { ascending: false });
          return bookings;
        case 'overview':
          const [usersRes, venuesRes, bookingsRes] = await Promise.all([
            supabase.from('profiles').select('id, created_at'),
            supabase.from('venues').select('id, is_active, created_at'),
            supabase.from('bookings').select('id, total_price, status, created_at'),
          ]);
          return {
            totalUsers: usersRes.data?.length || 0,
            totalVenues: venuesRes.data?.length || 0,
            activeVenues: venuesRes.data?.filter(v => v.is_active)?.length || 0,
            totalBookings: bookingsRes.data?.length || 0,
            totalRevenue: bookingsRes.data?.reduce((sum, b) => sum + Number(b.total_price || 0), 0) || 0,
            confirmedBookings: bookingsRes.data?.filter(b => b.status === 'confirmed')?.length || 0,
            pendingBookings: bookingsRes.data?.filter(b => b.status === 'pending')?.length || 0,
          };
        default:
          return null;
      }
    },
    enabled: false,
  });

  const convertToCSV = (data: any[], type: ExportType): string => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      ),
    ];
    return csvRows.join('\n');
  };

  const convertOverviewToCSV = (data: any): string => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Users', data.totalUsers],
      ['Total Venues', data.totalVenues],
      ['Active Venues', data.activeVenues],
      ['Total Bookings', data.totalBookings],
      ['Total Revenue (DA)', data.totalRevenue],
      ['Confirmed Bookings', data.confirmedBookings],
      ['Pending Bookings', data.pendingBookings],
      ['Export Date', new Date().toISOString()],
    ];
    return rows.map(row => row.join(',')).join('\n');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await refetch();
      const data = result.data;

      if (!data) {
        throw new Error('No data to export');
      }

      let csv: string;
      if (exportType === 'overview') {
        csv = convertOverviewToCSV(data);
      } else {
        csv = convertToCSV(data as any[], exportType);
      }

      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `easyhall_${exportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export Successful',
        description: `Your ${exportType} report has been downloaded.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Export Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={exportType} onValueChange={(v) => setExportType(v as ExportType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Platform Overview</SelectItem>
                <SelectItem value="users">User Report</SelectItem>
                <SelectItem value="venues">Venue Report</SelectItem>
                <SelectItem value="bookings">Booking Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {exportType === 'overview' && (
            <div className="space-y-3 p-3 bg-muted rounded-lg">
              <Label className="text-sm font-medium">Include in Overview:</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-users"
                    checked={includeFields.users}
                    onCheckedChange={(checked) => 
                      setIncludeFields(prev => ({ ...prev, users: !!checked }))
                    }
                  />
                  <label htmlFor="include-users" className="text-sm">User Statistics</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-venues"
                    checked={includeFields.venues}
                    onCheckedChange={(checked) => 
                      setIncludeFields(prev => ({ ...prev, venues: !!checked }))
                    }
                  />
                  <label htmlFor="include-venues" className="text-sm">Venue Statistics</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-bookings"
                    checked={includeFields.bookings}
                    onCheckedChange={(checked) => 
                      setIncludeFields(prev => ({ ...prev, bookings: !!checked }))
                    }
                  />
                  <label htmlFor="include-bookings" className="text-sm">Booking Statistics</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-revenue"
                    checked={includeFields.revenue}
                    onCheckedChange={(checked) => 
                      setIncludeFields(prev => ({ ...prev, revenue: !!checked }))
                    }
                  />
                  <label htmlFor="include-revenue" className="text-sm">Revenue Data</label>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-primary/10 rounded-lg text-sm">
            <p className="font-medium">Export Format: CSV</p>
            <p className="text-muted-foreground">
              The report will be downloaded as a CSV file that can be opened in Excel or Google Sheets.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportReportModal;
