import { Worksheet } from 'exceljs';
import { AbstractReportExcel } from '../abstract.report.excel';
import { PatientWithInspectionsModel } from '../../../../../patient/data/models/patient.with.inspections.model';

export class GeographicDataReportExcel extends AbstractReportExcel {

    patients: PatientWithInspectionsModel[] = []

    constructor(partial?: Partial<GeographicDataReportExcel>) {
        super()
        Object.assign(this, partial)
    }

    protected override getFileName(): string {
        return 'reporte_pacientes'
    }

    protected override getWorksheetName(): string {
        return 'Pacientes'
    }

    protected override addHeaders(): { key: string; header: string }[] {
        return [
            { key: 'patientId', header: 'ID' },
            { key: 'fullName', header: 'Paciente' },
            { key: 'latitude', header: 'Latitud' },
            { key: 'longitude', header: 'Longitud' },
            { key: 'lastDisease', header: 'Afección' },
            { key: 'lastResult', header: 'Resultado' },
            { key: 'inspectionCount', header: 'Num. Inspecciones' },
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
