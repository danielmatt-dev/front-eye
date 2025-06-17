import { Expose } from 'class-transformer';

export class DiseaseModel {

    @Expose({ name: 'disease_id' })
    diseaseId?: number = undefined

    name?: string = ''

    description?:string = ''

    constructor(partial?: Partial<DiseaseModel>) {
        Object.assign(this, partial)
    }

}
