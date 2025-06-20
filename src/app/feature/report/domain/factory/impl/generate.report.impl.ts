import { GenerateReport, ReportFactoryParams } from '../generate.report';
import { AbstractReportPdf } from '../../template-method/pdf/abstract.report.pdf';
import { Injectable } from '@angular/core';
import { AbstractReportExcel } from '../../template-method/excel/abstract.report.excel';

@Injectable({ providedIn: 'root' })
export class GenerateReportImpl implements GenerateReport {

    abstractReportPdf?: AbstractReportPdf
    abstractReportExcel?: AbstractReportExcel

    generatePDF(params: ReportFactoryParams): void {
        this.abstractReportPdf?.generate(params)
    }

    generateExcel(): void {
        this.abstractReportExcel?.generate()
    }

}
