export type TimelineItem = {
  id: string;
  assignedTo: string;
  assignedDate: string;
  returnedDate?: string | null;
};

export function AssignmentTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="font-medium text-slate-900">Assigned to {item.assignedTo}</p>
          <p className="text-sm text-slate-600">Assigned: {new Date(item.assignedDate).toLocaleDateString()}</p>
          <p className="text-sm text-slate-600">Returned: {item.returnedDate ? new Date(item.returnedDate).toLocaleDateString() : "Active"}</p>
        </li>
      ))}
    </ol>
  );
}
