import { Expose } from 'class-transformer';

export class AiModelModel {

    @Expose({ name: 'ai_model_id' })
    aiModelId?: number = undefined

    name?: string = ''

    version?: string = ''

    description?: string = ''

    constructor(partial?: Partial<AiModelModel>) {
        Object.assign(this, partial)
    }

}
