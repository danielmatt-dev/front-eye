import { Injectable } from '@angular/core';
import { OptionLabel } from '../utils/data';

@Injectable({ providedIn: 'root' })
export class FilterService {

    filterByPeriodo<T>(
        items: T[],
        dateGetter: (item: T) => Date,
        period: OptionLabel | undefined,
        selectedDates: Date[]
    ): T[] {

        if (!period || period.value === -1 && selectedDates.length === 0) {
            return items
        }

        const today = new Date()
        let initDate: Date;
        let finalDate: Date = today;

        let n = period.value
        initDate = new Date(today.getFullYear(), today.getMonth() - n, 1)

        if (period.value === -1) {
            if (selectedDates.length === 2) {
                initDate = selectedDates[0]
                finalDate = selectedDates[1]
            }

            if (selectedDates[1] === null) {
                initDate = selectedDates[0]
                finalDate = selectedDates[0]
            }
        }

        return items.filter(item => {
            const d = dateGetter(item)
            return d >= initDate && d <= finalDate
        })
    }

}
