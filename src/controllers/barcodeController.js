const { jsPDF } = require('jspdf');
const bwipjs = require('bwip-js');
const Producto = require('../models/Producto');

class BarcodeController {
    // Generate barcode PDF for a product
    async generateBarcodePDF(req, res, next) {
        try {
            const { id } = req.params;
            const producto = await Producto.getById(parseInt(id));

            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            // Create PDF
            const doc = new jsPDF();

            // Configuration for barcode layout - Optimized for sticker labels
            const barcodeWidth = 38;  // Reduced width
            const barcodeHeight = 12; // Reduced height
            const labelHeight = 25;   // Total label height including text
            const espacioHorizontal = 45; // Horizontal spacing
            const espacioVertical = 28;   // Vertical spacing
            const margenY = 15;
            const margenX = 15;

            const paginaAncho = doc.internal.pageSize.getWidth();
            const paginaAlto = doc.internal.pageSize.getHeight();

            const columnas = Math.floor((paginaAncho - margenX * 2) / espacioHorizontal);
            const filas = Math.floor((paginaAlto - margenY * 2) / espacioVertical);

            // Add header
            doc.setFillColor(13, 110, 253);
            doc.rect(0, 0, paginaAncho, 12, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('CÓDIGOS DE BARRAS - ' + producto.NOMBRE.toUpperCase(), paginaAncho / 2, 8, { align: 'center' });

            let currentY = margenY;

            // Generate barcodes in a grid
            for (let fila = 0; fila < filas; fila++) {
                for (let col = 0; col < columnas; col++) {
                    const x = margenX + col * espacioHorizontal;
                    const y = currentY;

                    // Generate barcode image using bwip-js
                    try {
                        const barcodeBuffer = await bwipjs.toBuffer({
                            bcid: 'code128',
                            text: producto.PLU.toString(),
                            scale: 2,
                            height: 8,
                            includetext: true,
                            textxalign: 'center',
                            textsize: 8,
                        });

                        const barcodeBase64 = `data:image/png;base64,${barcodeBuffer.toString('base64')}`;

                        // Draw label border (optional - comment out if not needed)
                        doc.setDrawColor(220, 220, 220);
                        doc.setLineWidth(0.3);
                        doc.roundedRect(x - 1, y - 1, barcodeWidth + 2, labelHeight, 1, 1, 'S');

                        // Add barcode image
                        doc.addImage(barcodeBase64, 'PNG', x, y, barcodeWidth, barcodeHeight);

                        // Add product name below barcode
                        doc.setTextColor(0, 0, 0);
                        doc.setFontSize(6);
                        doc.setFont('helvetica', 'normal');
                        const nombreCorto = producto.NOMBRE.length > 35
                            ? producto.NOMBRE.substring(0, 32) + '...'
                            : producto.NOMBRE;
                        const textWidth = doc.getTextWidth(nombreCorto);
                        const centerX = x + barcodeWidth / 2 - textWidth / 2;
                        doc.text(nombreCorto, centerX, y + barcodeHeight + 4);

                        // Add price below name with background
                        doc.setFontSize(7);
                        doc.setFont('helvetica', 'bold');
                        const precioTexto = `$${producto.PRECIO_VENTA.toFixed(2)}`;
                        const precioWidth = doc.getTextWidth(precioTexto);
                        const precioCenterX = x + barcodeWidth / 2;

                        // Price background
                        doc.setFillColor(40, 167, 69);
                        doc.roundedRect(precioCenterX - precioWidth / 2 - 2, y + barcodeHeight + 5, precioWidth + 4, 4, 0.5, 0.5, 'F');

                        // Price text
                        doc.setTextColor(255, 255, 255);
                        doc.text(precioTexto, precioCenterX, y + barcodeHeight + 8, { align: 'center' });

                    } catch (barcodeError) {
                        console.error('Error generating barcode:', barcodeError);
                    }
                }
                currentY += espacioVertical;
            }

            // Add footer
            doc.setFontSize(7);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'italic');
            const fecha = new Date().toLocaleDateString('es-MX');
            doc.text(`Generado: ${fecha} | FullControl System`, paginaAncho / 2, paginaAlto - 5, { align: 'center' });

            // Generate PDF buffer
            const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

            // Set response headers
            const sanitizedName = producto.NOMBRE.replace(/[^a-zA-Z0-9]/g, '_');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=CODIGOS-${sanitizedName}.pdf`);
            res.setHeader('Content-Length', pdfBuffer.length);

            // Send PDF
            res.send(pdfBuffer);

        } catch (error) {
            console.error('Error generating barcode PDF:', error);
            next(error);
        }
    }
}

module.exports = new BarcodeController();
