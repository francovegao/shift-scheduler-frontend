"use client";

import { updateEmailTemplate } from "@/app/lib/actions";
import { fetchEmailTemplate } from "@/app/lib/data";
import { AuthWrapper } from "@/app/ui/authentication/auth-wrapper";
import { useAuth } from "@/app/ui/context/auth-context";
import { toast } from "react-toastify";
import {
  ArrowLeftIcon,
  ClipboardIcon,
  FolderArrowDownIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FormEvent,
  SetStateAction,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import EmailTemplatesActionsModal from "@/app/ui/email-templates/templates-actions-modal";

type EmailTemplate = {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  subjectTemplate: string;
  htmlTemplate: string;
  textTemplate?: string | null;
  variables?: Record<string, unknown> | null;
  isActive: boolean;
  allowManualSend: boolean;
  updatedBy?: {
    firstName?: string;
    lastName?: string;
  } | null;
  versions?: Array<{ version: number }>;
};

type EmailTemplateDraft = {
  subjectTemplate: string;
  htmlTemplate: string;
  textTemplate: string;
  isActive: boolean;
};

const DEFAULT_SHIFT_LIST_BLOCK = `
{{#each shifts}} 
  <div style="margin-bottom: 15px; padding: 10px; border-left: 4px solid #f44336; background: #fafafa;">
    <p style="margin: 0;">Date: <strong>{{shiftDate}}</strong></p>
    <p style="margin: 0;">Time: <strong>{{startTime}} - {{endTime}}</strong></p>
    <p style="margin: 0;">Notes: {{title}}</p> <p style="margin: 0;">{{description}}</p>
    <p style="margin: 8px 0 0;"> 
      <a href="{{gcalLink}}">Add shift to Google Calendar</a> 
    </p> 
  </div> 
{{/each}}
`;

export default function EmailTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: templateKey } = use(params);

  const { firebaseUser, appUser, loading } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [token, setToken] = useState("");

  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate | null>(
    null,
  );
  const [draft, setDraft] = useState<EmailTemplateDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const htmlEditorRef = useRef<HTMLTextAreaElement>(null);

  // Get token
  useEffect(() => {
    if (!firebaseUser) {
      setToken("");
      return;
    }

    if (firebaseUser) {
      firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
        setToken(idToken);
      });
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (!token || !appUser) return;

    const getEmailTemplate = async () => {
      setIsFetching(true);
      try {
        if (appUser?.id) {
          const response = await fetchEmailTemplate(templateKey, token);
          const template = response?.data as EmailTemplate | undefined;

          if (!template) {
            setEmailTemplate(null);
            setDraft(null);
            return;
          }
          setEmailTemplate(template);
          setDraft({
            subjectTemplate: template.subjectTemplate ?? "",
            htmlTemplate: template.htmlTemplate ?? "",
            textTemplate: template.textTemplate ?? "",
            isActive: template.isActive,
          });
        }
      } catch (err) {
        console.error("Failed to fetch email template", err);
      } finally {
        setIsFetching(false);
      }
    };
    if (token) {
      getEmailTemplate();
    }
  }, [token, appUser, templateKey]);

  const updateDraft = <K extends keyof EmailTemplateDraft>(
    field: K,
    value: EmailTemplateDraft[K],
  ) => {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const hasChanges =
    !!emailTemplate &&
    !!draft &&
    (draft.subjectTemplate !== emailTemplate.subjectTemplate ||
      draft.htmlTemplate !== emailTemplate.htmlTemplate ||
      draft.textTemplate !== (emailTemplate.textTemplate ?? "") ||
      draft.isActive !== emailTemplate.isActive);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft || !emailTemplate || !token || !hasChanges) return;

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await updateEmailTemplate(
        token,
        {
          success: false,
          error: false,
        },
        {
          subjectTemplate: draft.subjectTemplate,
          htmlTemplate: draft.htmlTemplate,
          textTemplate: draft.textTemplate || null,
          isActive: draft.isActive,
        },
        templateKey,
      );

      const savedTemplate = (response?.data ?? response) as
        | EmailTemplate
        | undefined;

      if (savedTemplate?.key) {
        setEmailTemplate(savedTemplate);
        setDraft({
          subjectTemplate: savedTemplate.subjectTemplate ?? "",
          htmlTemplate: savedTemplate.htmlTemplate ?? "",
          textTemplate: savedTemplate.textTemplate ?? "",
          isActive: savedTemplate.isActive,
        });
      } else {
        const refreshed = await fetchEmailTemplate(templateKey, token);
        const saved = refreshed?.data as EmailTemplate | undefined;
        if (saved) {
          setEmailTemplate(saved);
          setDraft({
            subjectTemplate: saved.subjectTemplate ?? "",
            htmlTemplate: saved.htmlTemplate ?? "",
            textTemplate: saved.textTemplate ?? "",
            isActive: saved.isActive,
          });
        }
      }

      setSuccessMessage("Email template saved successfully.");
      toast("Email template saved successfully.", {
        toastId: "unique-toast",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to save email template.",
      );
      toast(
        error instanceof Error
          ? error.message
          : "Failed to save email template.",
        {
          toastId: "unique-toast",
        },
      );
    } finally {
      setIsSaving(false);
    }
  };

  const insertVariable = async (variable: string) => {
    const textToInsert = `{{${variable}}}`;
    const editor = htmlEditorRef.current;

    if (!editor || !draft) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const currentText = draft.htmlTemplate;

    const nextText =
      currentText.slice(0, start) + textToInsert + currentText.slice(end);

    updateDraft("htmlTemplate", nextText);

    requestAnimationFrame(() => {
      editor.focus();
      const position = start + textToInsert.length;
      editor.setSelectionRange(position, position);
    });
  };

  const insertShiftList = () => {
    const editor = htmlEditorRef.current;

    if (!draft) return;

    if (!editor) {
      updateDraft(
        "htmlTemplate",
        draft.htmlTemplate + DEFAULT_SHIFT_LIST_BLOCK,
      );
      return;
    }

    const start = editor.selectionStart;
    const end = editor.selectionEnd;

    const currentHtml = draft.htmlTemplate;

    const newHtml =
      currentHtml.slice(0, start) +
      DEFAULT_SHIFT_LIST_BLOCK +
      currentHtml.slice(end);

    updateDraft("htmlTemplate", newHtml);

    requestAnimationFrame(() => {
      editor.focus();

      const cursorPosition = start + DEFAULT_SHIFT_LIST_BLOCK.length;

      editor.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  if (loading || isFetching) return <div>Loading...</div>;
  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;
  if (!emailTemplate || !draft) {
    notFound();
  }

  const variableNames = Object.keys(emailTemplate.variables ?? {});

  const isArrayVariable = (variable: string) => {
    const field = emailTemplate.variables?.[variable] as { type?: string };

    return field?.type === "array";
  };

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <div className="p-4 lg:p-8">
        <Link
          href={`/dashboard/list/email-templates`}
          className="mb-5 inline-flex items-center gap-2 text-sm text-tx-body-muted hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to email templates
        </Link>
        <h1 className="text-2xl font-bold">Email Template</h1>
        <p className="mt-1 text-sm text-tx-body-muted">
          Edit the content used by automated email notifications.
        </p>
        <div className="bg-surface p-4 rounded-md flex-1 m-4 mt-2">
          {/* TOP */}
          <div className="mt-2 flex flex-wrap align-end justify-end gap-4 md:mt-2">
            <EmailTemplatesActionsModal
              type={"preview"}
              token={token}
              data={{
                subjectTemplate: draft.subjectTemplate,
                htmlTemplate: draft.htmlTemplate,
                textTemplate: draft.textTemplate || null,
              }}
              templateKey={templateKey}
            />
            <EmailTemplatesActionsModal
              type={"send_test"}
              token={token}
              data={{
                subjectTemplate: draft.subjectTemplate,
                htmlTemplate: draft.htmlTemplate,
                textTemplate: draft.textTemplate || null,
              }}
              templateKey={templateKey}
            />
            {emailTemplate.allowManualSend && (
              <EmailTemplatesActionsModal type={"send_manual"} token={token} />
            )}
          </div>

          {/* FORM */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"></div>

            {/* Feedback */}
            {errorMessage && (
              <div
                role="alert"
                className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800"
              >
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-800"
              >
                {successMessage}
              </div>
            )}

            {/* Template metadata */}
            <section className="relative space-y-4 rounded-lg bg-surface p-5 shadow-sm">
              <span
                className={`absolute top-5 right-5 align-right w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  draft.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {draft.isActive ? "Active" : "Inactive"}
              </span>

              <div className="flex flex-col">
                <label className="text-tx-body-muted">Name:</label>
                <p>{emailTemplate.name}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-tx-body-muted">Template key:</label>
                <p>{emailTemplate.key}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-tx-body-muted">Description:</label>
                <p>{emailTemplate.description}</p>
              </div>

              <label
                htmlFor="subjectTemplate"
                className="block text-sm font-semibold"
              >
                Email subject
              </label>
              <input
                id="subjectTemplate"
                value={draft.subjectTemplate}
                onChange={(event) =>
                  updateDraft("subjectTemplate", event.target.value)
                }
                required
                maxLength={200}
                className="w-full rounded-md border border-surface-muted bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Shift Assigned at {{companyName}}"
              />

              <div>
                <label
                  htmlFor="htmlTemplate"
                  className="block text-sm font-semibold"
                >
                  HTML template
                </label>
                <p className="mt-1 text-xs text-tx-body-muted">
                  Edit the HTML source. Handlebars variables and blocks are
                  supported.
                </p>
              </div>

              <textarea
                ref={htmlEditorRef}
                id="htmlTemplate"
                value={draft.htmlTemplate}
                onChange={(event) =>
                  updateDraft("htmlTemplate", event.target.value)
                }
                required
                spellCheck={false}
                rows={20}
                className="w-full resize-y rounded-md border border-surface-muted bg-surface-secondary p-4 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-tx-body-muted">
                  {draft.htmlTemplate.length.toLocaleString()} characters
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateDraft("htmlTemplate", emailTemplate.htmlTemplate)
                  }
                  disabled={!hasChanges}
                  className="text-sm text-tx-body-muted underline disabled:opacity-50"
                >
                  Reset HTML
                </button>
              </div>

              <label
                htmlFor="textTemplate"
                className="block text-sm font-semibold"
              >
                Plain-text alternative
              </label>
              <p className="text-xs text-tx-body-muted">
                Optional. Recommended for email clients that prefer plain text.
              </p>
              <textarea
                id="textTemplate"
                value={draft.textTemplate}
                onChange={(event) =>
                  updateDraft("textTemplate", event.target.value)
                }
                rows={8}
                className="w-full resize-y rounded-md border border-surface-muted bg-surface-secondary p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div>
                <h2 className="text-sm font-semibold">Available variables</h2>
                <p className="mt-1 text-xs text-tx-body-muted">
                  Select a variable to insert it at the cursor in the HTML
                  editor.
                </p>
              </div>

              {variableNames.length ? (
                <div className="flex flex-wrap gap-2">
                  {variableNames.map((variable) => {
                    const isArray = isArrayVariable(variable);

                    return (
                      <button
                        key={variable}
                        type="button"
                        onClick={() =>
                          isArray
                            ? insertShiftList()
                            : void insertVariable(variable)
                        }
                        className="inline-flex items-center gap-1 rounded-md border border-surface-muted px-2 py-1.5 font-mono text-xs hover:bg-surface-secondary"
                        title={
                          isArray
                            ? `Insert ${variable} list block`
                            : `Insert {{${variable}}}`
                        }
                      >
                        <ClipboardIcon className="h-3.5 w-3.5" />
                        {isArray
                          ? `Insert ${variable} list`
                          : `{{${variable}}}`}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-tx-body-muted">
                  No variable metadata is defined for this template.
                </p>
              )}
            </section>

            {/* Actions */}
            <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-surface-muted bg-surface/95 p-4 backdrop-blur">
              <div className="text-xs text-tx-body-muted">
                {hasChanges
                  ? "You have unsaved changes."
                  : "All changes saved."}
              </div>

              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FolderArrowDownIcon className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthWrapper>
  );
}
