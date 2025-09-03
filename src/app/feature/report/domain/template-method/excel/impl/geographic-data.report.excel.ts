import { Worksheet } from 'exceljs';
import { AbstractReportExcel } from '../abstract.report.excel';
import { PatientWithInspectionsModel } from '../../../../../patient/data/models/patient.with.inspections.model';

export class GeographicDataReportExcel extends AbstractReportExcel {

    patients: PatientWithInspectionsModel[] = []
    headers: Record<string, string> = {}

    constructor(partial?: Partial<GeographicDataReportExcel>) {
        super()
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
            { key: 'patientId', header: this.headers['id'] },
            { key: 'fullName', header: this.headers['patient'] },
            { key: 'latitude', header: this.headers['latitude'] },
            { key: 'longitude', header: this.headers['longitude'] },
            { key: 'lastDisease', header: this.headers['disease'] },
            { key: 'lastResult', header: this.headers['result'] },
            { key: 'inspectionCount', header: this.headers['numInspections'] },
        ]
    }

    protected override addBody(sheet: Worksheet): Worksheet {
        this.patients.map((patient) => {
            sheet.addRow({
                patientId: patient.patientId,
                fullName: patient.fullName,
                latitude: patient.latitude,
                longitude: patient.longitude,
                lastDisease: patient.lastDisease,
                lastResult: patient.lastResult,
                inspectionCount: patient.inspectionCount
            })
        })
        return sheet
    }

}
