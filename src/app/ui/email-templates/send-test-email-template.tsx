import {
  PreviewEmailTemplateSchema,
  sendTestEmailTemplateSchema,
} from "@/app/lib/formValidationSchemas";
import {
  Dispatch,
  Key,
  SetStateAction,
  useActionState,
  useEffect,
} from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendTestTemplateEmail } from "@/app/lib/actions";
import { toast } from "react-toastify";

type FormInput = z.input<typeof sendTestEmailTemplateSchema>;
type FormOutput = z.output<typeof sendTestEmailTemplateSchema>;

export default function SendTestEmailTemplate({
  type,
  templateKey,
  token,
  data,
  setOpen,
}: {
  type: "send_test";
  templateKey: string;
  token: string;
  data?: PreviewEmailTemplateSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(sendTestEmailTemplateSchema),
    defaultValues: {
      testRecipient: undefined,
      subjectTemplate: data?.subjectTemplate,
      htmlTemplate: data?.htmlTemplate,
      textTemplate: data?.textTemplate,
      key: templateKey,
    },
  });

  const [state, formAction] = useActionState(
    sendTestTemplateEmail.bind(null, token),
    {
      success: false,
      error: false,
    },
  );

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Email sent!`, { toastId: "unique-toast" });
      setOpen(false);
    }
    if (state.error) {
      toast.error(state.message || "Email template draft is invalid.", {
        toastId: "error-toast",
      });
    }
  }, [state, setOpen]);

  if (!data) return <div>Loading...</div>;

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Send Test Template Email</h1>
      <span className="text-sm text-tx-muted font-medium">
        Test the email template with your current changes in the email editor
      </span>
      <label htmlFor="testEmail" className="block text-sm font-semibold">
        Test recipient
      </label>
      <input
        id="testRecipient"
        type="email"
        {...register("testRecipient")}
        placeholder="you@example.com"
        className="w-full rounded-md border border-surface-muted bg-surface px-3 py-2 text-sm"
      />
      <p className="text-xs text-tx-body-muted">
        A test send should use mock data and should not email real pharmacists
        or customers.
      </p>
      {errors.subjectTemplate?.message && (
        <p className="text-xs text-red-400">
          {errors.subjectTemplate?.message.toString()}
        </p>
      )}
      {errors.htmlTemplate?.message && (
        <p className="text-xs text-red-400">
          {errors.htmlTemplate?.message.toString()}
        </p>
      )}
      {errors.testRecipient?.message && (
        <p className="text-xs text-red-400">
          {errors.testRecipient?.message.toString()}
        </p>
      )}
      {errors.testRecipient?.message && (
        <p className="text-xs text-red-400">
          {errors.testRecipient?.message.toString()}
        </p>
      )}
      <button
        type="submit"
        className="bg-primary text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-primary-100 cursor-pointer"
      >
        Send Test Email
      </button>
      {state.error && (
        <div className="mt-4 p-3 text-left">
          <span className="font-medium text-complementary-one block mb-1">
            Validation Errors:
          </span>

          {state.errors && state.errors.length > 0 ? (
            <div className="flex flex-col gap-1">
              {state.errors.map((err: any, index: Key | null | undefined) => (
                <span key={index} className="text-sm text-complementary-one">
                  <strong className="capitalize">{err.field}:</strong>{" "}
                  {err.message}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-red-500">
              Something went wrong! Please try again.
            </span>
          )}

          {state.warnings && state.warnings.length > 0 && (
            <div className="mt-4 p-3 text-left">
              <span className="font-medium text-amber-800 block mb-1">
                Warnings:
              </span>
              <div className="flex flex-col gap-1">
                {state.warnings.map(
                  (warning: any, index: Key | null | undefined) => (
                    <span key={index} className="text-sm text-amber-700">
                      <strong className="capitalize">{warning.field}:</strong>{" "}
                      {warning.message}
                    </span>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
