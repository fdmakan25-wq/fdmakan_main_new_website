import { ReactNode } from 'react';

const iconClass = 'w-5 h-5';

export function IconRupee() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10M7 4v16M7 9.5h7.5a3.25 3.25 0 110 6.5H7M7 14h11" />
    </svg>
  );
}

/** Banknotes / money — same as left sidebar "Worth of Homes Sold" */
export function IconBanknotes() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75a.75.75 0 00-.75-.75H3.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  );
}

/** @deprecated Use IconRupee */
export const IconCurrency = IconRupee;

export function IconSparkles() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

export function IconDocument() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

export function IconBuilding() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 19.5V6.75a2.25 2.25 0 012.25-2.25h10.5A2.25 2.25 0 0119.5 6.75V19.5M6 10.5h2.25v2.25H6V10.5zm0 4.5h2.25V17.25H6V15zm9-9H9v2.25h6V6zm0 4.5H9v2.25h6v-2.25zm0 4.5H9V17.25h6v-2.25z" />
    </svg>
  );
}

/** Tall tower — number of storeys / floors */
export function IconStoreys() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-9.75a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25V21M3.75 21h16.5M12 3v.75m0 0a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-4.5 0V5.25A2.25 2.25 0 0112 3.75z" />
    </svg>
  );
}

/** Land plot / project area in acres */
export function IconProjectArea() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 5.25h15v13.5h-15V5.25zM9 5.25v13.5M15 5.25v13.5M4.5 11.25h15M4.5 17.25h15" />
    </svg>
  );
}

export function IconRuler() {
  return <IconProjectArea />;
}

export function IconKey() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499a1.125 1.125 0 011.591 0l2.25 2.25a1.125 1.125 0 010 1.591l-1.8 1.8" />
    </svg>
  );
}

/** Handover / possession — home with key */
export function IconPossession() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-7.5a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25V21M3.75 21h16.5M12 3.75l7.5 4.5v1.5H4.5v-1.5L12 3.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 14.25l1.5 1.5 3-3" />
    </svg>
  );
}

/** RERA registration / certificate */
export function IconCertificate() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m4.125 15.75l-2.25-1.125-2.25 1.125m4.5 0l-2.25-1.125-2.25 1.125M8.25 7.5V4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V7.5" />
    </svg>
  );
}

export function IconCalendar() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

export function IconShield() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

export function IconInfo() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

export function IconMapPin() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

export function IconHome() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

export function IconMap() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  );
}

export function IconTrain() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

export function IconShopping() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  );
}

export function IconHospital() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 7.5V21M19.5 7.5V21M6 10.5h3v3H6v-3zm9 0h3v3h-3v-3zM9 3h6v4.5H9V3z" />
    </svg>
  );
}

export function IconSchool() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0A50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  );
}

export function IconLandmark() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6M4.5 10.5V21M19.5 10.5V21" />
    </svg>
  );
}

export function IconCheck() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export function IconFaq() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

export function IconPool() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-7.5-3.75l1.591-1.591a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 9.75V5.25A2.25 2.25 0 016.75 3h10.5a2.25 2.25 0 012.25 2.25v4.5" />
    </svg>
  );
}

export function IconGym() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 9v6M3 10.5v3M3 9.75h3.75M3 13.5h3.75M17.25 9v6M21 10.5v3M17.25 9.75H21M17.25 13.5H21M9 12h6" />
    </svg>
  );
}

export function IconTree() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-6m0 0c-2.5 0-4.5-2-4.5-4.5S9.5 9 12 9s4.5 2 4.5 4.5S14.5 15 12 15zm-6-3c0-3 2.5-5.5 6-6 0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c3.5.5 6 3 6 6" />
    </svg>
  );
}

/** Open grass lawn */
export function IconLawn() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 18c2.5-1.5 4-1.5 5.5 0s3.5 1.5 5.5 0 3.5-1.5 5.5 0M3 21h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 18V9m0 0l-2-2m2 2l2-2M12 18V7m0 0L10 5m2 2l2-2M17 18v-5m0 0l-2-2m2 2l2-2" />
    </svg>
  );
}

/** Pet / paw walking area */
export function IconPaw() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0zM5.25 9.75a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm13.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.25 13.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm9 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM12 15.75c-2.5 0-4.5 1.5-4.5 3.75h9c0-2.25-2-3.75-4.5-3.75z" />
    </svg>
  );
}

/** Kids play area */
export function IconPlayground() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M8.25 7.5L12 3l3.75 4.5M6 21h12M9 12h6M10.5 15h3" />
    </svg>
  );
}

/** Club house / banquet hall */
export function IconClubHouse() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M8.25 21v-4.5a3.75 3.75 0 017.5 0V21M3.75 21h16.5M12 3l9 5.25v2.25H3V8.25L12 3z" />
    </svg>
  );
}

/** Theatre / amphitheater */
export function IconTheatre() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l3 3-3 3m6 0l-3-3 3-3M4.5 19.5h15M7.5 15.75v3.75M16.5 15.75v3.75M12 3v3" />
    </svg>
  );
}

/** Table tennis / indoor games */
export function IconIndoorGames() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM8.25 9.75h7.5M8.25 14.25h7.5" />
    </svg>
  );
}

/** Senior citizen / seating */
export function IconSeniorCitizen() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0v-.75a.75.75 0 00-.75-.75h-13.5a.75.75 0 00-.75.75v.75z" />
    </svg>
  );
}

export function IconUsers() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

export function IconSport() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75c2.5 3 2.5 8.25 0 11.25M17.25 6.75c-2.5 3-2.5 8.25 0 11.25" />
    </svg>
  );
}

export function IconAmenityDefault() {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  );
}

export function SectionIcon({
  children,
  color = 'teal',
  size = 'md',
}: {
  children: ReactNode;
  color?: 'teal' | 'red' | 'navy';
  size?: 'md' | 'sm';
}) {
  const colors = {
    teal: 'bg-brand-teal/10 text-brand-teal ring-brand-teal/20',
    red: 'bg-brand-red/10 text-brand-red ring-brand-red/20',
    navy: 'bg-navy-blue/10 text-navy-blue ring-navy-blue/20',
  };
  const sizes = {
    md: 'w-11 h-11 rounded-xl',
    sm: 'w-9 h-9 rounded-lg',
  };
  return (
    <div
      className={`flex items-center justify-center shrink-0 ring-1 ring-inset shadow-sm ${colors[color]} ${sizes[size]}`}
    >
      {children}
    </div>
  );
}

export function InlineIconBox({
  children,
  color = 'teal',
}: {
  children: ReactNode;
  color?: 'teal' | 'red' | 'navy';
}) {
  const colors = {
    teal: 'bg-brand-teal/10 text-brand-teal ring-brand-teal/15 group-hover:bg-brand-teal group-hover:text-white',
    red: 'bg-brand-red/10 text-brand-red ring-brand-red/15 group-hover:bg-brand-red group-hover:text-white',
    navy: 'bg-navy-blue/10 text-navy-blue ring-navy-blue/15 group-hover:bg-navy-blue group-hover:text-white',
  };
  return (
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-inset border border-white/50 shadow-sm transition-all ${colors[color]}`}
    >
      {children}
    </div>
  );
}

export function getLandmarkIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('metro') || lower.includes('station') || lower.includes('rail')) return <IconTrain />;
  if (lower.includes('mall') || lower.includes('shop') || lower.includes('market')) return <IconShopping />;
  if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('medical')) return <IconHospital />;
  if (lower.includes('school') || lower.includes('college') || lower.includes('university')) return <IconSchool />;
  return <IconLandmark />;
}

export function getAmenityIcon(name: string) {
  const lower = name.toLowerCase();

  // Pets — before lawn/garden/park
  if (lower.includes('pet')) return <IconPaw />;

  // Lawn & garden — distinct icons
  if (lower.includes('lawn')) return <IconLawn />;
  if (lower.includes('garden')) return <IconTree />;

  if (lower.includes('pool') || lower.includes('swim')) return <IconPool />;
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('open gym')) return <IconGym />;

  if (lower.includes('cricket') || lower.includes('badminton') || lower.includes('tennis') ||
      lower.includes('squash') || lower.includes('golf') || lower.includes('box cricket')) return <IconSport />;
  if (lower.includes('court') || lower.includes('skating') || lower.includes('multi purpose court')) return <IconSport />;

  if (lower.includes('club house') || lower.includes('clubhouse')) return <IconClubHouse />;
  if (lower.includes('banquet') || lower.includes('multi purpose hall')) return <IconClubHouse />;
  if (lower.includes('theatre') || lower.includes('theater') || lower.includes('amphitheater') || lower.includes('mini theatre')) return <IconTheatre />;

  if (lower.includes('kids') || lower.includes('toddler') || lower.includes('creche') || lower.includes('play area')) return <IconPlayground />;
  if (lower.includes('senior') || lower.includes('seating')) return <IconSeniorCitizen />;

  if (lower.includes('table tennis') || lower.includes('indoor game')) return <IconIndoorGames />;
  if (lower.includes('library')) return <IconDocument />;
  if (lower.includes('star gazing')) return <IconSparkles />;

  if (lower.includes('park') && !lower.includes('pet')) return <IconTree />;

  return <IconAmenityDefault />;
}
