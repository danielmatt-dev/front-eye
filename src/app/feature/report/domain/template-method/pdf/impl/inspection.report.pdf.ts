import { RowInput } from 'jspdf-autotable';
import { AbstractReportPdf } from '../abstract.report.pdf';
import { InspectionResponseEntity } from '../../../../../inspection/domain/entity/inspection.response.entity';
import { formatDateToDDMMYYYY } from '../../../../../../shared/utils/functions/functions';

export class InspectionReportPdf extends AbstractReportPdf {

    inspections: InspectionResponseEntity[] = []

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
