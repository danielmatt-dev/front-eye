import { RowInput } from 'jspdf-autotable';
import { AbstractReportPdf } from '../abstract.report.pdf';
import { formatDateToDDMMYYYY } from '../../../../../../shared/utils/functions/functions';
import { InspectionResponseModel } from '../../../../../inspection/data/models/inspection.response.model';

export class InspectionReportPdf extends AbstractReportPdf {

    inspections: InspectionResponseModel[] = []

    constructor(partial?: Partial<InspectionReportPdf>) {
        super();
        Object.assign(this, partial)
    }

    protected override getHeaderColums(): RowInput[] {
        return [
            ['ID', 'Fecha', 'Hora', 'Edad', 'Afección', 'Ojo', 'Resultado']
        ]
    }

    protected override getBody(): RowInput[] {
        return this.inspections.map(inspection => [
            inspection.inspectionId.toString(),
            formatDateToDDMMYYYY(inspection.inspectionDate),
            inspection.inspectionTime,
            `${inspection.patientAge} años`,
            inspection.disease,
            inspection.eye,
            inspection.result
        ])
    }

}
