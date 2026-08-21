import NotificationsDashboard from "@/components/NotificationsDashboard";

export const metadata = {
  title: "Notifications | Coordinator Dashboard",
  description: "View coordinator-specific notifications and emergency alerts.",
};

export default function Page() {
  return <NotificationsDashboard />;
}
