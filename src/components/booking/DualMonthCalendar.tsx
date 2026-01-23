import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { cn } from '@/lib/utils';

interface DualMonthCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  isDateAvailable: (date: Date) => boolean;
  isPastDate: (date: Date) => boolean;
  isLoading?: boolean;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MonthGrid: React.FC<{
  month: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  isDateAvailable: (date: Date) => boolean;
  isPastDate: (date: Date) => boolean;
}> = ({ month, selectedDate, onDateSelect, isDateAvailable, isPastDate }) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="flex-1 min-w-[280px]">
      {/* Month Header */}
      <div className="text-center mb-4">
        <h3 className="text-base font-semibold text-foreground">
          {format(month, 'MMMM yyyy')}
        </h3>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, month);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isPast = isPastDate(day);
          const isAvailable = isDateAvailable(day);
          const isDisabled = !isCurrentMonth || isPast || !isAvailable;

          return (
            <button
              key={index}
              type="button"
              disabled={isDisabled}
              onClick={() => onDateSelect(day)}
              className={cn(
                'h-10 w-10 mx-auto flex items-center justify-center text-sm rounded-full transition-all duration-200',
                // Base styles
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                // Not current month
                !isCurrentMonth && 'invisible',
                // Current month styles
                isCurrentMonth && !isDisabled && !isSelected && [
                  'text-foreground hover:bg-accent cursor-pointer',
                ],
                // Disabled/unavailable
                isCurrentMonth && isDisabled && [
                  'text-muted-foreground/40 cursor-not-allowed',
                ],
                // Selected date
                isSelected && [
                  'bg-primary text-primary-foreground font-semibold',
                  'hover:bg-primary/90',
                ]
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DualMonthCalendar: React.FC<DualMonthCalendarProps> = ({
  selectedDate,
  onDateSelect,
  isDateAvailable,
  isPastDate,
  isLoading = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const nextMonth = addMonths(currentMonth, 1);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Don't allow navigating to past months
  const canGoPrevious = startOfMonth(currentMonth) > startOfMonth(new Date());

  if (isLoading) {
    return (
      <div className="p-6 bg-card rounded-xl border border-border">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-card rounded-xl border border-border">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          disabled={!canGoPrevious}
          className="h-8 w-8 rounded-full hover:bg-accent disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8 rounded-full hover:bg-accent"
        >
          <ChevronRight className="h-5 w-5 rtl:rotate-180" />
        </Button>
      </div>

      {/* Dual Month Display */}
      <div className="flex flex-col md:flex-row gap-8">
        <MonthGrid
          month={currentMonth}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          isDateAvailable={isDateAvailable}
          isPastDate={isPastDate}
        />
        <MonthGrid
          month={nextMonth}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          isDateAvailable={isDateAvailable}
          isPastDate={isPastDate}
        />
      </div>
    </div>
  );
};

export default DualMonthCalendar;
