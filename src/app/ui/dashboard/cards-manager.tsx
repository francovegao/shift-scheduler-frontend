"use client";

import {
  ClockIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { fetchAllMyShifts } from '@/app/lib/data';
import { useAuth } from '../context/auth-context';
import { SetStateAction, useEffect, useState } from 'react';

const iconMap = {
  openShifts: BookOpenIcon,
  myTakenShifts: ClockIcon,
  myCompletedShifts: CheckCircleIcon,
  myCancelledShifts: XCircleIcon,
};

export default function CardWrapperManager() {
  const { firebaseUser, appUser, loading } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [token, setToken] = useState("");
  const [openShifts, setOpenShifts] = useState<number>(0);
  const [myTakenShifts, setTakenShifts] = useState<number>(0);
  const [myCompletedShifts, setCompletedShifts] = useState<number>(0);
  const [myCancelledShifts, setCancelledShifts] = useState<number>(0);

  // Get token
    useEffect(() => {
      if (firebaseUser) {
        firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
          setToken(idToken);
        });
      }
    }, [firebaseUser]);

  // Fetch data when token is ready
        useEffect(() => {
          const getData = async () => {
            setIsFetching(true);
            try {
              const cardResponse = await fetchAllMyShifts( token);
              setOpenShifts(cardResponse.meta.totalOpen);
              setTakenShifts(cardResponse.meta.totalTaken);
              setCompletedShifts(cardResponse.meta.totalCompleted);
              setCancelledShifts(cardResponse.meta.totalCancelled);
            } catch (err) {
              console.error("Failed to fetch cards data", err);
            } finally {
              setIsFetching(false);
            }
          };
          if (token){ getData() };
    }, [ token ]);
  
      if (loading || isFetching) return <div>Loading...</div>;
      if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;
  
  return (
    <>
      <Card title="Open Shifts" value={openShifts} type="openShifts" backgroundColor='bg-complementary-two' />
      <Card title="Taken Shifts" value={myTakenShifts} type="myTakenShifts" backgroundColor='bg-primary'/>
      <Card title="Completed Shifs" value={myCompletedShifts} type="myCompletedShifts" backgroundColor='bg-secondary'/>
      <Card title="Cancelled Shifts" value={myCancelledShifts} type="myCancelledShifts" backgroundColor='bg-complementary-one'/>
    </>
  );
}

export function Card({
  title,
  value,
  type,
  backgroundColor,
}: {
  title: string;
  value: number | string;
  type: 'openShifts' | 'myTakenShifts' | 'myCompletedShifts' | 'myCancelledShifts';
  backgroundColor?: string;
}) {
  const Icon = iconMap[type];

  return (
    <div className={`rounded-xl p-2 shadow-sm flex-1 text-white ${backgroundColor}`}>
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 mt-1 text-white" /> : null}
        <h3 className="ml-2 text-md font-semibold">{title}</h3>
      </div>
      <p className={`text-black truncate rounded-xl bg-white px-4 py-8 text-center text-2xl font-bold`}>
        {value}
      </p>
    </div>
  );
}
