# Quick Start Guide

## Get Up and Running in 3 Minutes

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### 3. Test with Sample Data

1. Open your browser to `http://localhost:3000`

2. Upload the sample files from the `data/` folder:
   - Navigate to `../data/`
   - Select and upload:
     - `test_sample_en_parsed.json`
     - `test_sample_de_parsed.json`

3. Click "Analyze Documents"

4. View the detected inconsistencies!

## What You Should See

The analyzer should detect several inconsistencies:

✅ **High Severity**:
- Date mismatch: "30 June 2029" vs "30. Juni 2028"
- Currency difference: "EUR 135 million" vs "136 Mio. EUR"
- Currency type: "EUR 1 500 million" vs "1,5 Mrd. USD"

✅ **Medium Severity**:
- Percentage variation: "32%" vs "30%"
- Date difference: "16 June 2023" vs "15. Juni 2023"

## Features to Try

### Upload Interface
- ✨ Drag and drop files
- 🌍 Auto-detect language from filename
- 🔧 Manually adjust language if needed
- ❌ Remove files before analysis

### Results View
- 📊 Summary dashboard with counts
- 🔍 Filter by severity (All, High, Medium, Low)
- 📖 Expand inconsistencies to see details
- 📝 View context and exact values

### User Experience
- 🎨 Modern, responsive design
- 🚀 Fast client-side processing
- 💡 Helpful error messages
- 📱 Works on mobile and desktop

## Next Steps

After testing with sample data:

1. **Upload Your Own Documents**
   - Prepare JSON files with your document data
   - Ensure they follow the same structure as samples
   - Upload and analyze

2. **Explore the Code**
   - Check out `app/page.tsx` for the main interface
   - Review `components/DocumentUploader.tsx` for upload logic
   - See `app/api/analyze/route.ts` for detection algorithms

3. **Customize**
   - Modify detection patterns in `app/api/analyze/route.ts`
   - Adjust severity levels
   - Add new inconsistency types
   - Customize the UI theme

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Dependencies Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npm run build
```

## Sample File Structure

The JSON files should have this structure:

```json
[
  {
    "file": "document_name.docx",
    "para": [
      {
        "para": "Text content here...",
        "para_number": 1
      },
      {
        "para": "More text content...",
        "para_number": 2
      }
    ]
  }
]
```

## Architecture Overview

```
User uploads files
       ↓
DocumentUploader validates and groups files
       ↓
Files sent to /api/analyze endpoint
       ↓
API extracts dates, numbers, currencies
       ↓
API compares across documents
       ↓
Inconsistencies detected and classified
       ↓
Results displayed in InconsistencyDisplay
       ↓
User filters and explores results
```

## Tips for Best Results

1. **Use Consistent Naming**: Name files with language codes (e.g., `doc_en.json`, `doc_de.json`)

2. **Align Paragraph Numbers**: Ensure corresponding paragraphs have the same number across documents

3. **Include Context**: Keep surrounding text for better context display

4. **Upload Multiple Versions**: Upload at least 2 documents for comparison

5. **Check Data Quality**: Ensure factual data (dates, numbers) is present in documents

## Resources

- **Full Documentation**: See `README_USAGE.md`
- **Implementation Details**: See `../IMPLEMENTATION_NOTES.md`
- **Sample Data**: Located in `../data/`
- **Next.js Docs**: https://nextjs.org/docs

## Support

Having issues? Check:

1. Browser console for errors (F12 → Console)
2. Terminal output for server errors
3. File format matches sample structure
4. All dependencies installed correctly

---

**Happy analyzing!** 🎉

Built by IBM x GDG KUL - AI Accelerate 2025 Team 09

