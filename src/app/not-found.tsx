import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      id="main"
      className="relative z-10 mx-auto flex min-h-[70vh] max-w-stage flex-col justify-center px-5 py-24"
    >
      <p className="font-mono text-[13px] uppercase tracking-[0.22em] text-beam">
        Off the network
      </p>
      <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">
        This node doesn’t exist.
      </h1>
      <p className="mt-4 max-w-md text-lg text-fog">
        The page you asked for isn’t on the journey. Head back to the overview to find your way.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-lg bg-mist px-6 font-semibold text-inkbtn transition-transform hover:scale-[1.02]"
        >
          Back to IDEATRIX
        </Link>
      </div>
    </main>
  );
}
