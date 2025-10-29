import { NextRequest, NextResponse } from 'next/server';
import { ParsedDocument, Inconsistency, DocumentAnalysis } from '@/types/document';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const apiKey = formData.get('watsonx_api_key');

    if (files.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 documents are required for comparison' },
        { status: 400 }
      );
    }

    // Parse all documents
    const parsedDocuments: ParsedDocument[] = [];
    
    for (const file of files) {
      const content = await file.text();
      try {
        const parsed = JSON.parse(content);
        // Handle both array format and single object format
        const doc = Array.isArray(parsed) ? parsed[0] : parsed;
        parsedDocuments.push(doc);
      } catch (error) {
        console.error(`Error parsing file ${file.name}:`, error);
      }
    }

    // Detect inconsistencies
    const inconsistencies = detectInconsistencies(parsedDocuments);

    // Build analysis response
    const analysis: DocumentAnalysis = {
      documents: parsedDocuments.map((doc, idx) => ({
        id: `doc-${idx}`,
        name: doc.file || files[idx].name,
        language: detectLanguage(doc.file || files[idx].name),
        data: doc,
        uploadedAt: new Date(),
      })),
      inconsistencies,
      analyzedAt: new Date(),
      totalInconsistencies: inconsistencies.length,
      summary: {
        high: inconsistencies.filter(i => i.severity === 'high').length,
        medium: inconsistencies.filter(i => i.severity === 'medium').length,
        low: inconsistencies.filter(i => i.severity === 'low').length,
      },
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing documents:', error);
    return NextResponse.json(
      { error: 'Failed to analyze documents' },
      { status: 500 }
    );
  }
}

function detectLanguage(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes('_bg') || lower.includes('bulgarian')) return 'BG';
  if (lower.includes('_hr') || lower.includes('croatian')) return 'HR';
  if (lower.includes('_cs') || lower.includes('czech')) return 'CS';
  if (lower.includes('_da') || lower.includes('danish')) return 'DA';
  if (lower.includes('_nl') || lower.includes('dutch')) return 'NL';
  if (lower.includes('_en') || lower.includes('english')) return 'EN';
  if (lower.includes('_et') || lower.includes('estonian')) return 'ET';
  if (lower.includes('_fi') || lower.includes('finnish')) return 'FI';
  if (lower.includes('_fr') || lower.includes('french')) return 'FR';
  if (lower.includes('_de') || lower.includes('german') || lower.includes('deutsch')) return 'DE';
  if (lower.includes('_el') || lower.includes('greek')) return 'EL';
  if (lower.includes('_hu') || lower.includes('hungarian')) return 'HU';
  if (lower.includes('_ga') || lower.includes('irish')) return 'GA';
  if (lower.includes('_it') || lower.includes('italian')) return 'IT';
  if (lower.includes('_lv') || lower.includes('latvian')) return 'LV';
  if (lower.includes('_lt') || lower.includes('lithuanian')) return 'LT';
  if (lower.includes('_mt') || lower.includes('maltese')) return 'MT';
  if (lower.includes('_pl') || lower.includes('polish')) return 'PL';
  if (lower.includes('_pt') || lower.includes('portuguese')) return 'PT';
  if (lower.includes('_ro') || lower.includes('romanian')) return 'RO';
  if (lower.includes('_sk') || lower.includes('slovak')) return 'SK';
  if (lower.includes('_sl') || lower.includes('slovenian')) return 'SL';
  if (lower.includes('_es') || lower.includes('spanish')) return 'ES';
  if (lower.includes('_sv') || lower.includes('swedish')) return 'SV';
  return 'Unknown';
}

function detectInconsistencies(documents: ParsedDocument[]): Inconsistency[] {
  const inconsistencies: Inconsistency[] = [];
  
  if (documents.length < 2) return inconsistencies;

  // Extract all dates, numbers, and currencies from each document
  const extractedData = documents.map(doc => extractFactualData(doc));

  // Compare dates across documents
  const dateInconsistencies = compareDates(extractedData, documents);
  inconsistencies.push(...dateInconsistencies);

  // Compare numbers across documents
  const numberInconsistencies = compareNumbers(extractedData, documents);
  inconsistencies.push(...numberInconsistencies);

  // Compare currencies across documents
  const currencyInconsistencies = compareCurrencies(extractedData, documents);
  inconsistencies.push(...currencyInconsistencies);

  return inconsistencies;
}

interface ExtractedData {
  dates: Array<{ value: string; paraNumber: number; context: string }>;
  numbers: Array<{ value: string; paraNumber: number; context: string }>;
  currencies: Array<{ value: string; paraNumber: number; context: string }>;
  percentages: Array<{ value: string; paraNumber: number; context: string }>;
}

function extractFactualData(doc: ParsedDocument): ExtractedData {
  const data: ExtractedData = {
    dates: [],
    numbers: [],
    currencies: [],
    percentages: [],
  };

  doc.para.forEach(paragraph => {
    const text = paragraph.para;
    
    // Extract dates (various formats)
    const dateRegex = /\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s+\d{4}|\d{1,2}\.\s*(?:März|Juni|Dezember)\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})\b/gi;
    const dates = text.match(dateRegex);
    if (dates) {
      dates.forEach(date => {
        data.dates.push({
          value: date.trim(),
          paraNumber: paragraph.para_number,
          context: text.substring(Math.max(0, text.indexOf(date) - 50), Math.min(text.length, text.indexOf(date) + 50))
        });
      });
    }

    // Extract currency amounts (EUR, USD, etc.)
    const currencyRegex = /(?:EUR|€|\$|USD|GBP|£)\s*[\d,.]+(?:\s*(?:million|billion|Mio\.|Mrd\.))?|\d+(?:\.\d+)?\s*(?:million|billion|Mio\.|Mrd\.)\s*(?:EUR|€|\$|USD)/gi;
    const currencies = text.match(currencyRegex);
    if (currencies) {
      currencies.forEach(currency => {
        data.currencies.push({
          value: currency.trim(),
          paraNumber: paragraph.para_number,
          context: text.substring(Math.max(0, text.indexOf(currency) - 50), Math.min(text.length, text.indexOf(currency) + 50))
        });
      });
    }

    // Extract percentages
    const percentageRegex = /\b\d+(?:\.\d+)?\s*%/g;
    const percentages = text.match(percentageRegex);
    if (percentages) {
      percentages.forEach(percentage => {
        data.percentages.push({
          value: percentage.trim(),
          paraNumber: paragraph.para_number,
          context: text.substring(Math.max(0, text.indexOf(percentage) - 50), Math.min(text.length, text.indexOf(percentage) + 50))
        });
      });
    }

    // Extract standalone numbers
    const numberRegex = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b/g;
    const numbers = text.match(numberRegex);
    if (numbers) {
      numbers.forEach(number => {
        // Skip if it's part of a currency or percentage
        const idx = text.indexOf(number);
        const before = text.substring(Math.max(0, idx - 5), idx);
        const after = text.substring(idx + number.length, Math.min(text.length, idx + number.length + 5));
        
        if (!/[€$£%]/.test(before + after)) {
          data.numbers.push({
            value: number.trim(),
            paraNumber: paragraph.para_number,
            context: text.substring(Math.max(0, idx - 50), Math.min(text.length, idx + 50))
          });
        }
      });
    }
  });

  return data;
}

function compareDates(extractedData: ExtractedData[], documents: ParsedDocument[]): Inconsistency[] {
  const inconsistencies: Inconsistency[] = [];
  
  // Group dates by paragraph number
  const datesByPara = new Map<number, Array<{ docIdx: number; date: string; context: string }>>();
  
  extractedData.forEach((data, docIdx) => {
    data.dates.forEach(dateInfo => {
      if (!datesByPara.has(dateInfo.paraNumber)) {
        datesByPara.set(dateInfo.paraNumber, []);
      }
      datesByPara.get(dateInfo.paraNumber)!.push({
        docIdx,
        date: dateInfo.value,
        context: dateInfo.context
      });
    });
  });

  // Check for inconsistencies in corresponding paragraphs
  datesByPara.forEach((dates, paraNumber) => {
    if (dates.length > 1) {
      // Normalize dates for comparison
      const normalizedDates = dates.map(d => normalizeDateString(d.date));
      const uniqueDates = new Set(normalizedDates);
      
      if (uniqueDates.size > 1) {
        const values: { [key: string]: string } = {};
        dates.forEach(d => {
          const docName = documents[d.docIdx].file;
          values[docName] = d.date;
        });

        inconsistencies.push({
          id: `date-${paraNumber}-${Math.random()}`,
          type: 'date',
          severity: 'high',
          description: `Inconsistent dates found in paragraph ${paraNumber}`,
          location: {
            documents: dates.map(d => documents[d.docIdx].file),
            paragraphNumbers: [paraNumber]
          },
          values,
          context: dates[0].context
        });
      }
    }
  });

  return inconsistencies;
}

function compareNumbers(extractedData: ExtractedData[], documents: ParsedDocument[]): Inconsistency[] {
  const inconsistencies: Inconsistency[] = [];
  
  // Similar logic to compareDates but for numbers
  const numbersByPara = new Map<number, Array<{ docIdx: number; number: string; context: string }>>();
  
  extractedData.forEach((data, docIdx) => {
    data.numbers.forEach(numInfo => {
      if (!numbersByPara.has(numInfo.paraNumber)) {
        numbersByPara.set(numInfo.paraNumber, []);
      }
      numbersByPara.get(numInfo.paraNumber)!.push({
        docIdx,
        number: numInfo.value,
        context: numInfo.context
      });
    });
  });

  numbersByPara.forEach((numbers, paraNumber) => {
    if (numbers.length > 1) {
      const normalizedNumbers = numbers.map(n => normalizeNumber(n.number));
      const uniqueNumbers = new Set(normalizedNumbers);
      
      if (uniqueNumbers.size > 1) {
        const values: { [key: string]: string } = {};
        numbers.forEach(n => {
          const docName = documents[n.docIdx].file;
          values[docName] = n.number;
        });

        // Only report significant differences
        if (isSignificantDifference(normalizedNumbers)) {
          inconsistencies.push({
            id: `number-${paraNumber}-${Math.random()}`,
            type: 'number',
            severity: 'medium',
            description: `Inconsistent numbers found in paragraph ${paraNumber}`,
            location: {
              documents: numbers.map(n => documents[n.docIdx].file),
              paragraphNumbers: [paraNumber]
            },
            values,
            context: numbers[0].context
          });
        }
      }
    }
  });

  return inconsistencies;
}

function compareCurrencies(extractedData: ExtractedData[], documents: ParsedDocument[]): Inconsistency[] {
  const inconsistencies: Inconsistency[] = [];
  
  const currenciesByPara = new Map<number, Array<{ docIdx: number; currency: string; context: string }>>();
  
  extractedData.forEach((data, docIdx) => {
    data.currencies.forEach(currInfo => {
      if (!currenciesByPara.has(currInfo.paraNumber)) {
        currenciesByPara.set(currInfo.paraNumber, []);
      }
      currenciesByPara.get(currInfo.paraNumber)!.push({
        docIdx,
        currency: currInfo.value,
        context: currInfo.context
      });
    });
  });

  currenciesByPara.forEach((currencies, paraNumber) => {
    if (currencies.length > 1) {
      const normalizedCurrencies = currencies.map(c => normalizeCurrency(c.currency));
      const uniqueCurrencies = new Set(normalizedCurrencies);
      
      if (uniqueCurrencies.size > 1) {
        const values: { [key: string]: string } = {};
        currencies.forEach(c => {
          const docName = documents[c.docIdx].file;
          values[docName] = c.currency;
        });

        inconsistencies.push({
          id: `currency-${paraNumber}-${Math.random()}`,
          type: 'currency',
          severity: 'high',
          description: `Inconsistent currency amounts found in paragraph ${paraNumber}`,
          location: {
            documents: currencies.map(c => documents[c.docIdx].file),
            paragraphNumbers: [paraNumber]
          },
          values,
          context: currencies[0].context
        });
      }
    }
  });

  return inconsistencies;
}

// Helper functions
function normalizeDateString(date: string): string {
  // Simple normalization - can be enhanced
  return date.toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizeNumber(num: string): number {
  return parseFloat(num.replace(/,/g, ''));
}

function normalizeCurrency(currency: string): string {
  // Extract just the numeric value for comparison
  const match = currency.match(/[\d,.]+/);
  return match ? normalizeNumber(match[0]).toString() : currency;
}

function isSignificantDifference(numbers: number[]): boolean {
  if (numbers.length < 2) return false;
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);
  // Consider it significant if difference is more than 0.1% or if numbers are different integers
  return (max - min) / max > 0.001 || !numbers.every(n => n === numbers[0]);
}

