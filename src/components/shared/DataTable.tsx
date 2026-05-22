"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface Column<T> {
  header?: string;
  label?: string;
  accessorKey?: keyof T | string;
  key?: string;
  cell?: (item: T) => ReactNode;
  render?: (val: any, item: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (item: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T>({ 
  data, 
  columns, 
  keyExtractor = (item: any) => item.id || Math.random().toString(), 
  emptyMessage = "No results.",
  isLoading = false
}: DataTableProps<T>) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index} className={col.className}>{col.header || col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={keyExtractor(item)}>
                {columns.map((col, index) => {
                  const valKey = (col.accessorKey || col.key) as keyof T;
                  const value = item[valKey];
                  
                  return (
                    <TableCell key={index} className={col.className}>
                      {col.cell ? col.cell(item) : col.render ? col.render(value, item) : String(value ?? '')}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
