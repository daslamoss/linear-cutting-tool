function printCutting() {
    if (!currentCuttingResult) return;
    fetch('../server/pdf_generator.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCuttingResult)
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentCuttingResult.cuttingName}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
    });
}
