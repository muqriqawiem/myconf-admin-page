"use client";
import Loader from '@/components/Loader';
import { useGetAllUsersQuery } from '@/store/features/UserData';
import React, { useCallback, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from '../../../components/DataTable';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { User } from '@/model/User';
import Papa from 'papaparse';
import { useDeleteUsersMutation } from '@/store/features/UserData';
import { toast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullname",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "affilation",
    header: "Affilation",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "isVerified",
    header: "Verified User",
  },
];

const Page = () => {
  const [rowSelection, setRowSelection] = useState({}); // Track row selection state

  const { data: AllUsers, error: UserError, isLoading: loadingUsers } = useGetAllUsersQuery(undefined, {
    pollingInterval: 5000,
  });

  const [deleteUsers] = useDeleteUsersMutation();

  const handleDeleteUsers = async (selectedRows: User[]) => {
    const confirmDelete = window.confirm("Are you sure you want to delete the selected users?");
    if (!confirmDelete) return;

    try {
      // Extract IDs of selected users
      const selectedIds = selectedRows.map(row => row._id);

      // Call the delete mutation
      await deleteUsers(selectedIds as string[]).unwrap();

      // Show success toast
      toast({
        title: "Success",
        description: "Users deleted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to delete users: ', error);

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to delete users.",
        variant: "destructive",
      });
    }
  };

  // Function to handle CSV export
  const handleExportToCSV = useCallback((data: User[]) => {
    // Convert data to CSV format
    const csv = Papa.unparse(data, {
      header: true,
    });

    // Create a blob from the CSV string
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'users.csv'; // File name
    link.click(); // Trigger download

    // Clean up
    URL.revokeObjectURL(link.href);
  }, []);

  if (loadingUsers) {
    return <Loader />;
  }

  return (
    <div className='container mx-auto flex-col justify-between items-center'>
      {!UserError ? (
        <div>
          {AllUsers && (
            <DataTable
              columns={columns}
              data={AllUsers}
              searchColumn="email"
              isLoading={loadingUsers}
              error={UserError}
              actionButton={{
                label: "Delete Selected User(s)",
                onClick: (selectedRows) => {
                  // Handle delete action for users
                  handleDeleteUsers(selectedRows);
                },
                disabled: Object.keys(rowSelection).length === 0, // Disable button if no rows are selected
              }}
              exportButton={{
                label: "Export to CSV",
                onClick: (data) => {
                  // Call the export function
                  handleExportToCSV(data);
                },
              }}
              onRowSelectionChange={setRowSelection} // Pass the setRowSelection function
            />
          )}
        </div>
      ) : (
        <div>An error occurred while fetching all the users.</div>
      )}
    </div>
  );
};

export default Page;
