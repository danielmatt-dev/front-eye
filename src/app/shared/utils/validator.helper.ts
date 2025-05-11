import { SendMessage } from '../toast/send.message';
import { LocaleTextProvider } from '../locale.text.provider';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

export abstract class ValidatorHelper {
    protected sendMessage: SendMessage;
    protected localeTextProvider: LocaleTextProvider;

    protected constructor(
        messageService: MessageService,
        translateService: TranslateService,
        primeng: PrimeNG
    ) {
        this.sendMessage = SendMessage.getInstance(messageService);
        this.localeTextProvider = LocaleTextProvider.getInstance(translateService, primeng);
    }

    protected getText(key: string): string {
        return this.localeTextProvider.execute(key);
    }

    protected showMessage({ key, type = 'warn', life = 4000 }:
                              { key: string, type?: string; life?: number }) {

        const titleMessage = this.getText(`toast.${type}.titles.${key}`)
        const descriptionMessage = this.getText(`toast.${type}.messages.${key}`)
        this.sendMessage.execute({ title: titleMessage, message: descriptionMessage, type: type, life: life });
    }

}
