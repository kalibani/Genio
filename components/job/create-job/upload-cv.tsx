'use client';
import { Button } from '@/components/ui/button';
import { MonitorUp, FileStack, Trash2, ArrowUpDown } from 'lucide-react';
import ModalBankCv from './modal-upload-cv';
import { usePopupModal, MODAL_ENUM } from '@/hooks/use-popup-modal';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TableCV from './table';

import { FormStepState, useFormStepStore } from '@/zustand/useCreateJob';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateDMY, formatFileSize } from '@/helpers';
import { FC, ReactElement, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const UploadCv: FC = (): ReactElement => {
  const {
    files,
    handleFileChange,
    handleDeleteFile,
    handleUploadButtonClick,
    setStep,
  } = useFormStepStore((state) => state);
  const { setIsModalOpen } = usePopupModal();
  const [tableItems, setTableItems] = useState<FormStepState['files']>([])
  const searchParams = useSearchParams();
  const perPage = searchParams.get('per_page') || '10'
  const currPage = searchParams.get('page') || '1'
  const query = searchParams.get('search')

  const handleNext = () => {
    setStep(3);
  };

  interface UploadCVData {
    file: File;
  }

  // handle filter & pagination in client side, since cv upload is in client state
  useEffect(() => {
    const allItems = files
    let itemInPage: FormStepState['files'] = allItems
    if (query) {
      const namePattern = new RegExp(query)
      itemInPage = allItems.filter((item) => namePattern.test(item.file.name))
    }
    if (allItems.length) {
       const firstItem =  (Number(currPage) - 1) * Number(perPage)
       const lastItem = Number(currPage) * Number(perPage)
       itemInPage = itemInPage.slice(firstItem, lastItem)
    }

    setTableItems(itemInPage)
  }, [files, perPage, currPage, query])

  const columns: ColumnDef<UploadCVData>[] = [
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
          className="border-slate-400 bg-white text-black"
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
      accessorKey: 'name',
      maxSize: 250,
      size: 250,
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            File Name
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.original.file.name
        const truncated = value.slice(0, 20)

        const isOverflow = value.length > truncated.length

        return (
            <p data-tooltip-target="tooltip-default">{`${truncated}${isOverflow ? '...' : ''}`}</p>
        )
      },
    },
    {
      accessorKey: 'Added on',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Added On
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p className="capitalize text-slate-400">
          {formatDateDMY(row.original.file.lastModified)}
        </p>
      ),
    },
    {
      accessorKey: 'size',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Size
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const size: number = row.original.file.size;
        return (
          <p className="capitalize text-slate-400">{formatFileSize(size)}</p>
        );
      },
    },
    {
      accessorKey: 'from',
      header: ({ column }) => {
        return (
          <Button
            className="w-fit px-4 pl-0 hover:bg-transparent"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            From
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <p className="capitalize text-slate-400">{row.getValue('from')}</p>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Button
            onClick={() => {
              handleDeleteFile(row.index);
            }}
            variant="ghost"
            className="hover:bg-transparent"
          >
            <Trash2 className="size-4 text-primary" />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-1 overflow-y-scroll w-full flex-col items-center rounded-md bg-white  py-8">
        <div className="flex items-center justify-center gap-x-5">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={(e) => handleFileChange(e, 'From Device')}
            style={{ display: 'none' }}
            id="fileInput"
          />

          <Button
            className="text-sm font-normal"
            onClick={handleUploadButtonClick}
          >
            <MonitorUp className="mr-2 size-4" />
            From Device
          </Button>
          <Button
            className="text-sm font-normal"
            onClick={() => setIsModalOpen(MODAL_ENUM.BANK_CV, true)}
            // temporary disabled, while focus on upload from device
            disabled
          >
            <FileStack className="mr-2 size-4" /> From Bank CV (Candidates)
          </Button>
          <Select
            // temporary disabled, while focus on upload from device
            disabled
          >
            <SelectTrigger className="w-[180px] text-sm font-normal">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {dataSelectItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            className="text-sm font-normal"
            onClick={() => setIsModalOpen(MODAL_ENUM.THIRD_PARTY_CV, true)}
            // temporary disabled, while focus on upload from device
            disabled
          >
            Import
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col items-center rounded-md bg-white px-1 py-6">
        <TableCV<UploadCVData> data={tableItems} columns={columns} totalItems={files.length} />
      </div>
      <div className="flex w-full justify-between rounded-md bg-white px-4 py-5">
        <Button
          onClick={() => setStep(1)}
          variant="outline"
          className="min-w-32"
        >
          Previous
        </Button>
        <Button
          className="min-w-32"
          onClick={handleNext}
          disabled={files.length <= 0}
        >
          Next
        </Button>
      </div>
      <ModalBankCv />
    </>
  );
};

export default UploadCv;
const dataSelectItems = [
  { value: 'jobStreet', label: 'Job Street' },
  { value: 'techInAsia', label: 'Tech in Asia' },
  { value: 'linkedin', label: 'Linkedin' },
  { value: 'kalibr', label: 'Kalibr' },
];
