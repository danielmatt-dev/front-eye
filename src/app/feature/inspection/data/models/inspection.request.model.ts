import { Expose, Type } from 'class-transformer';

export class InspectionRequestModel {

    @Expose({ name: 'patient_id' })
    patientId: number = 0;

    @Expose({ name: 'disease_id' })
    diseaseId: number = 0;

    @Expose({ name: 'model_id' })
    modelId: number = 0;

    images: string[] = [];

    eye: string = '';

    result: string = '';

    @Type(() => DiagnosticProbabilityModel)
    probabilities: DiagnosticProbabilityModel[] = [];

    notes: string = '';

    constructor(partial?: Partial<InspectionRequestModel>) {
        Object.assign(this, partial);
    }
}

export class DiagnosticProbabilityModel {

    @Expose({ name: 'diagnostic_probability_id' })
    diagnosticProbabilityId?: number

    @Expose({ name: 'result_category' })
    resultCategory: string = ''

    probability: number = 0.0

    constructor(partial?: Partial<DiagnosticProbabilityModel>) {
        Object.assign(this, partial)
    }

}
