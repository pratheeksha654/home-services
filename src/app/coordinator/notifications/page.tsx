import NotificationsDashboard from "@/components/notifications-dashboard";

export const metadata = {
  title: "Notifications | Coordinator Dashboard",
  description: "View coordinator-specific notifications and emergency alerts.",
};

export default function Page() {
  return <NotificationsDashboard />;
}
