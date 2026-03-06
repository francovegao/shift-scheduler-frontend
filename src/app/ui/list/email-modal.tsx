import { EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import SendEmailForm from '../forms/shifts/email-open-shift-form';
import { useAuth } from '../context/auth-context';
import clsx from 'clsx';
import NotifyOpenShiftForm from '../forms/shifts/email-open-shift-form';
import RequestCancelShiftForm from '../forms/shifts/request-cancel-shift-form';

export default function SendEmailModal({ 
  type, token, data, id, pharmacistId
}:{ 
  type: "open_shift" | "request_cancellation", 
  token: string,
  data?: any;
  id?: string; 
  pharmacistId?: string;
})  
{
    const [open, setOpen] = useState(false);
    const { appUser, loading } = useAuth();

    const Form = () => {
        return type === 'open_shift' && data ? (
            <NotifyOpenShiftForm type={type} token={token} data={data} setOpen={setOpen} />
        ) : type === 'request_cancellation' && id && pharmacistId ? (
            <RequestCancelShiftForm type={type} token={token} id={id} pharmacistId={pharmacistId} setOpen={setOpen} />
        ) : (
            <div>
                "Something wrong happened!"
            </div>
        );
    };

    if ( loading ) return <div>Loading...</div>;
    if ( !appUser ) return <div>Please sign in to continue</div>;


    return (
        <>
            <button onClick={()=>setOpen(true)}
            className={clsx(
                      'rounded-md cursor-pointer p-2',
                      {
                        'bg-complementary-one text-white py-2 px-4 border-none w-max self-center hover:bg-red-400 text-sm font-normal'
                        : type === 'request_cancellation',
                        'border p-2 hover:bg-gray-200': type === 'open_shift',
                      },
                    )}
            >
                 {type === 'open_shift' ? (
                    <>
                        <EnvelopeIcon className="w-5" />
                    </>
                    ) : null}
                    {type === 'request_cancellation' ? (
                    <>
                        Request Cancellation
                    </>
                    ) : null}
            </button>
            
            {open && (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
                    <Form />
                <div className='absolute top-4 right-4 cursor-pointer' onClick={()=>setOpen(false)}>
                    <XMarkIcon className='w-6' />
                </div>

                </div>
            </div>
            )}
        </>
    );
}