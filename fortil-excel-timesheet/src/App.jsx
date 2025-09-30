import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Funzione helper per ottenere la lettera di colonna (es: 1 -> A, 2 -> B, 27 -> AA)
function getColumnLetter(colIndex) {
  let temp, letter = '';
  while (colIndex > 0) {
    temp = (colIndex - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    colIndex = Math.floor((colIndex - 1) / 26);
  }
  return letter;
}

function MonthExcelForm() {
  const today = new Date();
  const [formData, setFormData] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    societa: "Fortil",
    nominativo: "Roberto Ingenito",
  });

  const [presenze, setPresenze] = useState({});

  const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  // Nomi dei giorni della settimana in Italiano
  const dayNames = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

  function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  function getDayOfWeek(year, month, day) {
    return dayNames[new Date(year, month - 1, day).getDay()];
  }

  function isWorkday(year, month, day) {
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5; // Lunedì (1) a Venerdì (5)
  }

  // Inizializza le presenze quando il componente si monta o quando cambiano mese/anno
  useEffect(() => {
    function initializePresenze(year, month) {
      const days = daysInMonth(year, month);
      const newPresenze = {};

      for (let d = 1; d <= days; d++) {
        if (isWorkday(year, month, d)) {
          newPresenze[d] = {
            ordinarie: "8",
            straordinarie: "0",
            ferie: "0"
          };
        } else {
          newPresenze[d] = {
            ordinarie: "0",
            straordinarie: "0",
            ferie: "0"
          };
        }
      }
      return newPresenze;
    }

    setPresenze(initializePresenze(formData.year, formData.month));
  }, [formData.year, formData.month]);

  function handleChange(day, tipo, value) {
    setPresenze(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [tipo]: value,
      },
    }));
  }

  const nDays = daysInMonth(formData.year, formData.month);

  async function handleExport() {
    const { year, month, societa, nominativo } = formData;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Presenze");

    // L'indice della colonna separatrice (dopo l'ultimo giorno) è nDays + 3
    const separatorColIndex = nDays + 3;

    // Riga 1: vuota
    sheet.addRow([]);

    // Riga 2: MESE
    sheet.getCell("A2").value = "MESE:";
    sheet.getCell("A2").font = { bold: true };
    sheet.getCell("B2").value = monthNames[month - 1];
    sheet.getCell("B2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
    sheet.getCell("B2").font = { color: { argb: "FFFFFFFF" }, bold: true };

    // Riga 3: SOCIETA'
    sheet.getCell("A3").value = "SOCIETÀ:";
    sheet.getCell("A3").font = { bold: true };
    sheet.getCell("B3").value = societa;
    sheet.getCell("B3").font = { bold: true };

    // Riga 4: NOMINATIVO
    sheet.getCell("A4").value = "NOMINATIVO:";
    sheet.getCell("A4").font = { bold: true };
    sheet.getCell("B4").value = nominativo;
    sheet.getCell("B4").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
    sheet.getCell("B4").font = { color: { argb: "FFFFFFFF" }, bold: true };

    // Riga 5: vuota
    sheet.addRow([]);

    // Riga 6: Intestazione con "Commessa" e giorni della settimana
    const row6 = ["", "Commessa"];
    for (let d = 1; d <= nDays; d++) {
      row6.push(getDayOfWeek(year, month, d));
    }
    row6.push("", "Totale ORE", 'Totale ORE Lavorate', "Totale Euro");
    sheet.addRow(row6); // Riga 6

    // Styling per Riga 6 (Intestazioni Giorni e Totali)
    for (let c = 3; c <= nDays + 6; c++) {
      // Rimuovi lo stile dalla colonna separatrice
      if (c === separatorColIndex) {
        sheet.getCell(6, c).value = null;
        sheet.getCell(6, c).fill = undefined;
        sheet.getCell(6, c).font = undefined;
        sheet.getCell(6, c).border = undefined;
        continue;
      }

      // Applica lo stile agli altri header
      sheet.getCell(6, c).font = { bold: true };
      sheet.getCell(6, c).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDAE3F3" }
      };
      sheet.getCell(6, c).border = {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" },
      };
    }

    sheet.getRow(6).height = 62;
    sheet.getCell(6, 2).value = "Commessa";

    // Riga 7: Numeri dei giorni
    const row7 = ["", ""];
    for (let d = 1; d <= nDays; d++) {
      row7.push(d);
    }
    row7.push("", "", "", ""); // Spazi vuoti per colonne totali
    const dayNumberRow = sheet.addRow(row7); // Riga 7
    dayNumberRow.font = { bold: true };

    // Styling per Riga 7 (Numeri Giorni)
    for (let i = 3; i <= nDays + 2; i++) {
      dayNumberRow.getCell(i).border = {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" },
      };
    }

    // Funzione per generare e stilizzare le righe dati
    const createDataRow = (label, tipo, rowNum) => {
      const row = ["", label];
      const dayColLetters = [];

      for (let d = 1; d <= nDays; d++) {
        const val = presenze[d]?.[tipo] || "0";
        row.push(parseInt(val, 10)); // Valore numerico
        dayColLetters.push(getColumnLetter(d + 2)); // Lettera colonna giorno (C, D, ...)
      }

      // Colonna nDays + 3 (Separatore)
      row.push("");

      // Colonne Totali (nDays + 4, nDays + 5, nDays + 6)
      row.push({ formula: `SUM(${dayColLetters[0]}${rowNum}:${dayColLetters[dayColLetters.length - 1]}${rowNum})` }); // Totale ORE 
      row.push({ formula: `SUM(${dayColLetters[0]}${rowNum}:${dayColLetters[dayColLetters.length - 1]}${rowNum})` }); // Totale ORE Lavorate 
      row.push(0); // Totale Euro (lasciato a 0 per ora)

      const excelRow = sheet.addRow(row);

      // Styling e bordi
      excelRow.eachCell((cell, colNum) => {
        if (colNum > 2 && colNum !== separatorColIndex) {
          cell.border = {
            top: { style: "thin" }, bottom: { style: "thin" },
            left: { style: "thin" }, right: { style: "thin" },
          };
        }
      });
      return excelRow;
    };

    // Riga 8: Ore ordinarie
    createDataRow("Ore ordinarie", "ordinarie", 8);

    // Riga 9: Ore straordinarie
    createDataRow("Ore straordinarie", "straordinarie", 9);

    // Riga 10: Ferie
    createDataRow("Ferie", "ferie", 10);

    // Riga 11 e 12: vuote (per spostare i totali alla Riga 13)
    sheet.addRow([]); // Riga 11: Vuota
    sheet.addRow([]); // Riga 12: Vuota

    // Riga 13: Totali per ogni giorno
    const rowTotals = ["", ""]; // Colonna A e B vuote per iniziare da Colonna C

    for (let d = 1; d <= nDays; d++) {
      const colLetter = getColumnLetter(d + 2); // C, D, E...
      // Formula: Somma (Ord + Str + Ferie) per il giorno corrente
      rowTotals.push({ formula: `${colLetter}8+${colLetter}9+${colLetter}10` });
    }

    // Colonne finali
    rowTotals.push(""); // Separator

    // Le tre colonne finali con formule
    const col1Letter = getColumnLetter(nDays + 4); // Colonna "Totale ORE"
    const col2Letter = getColumnLetter(nDays + 5); // Colonna "Totale ORE Lavorate"
    const col3Letter = getColumnLetter(nDays + 6); // Colonna "Totale Euro"

    // Prima: somma righe 8, 9, 10
    rowTotals.push({ formula: `${col1Letter}8+${col1Letter}9+${col1Letter}10` });

    // Seconda: somma righe 8, 9
    rowTotals.push({ formula: `${col2Letter}8+${col2Letter}9` });

    // Terza: somma righe 8, 9
    rowTotals.push({ formula: `${col3Letter}8+${col3Letter}9` });

    const totalsRow = sheet.addRow(rowTotals); // Riga 13

    // Styling per Riga 13 (Totali Giornalieri)
    totalsRow.eachCell((cell, colNum) => {
      // Applica bordi ai totali giornalieri (Col 3 fino a Col nDays + 2)
      if (colNum >= 3 && colNum <= nDays + 2) {
        cell.border = {
          top: { style: "thin" }, bottom: { style: "thin" },
          left: { style: "thin" }, right: { style: "thin" },
        };
        cell.font = { bold: true };
      }
      // Colonna finale per "€"
      if (colNum === nDays + 6) {
        cell.font = { bold: true };
      }
    });

    // --- Styling Generale ---

    // Larghezza colonne
    sheet.getColumn("A").width = 14;
    sheet.getColumn("B").width = 24;
    for (let i = 3; i <= nDays + 6; i++) sheet.getColumn(i).width = 9; // Colonne C fino ad AH

    // Allineamento per le prime 13 righe
    for (let c = 1; c <= nDays + 6; c++) {
      for (let r = 1; r <= 13; r++) {
        sheet.getCell(r, c).alignment = { horizontal: "center", vertical: "middle", wrapText: true }
      }
    }

    // Rotazione testo per i giorni (Riga 6)
    for (let c = 3; c <= nDays + 6; c++) {
      sheet.getCell(6, c).alignment = { ...sheet.getCell(6, c).alignment, textRotation: 90 }
    }

    sheet.mergeCells(6, 2, 7, 2);

    for (let r = 6; r <= 10; r++) {
      sheet.getCell(r, 2).border = {
        top: { style: "medium" }, bottom: { style: "medium" },
        left: { style: "medium" }, right: { style: "medium" },
      };
    }

    for (let r = 1; r <= 13; r++) {
      if (r == 6) continue
      sheet.getRow(r).height = 20
    }


    // Dopo aver creato tutte le righe, itera su di esse
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = { ...cell.font, name: 'Arial', size: 10 };
      });
    });
    sheet.getCell(6, 2).font = { ...sheet.getCell(6, 2).font, underline: "single", bold: true, size: 20 }

    // Salvataggio
    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Presenze_${nominativo}_${monthNames[month - 1]}_${year}.xlsx`);
  }

  // Funzione per calcolare i totali per la visualizzazione React
  const calculateTotal = (tipo) => {
    return Array.from({ length: nDays }, (_, i) => i + 1)
      .reduce((sum, day) => sum + parseInt(presenze[day]?.[tipo] || "0", 10), 0);
  };

  const totalOrdinarie = calculateTotal('ordinarie');
  const totalStraordinarie = calculateTotal('straordinarie');
  const totalFerie = calculateTotal('ferie');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 p-6 bg-white shadow-xl rounded-xl">
          <p className="text-2xl">
            Per tutti i giorni lavorativi, sono già indicate 8 ore.<br />
            Controllare eventuali giorni festivi oltre il <b>sabato</b> e la <b>domenica</b>
          </p>
        </header>

        <section className="bg-white p-6 shadow-xl rounded-xl mb-8 space-y-4 md:flex md:justify-between md:items-start">
          <div className="space-y-4 md:w-1/3">
            <h2 className="text-xl font-semibold text-gray-700">Dati anagrafici</h2>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-500 mb-1">Società:</label>
              <span className="p-2 bg-gray-100 rounded-lg font-semibold text-gray-800">{formData.societa}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="nominativo" className="text-sm font-medium text-gray-500 mb-1">Nominativo:</label>
              <input
                id="nominativo"
                type="text"
                value={formData.nominativo}
                onChange={e => setFormData({ ...formData, nominativo: e.target.value })}
                className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>
          </div>

          <div className="space-y-4 md:w-1/3">
            <h2 className="text-xl font-semibold text-gray-700">Selezione Mese/Anno</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col">
                <label htmlFor="month" className="text-sm font-medium text-gray-500 mb-1">Mese:</label>
                <select
                  id="month"
                  value={formData.month}
                  onChange={e => setFormData({ ...formData, month: parseInt(e.target.value) })}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  {monthNames.map((monthName, index) => (
                    <option key={index + 1} value={index + 1}>
                      {monthName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="year" className="text-sm font-medium text-gray-500 mb-1">Anno:</label>
                <input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="p-2 w-24 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                />
              </div>
            </div>
          </div>

          <div className="md:w-1/4 pt-8 md:pt-0">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Totali (Anteprima)</h2>
            <p className="text-sm">Ordinarie: <span className="font-bold">{totalOrdinarie}</span> h</p>
            <p className="text-sm">Straordinarie: <span className="font-bold">{totalStraordinarie}</span> h</p>
            <p className="text-sm">Ferie: <span className="font-bold">{totalFerie}</span> h</p>
            <p className="text-sm mt-2 font-semibold">Totale Presenza: <span className="font-extrabold text-blue-600">{totalOrdinarie + totalStraordinarie + totalFerie}</span> h</p>
          </div>
        </section>

        <div className="overflow-x-auto mb-8 bg-white p-4 rounded-xl shadow-xl">
          <table className="w-full text-xs border-collapse table-auto">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="sticky left-0 bg-gray-200 border border-gray-300 p-2 z-10 min-w-[120px] text-left">Tipo</th>
                {Array.from({ length: nDays }, (_, i) => {
                  const d = i + 1;
                  const dayName = getDayOfWeek(formData.year, formData.month, d);
                  const isWeekend = !isWorkday(formData.year, formData.month, d);
                  return (
                    <th
                      key={d}
                      className={`border border-gray-300 p-2 font-bold text-gray-700 ${isWeekend ? "bg-red-100" : "bg-blue-100"}`}
                      style={{ minWidth: "60px", writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {dayName}<span className="block">{d}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {['ordinarie', 'straordinarie', 'ferie'].map((tipo) => (
                <tr key={tipo} className="hover:bg-gray-50">
                  <td className="sticky left-0 bg-gray-50 border border-gray-300 p-2 font-bold text-gray-700 capitalize">
                    Ore {tipo}
                  </td>
                  {Array.from({ length: nDays }, (_, i) => {
                    const d = i + 1;
                    const isWeekend = !isWorkday(formData.year, formData.month, d);
                    return (
                      <td
                        key={d}
                        className={`border border-gray-300 p-1 ${isWeekend ? "bg-red-50" : "bg-white"}`}
                      >
                        <input
                          type="number"
                          min="0"
                          max="24"
                          value={(presenze[d] && presenze[d][tipo]) || ""}
                          onChange={e => handleChange(d, tipo, e.target.value)}
                          className="w-full h-full text-center text-sm border-none bg-transparent focus:ring-blue-500 focus:border-blue-500 p-0 m-0"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Riga Totali (Anteprima) */}
              <tr className="bg-blue-50 font-bold text-blue-800">
                <td className="sticky left-0 bg-blue-100 border border-gray-400 p-2 text-left">Totale Ore Giorno</td>
                {Array.from({ length: nDays }, (_, i) => {
                  const d = i + 1;
                  const totalDay = parseInt(presenze[d]?.ordinarie || "0", 10) +
                    parseInt(presenze[d]?.straordinarie || "0", 10) +
                    parseInt(presenze[d]?.ferie || "0", 10);
                  return (
                    <td key={`total-${d}`} className="border border-gray-400 p-1 text-center">
                      {totalDay}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150 transform hover:scale-[1.02]"
          >
            Esporta in Excel ({monthNames[formData.month - 1]} {formData.year})
          </button>
        </div>
      </div>
    </div>
  );
}

export default MonthExcelForm;