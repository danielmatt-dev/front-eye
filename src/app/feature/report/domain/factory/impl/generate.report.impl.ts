import { GenerateReport, ReportFactoryParams } from '../generate.report';
import { AbstractReportPdf } from '../../template-method/abstract.report.pdf';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class generateReportImpl implements GenerateReport {

    abstractReportPdf?: AbstractReportPdf = undefined

    generatePDF(params: ReportFactoryParams): void {
        this.abstractReportPdf?.generate(params)
    }

    generateExcel(params: ReportFactoryParams): void {
        throw new Error('Method not implemented.');
    }

}
