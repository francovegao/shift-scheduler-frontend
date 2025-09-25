
const ITEMS_PER_PAGE = 2; //TODO adjust this number to 10

export async function fetchLocations(query: string, currentPage: number, queryParams: Object, token: string) {
  try {
    console.log('Fetching locations data...');

    const url = new URL('http://localhost:5001/locations');
    url.searchParams.append('search', query);
    url.searchParams.append('page', currentPage.toString());
    url.searchParams.append('limit', ITEMS_PER_PAGE.toString());

    if(queryParams){
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchCompanies(query: string, currentPage: number, token: string) {
  try {
    console.log('Fetching companies data...');

    const url = new URL('http://localhost:5001/companies');
    url.searchParams.append('search', query);
    url.searchParams.append('page', currentPage.toString());
    url.searchParams.append('limit', ITEMS_PER_PAGE.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    //throw new Error('Failed to fetch companies');
    return null;
  }
}

export async function fetchShifts(query: string, currentPage: number, queryParams: Object, token: string) {
  try {
    console.log('Fetching shifts data...');

    const url = new URL('http://localhost:5001/shifts');
    url.searchParams.append('search', query);
    url.searchParams.append('page', currentPage.toString());
    url.searchParams.append('limit', ITEMS_PER_PAGE.toString());
    
    if(queryParams){
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchMyShifts(query: string, currentPage: number, queryParams: Object, token: string) {
  try {
    console.log('Fetching pharmacist shifts data...');
 
    const url = new URL('http://localhost:5001/shifts/myshifts');
    url.searchParams.append('search', query);
    url.searchParams.append('page', currentPage.toString());
    url.searchParams.append('limit', ITEMS_PER_PAGE.toString());
    
    if(queryParams){
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchAllMyShifts(token: string) {
  try {
    console.log('Fetching all my shifts data...');
 
    const url = new URL('http://localhost:5001/shifts/allmyshifts');
    url.searchParams.append('limit', '1000');   //Limit to 1000 shifts

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchShiftsByDate(date: string, token: string) {
  try {
    console.log('Fetching shifts by date data...');

    const url = new URL('http://localhost:5001/shifts/date');
    url.searchParams.append('date', date);
    

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchUsers(query: string, currentPage: number, queryParams: Object, token: string) {
  try {
    console.log('Fetching users data...');

    const url = new URL('http://localhost:5001/users');
    url.searchParams.append('search', query);
    url.searchParams.append('page', currentPage.toString());
    url.searchParams.append('limit', ITEMS_PER_PAGE.toString());

    if(queryParams){
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchPharmacists(query: string, currentPage: number, token: string) {
  try {
    console.log('Fetching pharmacists data...');

    const url = new URL('http://localhost:5001/users/pharmacists');
    url.searchParams.append('search', query);
    url.searchParams.append('page', currentPage.toString());
    url.searchParams.append('limit', ITEMS_PER_PAGE.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchUser(uid: string, token: string) {
  try {
    console.log('Validating user...');

    const url = new URL(`http://localhost:5001/users/fb/${uid}`);

    const response = await fetch(url.toString(), {
                    headers: { 
                      Authorization: `Bearer ${token}`, 
                    },
                  });
    
    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

export async function fetchPharmacistShifts(id: string, token: string) {
  try {
    console.log('Fetching single pharmacist shifts...');

    const url = new URL(`http://localhost:5001/users/shifts/${id}`);

    const response = await fetch(url.toString(), {
                    headers: { 
                      Authorization: `Bearer ${token}`, 
                    },
                  });
    
    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

export async function fetchOnePharmacist(id: string, token: string) {
  try {
    console.log('Fetching pharmacist...' + token);

    const url = new URL(`http://localhost:5001/users/pharmacist/${id}`);

    const response = await fetch(url.toString(), {
                    headers: { 
                      Authorization: `Bearer ${token}`, 
                    },
                  });
    
    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

export async function fetchUserRole(uid: string, token: string) {
  try {

    const url = new URL(`http://localhost:5001/users/me/${uid}`);

    const response = await fetch(url.toString(), {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                });
    
    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

export async function fetchAdminCardsData(token: string) {
  try {
    const shiftsCountPromise = fetchShifts("",1,{}, token);
    const companiesCountPromise = fetchCompanies("",1, token);
    const locationsCountPromise = fetchLocations("",1,{}, token);
    const pharmacistsCountPromise = fetchPharmacists("",1, token);
  
    const data = await Promise.all([
      shiftsCountPromise,
      companiesCountPromise,
      locationsCountPromise,
      pharmacistsCountPromise,
    ]);

    const numberOfShifts = Number(data[0].meta?.totalItems ?? '0');
    const numberOfCompanies = Number(data[1].meta?.totalItems ?? '0');
    const numberOfLocations = Number(data[2].meta?.totalItems ?? '0');
    const numberOfPharmacists = Number(data[3].meta?.totalItems ?? '0');
    
    //const numberOfCustomers = Number(data[1][0].count ?? '0');
    //const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    //const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfPharmacists,
      numberOfCompanies,
      numberOfLocations,
      numberOfShifts,
    };
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchUnseenNotifications( token: string) {
  try {
    console.log('Fetching unseen notifications...');

    const url = new URL(`http://localhost:5001/notifications/unseen`);

    const response = await fetch(url.toString(), {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                });
    
    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

export async function fetchLatestShifts( token: string) {
  try {
    console.log('Fetching latst shifts...');

    const url = new URL(`http://localhost:5001/shifts/latest`);

    const response = await fetch(url.toString(), {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                });
    
    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// TEMPORARY DATA

//export let role = "admin";  //["admin", "relief_pharmacist", "pharmacy_manager", "location_manager"]

// YOU SHOULD CHANGE THE DATES OF THE EVENTS TO THE CURRENT DATE TO SEE THE EVENTS ON THE CALENDAR
export const scheduledShifts = [
  {
    title: "Test Shift",
    allDay: false,
    start: new Date(2025, 8, 8, 8, 30),
    end: new Date(2025, 8, 8, 16, 30),
  },
  {
    title: "Overnight Shift",
    allDay: false,
    start: new Date(2025, 8, 10, 22, 30),
    end: new Date(2025, 8, 11, 6, 30),
  },
  {
    title: "Math",
    allDay: false,
    start: new Date(2025, 8, 12, 8, 0),
    end: new Date(2025, 8, 12, 8, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2025, 8, 12, 9, 0),
    end: new Date(2025, 8, 12, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2025, 8, 12, 10, 0),
    end: new Date(2025, 8, 12, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2025, 8, 12, 11, 0),
    end: new Date(2025, 8, 12, 11, 45),
  },
  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2025, 8, 12, 13, 0),
    end: new Date(2025, 8, 12, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2025, 8, 12, 14, 0),
    end: new Date(2025, 8, 12, 14, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2025, 8, 13, 9, 0),
    end: new Date(2025, 8, 13, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2025, 8, 13, 10, 0),
    end: new Date(2025, 8, 13, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2025, 8, 13, 11, 0),
    end: new Date(2025, 8, 13, 11, 45),
  },

  {
    title: "History",
    allDay: false,
    start: new Date(2025, 8, 13, 14, 0),
    end: new Date(2025, 8, 13, 14, 45),
  },
  {
    title: "Math",
    allDay: false,
    start: new Date(2025, 8, 14, 8, 0),
    end: new Date(2025, 8, 14, 8, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2025, 8, 14, 10, 0),
    end: new Date(2025, 8, 14, 10, 45),
  },

  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2025, 8, 14, 13, 0),
    end: new Date(2025, 8, 14, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2025, 8, 14, 14, 0),
    end: new Date(2025, 8, 14, 14, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2025, 8, 15, 9, 0),
    end: new Date(2025, 8, 15, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2025, 8, 15, 10, 0),
    end: new Date(2025, 8, 15, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2025, 8, 15, 11, 0),
    end: new Date(2025, 8, 15, 11, 45),
  },

  {
    title: "History",
    allDay: false,
    start: new Date(2025, 8, 15, 14, 0),
    end: new Date(2025, 8, 15, 14, 45),
  },
  {
    title: "Math",
    allDay: false,
    start: new Date(2025, 8, 16, 8, 0),
    end: new Date(2025, 8, 16, 8, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2025, 8, 16, 9, 0),
    end: new Date(2025, 8, 16, 9, 45),
  },

  {
    title: "Physics",
    allDay: false,
    start: new Date(2025, 8, 16, 11, 0),
    end: new Date(2025, 8, 16, 11, 45),
  },
  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2025, 8, 16, 13, 0),
    end: new Date(2025, 8, 16, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2025, 8, 16, 14, 0),
    end: new Date(2025, 8, 16, 14, 45),
  },
];

export const pharmacistsData = [
  {
    id: 1,
    licenseNumber: "1234567890",
    name: "John Doe",
    email: "john@doe.com",
    photo:
      "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 2,
    licenseNumber: "1234567890",
    name: "Jane Doe",
    email: "jane@doe.com",
    photo:
      "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 3,
    licenseNumber: "1234567890",
    name: "Mike Geller",
    email: "mike@geller.com",
    photo:
      "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: false,
  },
  {
    id: 4,
    licenseNumber: "1234567890",
    name: "Jay French",
    email: "jay@gmail.com",
    photo:
      "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 5,
    licenseNumber: "1234567890",
    name: "Jane Smith",
    email: "jane@gmail.com",
    photo:
      "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 6,
    licenseNumber: "1234567890",
    name: "Anna Santiago",
    email: "anna@gmail.com",
    photo:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: false,
  },
  {
    id: 7,
    licenseNumber: "1234567890",
    name: "Allen Black",
    email: "allen@black.com",
    photo:
      "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 8,
    licenseNumber: "1234567890",
    name: "Ophelia Castro",
    email: "ophelia@castro.com",
    photo:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 9,
    licenseNumber: "1234567890",
    name: "Derek Briggs",
    email: "derek@briggs.com",
    photo:
      "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 10,
    licenseNumber: "1234567890",
    name: "John Glover",
    email: "john@glover.com",
    photo:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
];

export const companiesData = [
  {
    id: 1,
    locationName: "Location 1",
    companyName: "Test Company",
    email: "example@mail.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 2,
    locationName: "Location 2",
    companyName: "Test Company",
    email: "example@mail.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: false,
  },
  {
    id: 3,
    licenseNumber: "1234567890",
    companyName: "Test Company",
    email: "example@mail.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 4,
    licenseNumber: "1234567890",
    companyName: "Other Company",
    email: "example@mail.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 5,
    locationName: "Location 1",
    companyName: "Third Company",
    email: "example@mail.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 6,
    locationName: "Location 2",
    companyName: "Third Company",
    email: "example@mail.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: false,
  },
  {
    id: 7,
    locationName: "Location 3",
    companyName: "Third Company",
    email: "example@mail.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 8,
    locationName: "Location 1",
    companyName: "Best Company",
    email: "example@mail.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 9,
    locationName: "Location 2",
    companyName: "Best Company",
    email: "example@mail.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
  {
    id: 10,
    companyName: "Best Company",
    email: "example@mail.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    approved: true,
  },
];

export const shiftsData = [
  {
    id: 1,
    locationName: "Location 1",
    companyName: "Test Company",
    title: "Morning Shift",
    description: "Some Text",
    startTime: "2025-08-13 08:30:00",
    endTime: "2025-08-13 16:30:00",
    payRate: "$33.50",
    status: "open",
    pharmacist: "",
  },
  {
    id: 2,
    locationName: "Location 2",
    companyName: "Test Company",
     title: "Morning Shift",
    description: "Some Text",
    startTime: "2025-08-15 11:30:00",
    endTime: "2025-08-13 19:30:00",
    payRate: "$33.50",
    status: "taken",
    pharmacist: "Matt Damon",
  },
  {
    id: 3,
    licenseNumber: "1234567890",
    companyName: "Test Company",
     title: "Morning Shift",
    description: "Some Text",
    startTime: "2025-08-17 16:30:00",
    endTime: "2025-08-17 00:30:00",
    payRate: "$33.50",
    status: "cancelled",
    pharmacist: "",
  },
  {
    id: 4,
    licenseNumber: "1234567890",
    companyName: "Other Company",
     title: "Morning Shift",
    description: "Some Text",
    startTime: "2025-08-13 08:30:00",
    endTime: "2025-08-13 16:30:00",
    payRate: "$33.50",
    status: "completed",
    pharmacist: "Jhon Doe",
  },
  {
    id: 5,
    locationName: "Location 1",
    companyName: "Third Company",
     title: "Morning Shift",
    description: "Some Text",
    startTime: "2025-08-15 11:30:00",
    endTime: "2025-08-15 19:30:00",
    payRate: "$33.50",
    status: "open",
    pharmacist: "",
  },
  {
    id: 6,
    locationName: "Location 2",
    companyName: "Third Company",
     title: "Morning Shift",
    description: "Some Text",
    startTime: "2025-08-17 16:30:00",
    endTime: "2025-08-17 00:30:00",
    payRate: "$33.50",
    status: "completed",
    pharmacist: "Matt Damon",
  },
  {
    id: 7,
    locationName: "Location 3",
    companyName: "Third Company",
     title: "Morning Shift",
    description: "Some Text",
    startTime: "2025-08-13 08:30:00",
    endTime: "2025-08-13 16:30:00",
    payRate: "$33.50",
    status: "taken",
    pharmacist: "Matt Damon",
  },
  {
    id: 8,
    locationName: "Location 1",
    companyName: "Best Company",
     title: "Morning Shift",
    description: "Some Text",
    startTime: "2025-08-15 11:30:00",
    endTime: "2025-08-15 19:30:00",
    payRate: "$33.50",
    status: "cancelled",
    pharmacist: "Matt Damon",
  },
  {
    id: 9,
    locationName: "Location 2",
    companyName: "Best Company",
     title: "Morning Shift",
    description: "Some Text",
    startTime: "2025-08-17 16:30:00",
    endTime: "2025-08-17 00:30:00",
    payRate: "$33.50",
    status: "completed",
    pharmacist: "Jhon Doe",
  },
  {
    id: 10,
    companyName: "Best Company",
    title: "Morning Shift",
    description: "Some Text",
    startTime: "2025-08-13 08:30:00",
    endTime: "2025-08-13 16:30:00",
    payRate: "$33.50",
    status: "completed",
    pharmacist: "Jhon Doe",
  },
];