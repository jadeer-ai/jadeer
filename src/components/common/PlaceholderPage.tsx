import { type LucideIcon, Sparkles } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  module?: string;
  actionText?: string;
  actionHref?: string;
}

export default function PlaceholderPage({
  title,
  description,
  icon: Icon = Sparkles,
  module = 'Candidate Validation',
  actionText,
  actionHref,
}: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] py-8">
      <div className="text-center max-w-lg w-full bg-white rounded-3xl p-8 sm:p-12 border border-[#0B0F19]/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.03)] animate-[slide-up_0.5s_var(--ease-spring)]">
        {/* Icon container */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-[#6E8F75]/10 border border-[#6E8F75]/20 flex items-center justify-center mb-6 animate-[float_6s_ease-in-out_infinite]">
          <Icon className="w-9 h-9 text-[#6E8F75]" />
        </div>

        {/* Module badge */}
        {module && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#6E8F75]/10 text-[#6E8F75] border border-[#6E8F75]/15 mb-4">
            <Sparkles className="w-3 h-3" />
            {module}
          </span>
        )}

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] mb-3 tracking-tight">
          {title}
        </h2>

        {/* Description */}
        <p className="text-[#0B0F19]/55 text-[15px] leading-relaxed mb-8">
          {description}
        </p>

        {/* Action button if provided */}
        {actionText && actionHref ? (
          <a
            href={actionHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6E8F75] text-white text-sm font-semibold rounded-xl hover:bg-[#5d7d64] transition-all duration-200 shadow-[0_2px_8px_rgba(110,143,117,0.25)]"
          >
            {actionText}
          </a>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] text-xs font-medium text-[#0B0F19]/40">
            <span>Stage unlocks after completing your Candidate Profile</span>
          </div>
        )}
      </div>
    </div>
  );
}
