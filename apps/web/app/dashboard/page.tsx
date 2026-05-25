import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { CreateFormModal } from "~/components/create-form-modal";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <main className="min-h-screen bg-[#080808] text-[#F5F5F5] relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none grid-lines z-0" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="mono text-white text-sm font-bold tracking-widest uppercase">
              Mirai<span className="text-[#E94B35]">Forms</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5 mr-2">
              <div className="w-2 h-2 rounded-full bg-[#E94B35] animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-[#00FF99]" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
            </div>
            <span className="mono text-[10px] text-[#6E6E6E] uppercase tracking-widest hidden md:inline-block">
              {user?.firstName ? `USER_ID: ${user.firstName}` : "SYS_OP"}
            </span>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 border border-white/10 hover:border-[#E94B35]/50 transition-colors"
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 relative z-10">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-8">
          <div>
            <div className="mono text-[#6E6E6E] text-[10px] uppercase tracking-widest mb-2">
              / MAIN / DASHBOARD
            </div>
            <h2 className="heading-brutalist text-4xl md:text-5xl text-white">Workspace</h2>
          </div>
          <div>
            <CreateFormModal />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/dashboard/forms"
            className="group relative rounded border border-white/10 bg-[#0D0D0D] p-8 transition-all hover:border-[#E94B35]/40 overflow-hidden block"
          >
            <div className="mb-6 relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 border border-white/10 rounded bg-[#080808] group-hover:border-[#E94B35]/50 transition-all text-xl">
                📝
              </div>
            </div>
            <h3 className="font-semibold text-white group-hover:text-[#E94B35] transition-colors text-lg mb-2">Create New Form</h3>
            <p className="text-sm text-[#6E6E6E] leading-relaxed">
              Launch our drag-and-drop designer tool to draft and configure a new form from scratch.
            </p>
            {/* Hover glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E94B35] via-[#FF3B30] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="/dashboard/forms"
            className="group relative rounded border border-white/10 bg-[#0D0D0D] p-8 transition-all hover:border-[#E94B35]/40 overflow-hidden block"
          >
            <div className="mb-6 relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 border border-white/10 rounded bg-[#080808] group-hover:border-[#E94B35]/50 transition-all text-xl">
                📋
              </div>
            </div>
            <h3 className="font-semibold text-white group-hover:text-[#E94B35] transition-colors text-lg mb-2">My Forms</h3>
            <p className="text-sm text-[#6E6E6E] leading-relaxed">
              Browse, monitor, filter, and inspect database submissions for all your existing forms.
            </p>
            {/* Hover glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E94B35] via-[#FF3B30] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="/dashboard/forms"
            className="group relative rounded border border-white/10 bg-[#0D0D0D] p-8 transition-all hover:border-[#E94B35]/40 overflow-hidden block"
          >
            <div className="mb-6 relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 border border-white/10 rounded bg-[#080808] group-hover:border-[#E94B35]/50 transition-all text-xl">
                📊
              </div>
            </div>
            <h3 className="font-semibold text-white group-hover:text-[#E94B35] transition-colors text-lg mb-2">Analytics</h3>
            <p className="text-sm text-[#6E6E6E] leading-relaxed">
              Track conversion stats, response rates, field completions, and average completion durations.
            </p>
            {/* Hover glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E94B35] via-[#FF3B30] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </main>
  );
}
