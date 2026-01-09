# Flutter API Documentation

## Template Server Endpoints for Flutter App

### 1. Get All Templates
**GET** `/api/templates`

Returns list of available templates.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "PetTemMasId": 1,
      "PetitionNumber": "TEMP-001",
      "PetitionName": "Petition under Section 355(1) - Absence Condonation",
      "TemplateType": "HTML",
      "IsActive": true
    },
    {
      "PetTemMasId": 2,
      "PetitionNumber": "TEMP-002",
      "PetitionName": "Vakalathnama - Power of Attorney",
      "TemplateType": "HTML",
      "IsActive": true
    }
  ],
  "count": 2
}
```

### 2. Render Template with Data
**POST** `/api/templates/render`

Fills template with provided data and returns rendered HTML or PDF.

**Request Body:**
```json
{
  "templateId": 2,
  "formData": {
    "tribunalLocation": "COIMBATORE",
    "oaNumber": "182",
    "oaYear": "2025",
    "applicantName": "INDIAN BANK",
    "accused": [
      { "name": "Defendant 1", "address": "Address 1" },
      { "name": "Defendant 2", "address": "Address 2" }
    ],
    "advocatesList": "A.AASHIK ALI.B.A.LL.B., (MS.3368/2022), V.VIJAYA KUMAR.B.A.LL.B., (MS.909/2022)",
    "advocateAddress": "78/82, Semi Basement, Cheran Towers, Coimbatore-18",
    "executionDay": "30",
    "executionMonth": "December",
    "executionYear": "2025",
    "advocateCity": "Coimbatore",
    "advocatePhone": "93444 84069",
    "advocateEmail": "aashiqalf12@gmail.com",
    "lawyerSignatureBase64": "data:image/png;base64,iVBORw0KG...",
    "advocateSignature": "data:image/png;base64,iVBORw0KG..."
  },
  "format": "html"
}
```

**Parameters:**
- `templateId` (required): Template ID (1 or 2)
- `formData` (required): Object containing all form fields
- `format` (optional): "html" (default) or "pdf"

**Response (HTML format):**
- Content-Type: `text/html; charset=utf-8`
- Returns rendered HTML string

**Response (PDF format):**
- Content-Type: `application/pdf`
- Returns PDF file (downloadable)

### 3. Preview Template (GET)
**GET** `/api/templates/render/:id?formData={json}`

Preview template with optional data in browser.

**Example:**
```
GET /api/templates/render/2?formData={"oaNumber":"182","oaYear":"2025"}
```

---

## Flutter Implementation Example

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class TemplateService {
  final String baseUrl = 'http://your-server:6000';
  
  // Get all templates
  Future<List<Map<String, dynamic>>> getTemplates() async {
    final response = await http.get(Uri.parse('$baseUrl/api/templates'));
    final data = json.decode(response.body);
    return List<Map<String, dynamic>>.from(data['data']);
  }
  
  // Render template and get HTML
  Future<String> renderTemplate({
    required int templateId,
    required Map<String, dynamic> formData,
    String format = 'html',
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/templates/render'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'templateId': templateId,
        'formData': formData,
        'format': format,
      }),
    );
    
    if (format == 'pdf') {
      // Save PDF file
      return response.bodyBytes;
    }
    
    return response.body; // HTML string
  }
  
  // Download PDF
  Future<void> downloadPDF({
    required int templateId,
    required Map<String, dynamic> formData,
    required String filePath,
  }) async {
    final pdfBytes = await renderTemplate(
      templateId: templateId,
      formData: formData,
      format: 'pdf',
    );
    
    final file = File(filePath);
    await file.writeAsBytes(pdfBytes);
  }
}
```

---

## Form Data Structure

### Template 1 (Section 355) Required Fields:
```dart
{
  "caseNumber": "325",
  "courtName": "COIMBATORE",
  "accused": [
    {"name": "Accused 1", "address": "Address"}
  ],
  "respondentName": "INSPECTOR OF POLICE,",
  "respondentStation": "PERIYANAIKENPALAYAM POLICE STATION,",
  "respondentAddress": "COIMBATORE.",
  "sectionNumber": "355(1)",
  "point1": "...",
  "point2": "...",
  "point3": "...",
  "point4": "...",
  "prayer": "...",
  "place": "Coimbatore",
  "lawyerSignatureBase64": "data:image/png;base64,..."
}
```

### Template 2 (Vakalathnama) Required Fields:
```dart
{
  "tribunalLocation": "COIMBATORE",
  "oaNumber": "182",
  "oaYear": "2025",
  "applicantName": "INDIAN BANK",
  "applicantBranch": "RAMNAGAR BRANCH",
  "applicantAddress": "COIMBATORE - 641 062.",
  "accused": [
    {"name": "Defendant 1"},
    {"name": "Defendant 2"}
  ],
  "advocatesList": "A.AASHIK ALI.B.A.LL.B., (MS.3368/2022), V.VIJAYA KUMAR.B.A.LL.B., (MS.909/2022)",
  "advocateAddress": "78/82, Semi Basement, Cheran Towers, Coimbatore-18",
  "executionDay": "30",
  "executionMonth": "December",
  "executionYear": "2025",
  "advocateCity": "Coimbatore",
  "advocatePhone": "93444 84069",
  "advocateEmail": "aashiqalf12@gmail.com",
  "vakalathnamaSignature": "data:image/png;base64,...",
  "advocateSignature": "data:image/png;base64,..."
}
```

---

## Displaying HTML in Flutter

Use `flutter_inappwebview` or `webview_flutter` to display rendered HTML:

```dart
import 'package:webview_flutter/webview_flutter.dart';

// After rendering template
final htmlContent = await templateService.renderTemplate(
  templateId: 2,
  formData: formData,
  format: 'html',
);

// Display in WebView
WebView(
  initialData: htmlContent,
  // Enable download/sharing
  onWebViewCreated: (controller) {
    // Handle actions
  },
)
```

---

## Installation

Run in template-server directory:
```bash
npm install
```

This will install:
- `handlebars` - For template rendering
- `puppeteer` - For PDF generation

---

## Notes

1. Signatures should be sent as base64 data URIs: `data:image/png;base64,iVBORw0KG...`
2. All dates should be strings in format: "30", "December", "2025"
3. Arrays (accused, advocates) should be properly formatted JSON arrays
4. The server handles missing fields with default values
5. For PDF generation, ensure Puppeteer dependencies are installed (may require Chrome/Chromium)

