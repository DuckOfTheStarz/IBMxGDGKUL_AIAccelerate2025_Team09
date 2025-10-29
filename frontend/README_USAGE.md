# Document Consistency Analyzer - Usage Guide

## Overview

The Document Consistency Analyzer is a web-based application that allows users to upload multiple versions of a document (in different languages) and automatically detects factual inconsistencies such as dates, numbers, currency amounts, and percentages.

## Features

- **Drag-and-Drop Upload**: Easy file upload with drag-and-drop support
- **Multi-Language Support**: Automatically detects language from filename (EN, DE, LV, FR, ES)
- **AI-Powered Analysis**: Advanced algorithms detect inconsistencies across documents
- **Severity Classification**: Inconsistencies are classified as High, Medium, or Low severity
- **Detailed Reports**: View detailed information about each inconsistency including context and location
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
cd frontend
npm install
```

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## How to Use

### Step 1: Upload Documents

1. Click the upload area or drag and drop files
2. Supported formats: JSON and DOCX files
3. Upload at least 2 document versions for comparison
4. The system will automatically detect the language from the filename

### Step 2: Configure Languages

- Review the detected languages for each file
- Adjust the language selection if needed using the dropdown
- Supported languages: EN, DE, LV, FR, ES

### Step 3: Analyze Documents

- Click the "Analyze Documents" button
- The AI model will process your documents
- Wait for the analysis to complete

### Step 4: Review Results

The analysis results will show:

- **Summary Dashboard**: Overview of inconsistencies by severity
- **Filter Options**: Filter inconsistencies by severity level
- **Detailed View**: Click on any inconsistency to expand and see:
  - Type (date, number, currency, percentage)
  - Severity level
  - Description
  - Detected values from each document
  - Paragraph numbers
  - Context excerpt

## Testing with Sample Data

Sample parsed JSON files are available in the `../data/` directory:

- `test_sample_en_parsed.json` - English version
- `test_sample_de_parsed.json` - German version
- `test_sample_lv_parsed.json` - Latvian version

To test:

1. Upload 2 or more of these JSON files
2. The system will detect inconsistencies like:
   - Date differences (e.g., "30 June 2029" vs "30. Juni 2028")
   - Currency amount variations (e.g., "EUR 135 million" vs "136 Mio. EUR")
   - Numerical discrepancies

## API Endpoints

### POST `/api/analyze`

Analyzes uploaded documents for inconsistencies.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Files array

**Response:**
```json
{
  "documents": [...],
  "inconsistencies": [...],
  "analyzedAt": "2025-10-29T...",
  "totalInconsistencies": 5,
  "summary": {
    "high": 2,
    "medium": 2,
    "low": 1
  }
}
```

## Inconsistency Types

The system detects the following types of inconsistencies:

1. **Dates**: Different dates in corresponding paragraphs
2. **Numbers**: Numerical differences in similar contexts
3. **Currency**: Monetary amount discrepancies
4. **Percentages**: Percentage value variations

## Severity Levels

- **High**: Critical inconsistencies (dates, currency amounts)
- **Medium**: Moderate inconsistencies (numbers, percentages)
- **Low**: Minor variations

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Processing**: Custom analysis algorithms
- **IBM watsonx.ai**: AI platform integration

## Troubleshooting

### Files not uploading
- Ensure files are in JSON or DOCX format
- Check file size limits
- Verify file content is valid JSON

### No inconsistencies detected
- Ensure documents are translations of the same content
- Verify paragraph numbering matches across documents
- Check that factual data (dates, numbers) exists in the documents

### Analysis fails
- Check browser console for errors
- Verify API endpoint is accessible
- Ensure at least 2 documents are uploaded

## Future Enhancements

- Integration with IBM watsonx.ai for advanced NLP analysis
- Support for more document formats (PDF, Word)
- Export analysis results to CSV/PDF
- Batch processing capabilities
- Custom rule configuration
- Real-time collaboration features

## Support

For issues or questions, please contact the development team or refer to the project documentation.

---

Built with ❤️ by IBM x GDG KUL - AI Accelerate 2025 Team 09

