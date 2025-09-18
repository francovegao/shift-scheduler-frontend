import { UserSchema } from "./formValidationSchemas"

type CurrentState = {success: boolean; error: boolean }

export const createUser = async (currentState: CurrentState, data: UserSchema)=>{
   try {
    console.log('Creating new user...');

    const body = {
        firebaseUid: data.firstName,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
    }

    const response = await fetch('http://localhost:5001/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${token}`,
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
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
    throw new Error('Failed to create user');
  }
}

export const updateUser = async (currentState: CurrentState, data: UserSchema)=>{
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
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }
  
    return {success: true, error: false};
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {success: false, error: true};
    throw new Error('Failed to create user');
  }
}

export const deleteUser = async (
    currentState: CurrentState,
     data: FormData) => {
        const id = data.get("id") as string;
    
    try {
        console.log('Deleting user...');

        const response = await fetch(`http://localhost:5001/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        const errorData = await response.json(); // If the API returns error details
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
        }
    
        return {success: true, error: false};
        return response.json();
    } catch (error) {
        console.error('API Error:', error);
        return {success: false, error: true};
        throw new Error('Failed to create user');
    }
}