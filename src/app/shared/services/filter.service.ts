import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FilterService {

    filterByPeriodo<T>(
        items: T[],
        dateGetter: (item: T) => Date,
        period: string,
        selectedDates: Date[]
    ): T[] {

        if (!period || period === 'Personalizado' && selectedDates.length === 0) {
            return items
        }

        const mesesARestar: Record<string, number> = {
            'Mes actual': 0,
            '2 meses': 1,
            '3 meses': 2
        };

        const today = new Date()
        let initDate: Date;
        let finalDate: Date = today;

        let n = mesesARestar[period] ?? 0
        initDate = new Date(today.getFullYear(), today.getMonth() - n, 1)

        if (period === 'Personalizado') {
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
