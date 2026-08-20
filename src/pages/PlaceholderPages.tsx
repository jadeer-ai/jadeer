import { PlaceholderPage } from '@/components/common';
import {
  User,
  BrainCircuit,
  GitBranch,
  FileBarChart,
  ClipboardCheck,
} from 'lucide-react';

/* ── Candidate-Focused Module Placeholders ───────────────────────────────── */

export function CandidateProfilesPage() {
  return (
    <PlaceholderPage
      title="My Candidate Profile"
      description="View and enrich your verified professional identity, Skill Graph, project history, and career goals."
      icon={User}
      module="Profile Management"
      actionText="Edit Profile via Wizard"
      actionHref="/candidates/wizard"
    />
  );
}

export function AIInterviewPage() {
  return (
    <PlaceholderPage
      title="AI Technical Interviewer"
      description="Practice and complete real-world coding and debugging challenges with Jadeer's adaptive AI interviewer. Your performance directly feeds your verified Skill Graph."
      icon={BrainCircuit}
      module="Stage 02: AI Validation"
    />
  );
}

export function ProjectWorkspacePage() {
  return (
    <PlaceholderPage
      title="Project Workspace"
      description="Work on real industry projects under expert supervision. Manage sprints, tasks, milestones, GitHub commits, and code reviews as tangible proof of performance."
      icon={GitBranch}
      module="Stage 03: Practical Execution"
    />
  );
}

export function PortfolioPage() {
  return (
    <PlaceholderPage
      title="Evidence Portfolio"
      description="Your verified record of technical achievement — containing AI interview artifacts, mentor evaluations, project outcomes, and verified skill scores for company matching."
      icon={FileBarChart}
      module="Stage 04: Verified Evidence"
    />
  );
}

export function ReadinessPage() {
  return (
    <PlaceholderPage
      title="Readiness Report"
      description="Comprehensive breakdown of your strengths, skill gaps, personalized learning roadmaps, and company role suitability."
      icon={ClipboardCheck}
      module="Career Intelligence"
    />
  );
}
