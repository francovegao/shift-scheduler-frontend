import { AllowedCompaniesSchema, CompanySchema, LinkManagerToCompanySchema, LocationSchema, PharmacistSchema, ShiftSchema, TakeShiftSchema, UserSchema } from "./formValidationSchemas"

const LOCAL_URL = 'http://localhost:8080'
//const STAGING_URL = 'https://scheduler-nest-api-353576862326.us-west1.run.app'
const STAGING_URL = 'https://scheduler-nest-api-staging-353576862326.us-west1.run.app'

const CURRENT_URL = STAGING_URL;

type CurrentState = {success: boolean; error: boolean }

export async function markAsReadNotification(id: string, dataToSend: object, token: string) {
  try {
    console.log('Marking notification as read...');

    const url = new URL(`${CURRENT_URL}/notifications/${id}`);

    const response =await fetch(url.toString(), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
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

export const createUser = async (token: string, currentState: CurrentState,  data: UserSchema)=>{
   try {
    console.log('Creating new user...');

    //Send data to register user in Firebase
    const firebaseResponse = await fetch(`${CURRENT_URL}/users/firebase`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: data.email, password: data.password}),
    });

    if (!firebaseResponse.ok) {
      const errorData = await firebaseResponse.json();
      throw new Error(`Firebase error! ${errorData.message || 'Unknown error'}`);
    }

    const firebaseUser = await firebaseResponse.json();
    const firebaseUid = firebaseUser.uid;
    console.log("User registered");
    
    //Prepare payload for API request
    const body = {
      firebaseUid: firebaseUid, 
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
    }

    const response = await fetch(`${CURRENT_URL}/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    //revalidatePath("/list/users");   
    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('An error occurred during user creation:', error);
    return {success: false, error: true};
  }
}

export const updateUser = async (token: string, currentState: CurrentState, data: UserSchema)=>{
   try {
    console.log('Updating user...');

    const body = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
    }

    const response = await fetch(`${CURRENT_URL}/users/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
  
    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
  }
}

export const setManagerAllowedCompanies = async (token: string, currentState: CurrentState, data: AllowedCompaniesSchema)=>{
   try {
    console.log('Updating user...');

    const body = {
      allowedCompaniesIds: data.companiesArray,
    }

    const response = await fetch(`${CURRENT_URL}/users/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
  
    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
  }
}

export const linkManagerToCompany = async (token: string, currentState: CurrentState, data: LinkManagerToCompanySchema)=>{
   try {
    console.log('Updating user...');

    const body = {
        companyId: data.companyId,
        locationId: data.locationId ? data.locationId : null,
    }

    const response = await fetch(`${CURRENT_URL}/users/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
  
    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
  }
}

export const deleteUser = async (token: string, currentState: CurrentState, data: FormData) => {
        const id = data.get("id") as string;
    
    try {
        console.log('Deleting user...');

        const response = await fetch(`${CURRENT_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        const errorData = await response.json(); // If the API returns error details
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
        }
    
        return {success: true, error: false};
        //return response.json();
    } catch (error) {
        console.error('API Error:', error);
        return {success: false, error: true};
    }
}

export const createCompany = async (token: string, currentState: CurrentState,  data: CompanySchema)=>{
   try {
    console.log('Creating new company...');

    const body = {
        approved: data.approved,
        name: data.name,
        legalName: data.legalName,
        GSTNumber: data.GSTNumber,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
    }

    const response = await fetch(`${CURRENT_URL}/companies`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
 
    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
  }
}

export const updateCompany = async (token: string, currentState: CurrentState, data: CompanySchema)=>{
   try {
    console.log('Updating company...');

    const body = {
        approved: data.approved,
        name: data.name,
        legalName: data.legalName,
        GSTNumber: data.GSTNumber,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
    }

    const response = await fetch(`${CURRENT_URL}/companies/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
  }
}

export const deleteCompany = async (token: string, currentState: CurrentState, data: FormData) => {
        const id = data.get("id") as string;
    
    try {
        console.log('Deleting company...');

        const response = await fetch(`${CURRENT_URL}/companies/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        const errorData = await response.json(); // If the API returns error details
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
        }
    
        return {success: true, error: false};
        //return response.json();
    } catch (error) {
        console.error('API Error:', error);
        return {success: false, error: true};
    }
}

export const createLocation = async (token: string, currentState: CurrentState,  data: LocationSchema)=>{
   try {
    console.log('Creating new location...');

    const body = {
        name: data.name,
        legalName: data.legalName,
        GSTNumber: data.GSTNumber,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        companyId: data.companyId,
    }

    const response = await fetch(`${CURRENT_URL}/locations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    //revalidatePath("/list/users");   
    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
  }
}

export const updateLocation = async (token: string, currentState: CurrentState, data: LocationSchema)=>{
   try {
    console.log('Updating location...');

    const body = {
        name: data.name,
        legalName: data.legalName,
        GSTNumber: data.GSTNumber,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        companyId: data.companyId,
    }

    const response = await fetch(`${CURRENT_URL}/locations/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
  
    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
  }
}

export const deleteLocation = async (token: string, currentState: CurrentState, data: FormData) => {
        const id = data.get("id") as string;
    
    try {
        console.log('Deleting location...');

        const response = await fetch(`${CURRENT_URL}/locations/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        const errorData = await response.json(); // If the API returns error details
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
        }
    
        return {success: true, error: false};
        //return response.json();
    } catch (error) {
        console.error('API Error:', error);
        return {success: false, error: true};
    }
}

export const createPharmacist = async (token: string, currentState: CurrentState,  data: PharmacistSchema)=>{
   try {
    console.log('Creating new pharmacist...');

    const body = {
      userId: data.userId,
      licenseNumber: data.licenseNumber,
      address: data.address,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      email: data.email,
      bio: data.bio,
      experienceYears: data.experienceYears,
      approved: data.approved,
      canViewAllCompanies: data.canViewAllCompanies,
    }

    const response = await fetch(`${CURRENT_URL}/pharmacist-profiles`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    const newPharmacistProfile = await response.json(); 
  
    return { success: true, error: false, responseData: newPharmacistProfile };
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true, responseData: null};
  }
}

export const updatePharmacist = async (token: string, currentState: CurrentState, data: PharmacistSchema)=>{
   try {
    console.log('Updating pharmacist...');

    const body = {
      userId: data.userId,
      licenseNumber: data.licenseNumber,
      address: data.address,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      email: data.email,
      bio: data.bio,
      experienceYears: data.experienceYears,
      approved: data.approved,
      canViewAllCompanies: data.canViewAllCompanies,
    }

    const response = await fetch(`${CURRENT_URL}/pharmacist-profiles/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
  
    return {success: true, error: false, responseData: null};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true, responseData: null};
  }
}

export const setPharmacistAllowedCompanies = async (token: string, currentState: CurrentState, data: AllowedCompaniesSchema)=>{
   try {
    console.log('Updating pharmacist...');

    const body = {
      allowedCompaniesIds: data.companiesArray,
    }

    const response = await fetch(`${CURRENT_URL}/pharmacist-profiles/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
  
    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
  }
}

export const deletePharmacist = async (token: string, currentState: CurrentState, data: FormData) => {
        const id = data.get("id") as string;
    
    try {
        console.log('Deleting pharmacist...');

        const response = await fetch(`${CURRENT_URL}/pharmacist-profiles/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        const errorData = await response.json(); // If the API returns error details
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
        }
    
        return {success: true, error: false};
        //return response.json();
    } catch (error) {
        console.error('API Error:', error);
        return {success: false, error: true};
    }
}

export const createShift = async (token: string, currentState: CurrentState,  data: ShiftSchema)=>{
   try {
    console.log('Creating new shift...');

    const body = {
      companyId: data.companyId,
      locationId: data.locationId ? data.locationId : null,
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      payRate: parseFloat(data.payRate),
      status: data.status,
      pharmacistId: data.pharmacistId ? data.pharmacistId : null,
    }

    const response = await fetch(`${CURRENT_URL}/shifts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    //revalidatePath("/list/users");   
    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
  }
}

export const updateShift = async (token: string, currentState: CurrentState, data: ShiftSchema)=>{
   try {
    console.log('Updating shift...');

    const body = {
      companyId: data.companyId,
      locationId: data.locationId ? data.locationId : null,
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      payRate: parseFloat(data.payRate),
      status: data.status,
      pharmacistId: data.pharmacistId ? data.pharmacistId : null,
    }

    const response = await fetch(`${CURRENT_URL}/shifts/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
  
    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
  }
}

export const takeShift = async (token: string, currentState: CurrentState, data: TakeShiftSchema)=>{
   try {
    console.log('Taking shift...');

    const body = {
      status: data.status,
      pharmacistId: data.pharmacistId ? data.pharmacistId : null,
    }

    const response = await fetch(`${CURRENT_URL}/shifts/${data.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
  
    return {success: true, error: false};
    //return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
  }
}

export const deleteShift = async (token: string, currentState: CurrentState, data: FormData) => {
        const id = data.get("id") as string;
    
    try {
        console.log('Deleting shift...');

        const response = await fetch(`${CURRENT_URL}/pharmacist-profiles/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        const errorData = await response.json(); // If the API returns error details
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
        }
    
        return {success: true, error: false};
        //return response.json();
    } catch (error) {
        console.error('API Error:', error);
        return {success: false, error: true};
    }
}