import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../services/local.storage.service';
import { genders2 } from '../data';

@Injectable({ providedIn: 'root' })
export class TranslateLang {

    constructor(
        private readonly local: LocalStorageService
    ) {}

    private isLangEs(): boolean {
        return this.local.getLang() === 'es'
    }

    getGenderList(): string[] {
        const langGenders = this.isLangEs()
            ? genders2.es
            : genders2.en

        return Object.values(langGenders)
    }



}
