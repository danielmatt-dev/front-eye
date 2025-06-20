import { Worksheet } from 'exceljs';
import { AbstractReportExcel } from '../abstract.report.excel';
import { InspectionResponseEntity } from '../../../../../inspection/domain/entity/inspection.response.entity';

export class InspectionReportExcel extends AbstractReportExcel {

    inspections: InspectionResponseEntity[] = []

    constructor(partial?: Partial<InspectionReportExcel>) {
        super();
        Object.assign(this, partial)
    }

    protected override getFileName(): string {
        return 'reporte_inspecciones'
    }

    protected override getWorksheetName(): string {
        return 'Inspecciones'
    }

    protected override addHeaders(): { key: string; header: string }[] {
        return [
            { key: 'inspectionId', header: 'ID' },
            { key: 'inspectionDate', header: 'Fecha' },
            { key: 'inspectionTime', header: 'Hora' },
            { key: 'patientAge', header: 'Edad' },
            { key: 'disease', header: 'Afección' },
            { key: 'eye', header: 'Ojo' },
            { key: 'result', header: 'Resultado' },
        ]
    }

    protected override addBody(sheet: Worksheet): Worksheet {
        this.inspections.map((inspection) => {
            sheet.addRow({
                inspectionId: inspection.inspectionId,
                inspectionDate: inspection.inspectionDate.toLocaleDateString('en-GB'),
                inspectionTime: inspection.inspectionTime,
                patientAge: inspection.patientAge,
                disease: inspection.disease,
                eye: inspection.eye,
                result: inspection.result
            })
        })
        return sheet
    }

}
