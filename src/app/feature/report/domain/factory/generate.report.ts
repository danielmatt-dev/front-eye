import { AbstractReportPdf } from '../template-method/pdf/abstract.report.pdf';
import { AbstractReportExcel } from '../template-method/excel/abstract.report.excel';

export interface GenerateReport {

    generatePDF(abstractReportPdf: AbstractReportPdf): void

    generateExcel(abstractReportExcel: AbstractReportExcel): Promise<void>

}
