document.getElementById("generateFormsBtn").addEventListener("click", () => {
    const studentsCount = parseInt(document.getElementById("studentsCount").value);
    if (studentsCount > 0) {
        generateForms(studentsCount);
    } else {
        alert("Por favor, insira um número válido de alunos.");
    }
});

function generateForms(count) {
    const formsContainer = document.getElementById("formsContainer");
    formsContainer.innerHTML = "";  // Limpa os formulários anteriores

    for (let i = 1; i <= count; i++) {
        const form = document.createElement("form");
        form.id = `registration-form-${i}`;
        form.className = "registration-form";

        form.innerHTML = `
            <h2>Formulário de Inscrição - Aluno ${i}</h2>

            <label for="isVeteran-${i}">O aluno é novato ou veterano?</label>
            <select id="isVeteran-${i}" name="isVeteran" onchange="handleVeteranSelection(${i})" required>
                <option value="">Selecione</option>
                <option value="novato">Novato</option>
                <option value="veterano">Veterano</option>
            </select>

            <label for="originSchool-${i}">Escola de Origem:</label>
            <input type="text" id="originSchool-${i}" name="originSchool" placeholder="E. E. F. NAIR CUNHA DE AGUIAR" disabled>

            <label for="name-${i}">NOME:</label>
            <input type="text" id="name-${i}" name="name" required>

            <label for="dob-${i}">DATA DE NASCIMENTO:</label>
            <input type="date" id="dob-${i}" name="dob" required>

            <label for="fatherName-${i}">NOME DO PAI:</label>
            <input type="text" id="fatherName-${i}" name="fatherName" required>

            <label for="motherName-${i}">NOME DA MÃE:</label>
            <input type="text" id="motherName-${i}" name="motherName" required>

            <label for="grade-${i}">SÉRIE:</label>
            <select id="grade-${i}" name="grade" required>
                <option value="">Selecione a série</option>
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(year => `<option value="${year}º ano">${year}º ano</option>`).join("")}
            </select>

            <label for="registrationDate-${i}">DATA DE MATRÍCULA:</label>
            <input type="date" id="registrationDate-${i}" name="registrationDate" required>

            <label for="documents-${i}">DOCUMENTOS PESSOAIS:</label>
            <select id="documents-${i}" name="documents" onchange="showDocumentTypeField(${i})" required>
                <option value="">Selecione</option>
                <option value="RG">RG</option>
                <option value="CPF">CPF</option>
            </select>

            <div id="documentTypeContainer-${i}" style="display: none;">
                <label for="documentType-${i}">Número do Documento:</label>
                <input type="text" id="documentType-${i}" name="documentType" required>
            </div>

            <label for="location-${i}">LOCALIDADE:</label>
            <input type="text" id="location-${i}" name="location" required>

            <label for="citizenCard-${i}">Nº CARTÃO DO CIDADÃO:</label>
            <input type="text" id="citizenCard-${i}" name="citizenCard" required>

            <label for="disorder-${i}">TEM TRANSTORNO/LAUDO:</label>
            <select id="disorder-${i}" name="disorder" onchange="toggleCIDField(${i})" required>
                <option value="">Selecione</option>
                <option value="sim">Sim</option>
                <option value="não">Não</option>
            </select>

            <div id="cidContainer-${i}" style="display: none;">
                <label for="cid-${i}">CID:</label>
                <input type="text" id="cid-${i}" name="cid">
            </div>
        `;
        formsContainer.appendChild(form);
    }

    const generateXLSXButton = document.createElement("button");
    generateXLSXButton.innerText = "Verificar Dados e Gerar XLSX";
    generateXLSXButton.type = "button";
    generateXLSXButton.onclick = verifyDataBeforeXLSX;
    formsContainer.appendChild(generateXLSXButton);
}

function handleVeteranSelection(index) {
    const isVeteran = document.getElementById(`isVeteran-${index}`).value;
    const originSchool = document.getElementById(`originSchool-${index}`);
    if (isVeteran === "veterano") {
        originSchool.value = "E. E. F. NAIR CUNHA DE AGUIAR";
        originSchool.disabled = true;
    } else {
        originSchool.value = "";
        originSchool.disabled = false;
    }
}

function showDocumentTypeField(index) {
    const documentTypeContainer = document.getElementById(`documentTypeContainer-${index}`);
    documentTypeContainer.style.display = "block";
}

function toggleCIDField(index) {
    const disorder = document.getElementById(`disorder-${index}`).value;
    const cidContainer = document.getElementById(`cidContainer-${index}`);
    cidContainer.style.display = disorder === "sim" ? "block" : "none";
}

function verifyDataBeforeXLSX() {
    const forms = document.querySelectorAll(".registration-form");
    let allData = [];

    forms.forEach((form, index) => {
        const formData = new FormData(form);
        const formObject = {};

        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        allData.push(formObject);
    });

    if (confirm("Os dados estão corretos? Clique em 'OK' para gerar o arquivo XLSX ou 'Cancelar' para corrigir.")) {
        generateXLSX(allData);
    } else {
        alert("Por favor, corrija os dados antes de prosseguir.");
    }
}

function generateXLSX(data) {
    const worksheetData = data.map((entry, i) => ({
        "Aluno": i + 1,
        "Nome": entry.name,
        "Data de Nascimento": entry.dob,
        "Nome do Pai": entry.fatherName,
        "Nome da Mãe": entry.motherName,
        "Série": entry.grade,
        "Data de Matrícula": entry.registrationDate,
        "Documentos Pessoais": entry.documents,
        "Tipo de Documento": entry.documentType,
        "Localidade": entry.location,
        "Nº Cartão do Cidadão": entry.citizenCard,
        "Tem Transtorno/Laudo": entry.disorder,
        "CID": entry.cid || "-"
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Alunos");
    XLSX.writeFile(wb, "formulario_inscricao.xlsx");
}
