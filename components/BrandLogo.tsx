import Image from 'next/image';

/** The selected artwork, cropped only in presentation to remove its outer margin. */
export function BrandLogo({ className = '', priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span aria-hidden="true" className={`brand-logo ${className}`}>
      <Image src="/brand/awais-light.png" alt="" width={1254} height={1254} sizes="120px" priority={priority} className="brand-logo-image dark:hidden" />
      <Image src="/brand/awais-dark.png" alt="" width={1254} height={1254} sizes="120px" priority={priority} className="brand-logo-image hidden dark:block" />
    </span>
  );
}
