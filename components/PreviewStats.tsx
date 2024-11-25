import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PreviewStatsProps {
  stats: {
    totalEmails: number;
    totalRows: number;
    totalEmptyEmails: number;
    totalDuplicateEmails: number;
    columnName: string;
  };
}


export function PreviewStats({ stats }: PreviewStatsProps) {
  return (
    <Card className="bg-slate-50">
      <CardHeader>
        <CardTitle className="text-lg">Preview Statistics</CardTitle>
        <p className="text-sm text-blue-600">
          Column found: {stats.columnName}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Rows</p>
            <p className="text-2xl font-bold">{stats.totalRows}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Valid Emails</p>
            <p className="text-2xl font-bold">{stats.totalEmails}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Empty Emails</p>
            <p className="text-2xl font-bold">{stats.totalEmptyEmails}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duplicate Emails</p>
            <p className="text-2xl font-bold">{stats.totalDuplicateEmails}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
