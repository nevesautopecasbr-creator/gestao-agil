// Validações e helpers reutilizáveis para campos de cadastro.
// Observação: backend já tem tipos (NUMERIC/DATE/VARCHAR), mas o front valida/mascara
// para melhorar UX e reduzir erros de persistência.

export function digitsOnly(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\D+/g, '');
}

export function validateEmail(email) {
  if (!email) return false;
  const v = String(email).trim();
  if (v.length < 5) return false;
  // Regex simples e suficientemente segura para validação de formulário.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function validateCPF(cpfDigits) {
  const cpf = digitsOnly(cpfDigits);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false; // todos iguais

  const calcDigit = (baseDigits, factorStart) => {
    let sum = 0;
    for (let i = 0; i < baseDigits.length; i++) {
      sum += Number(baseDigits[i]) * (factorStart - i);
    }
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const base9 = cpf.slice(0, 9);
  const digit1 = calcDigit(base9, 10);
  const base10 = cpf.slice(0, 10);
  const digit2 = calcDigit(base10, 11);

  return cpf === `${base9}${digit1}${digit2}`;
}

export function validateCNPJ(cnpjDigits) {
  const cnpj = digitsOnly(cnpjDigits);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false; // todos iguais

  const calcDigit = (baseDigits, weights) => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += Number(baseDigits[i]) * weights[i];
    }
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const base12 = cnpj.slice(0, 12);
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digit1 = calcDigit(base12, weights1);

  const base13 = cnpj.slice(0, 13);
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digit2 = calcDigit(base13, weights2);

  return cnpj === `${base12}${digit1}${digit2}`;
}

export function validateCPFOrCNPJ(value) {
  const d = digitsOnly(value);
  if (d.length === 11) return validateCPF(d);
  if (d.length === 14) return validateCNPJ(d);
  return false;
}

export function validatePhone(phoneDigits) {
  const d = digitsOnly(phoneDigits);
  if (d.length !== 10 && d.length !== 11) return false;
  const ddd = Number(d.slice(0, 2));
  if (!ddd || ddd < 11) return false; // evita "00", "01", etc.
  // Alguns DDD/num podem ser reservados; aqui mantemos uma validação geral.
  return true;
}

export function validateISODate(dateStr) {
  if (!dateStr) return false;
  const v = String(dateStr).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y, m, d] = v.split('-').map(Number);
  const dt = new Date(`${v}T12:00:00`);
  return dt instanceof Date && !Number.isNaN(dt.getTime()) && dt.getFullYear() === y && dt.getMonth() + 1 === m && dt.getDate() === d;
}

// Aceita: "1234,56", "1.234,56", "1234.56", 1234.56
export function parseMoneyBRToNumber(value) {
  if (value === null || value === undefined || value === '') return NaN;
  if (typeof value === 'number') return value;
  const s = String(value).trim();
  if (!s) return NaN;

  // remove "R$" e espaços
  const cleaned = s.replace(/R\$\s?/gi, '').replace(/\s/g, '');
  // se tiver vírgula, tratamos como decimal
  if (cleaned.includes(',')) {
    const normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');
    const n = Number(normalized);
    return Number.isFinite(n) ? n : NaN;
  }

  // caso "1,234.56" não esperado, mas pode acontecer: remover vírgulas de milhar
  const normalized = cleaned.replace(/,/g, '');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

export function validateMoney(value, { min = 0, allowEmpty = false } = {}) {
  if (value === null || value === undefined || value === '') {
    return allowEmpty ? true : false;
  }
  const n = parseMoneyBRToNumber(value);
  if (!Number.isFinite(n)) return false;
  return n >= min;
}

/** Formata número para string compatível com Cleave (ex.: 1.234,56). */
export function formatNumberToMoneyBRInput(n) {
  if (n === null || n === undefined || n === '') return '';
  const num = Number(n);
  if (!Number.isFinite(num)) return '';
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCPF(cpfDigits) {
  const d = digitsOnly(cpfDigits);
  if (d.length !== 11) return cpfDigits || '';
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

export function formatCNPJ(cnpjDigits) {
  const d = digitsOnly(cnpjDigits);
  if (d.length !== 14) return cnpjDigits || '';
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}

