'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { forwardRef, useEffect, useRef, useState, type InputHTMLAttributes } from 'react';
import { useForm, type FieldErrors, type UseFormRegisterReturn } from 'react-hook-form';

import { EVENT } from '@/data/event';
import { useJourney } from '@/components/journey/JourneyProvider';
import { JourneySection } from '@/components/ui/JourneySection';
import { Stamp } from '@/components/ui/Stamp';
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

const ACCENT = '#34D399';

const FIELD_STEP: Record<keyof RegistrationInput, number> = {
  teamName: 0,
  leaderName: 1,
  leaderEmail: 1,
  memberName: 2,
  memberEmail: 2,
};

type SubmitState = 'idle' | 'pending' | 'success' | 'error';

export function Register() {
  const { reduced } = useJourney();
  const [step, setStep] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [registrationId, setRegistrationId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [draftNotice, setDraftNotice] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadNote, setDownloadNote] = useState('');

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

  useEffect(() => {
    const draft = loadDraft();
    if (draft && draftHasContent(draft.values)) {
      reset(draft.values);
      setStep(Math.min(draft.step, FORM_STEPS.length - 1));
      setDraftNotice(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = watch((values) => {
      saveDraft(
        { ...REGISTRATION_DEFAULTS, ...(values as Partial<RegistrationInput>) },
        stepRef.current,
      );
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (next: number) => {
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
    <JourneySection
      id="register"
      kicker="Sign up"
      title={EVENT.registerHeading}
      lede={
        <p>
          Four short steps, about two minutes. Progress saves in this browser as you type, and the
          fee is <strong className="font-semibold text-mist">{fee} per team</strong> — nothing is
          charged online.
        </p>
      }
    >
      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border px-5 py-4"
        style={{ borderColor: `${ACCENT}55`, backgroundColor: `${ACCENT}12` }}
      >
        <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-fog">
          <Ticket size={15} aria-hidden="true" style={{ color: ACCENT }} />
          Entry fee
        </p>
        <p className="font-display text-2xl font-semibold">
          {fee} <span className="font-sans text-sm font-normal text-fog">/ team</span>
        </p>
        <p className="ml-auto font-mono text-[12px] text-mute">
          {EVENT.date.display} · {EVENT.time.reporting}
        </p>
      </div>

      <div className="mt-6">
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
              if (step < FORM_STEPS.length - 1) {
                e.preventDefault();
                void next();
              } else {
                void handleSubmit(onSubmit, onInvalid)(e);
              }
            }}
          >
            {draftNotice && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-[14px]">
                <p className="font-medium text-mist">Draft restored — pick up where you left off.</p>
                <button
                  type="button"
                  onClick={discardDraft}
                  className="min-h-[36px] rounded-md border border-white/20 bg-void/60 px-3 font-semibold text-mist hover:border-white/50"
                >
                  Discard draft
                </button>
              </div>
            )}

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
                        current && 'bg-white/[0.06]',
                        done && 'border-white/20 bg-raised hover:border-white/50',
                        !current && !done && 'cursor-default border-white/10 bg-void/50 opacity-70',
                      )}
                      style={current ? { borderColor: ACCENT } : undefined}
                    >
                      <span
                        className="font-mono text-[11px] uppercase tracking-[0.16em]"
                        style={{ color: current ? ACCENT : undefined }}
                      >
                        <span className={current ? '' : 'text-mute'}>Step {i + 1}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[13px] font-semibold sm:gap-1.5 sm:text-[14px]">
                        {done && <BadgeCheck size={15} aria-hidden="true" style={{ color: ACCENT }} />}
                        {s.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
              <div
                className={cn('h-full rounded-full', !reduced && 'transition-all duration-500')}
                style={{ width: `${((step + 1) / FORM_STEPS.length) * 100}%`, backgroundColor: ACCENT }}
              />
            </div>

            <div key={step}>
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
                  <div className="grid gap-x-5 sm:grid-cols-2">
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
                  <div className="grid gap-x-5 sm:grid-cols-2">
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
                  <dl className="overflow-hidden rounded-xl border border-white/10">
                    <ReviewRow label="Team" value={values.teamName || '—'} onEdit={() => go(0)} />
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
                      value={isSolo ? 'Solo team' : `${values.memberName} · ${values.memberEmail}`}
                      onEdit={() => go(2)}
                    />
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                      style={{ backgroundColor: `${ACCENT}18` }}
                    >
                      <dt className="font-semibold">Fee due</dt>
                      <dd className="font-display text-2xl font-semibold">
                        {fee} <span className="font-sans text-sm font-normal text-fog">/ team</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>

            {submitState === 'error' && (
              <div
                role="alert"
                className="mt-6 flex gap-3 rounded-lg border border-rose-400/50 bg-rose-400/10 px-4 py-3 text-[15px]"
              >
                <AlertTriangle size={19} aria-hidden="true" className="mt-0.5 flex-none text-rose-300" />
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
                className="inline-flex min-h-[52px] items-center gap-2 rounded-lg border border-white/20 px-6 font-semibold transition-colors hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/20"
              >
                <ArrowLeft size={18} aria-hidden="true" />
                Back
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-lg bg-mist px-8 font-semibold text-inkbtn transition-transform hover:scale-[1.02]"
                >
                  {step === 2 ? 'Review team' : 'Continue'}
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitState === 'pending'}
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-lg px-8 font-semibold text-inkbtn transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70"
                  style={{ backgroundColor: ACCENT }}
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

            <p className="mt-5 flex items-start gap-2 text-[13px] leading-relaxed text-mute">
              <Info size={15} aria-hidden="true" className="mt-0.5 flex-none" />
              Demo mode: submitting records your team and returns a demo ID. No payment is taken
              and no confirmation email is sent.
            </p>
          </form>
        )}
      </div>
    </JourneySection>
  );
}

/* ---------- pieces ---------- */

const StepHeading = forwardRef<
  HTMLHeadingElement,
  { step: string; title: string; body: string }
>(function StepHeading({ step, title, body }, ref) {
  return (
    <div className="mb-6 mt-8">
      <p className="font-mono text-[12px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
        {step}
      </p>
      <h3 ref={ref} tabIndex={-1} className="mt-1 font-display text-3xl font-semibold focus:outline-none">
        {title}
      </h3>
      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-fog">{body}</p>
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
  inputProps: UseFormRegisterReturn;
} & InputHTMLAttributes<HTMLInputElement>) {
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
          'mt-2 min-h-[52px] w-full rounded-lg border bg-void/70 px-4 text-[16px] text-mist transition-colors placeholder:text-mute/70 focus:border-emerald-400',
          error ? 'border-rose-400 bg-rose-400/10' : 'border-white/15',
        )}
      />
      <p
        id={errorId}
        role={error ? 'alert' : undefined}
        className="mt-2 min-h-[20px] text-[14px] font-medium text-rose-300"
      >
        {error ?? ''}
      </p>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-void/50 px-5 py-4 last:border-b-0">
      <dt className="font-mono text-[12px] uppercase tracking-[0.16em] text-mute">{label}</dt>
      <dd className="max-w-full break-words text-right font-semibold">{value}</dd>
      <dd className="w-full sm:w-auto">
        <button
          type="button"
          onClick={onEdit}
          className="min-h-[36px] rounded-md border border-white/20 bg-raised px-3 text-[14px] font-semibold hover:border-white/50"
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
      <p
        className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.22em]"
        style={{ color: ACCENT }}
      >
        <PartyPopper size={16} aria-hidden="true" />
        Team recorded
      </p>
      <h3 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
        You’re on the list, {values.teamName || 'team'}.
      </h3>
      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-fog">
        {isSolo ? 'Solo entry' : 'Pair entry'} · {values.leaderName} · {fee} fee due as instructed
        by the organisers.
      </p>

      <div className="mt-6 rounded-xl border-2 border-dashed border-white/20 bg-void/60 p-6 text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-mute">Registration ID</p>
        <p
          className="mt-1 font-display text-4xl font-bold tracking-wide md:text-5xl"
          aria-live="polite"
          style={{ color: ACCENT }}
        >
          {registrationId}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-5 text-[15px] font-semibold text-inkbtn"
            style={{ backgroundColor: ACCENT }}
          >
            <Copy size={16} aria-hidden="true" />
            {copied ? 'Copied!' : 'Copy ID'}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/25 bg-raised px-5 text-[15px] font-semibold hover:border-white/50"
          >
            <Download size={16} aria-hidden="true" />
            Download slip
          </button>
        </div>
        {downloadNote && (
          <p role="status" className="mt-3 text-[14px] text-fog">
            {downloadNote}
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-3 rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-[14px] leading-relaxed">
        <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 flex-none text-amber-300" />
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
          className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-white/20 px-5 font-semibold hover:border-white/50"
        >
          <RotateCcw size={17} aria-hidden="true" />
          Register another team
        </button>
      </div>
    </div>
  );
}
