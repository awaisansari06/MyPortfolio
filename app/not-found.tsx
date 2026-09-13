import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F0EC] dark:bg-[#0A0A0A] text-[#171717] dark:text-[#F5F3EF] px-6 text-center font-mono-code">
      <div className="font-mono-code text-xs text-neutral-400 dark:text-[#666666] uppercase tracking-widest mb-3">
        404 / NOT FOUND
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight uppercase mb-4">
        PAGE NOT FOUND
      </h1>
      <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#A3A3A3] max-w-md mb-8 leading-relaxed">
        The requested system path does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A] transition-all"
      >
        RETURN TO PORTFOLIO
      </Link>
    </div>
  );
}
