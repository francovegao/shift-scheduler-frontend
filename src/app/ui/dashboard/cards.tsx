"use client";

import {
  ClockIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';
import { useAuth } from '../context/auth-context';
import { SetStateAction, useEffect, useState } from 'react';
//import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  pharmacists: UserIcon,
  companies: BuildingOfficeIcon,
  locations: BuildingOffice2Icon,
  shifts: ClockIcon,
};

export default function CardWrapper() {
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
              const cardResponse = await fetchCardData( token);
              setShifts(cardResponse.numberOfShifts);
              setCompanies(cardResponse.numberOfCompanies);
              setLocations(cardResponse.numberOfLocations);
              setPharmacists(cardResponse.numberOfPharmacists);
            } catch (err) {
              console.error("Failed to fetch card data", err);
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
      <Card title="Pharmacists" value={pharmacists} type="pharmacists" />
      <Card title="Companies" value={companies} type="companies" />
      <Card title="Locations" value={locations} type="locations" />
      <Card
        title="Shifts"
        value={shifts}
        type="shifts"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'pharmacists' | 'companies' | 'locations' | 'shifts';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm flex-1">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
