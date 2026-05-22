import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  async generateQrCode(data: string): Promise<string> {
    try {
      return await QRCode.toDataURL(data, {
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    } catch (err) {
      console.error('Errore generazione QR Code:', err);
      return '';
    }
  }

  printLabel(qrDataUrl: string, label: string, mode: 'inline' | 'stacked') {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Stampa Etichetta - ${label}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          body {
            font-family: 'Outfit', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: white;
          }
          .label-container {
            border: 1px solid #eee;
            padding: 30px;
            border-radius: 12px;
            background: white;
            text-align: center;
          }
          .inline {
            display: flex;
            align-items: center;
            gap: 30px;
          }
          .stacked {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
          }
          img {
            width: 180px;
            height: 180px;
            display: block;
          }
          .label-text {
            font-size: 32px;
            font-weight: 700;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          @media print {
            body { height: auto; }
            .label-container { border: none; padding: 0; }
            @page { size: auto; margin: 0mm; }
          }
        </style>
      </head>
      <body>
        <div class="label-container ${mode}">
          <img src="${qrDataUrl}" alt="QR Code" />
          <div class="label-text">${label}</div>
        </div>
        <script>
          window.onload = () => setTimeout(() => window.print(), 500);
        </script>
      </body>
    </html>
  `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const printWindow = window.open(url, '_blank');
    if (!printWindow) {
      alert('Il popup di stampa è stato bloccato dal browser.');
      URL.revokeObjectURL(url); // pulizia
      return;
    }

    // libera memoria dopo la stampa
    printWindow.onafterprint = () => {
      URL.revokeObjectURL(url);
    };
  }
}
