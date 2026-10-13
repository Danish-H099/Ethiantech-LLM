import { Link } from "react-router-dom";
import logo from "src/assets/logo.webp";

function StepIndicator({ steps, activeStep }) {
  return (
    <nav aria-label="Onboarding progress">
      <ol className="flex flex-wrap gap-x-6 gap-y-3">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === activeStep;
          const isDone = stepNumber < activeStep;
          return (
            <li
              key={label}
              aria-current={isActive ? "step" : undefined}
              className="flex items-center gap-2"
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  isActive
                    ? "bg-accent-tutor text-white"
                    : isDone
                      ? "bg-tint-tutor text-accent-tutor"
                      : "bg-surface-soft text-ink-muted"
                }`}
              >
                {stepNumber}
              </span>
              <span
                className={`text-sm-fluid ${
                  isActive ? "font-semibold text-ink" : "text-ink-muted"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Distraction-free chrome for the instructor onboarding surface (4-step wizard
 * + application status hub): brand header, optional step indicator, and a
 * single content column. The tutor sidebar layout is deliberately not used
 * here — applicants stay focused until their application is submitted.
 */
export default function OnboardingShell({
  heading,
  subheading,
  steps,
  activeStep,
  headerAction,
  children,
}) {
  return (
    <div data-role="tutor" className="flex min-h-screen flex-col bg-surface font-outfit text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm-fluid focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2" aria-label="Ethian Tech Home">
            <img src={logo} loading="lazy" className="h-8 w-auto" alt="Ethian Tech" />
            <span className="font-outfit text-header-brand font-bold text-ink">EthianTech</span>
            <span className="rounded bg-accent-tutor px-2 py-0.5 text-sm-fluid font-bold uppercase text-white">
              Teach
            </span>
          </Link>
          {headerAction}
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
        {steps?.length > 0 && <StepIndicator steps={steps} activeStep={activeStep} />}

        {heading && (
          <div className={steps?.length > 0 ? "mt-8" : ""}>
            <h1 className="page-title">{heading}</h1>
            {subheading && (
              <p className="mt-3 max-w-2xl text-subtitle text-ink-muted">{subheading}</p>
            )}
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
