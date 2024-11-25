import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ProcessingOptionsProps {
  emailColumnIndex: string;
  setEmailColumnIndex: (value: string) => void;
  removeEmptyEmails: boolean;
  setRemoveEmptyEmails: (value: boolean) => void;
}

export function ProcessingOptions({
  emailColumnIndex,
  setEmailColumnIndex,
  removeEmptyEmails,
  setRemoveEmptyEmails,
}: ProcessingOptionsProps) {
  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="emailColumn">Email Column Index</Label>
        <Input
          type="number"
          id="emailColumn"
          placeholder="Enter column number (0-based)"
          value={emailColumnIndex}
          onChange={(e) => setEmailColumnIndex(e.target.value)}
          min="0"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="removeEmpty"
          checked={removeEmptyEmails}
          onCheckedChange={(checked) =>
            setRemoveEmptyEmails(checked as boolean)
          }
        />
        <Label htmlFor="removeEmpty">Remove rows with empty emails</Label>
      </div>
    </div>
  );
}
