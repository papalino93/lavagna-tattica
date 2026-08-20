import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function DashboardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75 12 3l9 6.75V21a.75.75 0 0 1-.75.75H3.75A.75.75 0 0 1 3 21V9.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 21.75V12h6v9.75" />
    </svg>
  );
}

function PlayersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3M18 19.5a2.25 2.25 0 0 0-2.16-2.25M14.25 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 8.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );
}

function TrainingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v3M17.25 3v3M3.75 9h16.5M4.5 6h15a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75V6.75A.75.75 0 0 1 4.5 6Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 15 2 2 4-4" />
    </svg>
  );
}

function MatchesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 7.5 2.4 1.74-.9 2.83H10.5l-.9-2.83L12 7.5Z" />
    </svg>
  );
}

function TacticsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15M3 12h18" />
    </svg>
  );
}

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/rosa", label: "Rosa", icon: PlayersIcon },
  { href: "/allenamenti", label: "Allenamenti", icon: TrainingIcon },
  { href: "/partite", label: "Partite", icon: MatchesIcon },
  { href: "/lavagna", label: "Lavagna", icon: TacticsIcon },
] as const;
