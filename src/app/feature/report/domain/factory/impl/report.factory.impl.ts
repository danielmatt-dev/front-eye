import { ReportFactory, ReportFactoryParams } from '../report.factory';
import { AbstractReportPdf } from '../../template-method/abstract.report.pdf';

export class ReportFactoryImpl implements ReportFactory {

    abstractReportPdf?: AbstractReportPdf

    constructor(partial?: Partial<ReportFactoryImpl>) {
        Object.assign(this, partial)
    }

    generatePDF(params: ReportFactoryParams): void {
        this.abstractReportPdf?.generate(params)
    }

    generateExcel(params: ReportFactoryParams): void {
        throw new Error('Method not implemented.');
    }

}
