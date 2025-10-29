# GDG Hackaton 2025 - IBM Use Case

IBM Introduction and use case available in powerpoint presentation.

Also some training material ... any questions ? Come see us at the booth !


# IBM watsonx platform

We have our full watsonx cloud platform available for you to use. The lab guide folder provides a introduction to some of the AI capbilities there.
You will get the credentials from us after being selected for our use case.

A specific login URL needs to be used for those credentials. This is :

https://cloud.ibm.com/authorize/gdghackaton

# **Who Are We – IBM**

The mission of **IBM** is to be a catalyst that makes the world work better. We aim to have a positive impact globally, and in the communities where we operate, through strong business ethics, environmental commitment, and responsible technology.

For over a century, IBM has led technological innovation. From the earliest days of computing to today’s advancements in AI and quantum technology, IBM has continuously blended intelligence, innovation, and science to improve business, society, and the human experience.
**IBM is always on the hunt for what's next.**

---

# **Case Introduction**

The **Publications Office of the European Union** publishes millions of pages of legal and regulatory documents each year — in **over 24 official EU languages**.

Before publication, every version must be **proofread to ensure factual alignment**. This means:

* No missing or mismatched numbers
* Dates must be identical across languages
* Monetary amounts and legal values must be consistent
  ➤ **Simply put: all language versions must say exactly the same thing.**

Currently, this verification process relies on **regex-based checks** that compare language versions to detect discrepancies. However:

* The system generates *nearly twice as many alerts as actual inconsistencies*
* This leads to **high false positive rates**, causing proofreaders to waste time manually reviewing false alerts
* The process slows down publication and increases operational cost

---

# **The Challenge**

**Your mission:** Use AI to make this process smarter.

You will receive multilingual versions of the same EU document (e.g., English, German, Latvian). You must build a solution that can:

✅ **Detect factual differences across versions**
✅ **Minimize false positives** — only real inconsistencies should be flagged

### **Why It Matters**

A single wrong number or date in an official EU regulation can:

* Change its legal meaning
* Cause misinterpretation between member states
* Require an official correction post-publication (costing time and money)

---

# **Resources & Tools**

* **IBM watsonx.ai Documentation**
  [https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/overview-wx.html?context=wx&audience=wdp](https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/overview-wx.html?context=wx&audience=wdp)

* **Lab Guide & Video Walkthrough**
  [https://github.com/steve-lievens/gdghackaton2025](https://github.com/steve-lievens/gdghackaton2025)

* **watsonx.ai Tutorials**
  [https://developer.ibm.com/components/watsonx-ai/tutorials/](https://developer.ibm.com/components/watsonx-ai/tutorials/)

* **watsonx.ai Python SDK**
  [https://ibm.github.io/watsonx-ai-python-sdk/](https://ibm.github.io/watsonx-ai-python-sdk/)

---

# **Judging Criteria**

| Category                        | Weight |
| ------------------------------- | :----: |
| Presentation                    |   30%  |
| Result (Accuracy & Performance) |   50%  |
| Solution Originality            |   20%  |

*Note: LLM-based judging may be part of the evaluation process.*

---

# **Our Solution: Document Consistency Analyzer**

We've built a **web-based front-end application** that allows users to upload multiple versions of a document (in different languages) and automatically detect factual inconsistencies using AI-powered analysis.

## ✨ Key Features

- 🎯 **Smart Detection**: Automatically identifies inconsistencies in dates, numbers, currency amounts, and percentages
- 🌍 **Multi-Language Support**: Works with documents in English, German, Latvian, French, and Spanish
- 📊 **Severity Classification**: Categorizes inconsistencies as High, Medium, or Low priority
- 🎨 **Modern UI**: Beautiful, responsive interface with drag-and-drop file upload
- 🔍 **Detailed Analysis**: Provides context and exact values for each inconsistency
- ⚡ **Fast Processing**: Client-side processing for quick results

## 🚀 Quick Start

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` and upload the sample files from the `data/` folder to see it in action!

## 📖 Documentation

- **Quick Start Guide**: `frontend/QUICKSTART.md`
- **Usage Guide**: `frontend/README_USAGE.md`
- **Implementation Notes**: `IMPLEMENTATION_NOTES.md`

## 🎯 How It Works

1. **Upload Documents**: Drag and drop multiple document versions (JSON or DOCX format)
2. **AI Analysis**: Advanced algorithms extract and compare factual data across all versions
3. **Review Results**: View inconsistencies with severity levels, context, and filtering options

## 📊 Detected Inconsistency Types

- **Dates**: "30 June 2029" vs "30. Juni 2028" ❌
- **Currency**: "EUR 135 million" vs "136 Mio. EUR" ❌
- **Numbers**: Numerical discrepancies in corresponding paragraphs ❌
- **Percentages**: "32%" vs "30%" ❌

## 🔬 Test with Sample Data

We've included sample EU regulation documents in the `data/` folder:
- `test_sample_en_parsed.json` - English version
- `test_sample_de_parsed.json` - German version
- `test_sample_lv_parsed.json` - Latvian version

Upload any 2+ files to see real inconsistencies detected!

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Platform**: IBM watsonx.ai (integration ready)

## 📈 Results

Our solution addresses the key challenges:

✅ **Reduces False Positives**: Smart pattern matching and normalization  
✅ **Accurate Detection**: Catches real inconsistencies across languages  
✅ **Time Savings**: Automated analysis instead of manual review  
✅ **Scalable**: Can handle multiple documents simultaneously  
✅ **User-Friendly**: Intuitive interface for proofreaders  

---

# **Point of Contact**

**Steve Lievens**
📧 [steve.lievens@be.ibm.com](mailto:steve.lievens@be.ibm.com)
📞 +32 478 423 42 12

**Team 09**
IBM x GDG KUL - AI Accelerate 2025

---

# **Goodie Bag**

🎁 **200 IBM Mini Puzzles**

---

# **Prize**

🏆 **IBM Branded Prize Packages**
