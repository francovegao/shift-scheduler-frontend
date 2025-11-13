"use client";

import {
  ClockIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { fetchAdminCardsData } from '@/app/lib/data';
import { useAuth } from '../context/auth-context';
import { SetStateAction, useEffect, useState } from 'react';

const iconMap = {
  pharmacists: UserIcon,
  companies: BuildingOfficeIcon,
  locations: BuildingOffice2Icon,
  shifts: ClockIcon,
};

export default function CardWrapperAdmin() {
  const { firebaseUser, appUser, loading } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [token, setToken] = useState("");
  const [pharmacists, setPharmacists] = useState<number>(0);
  const [companies, setCompanies] = useState<number>(0);
  const [locations, setLocations] = useState<number>(0);
  const [shifts, setShifts] = useState<number>(0);

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
              const cardResponse = await fetchAdminCardsData( token);
              setShifts(cardResponse.numberOfShifts);
              setCompanies(cardResponse.numberOfCompanies);
              setLocations(cardResponse.numberOfLocations);
              setPharmacists(cardResponse.numberOfPharmacists);
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
      <Card title="Pharmacists" value={pharmacists} type="pharmacists" backgroundColor='bg-complementary-two' />
      <Card title="Companies" value={companies} type="companies" backgroundColor='bg-primary' />
      <Card title="Locations" value={locations} type="locations" backgroundColor='bg-secondary'/>
      <Card title="Shifts" value={shifts} type="shifts" backgroundColor='bg-complementary-one'/>
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
  type: 'pharmacists' | 'companies' | 'locations' | 'shifts';
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
