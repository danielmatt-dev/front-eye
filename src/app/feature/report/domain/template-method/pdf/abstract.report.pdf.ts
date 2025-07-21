import { jsPDF } from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { ReportFactoryParams } from '../../factory/generate.report';

export abstract class AbstractReportPdf {

    private doc!: jsPDF

    private getHeader(name: string) {
        const now = new Date().toLocaleString()

        // Logo
        this.doc.addImage('/assets/images/imagotipo_negativo.png', 'PNG', 15, 10, 80, 15);

        // Fecha (alineado a la derecha y en negritas)
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold'); // Negrita
        this.doc.text(now, this.doc.internal.pageSize.getWidth() - 10, 15, { align: 'right' });

        // Título del reporte
        this.doc.setFontSize(12);
        this.doc.text(name, 14, 32, { align: 'left' });
    }

    protected abstract getHeaderColums(): RowInput[]

    generate(params: ReportFactoryParams): void {
        this.doc = new jsPDF()

        // Añadir header
        this.getHeader(params.name)
        autoTable(this.doc, {
            startY: 38,
            head: this.getHeaderColums(),
            body: this.getBody(),
            headStyles: {
                fillColor: [211, 211, 211],  // Color gris claro
                textColor: [0, 0, 0],        // Texto negro
                fontStyle: 'bold',           // Negrita
                halign: 'left',             // Derecha
            },
            styles: {
                fontSize: 10,                // Tamaño de letra
                cellPadding: 4               // Espaciado en celdas
            },
            columnStyles: {
                4: { cellWidth: 30 } // Índice de la columna "Correo"
            },
            didDrawPage: (data) => {
                this.drawFooter(params.user, data.pageNumber);
            }
        })

        const blob = this.doc.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    protected abstract getBody(): RowInput[]

    private drawFooter(user: string, pageNumber: number): void {
        const pageHeight = this.doc.internal.pageSize.height;
        const pageWidth = this.doc.internal.pageSize.width;

        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(10);

        // Usuario a la izquierda
        this.doc.text(user, 10, pageHeight - 10);

        // Número de página a la derecha
        this.doc.text(`Página ${pageNumber}`, pageWidth - 10, pageHeight - 10, { align: 'right' });
    }

}
