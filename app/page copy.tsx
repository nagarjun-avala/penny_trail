// File: app/page.tsx
//  ! Transfer the generated site files from replit to heare without errors
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const dummyTransactions = [
  {
    id: "1",
    type: "income",
    date: "2025-07-01",
    description: "Freelance Payment",
    category: "Work",
    amount: 5000,
  },
  {
    id: "2",
    type: "expense",
    date: "2025-07-02",
    description: "Groceries",
    category: "Food",
    amount: 1200,
  },
  {
    id: "3",
    type: "expense",
    date: "2025-07-04",
    description: "Movie Night",
    category: "Entertainment",
    amount: 800,
  },
];

export default function Home() {
  const income = dummyTransactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = dummyTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-orange-500 text-center">PennyTrail</h1>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <div>
              <p className="text-green-600 font-semibold">Income</p>
              <p className="text-lg">₹{income}</p>
            </div>
            <div>
              <p className="text-red-600 font-semibold">Expenses</p>
              <p className="text-lg">₹{expense}</p>
            </div>
            <div>
              <p className="text-blue-600 font-semibold">Net</p>
              <p className="text-lg">₹{income - expense}</p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dummyTransactions.map((t) => (
              <div key={t.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{t.description}</p>
                  <p className="text-sm text-muted-foreground">{t.date} • {t.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={t.type === "income" ? "default" : "destructive"}>
                    {t.type === "income" ? "+" : "-"}₹{t.amount}
                  </Badge>
                  <Button variant="ghost" size="sm">Delete</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// Note: Make sure ShadCN UI components (Card, Button, Badge, etc.) are correctly set up.
// Run `npx shadcn-ui@latest init` and install needed components.
// Then, run `npx shadcn-ui@latest add card button badge separator`
