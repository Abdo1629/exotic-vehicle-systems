import AppShell from "@/components/AppShell";
import OverviewDashboard from "@/components/OverviewDashboard";

export default function Home() {
  return <AppShell active="overview" title="Overview"><OverviewDashboard /></AppShell>;
}
