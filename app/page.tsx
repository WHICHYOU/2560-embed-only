import { FlipCard } from "@/components/FlipCard";

const CardFront = ({ title }: { title: string }) => (
  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600 text-white flex items-center justify-center text-xl font-bold rounded-xl">
    {title}
  </div>
);

const CardBack = ({ detail }: { detail: string }) => (
  <div className="w-full h-full bg-white text-gray-900 p-4 flex flex-col items-center justify-center text-center rounded-xl">
    <h3 className="text-lg font-semibold mb-2">Details</h3>
    <p className="text-sm">{detail}</p>
  </div>
);

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 p-10 bg-gray-100">
      <FlipCard
        front={<CardFront title="Tabs Always Open" />}
        back={<CardBack detail="You thrive on multitasking and visual memory. Chaos is your default context switch." />}
        panelClassName="rounded-xl shadow-lg"
        className="w-[280px] h-[380px]"
      />
      <FlipCard
        front={<CardFront title="One-Tab Discipline" />}
        back={<CardBack detail="You value intentionality and single-focus clarity. You believe attention is finite." />}
        panelClassName="rounded-xl shadow-lg"
        className="w-[280px] h-[380px]"
      />
    </main>
  );
}
