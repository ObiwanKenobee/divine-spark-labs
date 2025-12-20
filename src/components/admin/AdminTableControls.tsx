import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, Trash2 } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  goToFirstPage,
  goToLastPage,
  goToNextPage,
  goToPrevPage,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Showing {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} of {totalItems}
        </span>
        <Select value={String(itemsPerPage)} onValueChange={(v) => onItemsPerPageChange(Number(v))}>
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span>per page</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={goToFirstPage} disabled={currentPage === 1}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-3 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={goToLastPage} disabled={currentPage === totalPages}>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface BulkActionsBarProps {
  selectedCount: number;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
  onExport?: () => void;
  showExport?: boolean;
  isDeleting?: boolean;
}

export function BulkActionsBar({
  selectedCount,
  onDeleteSelected,
  onClearSelection,
  onExport,
  showExport = false,
  isDeleting = false,
}: BulkActionsBarProps) {
  if (selectedCount === 0 && !showExport) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md mb-4">
      {selectedCount > 0 && (
        <>
          <span className="text-sm font-medium">{selectedCount} selected</span>
          <Button variant="destructive" size="sm" onClick={onDeleteSelected} disabled={isDeleting}>
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </Button>
          <Button variant="outline" size="sm" onClick={onClearSelection}>
            Clear Selection
          </Button>
        </>
      )}
      {showExport && onExport && (
        <Button variant="outline" size="sm" onClick={onExport} className="ml-auto">
          <Download className="h-4 w-4 mr-1" />
          Export CSV
        </Button>
      )}
    </div>
  );
}

export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string, columns?: { key: keyof T; label: string }[]) {
  if (data.length === 0) return;

  let csvContent: string;

  if (columns) {
    const headers = columns.map((c) => c.label).join(",");
    const rows = data.map((row) =>
      columns.map((c) => `"${String(row[c.key] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    csvContent = [headers, ...rows].join("\n");
  } else {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    csvContent = [headers, ...rows].join("\n");
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
