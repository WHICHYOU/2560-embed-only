/* July 25, 2025.
yoister-kids-english/
├── app/
│   └── page.tsx                      # Landing page with FlipCards
├── components/
│   └── FlipCard.tsx                 # Reusable FlipCard UI component
├── lib/
│   └── utils.ts                     # cn() utility with tailwind-merge + clsx
├── public/
│   └── images/
│       └── cards/
│           ├── happy.png           # (You can add these images later)
│           └── sad.png
├── web/
│   └── data/
│       └── presets/
│           └── edu_vocab_happy_chain.json
├── .env.local                       # Supabase env placeholder
├── .gitignore
├── package.json
├── tsconfig.json
*/
import { FlipCard } from "@/components/FlipCard";

const CardFront = ({ title }: { title: string }) => (
  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center text-xl font-bold rounded-xl">
    {title}
  </div>
);

const CardBack = ({ detail }: { detail: string }) => (
  <div className="w-full h-full bg-white text-gray-900 p-4 flex flex-col items-center justify-center text-center rounded-xl">
    <h3 className="text-lg font-semibold mb-2">Definition</h3>
    <p className="text-sm">{detail}</p>
  </div>
);

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 p-10 bg-gradient-to-tr from-sky-100 to-white">
      <FlipCard
        front={<CardFront title="Happy 😊" />}
        back={
          <CardBack detail="Feeling or showing pleasure or contentment. Often used to describe positive emotions." />
        }
        panelClassName="rounded-xl shadow-lg"
        className="w-[280px] h-[380px]"
      />
      <FlipCard
        front={<CardFront title="Sad 😢" />}
        back={
          <CardBack detail="Feeling or showing sorrow. Often used when something negative or upsetting happens." />
        }
        panelClassName="rounded-xl shadow-lg"
        className="w-[280px] h-[380px]"
      />
    </main>
  );
}
