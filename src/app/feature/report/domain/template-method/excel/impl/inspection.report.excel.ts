import { Worksheet } from 'exceljs';
import { AbstractReportExcel } from '../abstract.report.excel';
import { InspectionResponseModel } from '../../../../../inspection/data/models/inspection.response.model';

export class InspectionReportExcel extends AbstractReportExcel {

    inspections: InspectionResponseModel[] = []
    headers: Record<string, string> = {}

    constructor(partial?: Partial<InspectionReportExcel>) {
        super();
        Object.assign(this, partial)
    }

    protected override getFileName(): string {
        return this.headers['filename']
    }

    protected override getWorksheetName(): string {
        return this.headers['title']
    }

    protected override addHeaders(): { key: string; header: string }[] {
        return [
            { key: 'inspectionId', header: this.headers['id'] },
            { key: 'inspectionDate', header: this.headers['date'] },
            { key: 'inspectionTime', header: this.headers['time'] },
            { key: 'patientAge', header: this.headers['age'] },
            { key: 'disease', header: this.headers['disease'] },
            { key: 'eye', header: this.headers['eye'] },
            { key: 'result', header: this.headers['result'] },
        ]
    }

    protected override addBody(sheet: Worksheet): Worksheet {
        this.inspections.map((inspection) => {
            sheet.addRow({
                inspectionId: inspection.inspectionId,
                inspectionDate: inspection.inspectionDate.toLocaleDateString('en-GB'),
                inspectionTime: inspection.inspectionTime,
                patientAge: inspection.patientAge,
                disease: inspection.diseaseOption?.label,
                eye: inspection.eyeOption?.label,
                result: inspection.resultOption?.label
            })
        })
        return sheet
    }

}
