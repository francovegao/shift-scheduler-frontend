import { create } from "zustand";

export type DataResource =
  | "users"
  | "pharmacists"
  | "companies"
  | "locations"
  | "shifts"
  | "requests"
  | "files"
  | "notifications";

type RevisionState = {
  revisions: Record<DataResource, number>;
  invalidate: (...resources: DataResource[]) => void;
};

export const useDataRevisions = create<RevisionState>((set) => ({
  revisions: {
    users: 0,
    pharmacists: 0,
    companies: 0,
    locations: 0,
    shifts: 0,
    requests: 0,
    files: 0,
    notifications: 0,
  },
  invalidate: (...resources) =>
    set(({ revisions }) => ({
      revisions: resources.reduce(
        (next, resource) => ({ ...next, [resource]: next[resource] + 1 }),
        {
          ...revisions,
          notifications:
            revisions.notifications + (resources.includes("notifications") ? 0 : 1),
        },
      ),
    })),
}));

export const invalidateData = (...resources: DataResource[]) =>
  useDataRevisions.getState().invalidate(...resources);

export const useDataRevision = (resource: DataResource) =>
  useDataRevisions((state) => state.revisions[resource]);
