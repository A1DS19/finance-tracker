import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

type DatePickerProps = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative flex items-center">
          <Input
            readOnly
            value={value ? format(value, "PPP") : ""}
            placeholder="Pick a date"
            className="pr-10 cursor-pointer flex items-center"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          disabled={{ after: new Date() }}
        />
      </PopoverContent>
    </Popover>
  );
}
