const ITEMS_PER_PAGE = 10;

const CURRENT_URL = process.env.NEXT_PUBLIC_API_URL;

if (!CURRENT_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function fetchLocations(
  query: string,
  currentPage: number,
  queryParams: Object,
  token: string,
) {
  try {
    console.log("Fetching locations data...");

    const url = new URL(`${CURRENT_URL}/locations`);
    url.searchParams.append("search", query);
    url.searchParams.append("page", currentPage.toString());
    url.searchParams.append("limit", ITEMS_PER_PAGE.toString());

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchCompanies(
  query: string,
  currentPage: number,
  queryParams: Object,
  token: string,
) {
  try {
    console.log("Fetching companies data...");

    const url = new URL(`${CURRENT_URL}/companies`);
    url.searchParams.append("search", query);
    url.searchParams.append("page", currentPage.toString());
    url.searchParams.append("limit", ITEMS_PER_PAGE.toString());

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch companies');
    return null;
  }
}

export async function fetchAllCompanies(token: string) {
  try {
    console.log("Fetching companies data...");

    const url = new URL(`${CURRENT_URL}/companies`);
    //url.searchParams.append('search', query);
    //url.searchParams.append('page', currentPage.toString());
    url.searchParams.append("limit", "1000"); //Limit to 1000 companies

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch companies');
    return null;
  }
}

export async function fetchAllLocations(token: string) {
  try {
    console.log("Fetching locations data...");

    const url = new URL(`${CURRENT_URL}/locations`);
    //url.searchParams.append('search', query);
    //url.searchParams.append('page', currentPage.toString());
    url.searchParams.append("limit", "1000"); //Limit to 1000 companies

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch companies');
    return null;
  }
}

export async function fetchShifts(
  query: string,
  currentPage: number,
  queryParams: Object,
  token: string,
) {
  try {
    console.log("Fetching shifts data... ");

    const url = new URL(`${CURRENT_URL}/shifts`);
    url.searchParams.append("search", query);
    url.searchParams.append("page", currentPage.toString());
    url.searchParams.append("limit", ITEMS_PER_PAGE.toString());

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchMyShifts(
  query: string,
  currentPage: number,
  queryParams: Object,
  token: string,
) {
  try {
    console.log("Fetching pharmacist shifts data...");

    const url = new URL(`${CURRENT_URL}/shifts/myshifts`);
    url.searchParams.append("search", query);
    url.searchParams.append("page", currentPage.toString());
    url.searchParams.append("limit", ITEMS_PER_PAGE.toString());

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchAllMyShifts(token: string, queryParams: Object) {
  try {
    console.log("Fetching all my shifts data...");

    const url = new URL(`${CURRENT_URL}/shifts/allmyshifts`);
    url.searchParams.append("limit", "1000"); //Limit to 1000 shifts

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchShiftsByDate(date: string, token: string) {
  try {
    console.log("Fetching shifts by date data...");

    const url = new URL(`${CURRENT_URL}/shifts/date`);
    url.searchParams.append("date", date);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchMonthCounts(month: string, token: string) {
  try {
    console.log("Fetching shifts count by month data...");

    const url = new URL(`${CURRENT_URL}/shifts/month`);
    url.searchParams.append("month", month);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchWeekCounts(week: string, token: string) {
  try {
    console.log("Fetching shifts count by week data...");

    const url = new URL(`${CURRENT_URL}/shifts/week`);
    url.searchParams.append("week", week);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchUsers(
  query: string,
  currentPage: number,
  queryParams: Object,
  token: string,
) {
  try {
    console.log("Fetching users data...");

    const url = new URL(`${CURRENT_URL}/users`);
    url.searchParams.append("search", query);
    url.searchParams.append("page", currentPage.toString());
    url.searchParams.append("limit", ITEMS_PER_PAGE.toString());

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchPharmacists(
  query: string,
  currentPage: number,
  queryParams: Object,
  token: string,
  limit?: number,
) {
  try {
    console.log("Fetching pharmacists data...");

    const url = new URL(`${CURRENT_URL}/users/pharmacists`);
    url.searchParams.append("search", query);
    url.searchParams.append("page", currentPage.toString());

    const finalLimit = limit ?? ITEMS_PER_PAGE;
    url.searchParams.append("limit", finalLimit.toString());

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}

export async function fetchUserFb(uid: string, token: string) {
  try {
    console.log("Validating user...");

    const url = new URL(`${CURRENT_URL}/users/fb/${uid}`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function fetchUserInfo(id: string, token: string) {
  try {
    console.log("Fetching user...");

    const url = new URL(`${CURRENT_URL}/users/${id}`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function fetchPharmacistShifts(
  id: string,
  token: string,
  status?: string,
  from?: string,
  to?: string,
  limit?: string,
) {
  try {
    console.log("Fetching single pharmacist shifts...");

    const url = new URL(`${CURRENT_URL}/users/shifts/${id}`);

    if (status) {
      url.searchParams.append("status", status);
    }

    if (from) {
      url.searchParams.append("from", from);
    }

    if (to) {
      url.searchParams.append("to", to);
    }

    if (limit) {
      url.searchParams.append("limit", limit);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function fetchCompanyShifts(id: string, token: string) {
  try {
    console.log("Fetching single company shifts...");

    const url = new URL(`${CURRENT_URL}/companies/shifts/${id}`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function fetchLocationShifts(id: string, token: string) {
  try {
    console.log("Fetching single location shifts...");

    const url = new URL(`${CURRENT_URL}/locations/shifts/${id}`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function fetchOnePharmacist(id: string, token: string) {
  try {
    console.log("Fetching pharmacist...");

    const url = new URL(`${CURRENT_URL}/users/pharmacist/${id}`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function fetchOneCompany(id: string, token: string) {
  try {
    console.log("Fetching company...");

    const url = new URL(`${CURRENT_URL}/companies/${id}`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function fetchOneLocation(id: string, token: string) {
  try {
    console.log("Fetching location...");

    const url = new URL(`${CURRENT_URL}/locations/${id}`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function fetchUserRole(uid: string, token: string) {
  try {
    const url = new URL(`${CURRENT_URL}/users/me/${uid}`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function fetchAdminCardsData(token: string) {
  try {
    const shiftsCountPromise = fetchShifts("", 1, {}, token);
    const draftShiftsCountPromise = fetchShifts(
      "",
      1,
      { published: false },
      token,
    );
    const companiesCountPromise = fetchCompanies("", 1, {}, token);
    const locationsCountPromise = fetchLocations("", 1, {}, token);
    const pharmacistsCountPromise = fetchPharmacists("", 1, {}, token);

    const data = await Promise.all([
      shiftsCountPromise,
      companiesCountPromise,
      locationsCountPromise,
      pharmacistsCountPromise,
      draftShiftsCountPromise,
    ]);

    const numberOfShifts = Number(data[0].meta?.totalItems ?? "0");
    const numberOfCompanies = Number(data[1].meta?.totalItems ?? "0");
    const numberOfLocations = Number(data[2].meta?.totalItems ?? "0");
    const numberOfPharmacists = Number(data[3].meta?.totalItems ?? "0");
    const numberOfDraftShifts = Number(data[4].meta?.totalItems ?? "0");

    //const numberOfCustomers = Number(data[1][0].count ?? '0');
    //const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    //const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfPharmacists,
      numberOfCompanies,
      numberOfLocations,
      numberOfDraftShifts,
      numberOfShifts,
    };
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

export async function fetchUnseenNotifications(token: string) {
  try {
    console.log("Fetching unseen notifications...");

    const url = new URL(`${CURRENT_URL}/notifications/unseen`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function fetchLatestShifts(token: string, queryParams: Object) {
  try {
    console.log("Fetching latest shifts...");

    const url = new URL(`${CURRENT_URL}/shifts/latest`);

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function fetchShiftCancellationRequests(
  currentPage: number,
  token: string,
) {
  try {
    console.log("Fetching shift cancellation requests data...");

    const url = new URL(`${CURRENT_URL}/cancellation-requests`);
    url.searchParams.append("page", currentPage.toString());
    url.searchParams.append("limit", "5");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorData = await response.json(); // If the API returns error details
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorData.message || "Unknown error"}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    //throw new Error('Failed to fetch locations');
    return null;
  }
}
