import { previewEmailTemplate } from "@/app/lib/actions";
import { PreviewEmailTemplateSchema } from "@/app/lib/formValidationSchemas";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type PreviewWarning = {
  field: "subjectTemplate" | "htmlTemplate" | "textTemplate" | "variables";
  message: string;
};

export default function PreviewEmailTemplate({
  type,
  templateKey,
  token,
  data,
}: {
  type: "preview";
  templateKey: string;
  token: string;
  data?: PreviewEmailTemplateSchema;
}) {
  const [isFetching, setIsFetching] = useState(true);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSubject, setPreviewSubject] = useState("");
  const [previewWarnings, setPreviewWarnings] = useState<PreviewWarning[]>([]);

  useEffect(() => {
    const handlePreview = async () => {
      if (!data || !token) return;
      setIsFetching(true);
      try {
        const response = await previewEmailTemplate(token, data, templateKey);

        if (response && response.success === false) {
          const apiErrors = response.errors || [];
          setPreviewWarnings(apiErrors);

          toast.error(response.message || "Email template draft is invalid.");
          return;
        }

        const preview = response?.data ?? response;

        toast("Previewing Email Template", {
          toastId: "unique-toast",
        });

        setPreviewSubject(preview.subject ?? "");
        setPreviewHtml(preview.html ?? "");
        setPreviewWarnings(preview.warnings ?? []);
      } catch (err: any) {
        console.error("Failed to preview template", err);
        const serverResponse = err.response?.data;
        if (serverResponse?.errors) {
          setPreviewWarnings(serverResponse.errors);
          toast.error(serverResponse.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setIsFetching(false);
      }
    };

    if (token) handlePreview();
  }, [token, type, data]);

  if (isFetching || !data) return <div>Loading...</div>;

  return (
    <section className="space-y-3 rounded-lg bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Rendered preview</h2>
      </div>

      <div className="text-sm">
        <span className="font-medium">Warnings: </span>
        {previewWarnings.length ? (
          <div className="">
            {previewWarnings.map((warning) => (
              <span className="text-sm text-complementary-one">
                {warning.field}: {warning.message}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-tx-body-muted">No warnings</p>
        )}
      </div>

      <p className="text-sm">
        <span className="font-medium">Subject: </span>
        {previewSubject}
      </p>

      <iframe
        title="Email HTML preview"
        sandbox=""
        srcDoc={previewHtml}
        className="h-[500px] w-full rounded-md border border-surface-muted bg-white"
      />
    </section>
  );
}
