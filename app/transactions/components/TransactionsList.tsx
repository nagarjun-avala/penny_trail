import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { SetStateAction, Dispatch } from 'react'
import { Transaction } from '@/lib/types';


type Props = {
    transactions: Transaction[]
    setSelectedTransaction: Dispatch<SetStateAction<Transaction | undefined>>
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>
}


const TransactionsList = ({ transactions, setSelectedTransaction, setIsDialogOpen }: Props) => {

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedTransaction(undefined);
        setIsDialogOpen(true);
    };
    return (
        <Card>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead >
                                    Date
                                </TableHead >
                                <TableHead >
                                    Description
                                </TableHead >
                                <TableHead >
                                    Category
                                </TableHead >
                                <TableHead >
                                    Type
                                </TableHead >
                                <TableHead className="text-right">
                                    Amount
                                </TableHead >
                                <TableHead className="text-right pr-2">
                                    Actions
                                </TableHead >
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id} className="hover:bg-slate-50">
                                    <TableCell >
                                        {formatDate(transaction.date)}
                                    </TableCell>
                                    <TableCell >
                                        {transaction.description}
                                    </TableCell>
                                    <TableCell >
                                        <Badge variant="secondary">{transaction.category}</Badge>
                                    </TableCell>
                                    <TableCell >
                                        {transaction.type}
                                    </TableCell>
                                    <TableCell
                                        className={`text-sm text-right font-mono ${transaction.type === "income"
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        {transaction.type === "income" ? "+" : "-"}
                                        {formatCurrency(transaction.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(transaction)}
                                            >
                                                <Pencil className="text-blue-600" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <Trash2 className="text-red-600" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete Transaction
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this
                                                            transaction?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => { }}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {transactions.length === 0 && (
                        <div className="text-center py-12">
                            <i className="fas fa-receipt text-slate-300 text-4xl mb-4"></i>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">
                                No transactions found
                            </h3>
                            <p className="text-slate-500 mb-4">
                                Try adjusting your filters or add your first transaction.
                            </p>
                            <Button onClick={handleAdd}>
                                <i className="fas fa-plus mr-2"></i>Add Transaction
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default TransactionsList