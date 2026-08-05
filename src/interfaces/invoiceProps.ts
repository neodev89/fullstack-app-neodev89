export interface InvoiceSchema {
  id: number;
  created_at: string; // I campi datetime in JSON vengono serializzati come stringhe ISO (es. "2026-08-05T12:00:00Z")
  num_invoice: number; // Decimal in JSON viene comunemente mappato come number (oppure string se mantieni alta precisione)
  taxable: string;
  vat: string;
  total: string;
  creation_date: string;
  protocol_numb: number;
  invoice_token: string;
  tax_id_code: string;
}