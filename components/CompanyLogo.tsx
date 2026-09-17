type CompanyLogoProps = {
  variant?: 'sidebar' | 'login' | 'portal' | 'mobile';
};

/** The approved artwork is used unchanged; never recolor or recreate the mark. */
export default function CompanyLogo({ variant = 'sidebar' }: CompanyLogoProps) {
  return (
    <img
      className={`companyLogo companyLogo--${variant}`}
      src="/brand/growth-intelligence-llc-logo.png"
      alt="Growth Intelligence LLC"
      width={1536}
      height={1024}
      loading="eager"
      decoding="async"
    />
  );
}
