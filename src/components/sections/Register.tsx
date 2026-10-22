'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Copy,
  Download,
  Info,
  Loader2,
  PartyPopper,
  RotateCcw,
  Ticket,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';

import { EVENT } from '@/data/event';
import {
  clearDraft,
  copyToClipboard,
  downloadSlip,
  draftHasContent,
  formatINR,
  loadDraft,
  saveDraft,
  submitRegistration,
} from '@/lib/registrations';
import { cn } from '@/lib/utils';
import {
  FORM_STEPS,
  REGISTRATION_DEFAULTS,
  STEP_FIELDS,
  registrationSchema,
  type RegistrationInput,
} from '@/lib/validation';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { Stamp } from '@/components/ui/Stamp';

const FIELD_STEP: Record<keyof RegistrationInput, number> = {
  teamName: 0,
  leaderName: 1,
  leaderEmail: 1,
  memberName: 2,
  memberEmail: 2,
};

type SubmitState = 'idle' | 'pending' | 'success' | 'error';

export function Register() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [registrationId, setRegistrationId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [draftNotice, setDraftNotice] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadNote, setDownloadNote] = useState('');
  const reduce = useReducedMotion();

  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepRef = useRef(0);
  stepRef.current = step;

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: REGISTRATION_DEFAULTS,
    mode: 'onTouched',
  });
  const {
    register,
    trigger,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = form;

  // Restore an in-progress draft (a refresh never loses the form).
  useEffect(() => {
    const draft = loadDraft();
    if (draft && draftHasContent(draft.values)) {
      reset(draft.values);
      setStep(Math.min(draft.step, FORM_STEPS.length - 1));
      setDraftNotice(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist every change as a draft.
  useEffect(() => {
    const subscription = watch((values) => {
      saveDraft(
        { ...REGISTRATION_DEFAULTS, ...(values as Partial<RegistrationInput>) },
        stepRef.current,
      );
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Move focus to the step heading on step change (skips the first render).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: false });
  }, [step]);

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(Math.max(0, Math.min(FORM_STEPS.length - 1, next)));
  };

  const next = async () => {
    const fields = STEP_FIELDS[step];
    const ok = await trigger(fields, { shouldFocus: true });
    if (ok) go(step + 1);
  };

  const onInvalid = (errs: FieldErrors<RegistrationInput>) => {
    const steps = Object.keys(errs).map((k) => FIELD_STEP[k as keyof RegistrationInput]);
    if (steps.length > 0) go(Math.min(...steps));
  };

  const onSubmit = async (values: RegistrationInput) => {
    setSubmitState('pending');
    setSubmitError('');
    try {
      const result = await submitRegistration(values);
      setRegistrationId(result.registrationId);
      setSubmitState('success');
      clearDraft();
      setDraftNotice(false);
    } catch (err) {
      setSubmitState('error');
      setSubmitError(err instanceof Error ? err.message : 'Please try again.');
    }
  };

  const startOver = () => {
    reset(REGISTRATION_DEFAULTS);
    clearDraft();
    setStep(0);
    setSubmitState('idle');
    setRegistrationId('');
    setSubmitError('');
    setDraftNotice(false);
    setCopied(false);
    setDownloadNote('');
  };

  const discardDraft = () => {
    reset(REGISTRATION_DEFAULTS);
    clearDraft();
    setStep(0);
    setDraftNotice(false);
  };

  const copyId = async () => {
    const ok = await copyToClipboard(registrationId);
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 2500);
  };

  const download = () => {
    const ok = downloadSlip(getValues(), registrationId);
    setDownloadNote(
      ok ? 'Slip downloaded — keep it safe.' : 'Download was blocked by the browser; copy the ID instead.',
    );
  };

  const values = getValues();
  const fee = formatINR(EVENT.team.feeINR);
  const isSolo = values.memberName.trim().length === 0 && values.memberEmail.trim().length === 0;

  return (
    <SectionShell
      id="register"
      index="08"
      kicker="Sign up"
      title="Register your team"
      lede={
        <p>
          Four short steps, about two minutes. Your progress is saved in this browser as you type,
          and the fee is <strong className="font-semibold text-ink">{fee} per team</strong> — nothing
          is charged online.
        </p>
      }
      className="border-b-0"
    >
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Order summary rail */}
        <Reveal className="lg:col-span-4">
          <aside className="h-full rounded-xl border border-ink/25 bg-ink p-7 text-paper md:p-8">
            <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-paper/60">
              <Ticket size={16} aria-hidden="true" />
              Entry {EVENT.edition}
            </p>
            <p className="mt-3 font-display text-4xl font-semibold">
              {fee}
              <span className="ml-2 align-middle font-sans text-[15px] font-medium text-paper/70">
                per team
              </span>
            </p>
            <dl className="mt-6 space-y-4 text-[15px]">
              {[
                ['Date', `${EVENT.date.display} (${EVENT.date.yearNote})`],
                ['Reporting', EVENT.time.reporting],
                ['Team', `Up to ${EVENT.team.maxMembers} members`],
                ['Format', EVENT.format],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-3">
                  <dt className="flex-none text-paper/60">{label}</dt>
                  <dd
                    aria-hidden="true"
                    className="mx-1 h-px flex-1 bg-paper/20"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, rgba(245,240,229,0.4) 1.5px, transparent 1.5px)',
                      backgroundSize: '7px 1.5px',
                    }}
                  />
                  <dd className="text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="my-6 border-t border-dashed border-paper/25" aria-hidden="true" />
            <p className="flex gap-2.5 text-[14px] leading-relaxed text-paper/70">
              <Info size={17} aria-hidden="true" className="mt-0.5 flex-none" />
              Pay the fee as instructed by the organisers. This form only records your team — no
              payment is taken here.
            </p>
          </aside>
        </Reveal>

        {/* Form / success panel */}
        <Reveal delay={0.08} className="lg:col-span-8">
          <div className="rounded-xl border border-ink/25 bg-card p-6 shadow-[6px_6px_0_0_rgba(20,27,39,0.12)] md:p-10">
            {submitState === 'success' ? (
              <SuccessPanel
                values={values}
                registrationId={registrationId}
                isSolo={isSolo}
                fee={fee}
                copied={copied}
                downloadNote={downloadNote}
                onCopy={copyId}
                onDownload={download}
                onStartOver={startOver}
              />
            ) : (
              <form
                noValidate
                onSubmit={(e) => {
                  // Enter key on steps 1–3 behaves like "Continue"; the final
                  // step performs full validation and submits.
                  if (step < FORM_STEPS.length - 1) {
                    e.preventDefault();
                    void next();
                  } else {
                    void handleSubmit(onSubmit, onInvalid)(e);
                  }
                }}
              >
                {draftNotice && (
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gold/50 bg-gold-soft/70 px-4 py-3 text-[14px]">
                    <p className="font-medium text-ink">
                      Draft restored — pick up where you left off.
                    </p>
                    <button
                      type="button"
                      onClick={discardDraft}
                      className="min-h-[36px] rounded-md border border-ink/25 bg-card px-3 font-semibold hover:border-ink"
                    >
                      Discard draft
                    </button>
                  </div>
                )}

                {/* Stepper */}
                <ol aria-label="Registration steps" className="grid grid-cols-4 gap-2">
                  {FORM_STEPS.map((s, i) => {
                    const done = i < step;
                    const current = i === step;
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => i < step && go(i)}
                          disabled={i >= step}
                          aria-current={current ? 'step' : undefined}
                          className={cn(
                            'flex min-h-[56px] w-full flex-col items-start gap-1 rounded-lg border px-3 py-2 text-left transition-colors',
                            current && 'border-ember bg-ember-soft/60',
                            done && 'border-ink/30 bg-parchment hover:border-ink',
                            !current && !done && 'cursor-default border-line bg-paper/60 opacity-70',
                          )}
                        >
                          <span
                            className={cn(
                              'text-[11px] font-bold uppercase tracking-[0.16em]',
                              current ? 'text-ember-deep' : 'text-muted',
                            )}
                          >
                            Step {i + 1}
                          </span>
                          <span className="flex items-center gap-1.5 text-[14px] font-semibold">
                            {done && <BadgeCheck size={15} aria-hidden="true" className="text-moss" />}
                            {s.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-parchment" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-ember transition-all duration-500"
                    style={{ width: `${((step + 1) / FORM_STEPS.length) * 100}%` }}
                  />
                </div>

                {/* Steps */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 32 * direction }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 * direction }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {step === 0 && (
                      <fieldset>
                        <legend className="sr-only">Your team</legend>
                        <StepHeading
                          ref={headingRef}
                          step="Step 1 of 4"
                          title="Name your team"
                          body="This is the name the organisers will call out on the day."
                        />
                        <Field
                          id="teamName"
                          label="Team name"
                          placeholder="e.g. Paper Planes"
                          autoComplete="off"
                          error={errors.teamName?.message}
                          inputProps={register('teamName')}
                        />
                      </fieldset>
                    )}

                    {step === 1 && (
                      <fieldset>
                        <legend className="sr-only">Team leader</legend>
                        <StepHeading
                          ref={headingRef}
                          step="Step 2 of 4"
                          title="Who leads the team?"
                          body="The leader is the point of contact — and the inbox the digital certificate goes to."
                        />
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field
                            id="leaderName"
                            label="Leader’s full name"
                            placeholder="e.g. Ananya Rao"
                            autoComplete="name"
                            error={errors.leaderName?.message}
                            inputProps={register('leaderName')}
                          />
                          <Field
                            id="leaderEmail"
                            label="Leader’s email"
                            type="email"
                            inputMode="email"
                            placeholder="name@example.com"
                            autoComplete="email"
                            error={errors.leaderEmail?.message}
                            inputProps={register('leaderEmail')}
                          />
                        </div>
                      </fieldset>
                    )}

                    {step === 2 && (
                      <fieldset>
                        <legend className="sr-only">Second member (optional)</legend>
                        <StepHeading
                          ref={headingRef}
                          step="Step 3 of 4"
                          title="Bring a partner?"
                          body="Teams cap at two. Leave both fields blank to enter solo — or add both name and email for a pair."
                        />
                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field
                            id="memberName"
                            label="Second member’s name"
                            placeholder="Optional"
                            autoComplete="off"
                            error={errors.memberName?.message}
                            inputProps={register('memberName')}
                          />
                          <Field
                            id="memberEmail"
                            label="Second member’s email"
                            type="email"
                            inputMode="email"
                            placeholder="Optional"
                            autoComplete="off"
                            error={errors.memberEmail?.message}
                            inputProps={register('memberEmail')}
                          />
                        </div>
                      </fieldset>
                    )}

                    {step === 3 && (
                      <div>
                        <StepHeading
                          ref={headingRef}
                          step="Step 4 of 4"
                          title="Review & confirm"
                          body="Check the details below. Use Edit to jump back to any step."
                        />
                        <dl className="overflow-hidden rounded-xl border border-line">
                          <ReviewRow
                            label="Team"
                            value={values.teamName || '—'}
                            onEdit={() => go(0)}
                          />
                          <ReviewRow
                            label="Leader"
                            value={
                              values.leaderName || values.leaderEmail
                                ? `${values.leaderName} · ${values.leaderEmail}`
                                : '—'
                            }
                            onEdit={() => go(1)}
                          />
                          <ReviewRow
                            label="Second member"
                            value={
                              isSolo
                                ? 'Solo team'
                                : `${values.memberName} · ${values.memberEmail}`
                            }
                            onEdit={() => go(2)}
                          />
                          <div className="flex flex-wrap items-center justify-between gap-3 bg-ink px-5 py-4 text-paper">
                            <dt className="font-semibold">Fee due</dt>
                            <dd className="font-display text-2xl font-semibold">
                              {fee} <span className="font-sans text-sm font-normal text-paper/70">/ team</span>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {submitState === 'error' && (
                  <div
                    role="alert"
                    className="mt-6 flex gap-3 rounded-lg border border-ember/50 bg-ember-soft/70 px-4 py-3 text-[15px]"
                  >
                    <AlertTriangle size={19} aria-hidden="true" className="mt-0.5 flex-none text-ember-deep" />
                    <p>
                      <strong className="font-semibold">Submission failed. </strong>
                      {submitError}
                    </p>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => go(step - 1)}
                    disabled={step === 0 || submitState === 'pending'}
                    className="inline-flex min-h-[52px] items-center gap-2 rounded-lg border border-ink/25 px-6 font-semibold transition-colors hover:border-ink hover:bg-parchment disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink/25 disabled:hover:bg-transparent"
                  >
                    <ArrowLeft size={18} aria-hidden="true" />
                    Back
                  </button>
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={next}
                      className="inline-flex min-h-[52px] items-center gap-2 rounded-lg bg-ink px-8 font-semibold text-paper transition-colors hover:bg-ember-deep"
                    >
                      {step === 2 ? 'Review team' : 'Continue'}
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitState === 'pending'}
                      className="inline-flex min-h-[52px] items-center gap-2 rounded-lg bg-ember px-8 font-semibold text-paper transition-colors hover:bg-ember-deep disabled:cursor-wait disabled:opacity-70"
                    >
                      {submitState === 'pending' ? (
                        <>
                          <Loader2 size={18} aria-hidden="true" className="animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          Confirm registration
                          <ArrowRight size={18} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                <p className="mt-5 flex items-start gap-2 text-[13px] leading-relaxed text-muted">
                  <Info size={15} aria-hidden="true" className="mt-0.5 flex-none" />
                  Demo mode: submitting records your team and returns a demo ID. No payment is
                  taken and no confirmation email is sent.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

/* ---------- pieces ---------- */

import { forwardRef, type InputHTMLAttributes } from 'react';

const StepHeading = forwardRef<
  HTMLHeadingElement,
  { step: string; title: string; body: string }
>(function StepHeading({ step, title, body }, ref) {
  return (
    <div className="mb-6 mt-8">
      <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-ember">{step}</p>
      <h3 ref={ref} tabIndex={-1} className="mt-1 font-display text-3xl font-semibold focus:outline-none">
        {title}
      </h3>
      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-inksoft">{body}</p>
    </div>
  );
});

function Field({
  id,
  label,
  error,
  inputProps,
  ...rest
}: {
  id: keyof RegistrationInput;
  label: string;
  error?: string;
  inputProps: ReturnType<ReturnType<typeof useForm<RegistrationInput>>['register']>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-semibold">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        {...inputProps}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'mt-2 min-h-[52px] w-full rounded-lg border bg-paper px-4 text-[16px] transition-colors placeholder:text-muted/60 focus:border-ember',
          error ? 'border-ember-deep bg-ember-soft/40' : 'border-ink/25',
        )}
      />
      <p id={errorId} role={error ? 'alert' : undefined} className="mt-2 min-h-[20px] text-[14px] font-medium text-ember-deep">
        {error ?? ''}
      </p>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper/50 px-5 py-4 last:border-b-0">
      <dt className="text-[13px] font-bold uppercase tracking-[0.16em] text-muted">{label}</dt>
      <dd className="max-w-full break-words text-right font-semibold">{value}</dd>
      <dd className="w-full sm:w-auto">
        <button
          type="button"
          onClick={onEdit}
          className="min-h-[36px] rounded-md border border-ink/25 bg-card px-3 text-[14px] font-semibold hover:border-ink"
        >
          Edit
        </button>
      </dd>
    </div>
  );
}

function SuccessPanel({
  values,
  registrationId,
  isSolo,
  fee,
  copied,
  downloadNote,
  onCopy,
  onDownload,
  onStartOver,
}: {
  values: RegistrationInput;
  registrationId: string;
  isSolo: boolean;
  fee: string;
  copied: boolean;
  downloadNote: string;
  onCopy: () => void;
  onDownload: () => void;
  onStartOver: () => void;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-moss">
        <PartyPopper size={16} aria-hidden="true" />
        Team recorded
      </p>
      <h3 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
        You’re on the list, {values.teamName || 'team'}.
      </h3>
      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-inksoft">
        {isSolo ? 'Solo entry' : 'Pair entry'} · {values.leaderName} · {fee} fee due as instructed
        by the organisers.
      </p>

      <div className="mt-6 rounded-xl border-2 border-dashed border-ink/30 bg-paper p-6 text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-muted">
          Registration ID
        </p>
        <p className="mt-1 font-display text-4xl font-bold tracking-wide md:text-5xl" aria-live="polite">
          {registrationId}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-ink px-5 text-[15px] font-semibold text-paper hover:bg-ember-deep"
          >
            <Copy size={16} aria-hidden="true" />
            {copied ? 'Copied!' : 'Copy ID'}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-ink/30 bg-card px-5 text-[15px] font-semibold hover:border-ink"
          >
            <Download size={16} aria-hidden="true" />
            Download slip
          </button>
        </div>
        {downloadNote && (
          <p role="status" className="mt-3 text-[14px] text-inksoft">
            {downloadNote}
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-3 rounded-lg border border-gold/50 bg-gold-soft/70 px-4 py-3 text-[14px] leading-relaxed">
        <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 flex-none text-gold" />
        <p>
          <strong className="font-semibold">Demo mode — nothing was charged or emailed. </strong>
          Keep your registration ID for the day, and pay the {fee} fee as the organisers instruct.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Stamp tone="moss">Server validated ✓</Stamp>
        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-ink/25 px-5 font-semibold hover:border-ink hover:bg-parchment"
        >
          <RotateCcw size={17} aria-hidden="true" />
          Register another team
        </button>
      </div>
    </div>
  );
}
