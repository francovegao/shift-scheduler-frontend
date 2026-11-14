import { toast } from "react-toastify";
import { invalidateData, type DataResource } from "./data-revisions";

// Data fetchers return null on API errors. Keep the last good view in that case.
export function acceptRefresh(
  response: any,
  resource: DataResource,
  field: "data" | "meta" | null = "data",
  source: string = resource,
): boolean {
  const toastId = `refresh-${source}`;
  if (response != null && (field === null || response[field] != null)) {
    toast.dismiss(toastId);
    return true;
  }

  toast.error(`Could not refresh ${resource}. Click here to retry.`, {
    toastId,
    autoClose: false,
    onClick: () => {
      toast.dismiss(toastId);
      invalidateData(resource);
    },
  });
  return false;
}

// A deletion can remove the only record on the last page. Keep the active
// filters while moving to the new last page, then let that page fetch itself.
export function recoverPage(
  response: any,
  currentPage: number,
  searchParams: { toString(): string },
  router: { replace(href: string): void },
): boolean {
  const reportedPages = Number(response?.meta?.totalPages);
  if (!Number.isFinite(reportedPages)) return false;
  const lastPage = Math.max(1, reportedPages);
  if (currentPage <= lastPage) return false;

  const params = new URLSearchParams(searchParams.toString());
  if (lastPage <= 1) params.delete("page");
  else params.set("page", String(lastPage));
  const query = params.toString();
  router.replace(`${window.location.pathname}${query ? `?${query}` : ""}`);
  return true;
}
