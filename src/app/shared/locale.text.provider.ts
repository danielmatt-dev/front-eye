import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

export class LocaleTextProvider {

    private static instance: LocaleTextProvider

    constructor(
        private readonly translateService: TranslateService,
        private readonly primeng: PrimeNG
    ) {
        this.translateService.use('es')
        this.translateService.get('primeng').subscribe((res) => this.primeng.setTranslation(res))
    }

    execute(key: string): string {
        let text = ''
        this.translateService.get(key).subscribe((res: string) => {
            text = res
        })
        return text
    }

    static getInstance(translateService: TranslateService, primeng: PrimeNG): LocaleTextProvider {
        if (!LocaleTextProvider.instance) {
            LocaleTextProvider.instance = new LocaleTextProvider(translateService, primeng)
        }
        return LocaleTextProvider.instance
    }

}
