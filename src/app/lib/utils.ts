export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

// utility to format API shifts data into chart data
export function formatShiftsData(apiData: { month: string; count: number }[]) {
  // Months lookup
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Initialize all months with 0
  const result = monthNames.map((name, i) => ({
    month: name,
    shifts: 0,
    fill: i % 2 === 0 ? "#C3EBFA" : "#FAE27C", // alternating colors
  }));

  // Fill in real values from API
  apiData.forEach(item => {
    const date = new Date(item.month);
    const monthIndex = date.getUTCMonth(); // 0-based
    result[monthIndex].shifts = item.count;
  });

  return result;
}

export const getFullAddress = (
  address: string | null | undefined,
  city: string | null | undefined,
  province: string | null | undefined,
  postalCode: string | null | undefined, 
) => {

  if (!address && !city && !province && !postalCode) {
    return "No address info";
  }

  const parts = [address, city, province, postalCode].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : "No address info";
};

export const displayRole = (
  role: string | null | undefined,
) => {

  switch(role){
    case "admin":
      return "Admin"
    case "pharmacy_manager":
      return "Company Manager"
    case "location_manager":
      return "Location Manager"
    case "relief_pharmacist":
      return "Pharmacist"
    default:
      return "No Role"
  }
};