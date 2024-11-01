// src/app/page.tsx

import { Button } from "@/components/ui/button";


export default function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shadcn UI Button Example</h1>
      <Button>
        Click me
      </Button>
    </div>
  );
}
