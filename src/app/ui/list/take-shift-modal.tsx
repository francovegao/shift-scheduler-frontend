import { BookOpenIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import TakeShiftForm from '../forms/shifts/take-shift-form';

export default function TakeShiftModal({ 
  token,
  data, 
  pharmacistId, 
}: {
  pharmacistId?: string;
  data?: any;
  token: string;
  }) 
{
  const [open, setOpen] = useState(false);

  return (
     <>
        <button onClick={()=>setOpen(true)}
          className='rounded-md cursor-pointer border p-2 hover:bg-gray-200'
        >
          <>
            <BookOpenIcon className="w-5" />
          </>
        </button>
        
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
            <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
              <TakeShiftForm pharmacistId={pharmacistId} token={token} data={data} setOpen={setOpen}/>
              <div className='absolute top-4 right-4 cursor-pointer' onClick={()=>setOpen(false)}>
                <XMarkIcon className='w-6' />
              </div>

            </div>
          </div>
        )}
     </>
  );
}