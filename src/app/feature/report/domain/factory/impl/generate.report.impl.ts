import { GenerateReport } from '../generate.report';
import { AbstractReportPdf } from '../../template-method/pdf/abstract.report.pdf';
import { Injectable } from '@angular/core';
import { AbstractReportExcel } from '../../template-method/excel/abstract.report.excel';

@Injectable({ providedIn: 'root' })
export class GenerateReportImpl implements GenerateReport {

    generatePDF(abstractReportPdf: AbstractReportPdf): void {
        abstractReportPdf.generate()
    }

    async generateExcel(abstractReportExcel: AbstractReportExcel) {
        await abstractReportExcel.generate()
    }

}
