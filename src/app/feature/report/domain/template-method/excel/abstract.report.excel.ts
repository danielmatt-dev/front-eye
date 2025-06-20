import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export abstract class AbstractReportExcel {

    private workbook!: ExcelJS.Workbook;
    private sheet!: ExcelJS.Worksheet;

    async generate() {
        this.workbook = new ExcelJS.Workbook();

        const sheetName = this.getWorksheetName()
        this.sheet = this.workbook.addWorksheet(sheetName);

        const headers = this.addHeaders()
        this.sheet.columns = headers.map(item => ({
            header: item.header,
            key: item.key
        }));

        this.sheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCCCCCC' }  // Color gris claro
            };
            cell.font = { bold: true };  // Hacer el texto en negritas
        });

        this.sheet = this.addBody(this.sheet, headers)

        // Autoajustar el ancho de las columnas
        headers.forEach((_, index) => {

            const maxLength = Math.max(
                ...this.sheet.getColumn(index + 1).values
                    .filter(cell => cell !== null && cell !== undefined) // Filtrar valores null o undefined
                    .map(cell => String(cell).length) // Convertir a string y calcular longitud
            );

            this.sheet.getColumn(index + 1).width = maxLength + 2; // Añadir un pequeño margen
        });

        const filename = this.getFileName()
        await this.download(filename)
    }

    protected abstract getFileName(): string

    protected abstract getWorksheetName(): string

    // Paso 1: Agregar headers, cada clase hija debe implementarlo
    protected abstract addHeaders(): { key: string, header: string }[];

    // Paso 2: Agregar datos de la tabla, cada clase hija debe implementarlo
    protected abstract addBody(sheet: ExcelJS.Worksheet, headers:  { key: string, header: string }[]): ExcelJS.Worksheet;

    private async download(filename: string) {
        const buffer = await this.workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${filename}.xlsx`);
    }

}
