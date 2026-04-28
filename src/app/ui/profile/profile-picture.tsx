import ManageFilesModal from "../files/manage-files-modal";
import { getDisplayFileName } from "@/app/lib/utils";
import Image from "next/image";

export default function ProfilePicture({
  user,
  token,
}: {
  user: any;
  token: string;
}) {
  const profilePicture = user?.files.find(
    (file: { type: string }) => file.type === "profilePicture",
  );

  async function openProfilePicture(fileId: string) {
    try {
      window.open(profilePicture.fileUrl, "_blank", "noreferrer");
    } catch (err) {
      console.error("Failed to open profile picture", err);
    }
  }

  return (
    <div className="p-2">
      <div className="flex flex-col gap-2 text-black">
        {/*Title and Edit Button */}
        <div className="flex items-center justify-start gap-4">
          <h1 className="text-xl font-semibold">Profile Picture</h1>
          {profilePicture ? (
            <>
              <ManageFilesModal
                type="replace"
                fileType="profilePicture"
                token={token}
                ownerId={user.id}
                data={profilePicture}
              />
              <ManageFilesModal
                type="delete"
                fileType="profilePicture"
                token={token}
                ownerId={user.id}
                id={profilePicture.id}
              />
            </>
          ) : (
            <ManageFilesModal
              type="upload"
              fileType="profilePicture"
              token={token}
              ownerId={user.id}
            />
          )}
        </div>

        {/*Information */}
        <div className="flex justify-between flex-wrap p-4 gap-4 bg-white rounded-md shadow-sm">
          <div className="grid grid-cols-1 gap-4 w-full">
            <div className="flex flex-col">
              <label className="text-gray-500">Uploaded Profile Picture:</label>
              {profilePicture ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                    <Image
                      src={profilePicture.fileUrl}
                      alt="Profile picture"
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <span className="text-sm font-medium italic text-gray-700 block truncate">
                      {getDisplayFileName(profilePicture.fileName)}
                    </span>
                    <button
                      onClick={() => openProfilePicture(profilePicture.id)}
                      className="text-xs text-blue-500 hover:underline text-left cursor-pointer"
                    >
                      View Full Size
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed">
                    <span className="text-xs">No Photo</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
