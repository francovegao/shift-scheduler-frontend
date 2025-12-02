import { BookOpenIcon, CheckIcon, ClockIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function ApprovedStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'approved',
          ' text-white bg-red-500': status === 'no-profile',

          'text-white bg-slate-500': status === 'open',
          'text-white bg-blue-500': status === 'taken',
          'bg-red-500 text-white': status === 'cancelled',
          'text-white bg-green-500': status === 'completed',
        },
      )}
    >
      {status === 'pending' ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'approved' ? (
        <>
          Approved
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'no-profile' ? (
        <>
          No Pharmacist Profile
          <ExclamationTriangleIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}

      {status === 'open' ? (
        <>
          Open
          <ClockIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'taken' ? (
        <>
          Assigned
          <BookOpenIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'cancelled' ? (
        <>
          Cancelled
          <XCircleIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'completed' ? (
        <>
          Completed
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}