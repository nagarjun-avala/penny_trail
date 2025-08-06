import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateFilterValue } from '@/lib/types'
import React, { Dispatch, SetStateAction } from 'react'
import { Button } from "@/components/ui/button"
import { DateRange } from "react-day-picker"

type Props = {
    filterRange: DateFilterValue
    setFilterRange: Dispatch<SetStateAction<DateFilterValue>>
    availableFilters: {
        label: string;
        value: string;
        alwaysShow?: boolean | undefined;
    }[]
    customRange: DateRange | undefined
    setCustomRange: Dispatch<SetStateAction<DateRange | undefined>>
}

const CategoryFilter = ({
    filterRange,
    customRange,
    availableFilters,
    setFilterRange,
    setCustomRange
}: Props) => {
    return (
        <div className="flex items-center space-x-4">
            <Select value={filterRange} onValueChange={(val) => setFilterRange(val as DateFilterValue)}>

                <SelectTrigger className="w-[180px] mt-4 lg:mt-0">
                    <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                    {availableFilters.map((filter) => (
                        <SelectItem key={filter.value} value={filter.value}>
                            {filter.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {filterRange === "custom" && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="mt-4 lg:mt-0">
                            {customRange?.from && customRange?.to
                                ? `${customRange.from.toDateString()} - ${customRange.to.toDateString()}`
                                : "Pick date range"
                            }
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="range"
                            selected={customRange}
                            onSelect={(range) => setCustomRange(range)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}

export default CategoryFilter
