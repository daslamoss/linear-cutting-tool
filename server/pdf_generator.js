const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
app.use(express.json());

app.post('/generate_pdf', (req, res) => {
    const data = req.body;
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(`/tmp/${data.cuttingName}.pdf`);
    doc.pipe(stream);

    doc.fontSize(16).text('Карта раскроя', { align: 'center' });
    doc.fontSize(12).text(`Наименование: ${data.cuttingName}`);
    doc.text(`Профиль: ${data.profile}`);
    doc.text(`Дата: ${new Date().toLocaleDateString()}`);
    doc.text(`Эффективность: ${data.efficiency}%`);
    doc.moveDown();

    data.stocks.forEach(stock => {
        doc.fontSize(14).text(`Заготовка #${stock.id} (${stock.length} мм)`);
        doc.moveDown(0.5);
        stock.cuts.forEach(cut => {
            const name = cut.parentId ? `${cut.name} (${cut.id})` : cut.name;
            doc.fontSize(12).text(`- ${name}: ${cut.length} мм (Позиция: ${cut.startPos}-${cut.startPos + cut.length})`);
        });
        if (stock.remaining > 0) {
            doc.text(`- Остаток: ${stock.remaining} мм`);
        }
        doc.moveDown();
    });

    if (data.joinedParts && Object.keys(data.joinedParts).length > 0) {
        doc.fontSize(14).text('Стыковки:');
        Object.entries(data.joinedParts).forEach(([partId, segments]) => {
            doc.fontSize(12).text(`Деталь ${partId}: ${segments.join(' + ')}`);
        });
    }

    const totalWeight = data.parts.reduce((sum, p) => {
        const profile = Object.values(profiles).flat().find(pr => pr.name === data.profile);
        return sum + (p.length / 1000 * profile.weight_per_meter);
    }, 0);
    doc.moveDown().fontSize(12).text(`Общий вес деталей: ${totalWeight.toFixed(2)} кг`);

    doc.end();
    stream.on('finish', () => {
        res.download(`/tmp/${data.cuttingName}.pdf`, `${data.cuttingName}.pdf`, () => {
            fs.unlinkSync(`/tmp/${data.cuttingName}.pdf`);
        });
    });
});

app.listen(3000, () => console.log('PDF server running on port 3000'));
