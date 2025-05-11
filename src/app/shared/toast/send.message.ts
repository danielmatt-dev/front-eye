import { MessageService } from 'primeng/api';

export class SendMessage {

    private static instance: SendMessage

    constructor(readonly messageService: MessageService) {}

    execute({ title = 'Alerta', message, type = 'warn', life = 4000 }: { title?: string; message: string; type?: string; life?: number }) {
        this.messageService.add({
            severity: type,
            summary: title,
            detail: message,
            life: life
        });
    }

    static getInstance(messageService: MessageService): SendMessage {
        if (!SendMessage.instance) {
            SendMessage.instance = new SendMessage(messageService);
        }
        return SendMessage.instance;
    }

}
