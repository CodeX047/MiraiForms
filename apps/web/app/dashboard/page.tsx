import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { CreateFormModal } from "~/components/create-form-modal";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="mono text-white text-sm font-bold tracking-widest uppercase">
              Mirai<span className="text-primary">Forms</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 mr-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-2 h-2 rounded-full bg-terminal-green" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
            </div>
            <span className="mono text-[10px] text-muted-foreground uppercase tracking-widest hidden md:inline-block">
              {user?.firstName ? `USER_ID: ${user.firstName}` : "SYS_OP"}
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 relative z-10">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/5 pb-8">
          <div>
            <div className="mono text-muted-foreground text-[10px] uppercase tracking-widest mb-2">
              / MAIN / DASHBOARD
            </div>
            <h2 className="heading-brutalist text-4xl md:text-5xl text-white">Dashboard</h2>
          </div>
          <CreateFormModal />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/forms/create"
            className="group relative rounded-sm border border-white/5 bg-[#0D0D0D] p-8 transition-all hover:border-primary/30 overflow-hidden"
          >
            <div className="mb-6 relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 border border-white/10 rounded-sm bg-[#080808] group-hover:border-primary/50 transition-all text-xl">
                📝
              </div>
            </div>
            <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-lg mb-2">Create New Form</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Build a new form from scratch or use a template.
            </p>
            {/* Hover glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-[#FF3B30] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="/dashboard/forms"
            className="group relative rounded-sm border border-white/5 bg-[#0D0D0D] p-8 transition-all hover:border-primary/30 overflow-hidden"
          >
            <div className="mb-6 relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 border border-white/10 rounded-sm bg-[#080808] group-hover:border-primary/50 transition-all text-xl">
                📋
              </div>
            </div>
            <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-lg mb-2">My Forms</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              View and manage all your existing forms.
            </p>
            {/* Hover glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-[#FF3B30] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="/analytics"
            className="group relative rounded-sm border border-white/5 bg-[#0D0D0D] p-8 transition-all hover:border-primary/30 overflow-hidden"
          >
            <div className="mb-6 relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 border border-white/10 rounded-sm bg-[#080808] group-hover:border-primary/50 transition-all text-xl">
                📊
              </div>
            </div>
            <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-lg mb-2">Analytics</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track responses and view form performance.
            </p>
            {/* Hover glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-[#FF3B30] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </main>
  );
}
