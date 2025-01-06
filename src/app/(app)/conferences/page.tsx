"use client";
import Loader from '@/components/Loader';
import { useGetAllConferencesQuery } from '@/store/features/ConferenceData';
import React, { useCallback, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from '../../../components/DataTable';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { IConference } from '@/model/ConferenceSchema';
import { usePathname, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Papa from 'papaparse';
import { useDeleteConferencesMutation } from '@/store/features/ConferenceData';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast'; // Import the toast function

export const dynamic = 'force-dynamic';

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState({});

  const { data: AllConferences, error: ConferencesError, isLoading: loadingConferences } = useGetAllConferencesQuery(undefined, {
    pollingInterval: 5000,
  });

  const [deleteConferences] = useDeleteConferencesMutation();

  const handleDeleteConferences = async (selectedRows: IConference[]) => {
    const confirmDelete = window.confirm("Are you sure you want to delete the selected conferences?");
    if (!confirmDelete) return;

    try {
      const selectedIds = selectedRows.map(row => row._id);
      await deleteConferences(selectedIds as string[]).unwrap();
      queryClient.invalidateQueries({ queryKey: ['conferences'] });

      // Show success toast
      toast({
        title: "Success",
        description: "Conferences deleted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to delete conferences: ', error);

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to delete conferences.",
        variant: "destructive",
      });
    }
  };

  // Function to handle CSV export
  const handleExportToCSV = useCallback((data: IConference[]) => {
    if (!data || data.length === 0){
      toast({
        title: 'Error',
        description: 'No data to export',
        variant: 'destructive',
      });
      return;
    }
    
    const csv = Papa.unparse(data, {
      header: true,
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'conferences.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }, []);

  const columns: ColumnDef<IConference>[] = [
    // Column definitions...
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
      accessorKey: "conferenceAcronym",
      header: "Conference Acronym",
    },
    {
      accessorKey: "conferenceEmail",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className='text-lg'
          >
            Conference Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "conferenceOrganizer.fullname",
      header: "Organized By",
    },
    {
      accessorFn: (row) => row.conferenceStatus,
      header: "Conference Status",
      cell: (info) => {
        const value = info.getValue();
        switch (value) {
          case "submitted":
            return <Badge variant="submitted" className='text-md'>Submitted</Badge>;
          case "accepted":
            return <Badge variant="accepted" className='text-md'>Accepted</Badge>;
          case "rejected":
            return <Badge variant="rejected" className='text-md'>Rejected</Badge>;
          case "review":
            return <Badge variant="review" className='text-md'>Review</Badge>;
          default:
            return <Badge variant="submitted" className='text-md'>Submitted</Badge>;
        }
      }
    },
    {
      header: "Location",
      accessorFn: (row) =>
        `${row.conferenceVenue}, ${row.conferenceCity}, ${row.conferenceCountry}`,
      footer: "Location",
    },
    {
      accessorFn: (row) => row.conferenceSecurityDeposit2000Paid,
      header: "Premium Customer",
      cell: info => (
        info.getValue() ? <Badge className='text-md' variant={'premium'}>Premium</Badge> : <Badge className='text-md' variant={"default"}>No</Badge>
      )
    },
    {
      header: "Information",
      accessorFn: row => row.conferenceAcronym,
      footer: "Information",
      cell: info => (
        <Button variant={'outline'} onClick={() => router.push(`${pathname}/${info.getValue()}`)}>Open</Button>
      )
    },
  ];

  if (loadingConferences) {
    return <Loader />;
  }

  return (
    <div className='container mx-auto flex-col justify-between items-center'>
      {!ConferencesError ? (
        <div>
          {AllConferences && (
            <DataTable
              columns={columns}
              data={AllConferences}
              searchColumn="conferenceAcronym"
              isLoading={loadingConferences}
              error={ConferencesError}
              actionButton={{
                label: "Delete Selected Conference(s)",
                onClick: (selectedRows) => {
                  handleDeleteConferences(selectedRows);
                },
                disabled: Object.keys(rowSelection).length === 0, // Disable button if no rows are selected
              }}
              exportButton={{
                label: "Export to CSV",
                onClick: (data) => {
                  handleExportToCSV(data);
                },
              }}
              onRowSelectionChange={setRowSelection} //pass the setRowSelection
            />
          )}
        </div>
      ) : (
        <div>An error occurred while fetching all the conferences.</div>
      )}
    </div>
  );
};

export default Page;