import { RowInput } from 'jspdf-autotable';
import { AbstractReportPdf } from '../abstract.report.pdf';
import { InspectionResponseModel } from '../../../../../inspection/data/models/inspection.response.model';

export class InspectionReportPdf extends AbstractReportPdf {

    inspections: InspectionResponseModel[] = [];
    headers: Record<string, string> = {}
    data: Record<string, string> = {}
    username = ''

    constructor(partial?: Partial<InspectionReportPdf>) {
        super();
        Object.assign(this, partial);
    }

    protected override getTitle(): string {
        return this.headers['title']
    }

    protected override getUsername(): string {
        return this.username
    }

    protected override getHeaderColums(): RowInput[] {
        return [
            [
                this.headers['id'],
                this.headers['date'],
                this.headers['time'],
                this.headers['age'],
                this.headers['disease'],
                this.headers['eye'],
                this.headers['result']
            ]
        ];
    }

    protected override getBody(): RowInput[] {
        return this.inspections.map((inspection) => [
            inspection.inspectionId.toString(),
            inspection.inspectionDate.toLocaleDateString(),
            inspection.inspectionTime,
            `${inspection.patientAge} ${this.headers['years']}`,
            inspection.diseaseOption?.label ?? '',
            inspection.eyeOption?.label ?? '',
            inspection.resultOption?.label ?? ''
        ]);
    }
}
