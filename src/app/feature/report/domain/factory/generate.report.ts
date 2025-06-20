import { AbstractReportPdf } from '../template-method/pdf/abstract.report.pdf';
import { AbstractReportExcel } from '../template-method/excel/abstract.report.excel';

export interface GenerateReport {

    generatePDF(params: ReportFactoryParams, abstractReportPdf: AbstractReportPdf): void

    generateExcel(abstractReportExcel: AbstractReportExcel): Promise<void>

}

export class ReportFactoryParams {

    name: string = ''
    user: string = ''

    constructor(partial?: Partial<ReportFactoryParams>) {
        Object.assign(this, partial)
    }

}
