import { CompanySchema, LocationSchema, UserSchema } from "./formValidationSchemas"

type CurrentState = {success: boolean; error: boolean }

export async function markAsReadNotification(id: string, dataToSend: object, token: string) {
  try {
    console.log('Marking notification as read...');

    const url = new URL(`http://localhost:5001/notifications/${id}`);

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

    const body = {
        firebaseUid: data.firstName,  //TODO: Change this for the real firebaseUid
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
    }

    const response = await fetch('http://localhost:5001/users', {
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

export const updateUser = async (token: string, currentState: CurrentState, data: UserSchema)=>{
   try {
    console.log('Updating user...');

    const body = {
        //firebaseUid: data.firstName,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
    }

    const response = await fetch(`http://localhost:5001/users/${data.id}`, {
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

        const response = await fetch(`http://localhost:5001/users/${id}`, {
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
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
    }

    const response = await fetch('http://localhost:5001/companies', {
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

export const updateCompany = async (token: string, currentState: CurrentState, data: CompanySchema)=>{
   try {
    console.log('Updating company...');

    const body = {
        approved: data.approved,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
    }

    const response = await fetch(`http://localhost:5001/companies/${data.id}`, {
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

        const response = await fetch(`http://localhost:5001/companies/${id}`, {
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
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        companyId: data.companyId,
    }

    const response = await fetch('http://localhost:5001/locations', {
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
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        companyId: data.companyId,
    }

    const response = await fetch(`http://localhost:5001/locations/${data.id}`, {
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

        const response = await fetch(`http://localhost:5001/locations/${id}`, {
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