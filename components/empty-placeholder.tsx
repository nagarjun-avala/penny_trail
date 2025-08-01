// components/empty-placeholder.tsx
import { Button } from "@/components/ui/button"
import { FilePlus2 } from "lucide-react"

export function EmptyPlaceholder({ onAddClick }: { onAddClick?: () => void }) {
    return (
        <div className="flex h-[300px] w-full flex-col items-center justify-center text-center border border-dashed rounded-lg p-8">
            <FilePlus2 className="mb-2 h-8 w-8 text-muted-foreground" />
            <h3 className="text-lg font-medium">No Transactions Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Start adding income or expenses to track your financial activity.
            </p>
            {onAddClick && (
                <Button onClick={onAddClick} variant="outline">
                    Add Transaction
                </Button>
            )}
        </div>
    )
}
