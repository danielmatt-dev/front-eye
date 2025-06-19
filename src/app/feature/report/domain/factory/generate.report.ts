export interface GenerateReport {

    generatePDF(params: ReportFactoryParams): void

    generateExcel(params: ReportFactoryParams): void

}

export class ReportFactoryParams {

    name: string = ''
    user: string = ''

    constructor(partial?: Partial<ReportFactoryParams>) {
        Object.assign(this, partial)
    }

}
