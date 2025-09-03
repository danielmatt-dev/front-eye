import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { colorByResult } from '../../../../../shared/utils/functions/functions';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../../../../shared/services/local.storage.service';
import { InspectionDetailsModel } from '../../../../inspection/data/models/inspection.details.model';
import { TranslateLang, TypeList } from '../../../../../shared/utils/functions/translate-lang';

@Injectable({ providedIn: 'root' })
export class InspectionDetailsPdf {
    private doc!: jsPDF;
    inspection!: InspectionDetailsModel;
    headers: Record<string, string> = {};

    constructor(
        private readonly local: LocalStorageService,
        private readonly translateLang: TranslateLang
    ) {
        this.headers = this.translateLang.getHeaders(TypeList.details);
    }

    generate(inspection: InspectionDetailsModel) {
        this.inspection = inspection;
        this.createDocument();
        this.addHeader();
        this.addInspectionSection();
        this.addPatientSection();
        this.addProbabilitySection();
        this.addImagesSection();
        this.addAdditionalNotesSection();
        //this.addHistorySection();
        this.saveAndOpen();
    }
    /** Inicializa el PDF */
    private createDocument(): void {
        this.doc = new jsPDF();
    }

    /** Agrega logo, fecha y título */
    private addHeader(): void {
        const now = new Date().toLocaleString();

        // Logo
        this.doc.addImage('/assets/images/imagotipo_negativo.png', 'PNG', 15, 10, 80, 15);

        // Fecha a la derecha
        this.doc.setFontSize(10).setFont('helvetica', 'bold');
        this.doc.text(now, this.doc.internal.pageSize.getWidth() - 10, 15, { align: 'right' });

        // Título
        this.doc.setFontSize(12);
        this.doc.text(`${this.headers['details']} #${this.inspection.inspection.inspectionId}`, 14, 32, { align: 'left' });
    }

    /** Muestra los datos básicos de la inspección en una tabla */
    private addInspectionSection(): void {
        const { inspection } = this.inspection;

        // 1) Dibujar título encima de la tabla
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(this.headers['data'], 14, 40);

        const headersInspection = this.translateLang.getHeaders(TypeList.inspection);
        const headers = [[headersInspection['id'], headersInspection['date'], headersInspection['time'], headersInspection['age'], headersInspection['disease'], headersInspection['result']]];
        const body = [[inspection.inspectionId, inspection.inspectionDate.toLocaleDateString(), inspection.inspectionTime, inspection.eyeOption?.label ?? '', inspection.diseaseOption?.label ?? '', inspection.resultOption?.label ?? '']];

        autoTable(this.doc, {
            startY: 42,
            head: headers,
            body,
            headStyles: {
                fillColor: [211, 211, 211],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'left'
            },
            styles: {
                fontSize: 10,
                cellPadding: 4
            }
        });
    }

    /** Tabla de probabilidades con colores de barra */
    private addProbabilitySection(): void {
        let startY: number = (this.doc as any).lastAutoTable.finalY;

        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(this.headers['occurrence'], 14, startY + 10);

        const probabilities = this.inspection.inspection.diagnosticProbabilities;

        const headers = [[this.headers['results'], this.headers['probability']]];
        const body = probabilities.map((p) => [`${p.resultOption?.label} (${Math.round(p.probability * 100)}%)`, `${Math.round(p.probability * 100)}%`]);
        startY += 12;

        autoTable(this.doc, {
            startY,
            head: headers,
            body,
            headStyles: { fillColor: [211, 211, 211], textColor: [0, 0, 0], fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 4 },
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 1) {
                    const prob = this.inspection.inspection.diagnosticProbabilities[data.row.index];
                    const raw = prob.probability;
                    const pct = `${Math.round(raw * 100)}%`;
                    const fullW = data.cell.width - 8;
                    const barW = fullW * raw;
                    const x = data.cell.x + 4;
                    const y = data.cell.y + data.cell.height / 4;
                    const h = data.cell.height / 2;

                    // fondo gris
                    this.doc.setFillColor(200, 200, 200);
                    this.doc.rect(x, y, fullW, h, 'F');
                    // barra de color
                    this.doc.setFillColor(colorByResult(prob.resultCategory));
                    this.doc.rect(x, y, barW, h, 'F');

                    // ————— Añadir texto centrado sobre la barra —————
                    this.doc.setFontSize(8); // tamaño pequeño
                    this.doc.setTextColor(255, 255, 255); // blanco (o contraste)
                    const textW = this.doc.getTextWidth(pct);
                    const textX = x + barW / 2 - textW / 2;
                    // y + h*0.75 para que quede centrado verticalmente
                    const textY = y + h * 0.65;

                    this.doc.text(pct, textX, textY);
                }
            }
        });
    }

    /** Inserta las imágenes de la inspección */
    private addImagesSection(): void {
        let startY: number = (this.doc as any).lastAutoTable.finalY;

        const images = this.inspection.inspection.inspectionImages;

        // helpers
        const guessMime = (b64: string): 'image/png' | 'image/jpeg' => {
            // PNG típicamente empieza con iVBOR..., JPEG con /9j/
            if (b64?.startsWith('iVBOR')) return 'image/png';
            if (b64?.startsWith('/9j/')) return 'image/jpeg';
            // fallback; ajusta si sabes tu tipo predominante
            return 'image/png';
        };
        const toDataUrl = (b64: string): string => {
            const mime = guessMime(b64);
            return `data:${mime};base64,${b64}`;
        };

        // Título
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(this.headers['images'], 14, startY + 10);

        // Encabezados (títulos de cada imagen)
        // const head: string[] = images.map(img => img.title || '');

        // Cuerpo: una fila con tantas columnas como imágenes; no pongas el base64 aquí.
        const bodyRow = new Array(images.length).fill(''); // o ' '

        const imgSize = 50;
        startY += 12;

        autoTable(this.doc, {
            startY,
            //head: [head],
            body: [bodyRow],
            headStyles: {
                fillColor: [211, 211, 211],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center'
            },
            styles: {
                fontSize: 10,
                cellPadding: 4,
                halign: 'center',
                valign: 'middle'
            },
            bodyStyles: {
                fillColor: [240, 240, 240],
                minCellHeight: imgSize + 8
            },
            columnStyles: images.reduce(
                (acc, _, idx) => {
                    acc[idx] = { cellWidth: imgSize + 8 };
                    return acc;
                },
                {} as Record<number, any>
            ),
            didDrawCell: (data) => {
                if (data.section !== 'body') return;

                const col = data.column.index;
                const srcB64 = images[col]?.imageUrl;
                if (!srcB64) return;

                // data URL correcto
                const dataUrl = toDataUrl(srcB64);

                // posición dentro de la celda (respetando el padding)
                const x = data.cell.x + 4;
                const y = data.cell.y + 4;

                // Consejo: si pasas un dataURL, jsPDF detecta el formato solo;
                // no fuerces 'JPEG' si podría ser PNG.
                this.doc.addImage(dataUrl, x, y, imgSize, imgSize);
                // Si tu versión de jsPDF requiere el parámetro de formato:
                // const fmt = dataUrl.includes('image/jpeg') ? 'JPEG' : 'PNG';
                // this.doc.addImage(dataUrl, fmt, x, y, imgSize, imgSize);
            }
        });
    }

    /** Datos del paciente en clave-valor */
    private addPatientSection(): void {
        const { patient } = this.inspection;

        let startY: number = (this.doc as any).lastAutoTable.finalY;

        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(this.headers['patient'], 14, startY + 10);

        const headersPatient = this.translateLang.getHeaders(TypeList.patient);
        const data = this.translateLang.getHeaders(TypeList.pdf);
        const headers = [[headersPatient['id'], headersPatient['patient'], headersPatient['birthdate'], headersPatient['gender'], headersPatient['email'], headersPatient['occupation'], headersPatient['address']]];
        const body = [
            [
                patient.patientId.toString(),
                `${patient.firstName} ${patient.lastFathName} ${patient.lastMontName}`,
                patient.birthDate.toLocaleDateString(),
                patient.genderOption?.label ?? '',
                patient.email,
                patient.occupation,
                `${patient.address}. ${data['pc']} ${patient.postalCode}. ${patient.state}`
            ]
        ];
        startY += 12;

        autoTable(this.doc, {
            startY: startY,
            head: headers,
            body,
            headStyles: {
                fillColor: [211, 211, 211],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'left'
            },
            columnStyles: {
                4: { cellWidth: 30 } // Índice de la columna "Correo"
            },
            styles: {
                fontSize: 10,
                cellPadding: 4
            }
        });
    }

    /** Texto de notas adicionales */
    private addAdditionalNotesSection(): void {
        let startY: number = (this.doc as any).lastAutoTable.finalY;

        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(this.headers['notes'], 14, startY + 10);

        const notes = this.inspection.inspection.notes;
        const body = [[notes]];
        startY += 12;

        autoTable(this.doc, {
            startY: startY,
            body,
            styles: {
                fontSize: 10,
                cellPadding: 4,
                halign: 'justify'
            },
            didDrawPage: (data) => {
                this.drawFooter(data.pageNumber, this.local.getUsername());
            }
        });
    }

    /** Historial de inspecciones en tabla
    private addHistorySection(): void {
        const startY = (this.doc as any).lastAutoTable.finalY + 80;
        const headers = [['ID', 'Fecha', 'Ojo', 'Resultado']];
        const body = this.inspection.inspectionHistory.map((h) => [h.inspectionId, new Date(h.inspectionDate).toLocaleDateString(), h.eye, h.result]);

        autoTable(this.doc, {
            startY,
            head: headers,
            body,
            headStyles: { fillColor: [211, 211, 211], textColor: [0, 0, 0], fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 4 }
        });
    }
     */

    /** Pie de página con usuario y número de página */
    private drawFooter(pageNumber: number, user: string): void {
        const pageH = this.doc.internal.pageSize.getHeight();
        const pageW = this.doc.internal.pageSize.getWidth();

        this.doc.setFontSize(9).setFont('helvetica', 'normal');
        this.doc.text(user, 15, pageH - 10);
        this.doc.text(`${pageNumber}`, pageW - 10, pageH - 10, { align: 'right' });
    }

    /** Guarda y abre en nueva pestaña */
    private saveAndOpen(): void {
        const blob = this.doc.output('blob');
        window.open(URL.createObjectURL(blob), '_blank');
    }
}
