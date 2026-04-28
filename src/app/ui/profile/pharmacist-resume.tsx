import { getDownloadUrl } from "@/app/lib/actions";
import ManageFilesModal from "../files/manage-files-modal";
import { getDisplayFileName } from "@/app/lib/utils";

export default function PharmacistResume({
  user,
  token,
}: {
  user: any;
  token: string;
}) {
  const resume = user?.files.find(
    (file: { type: string }) => file.type === "resume",
  );

  async function openFile(fileId: string) {
    try {
      const signedUrl = await getDownloadUrl(token, fileId);

      window.open(signedUrl, "_blank", "noreferrer");
    } catch (err) {
      console.error("Failed to open file", err);
    }
  }

  return (
    <div className="p-2">
      <div className="flex flex-col gap-2 text-black">
        {/*Title and Edit Button */}
        <div className="flex items-center justify-start gap-4">
          <h1 className="text-xl font-semibold">Resume</h1>
          {resume ? (
            <>
              <ManageFilesModal
                type="replace"
                fileType="resume"
                token={token}
                ownerId={user.id}
                data={resume}
              />
              <ManageFilesModal
                type="delete"
                fileType="resume"
                token={token}
                ownerId={user.id}
                id={resume.id}
              />
            </>
          ) : (
            <ManageFilesModal
              type="upload"
              fileType="resume"
              token={token}
              ownerId={user.id}
            />
          )}
        </div>

        {/*Information */}
        <div className="flex justify-between flex-wrap p-4 gap-4 bg-white rounded-md shadow-sm">
          <div className="grid grid-cols-1 gap-4 w-full">
            <div className="flex flex-col">
              <label className="text-gray-500">Uploaded Resume:</label>
              {resume ? (
                <div className="flex items-center gap-4">
                  <div className="min-w-0">
                    <span className="text-md font-medium italic text-gray-700 block truncate">
                      {getDisplayFileName(resume.fileName)}
                    </span>
                    <button
                      onClick={() => openFile(resume.id)}
                      className="text-xs text-blue-500 hover:underline cursor-pointer"
                    >
                      View Resume
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">Not uploaded yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
