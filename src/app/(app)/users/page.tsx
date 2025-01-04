"use client"
import Loader from '@/components/Loader'
import { useGetAllUsersQuery } from '@/store/features/UserData'
import React, { useCallback } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '../../../components/DataTable'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import { User } from '@/model/User'
import Papa from 'papaparse'
import { useDeleteUsersMutation } from '@/store/features/UserData';

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
      )
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
    header: "Verified User ",
  },
]

const Page = () => {


  const { data: AllUsers, error: UserError, isLoading: loadingUsers } = useGetAllUsersQuery();

  const [deleteUsers] = useDeleteUsersMutation();

  const handleDeleteUsers = async (selectedRows: User[]) => {
    try {
      //extract ids of selected users
      const selectedIds = selectedRows.map(row => row._id);

      //call the delete mutation
      await deleteUsers(selectedIds as string[]).unwrap();

      //show success message
      console.log('Users deleted successfully');
    } catch (error) {
      console.error('Failed to delete users: ', error);
    }
  };

  //function to handle CSV export
  const handleExportToCSV = useCallback((data: User[]) => {
    //convert data to CSV format
    const csv = Papa.unparse(data, {
      header: true,
    });

    //create a blob from the CSV string
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    //create a link element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'users.csv'; //File name
    link.click(); //trigger download

    //clean up
    URL.revokeObjectURL(link.href);
  }, []);

  if (loadingUsers) {
    return <Loader />
  }
  return (
    <div className='container mx-auto flex-col  justify-between items-center'>
      {!UserError ?
        <div>
          {AllUsers && <DataTable
            columns={columns}
            data={AllUsers}
            searchColumn="email"
            isLoading={loadingUsers}
            error={UserError}
            actionButton={{
              label: "Delete Selected User(s)",
              onClick: (selectedRows) => {
                //handle delete action for users
                handleDeleteUsers(selectedRows);
              },
            }}
            exportButton={{
              label: "Export to CSV",
              onClick: (data) => {
                //call the export function
                handleExportToCSV(data);
              },
            }}
          />
          }
        </div>
        :
        <div>An Error has been occured while fetching all the users</div>}
    </div>
  )
}

export default Page
