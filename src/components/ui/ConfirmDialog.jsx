import * as Dialog from "@radix-ui/react-dialog";
import { HelpCircle } from "lucide-react";

const variantStyles = {
  default: "bg-brand/10 text-brand",
  warning: "bg-amber-100 text-amber-600",
  danger: "bg-error-soft text-error",
};

const confirmButtonStyles = {
  default: "btn-brand",
  warning: "btn-brand",
  danger: "btn-brand bg-error hover:bg-error/90",
};

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmIcon,
  loadingLabel = "Submitting…",
  variant = "default",
  icon = HelpCircle,
  isLoading = false,
  children = null,
}) {
  const ConfirmIcon = confirmIcon;
  const Icon = icon;
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          asChild
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            if (isLoading) {
              e.preventDefault();
              return;
            }
            e.preventDefault();
            const btn = e.currentTarget.querySelector("[data-confirm]");
            btn?.focus();
          }}
          onPointerDownOutside={(e) => {
            if (
              e.target instanceof Element &&
              e.target.closest("[data-sonner-toaster]")
            ) {
              e.preventDefault();
            }
          }}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${variantStyles[variant]}`}
                >
                  <Icon size={22} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <Dialog.Title className="mb-1 text-body-lg font-semibold text-ink">
                    {title}
                  </Dialog.Title>
                  <Dialog.Description className="text-sm-fluid text-ink-muted">
                    {description}
                  </Dialog.Description>
                </div>
              </div>

              {children}

              <div className="mt-6 flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    data-cancel
                    disabled={isLoading}
                    className="btn-outline px-4 py-2 text-sm-fluid disabled:opacity-50"
                  >
                    {cancelLabel}
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  data-confirm
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`${confirmButtonStyles[variant]} flex items-center gap-2 px-4 py-2 text-sm-fluid disabled:opacity-50`}
                >
                  {isLoading ? (
                    loadingLabel
                  ) : (
                    <>
                      {ConfirmIcon && <ConfirmIcon size={16} aria-hidden="true" />}
                      {confirmLabel}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}