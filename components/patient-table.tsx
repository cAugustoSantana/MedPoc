'use client';

import type React from 'react';

import { useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';

import { useTranslations } from '@/hooks/use-translations';

import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  EllipsisIcon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';

import { cn, formatPhoneNumber } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Patient } from '@/types/patient';
import {
  deletePatientAction,
  deleteMultiplePatientsAction,
} from '@/app/(app)/patient/actions';
import { toast } from 'sonner';

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Patient> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.email}`.toLowerCase();
  const searchTerm = (filterValue ?? '').toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Patient> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

// rececive data from the parent component
export default function PatientTable({
  data,
  addPatientComponent,
}: Readonly<{
  data: Patient[];
  addPatientComponent?: React.ReactNode;
}>) {
  const id = useId();
  const { t } = useTranslations();
  const router = useRouter();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'name',
      desc: false,
    },
  ]);

  const columns: ColumnDef<Patient>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: t('common.name'),
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="font-medium text-left">{row.getValue('name')}</div>
      ),
      size: 180,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: t('common.email'),
      accessorKey: 'email',
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('email')}</div>
      ),
      size: 220,
    },
    {
      header: t('common.address'),
      accessorKey: 'address',
      cell: ({ row }) => (
        <div className="text-left"> {row.getValue('address')}</div>
      ),
      size: 180,
    },
    {
      header: t('common.phone'),
      accessorKey: 'phone',
      cell: ({ row }) => {
        const phone: string = row.getValue('phone');
        const formattedPhone = formatPhoneNumber(phone);
        return (
          <div className="text-right w-full justify-end flex">
            {formattedPhone}
          </div>
        );
      },
      size: 100,
      filterFn: statusFilterFn,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActions patient={row.original} />,
      size: 60,
      enableHiding: false,
    },
  ];

  const handleDeleteRows = async () => {
    const selectedRows = table.getSelectedRowModel().rows;

    if (selectedRows.length === 0) return;

    setIsDeleting(true);

    try {
      // Delete all selected patients using server action
      const patientIds = selectedRows.map((row) => row.original.patientId);
      const result = await deleteMultiplePatientsAction(patientIds);

      if (result.success) {
        // Reset row selection
        table.resetRowSelection();
        toast.success('Patients deleted successfully!', {
          description: `${selectedRows.length} patient${selectedRows.length === 1 ? '' : 's'} removed from the system.`,
          duration: 5000,
        });
      } else {
        console.error('Failed to delete patients:', result.error);
        toast.error('Failed to delete patients', {
          description: result.error || 'Please try again.',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error deleting patients:', error);
      toast.error('Failed to delete patients', {
        description: 'An unexpected error occurred. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRowClick = (patient: Patient, event: React.MouseEvent) => {
    // Prevent navigation if clicking on interactive elements
    const target = event.target as HTMLElement;
    const isInteractiveElement = target.closest(
      'button, input, [role="checkbox"], [role="menuitem"]'
    );

    if (!isInteractiveElement) {
      router.push(`/patient/${patient.uuid}`);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  // Get unique status values for filter
  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn('status');
    if (!statusColumn) return [];
    const values = Array.from(statusColumn.getFacetedUniqueValues().keys());
    return values.sort();
  }, [table]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn('status');
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table]);

  const selectedStatuses = useMemo(() => {
    const statusColumn = table.getColumn('status');
    const filterValue = statusColumn?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn('status')?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn('status')
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Filter by name or email */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                'peer min-w-60 ps-9',
                Boolean(table.getColumn('name')?.getFilterValue()) && 'pe-9'
              )}
              value={
                (table.getColumn('name')?.getFilterValue() ?? '') as string
              }
              onChange={(e) =>
                table.getColumn('name')?.setFilterValue(e.target.value)
              }
              placeholder={t('patient.filterPlaceholder')}
              type="text"
              aria-label={t('patient.filterPlaceholder')}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn('name')?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn('name')?.setFilterValue('');
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          {/* Filter by status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                {t('common.status')}
                {selectedStatuses.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedStatuses.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  {t('common.filters')}
                </div>
                <div className="space-y-3">
                  {uniqueStatusValues.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-${i}`}
                        checked={selectedStatuses.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleStatusChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${id}-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        {value}{' '}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {statusCounts.get(value)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                {t('common.view')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('common.toggleColumns')}</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto bg-transparent" variant="outline">
                  <TrashIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  {t('common.delete')}
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{' '}
                      {table.getSelectedRowModel().rows.length} selected{' '}
                      {table.getSelectedRowModel().rows.length === 1
                        ? 'row'
                        : 'rows'}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    {t('common.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteRows}
                    disabled={isDeleting}
                  >
                    {isDeleting ? t('common.saving') : t('common.saveChanges')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Add user button */}
          {addPatientComponent || (
            <Button className="ml-auto bg-transparent" variant="outline">
              <PlusIcon
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Add user
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  // Determine alignment based on column ID
                  let align = 'left';
                  if (header.id === 'select' || header.id === 'actions') {
                    align = 'center';
                  } else if (header.id === 'phone') {
                    align = 'right';
                  }

                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className={`h-11 text-${align}`}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={(event) => handleRowClick(row.original, event)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => {
                    // Determine alignment based on column ID
                    let align = 'left';
                    if (
                      cell.column.id === 'select' ||
                      cell.column.id === 'actions'
                    ) {
                      align = 'center';
                    } else if (cell.column.id === 'phone') {
                      align = 'right';
                    }

                    return (
                      <TableCell
                        key={cell.id}
                        className={`last:py-0 text-${align}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            {t('common.rowFooter')}
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{' '}
            of{' '}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50 bg-transparent"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50 bg-transparent"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50 bg-transparent"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50 bg-transparent"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function RowActions({ patient }: { patient: Patient }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslations();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePatientAction(patient.patientId);

      if (result.success) {
        toast.success('Patient deleted successfully!', {
          description: `${patient.name} has been removed from the system.`,
          duration: 5000,
        });
      } else {
        toast.error('Failed to delete patient', {
          description: result.error || 'Please try again.',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient', {
        description: 'An unexpected error occurred. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit item"
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>{t('common.edit')}</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>{t('common.duplicate')}</span>
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>{t('common.archive')}</span>
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{t('common.more')}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>{t('common.moveProject')}</DropdownMenuItem>
                <DropdownMenuItem>{t('common.moveFolder')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t('common.moveFolder')} </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>{t('common.share')}</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>{t('common.addFavorites')}</span>
            <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              disabled={isDeleting}
              onSelect={(e) => e.preventDefault()}
            >
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <CircleAlertIcon className="opacity-80" size={16} />
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  patient <strong>{patient.name}</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                {t('common.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? t('common.deleting') : t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
