// Sample data utility for testing the Document Consistency Analyzer

export const sampleInconsistencies = [
  {
    id: '1',
    type: 'date' as const,
    severity: 'high' as const,
    description: 'Inconsistent deadline dates found in Article 6',
    location: {
      documents: ['test_sample_en.docx', 'test_sample_de.docx'],
      paragraphNumbers: [14, 30],
    },
    values: {
      'test_sample_en.docx': '30 June 2029',
      'test_sample_de.docx': '30. Juni 2028',
    },
    context: 'Decisions on the release of funds referred to in Article 19(3) for the support in the form of loans shall be adopted in the period from 1 January 2025 to 30 June 2029.',
  },
  {
    id: '2',
    type: 'currency' as const,
    severity: 'high' as const,
    description: 'Provisioning amount mismatch in financial section',
    location: {
      documents: ['test_sample_en.docx', 'test_sample_de.docx'],
      paragraphNumbers: [13, 29],
    },
    values: {
      'test_sample_en.docx': 'EUR 135 million',
      'test_sample_de.docx': '136 Mio. EUR',
    },
    context: 'The non-repayable support should cover the 9 % provisioning required for the loans corresponding to EUR 135 million...',
  },
  {
    id: '3',
    type: 'currency' as const,
    severity: 'high' as const,
    description: 'Maximum loan amount discrepancy',
    location: {
      documents: ['test_sample_en.docx', 'test_sample_de.docx'],
      paragraphNumbers: [13, 29],
    },
    values: {
      'test_sample_en.docx': 'EUR 1 500 million',
      'test_sample_de.docx': '1,5 Mrd. USD',
    },
    context: 'The Facility should be supported with resources from the NDICI amounting to EUR 520 million in non-repayable support and a maximum amount of EUR 1 500 million in loans...',
  },
  {
    id: '4',
    type: 'percentage' as const,
    severity: 'medium' as const,
    description: 'Climate objectives percentage variation',
    location: {
      documents: ['test_sample_en.docx', 'test_sample_de.docx'],
      paragraphNumbers: [12],
    },
    values: {
      'test_sample_en.docx': '32 %',
      'test_sample_de.docx': '30 %',
    },
    context: 'The Facility should contribute to the achievement of an overall target of 32 % of Union budget expenditure supporting climate objectives...',
  },
  {
    id: '5',
    type: 'date' as const,
    severity: 'low' as const,
    description: 'Commission communication date inconsistency',
    location: {
      documents: ['test_sample_en.docx', 'test_sample_de.docx'],
      paragraphNumbers: [11, 18],
    },
    values: {
      'test_sample_en.docx': '16 June 2023',
      'test_sample_de.docx': '15. Juni 2023',
    },
    context: "As outlined by the Commission in its communication of 16 June 2023, entitled 'Implementation of the 5G cybersecurity Toolbox'...",
  },
];

export const sampleDocumentAnalysis = {
  documents: [
    {
      id: 'doc-1',
      name: 'test_sample_en.docx',
      language: 'EN',
      data: {
        file: 'test_sample_en.docx',
        para: [],
      },
      uploadedAt: new Date(),
    },
    {
      id: 'doc-2',
      name: 'test_sample_de.docx',
      language: 'DE',
      data: {
        file: 'test_sample_de.docx',
        para: [],
      },
      uploadedAt: new Date(),
    },
  ],
  inconsistencies: sampleInconsistencies,
  analyzedAt: new Date(),
  totalInconsistencies: sampleInconsistencies.length,
  summary: {
    high: sampleInconsistencies.filter((i): i is typeof sampleInconsistencies[number] => i.severity === 'high').length,
    medium: sampleInconsistencies.filter((i): i is typeof sampleInconsistencies[number] => i.severity === 'medium').length,
    low: sampleInconsistencies.filter((i): i is typeof sampleInconsistencies[number] => i.severity === 'low').length,
  },
};

// Helper function to load sample JSON files for testing
export async function loadSampleFiles(): Promise<File[]> {
  // This would need to be implemented based on your file serving strategy
  // For now, it's a placeholder
  console.log('Load sample files from ../data/');
  return [];
}

