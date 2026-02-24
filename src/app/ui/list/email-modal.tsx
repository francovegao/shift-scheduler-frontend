import { EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import SendEmailForm from '../forms/shifts/send-email-form';
import { useAuth } from '../context/auth-context';

export default function SendEmailModal({ 
  type, token, data, id 
}:{ 
  type: "open_shift", 
  token: string,
  data?: any;
  id?: string; 
})  
{
    const [open, setOpen] = useState(false);
    const { appUser, loading } = useAuth();

    if ( loading ) return <div>Loading...</div>;
    if ( !appUser ) return <div>Please sign in to continue</div>;


    return (
        <>
            <button onClick={()=>setOpen(true)}
            className='rounded-md cursor-pointer border p-2 hover:bg-gray-200'
            >
            <>
                <EnvelopeIcon className="w-5" />
            </>
            </button>
            
            {open && (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
                <SendEmailForm type={type} token={token} data={data} setOpen={setOpen} />
                <div className='absolute top-4 right-4 cursor-pointer' onClick={()=>setOpen(false)}>
                    <XMarkIcon className='w-6' />
                </div>

                </div>
            </div>
            )}
        </>
    );
}