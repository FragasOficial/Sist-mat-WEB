function generatePDF() {
    // Captura os dados do formulário
    const form = document.getElementById('registration-form');
    const formData = new FormData(form);

    // Converte FormData para um objeto
    const dataObject = {};
    formData.forEach((value, key) => {
        dataObject[key] = value;
    });

    // Converte o objeto para uma string formatada
    const dataString = `
        Nome: ${dataObject.name}
        Data de Nascimento: ${dataObject.dob}
        Nome do Pai: ${dataObject.fatherName}
        Nome da Mãe: ${dataObject.motherName}
        Série: ${dataObject.grade}
        Data de Matrícula: ${dataObject.registrationDate}
        Documentos Pessoais: ${dataObject.documents}
        Localidade: ${dataObject.location}
        Nº Cartão do Cidadão: ${dataObject.citizenCard}
        Tem Transtorno/Laudo: ${dataObject.disorder}
        CID: ${dataObject.cid}
    `;

    // Usa a biblioteca jsPDF para gerar o PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(dataString, 10, 10);
    doc.save('formulario_inscricao.pdf');
}
