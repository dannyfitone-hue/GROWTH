type CompanyLogoProps = {
  variant?: 'sidebar' | 'login' | 'portal' | 'mobile';
};

/** Approved logo with its background cleaned for seamless placement. */
export default function CompanyLogo({ variant = 'sidebar' }: CompanyLogoProps) {
  return (
    <img
      className={`companyLogo companyLogo--${variant}`}
      src="/brand/growth-intelligence-llc-transparent.png"
      alt="Growth Intelligence LLC"
      width={1536}
      height={1024}
      loading="eager"
      decoding="async"
    />
  );
}
