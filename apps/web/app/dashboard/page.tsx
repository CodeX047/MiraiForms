import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  return (
    <main className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Mirai Forms</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.firstName ? `Welcome, ${user.firstName}` : "Welcome"}
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="mt-2 text-muted-foreground">
            Manage your forms, view analytics, and create new experiences.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/forms/create"
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="mb-3 text-2xl">📝</div>
            <h3 className="font-semibold group-hover:text-primary">Create New Form</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Build a new form from scratch or use a template.
            </p>
          </a>

          <a
            href="/forms"
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="mb-3 text-2xl">📋</div>
            <h3 className="font-semibold group-hover:text-primary">My Forms</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage all your existing forms.
            </p>
          </a>

          <a
            href="/analytics"
            className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="mb-3 text-2xl">📊</div>
            <h3 className="font-semibold group-hover:text-primary">Analytics</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Track responses and view form performance.
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
