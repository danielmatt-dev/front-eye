import { MessageService } from 'primeng/api';

export class SendMessage {

    constructor(readonly messageService: MessageService) {}

    execute({ title = 'Alerta', message, type = 'warn', life = 4000 }: { title?: string; message: string; type?: string; life?: number }) {
        this.messageService.add({
            severity: type,
            summary: title,
            detail: message,
            life: life
        });
    }

}
