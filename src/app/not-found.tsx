import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[70vh] max-w-ledger flex-col justify-center px-5 py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ember">Off the ledger</p>
      <h1 className="mt-4 font-display text-5xl leading-tight md:text-6xl">
        This page isn’t on the programme.
      </h1>
      <p className="mt-4 max-w-md text-lg text-inksoft">
        The page you asked for doesn’t exist. Head back to the event overview to find your way.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-lg bg-ink px-6 font-semibold text-paper transition-colors hover:bg-ember-deep"
        >
          Back to IDEATRIX
        </Link>
      </div>
    </main>
  );
}
