import { Expose } from 'class-transformer';

export class ClinicModel {

    @Expose({ name: 'clinic_id' })
    clinicId: number

    name: string

    description: string

    constructor(options: {
        clinicId?: number
        name?: string
        description?: string
    } = {}) {
        this.clinicId = options.clinicId || 0
        this.name = options.name || ''
        this.description = options.description || ''
    }

}
