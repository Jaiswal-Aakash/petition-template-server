# Postman Testing Guide

## Prerequisites
1. Make sure template server is running: `npm start` (should run on port 6000)
2. Install dependencies: `npm install` (if not done already)

---

## Test Endpoints

### 1. Health Check
**GET** `http://localhost:6000/health`

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Template server is running",
  "templatesCount": 2
}
```

---

### 2. Get All Templates
**GET** `http://localhost:6000/api/templates`

**Headers:**
- None required (CORS enabled)

**Expected Response:**
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

---

### 3. Get Template by ID
**GET** `http://localhost:6000/api/templates/2`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "PetTemMasId": 2,
    "PetitionNumber": "TEMP-002",
    "PetitionName": "Vakalathnama - Power of Attorney",
    "TemplateContent": "<!DOCTYPE html>...",
    ...
  }
}
```

---

### 4. Render Template (HTML) - Template 2 (Vakalathnama)
**POST** `http://localhost:6000/api/templates/render`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "templateId": 2,
  "format": "html",
  "formData": {
    "tribunalLocation": "COIMBATORE",
    "oaNumber": "182",
    "oaYear": "2025",
    "applicantName": "INDIAN BANK",
    "applicantBranch": "RAMNAGAR BRANCH",
    "applicantAddress": "COIMBATORE - 641 062.",
    "accused": [
      {
        "name": "Defendant 1",
        "signature": null
      },
      {
        "name": "Defendant 2",
        "signature": null
      },
      {
        "name": "Defendant 3",
        "signature": null
      }
    ],
    "advocatesList": "A.AASHIK ALI.B.A.LL.B., (MS.3368/2022), V.VIJAYA KUMAR.B.A.LL.B., (MS.909/2022), S.SYED AHMED SHERIFF.B.A.LL.B., (MS.1270/2023)",
    "advocateAddress": "78/82, Semi Basement, Cheran Towers, Coimbatore-18",
    "executionDay": "30",
    "executionMonth": "December",
    "executionYear": "2025",
    "advocateCity": "Coimbatore",
    "advocatePhone": "93444 84069",
    "advocateEmail": "aashiqalf12@gmail.com",
    "vakalathnamaTitleLine1": "VAKALATHNAMA FOR",
    "vakalathnamaTitleLine2": "THE DEFENDANTS 1,2,3",
    "advocateAddressLine1": "78/82, Semi Basement,",
    "advocateAddressLine2": "Govt. Arts College Road,",
    "advocateAddressLine3": "Cheran Towers,"
  }
}
```

**Expected Response:**
- Content-Type: `text/html; charset=utf-8`
- Returns rendered HTML document
- You can "Send and Download" to save as HTML file
- Or copy the response and paste into a .html file to view in browser

---

### 5. Render Template (PDF) - Template 2
**POST** `http://localhost:6000/api/templates/render`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "templateId": 2,
  "format": "pdf",
  "formData": {
    "tribunalLocation": "COIMBATORE",
    "oaNumber": "182",
    "oaYear": "2025",
    "applicantName": "INDIAN BANK",
    "applicantBranch": "RAMNAGAR BRANCH",
    "applicantAddress": "COIMBATORE - 641 062.",
    "accused": [
      {
        "name": "Defendant 1"
      },
      {
        "name": "Defendant 2"
      },
      {
        "name": "Defendant 3"
      }
    ],
    "advocatesList": "A.AASHIK ALI.B.A.LL.B., (MS.3368/2022), V.VIJAYA KUMAR.B.A.LL.B., (MS.909/2022), S.SYED AHMED SHERIFF.B.A.LL.B., (MS.1270/2023)",
    "advocateAddress": "78/82, Semi Basement, Cheran Towers, Coimbatore-18",
    "executionDay": "30",
    "executionMonth": "December",
    "executionYear": "2025",
    "advocateCity": "Coimbatore",
    "advocatePhone": "93444 84069",
    "advocateEmail": "aashiqalf12@gmail.com",
    "vakalathnamaTitleLine1": "VAKALATHNAMA FOR",
    "vakalathnamaTitleLine2": "THE DEFENDANTS 1,2,3",
    "advocateAddressLine1": "78/82, Semi Basement,",
    "advocateAddressLine2": "Govt. Arts College Road,",
    "advocateAddressLine3": "Cheran Towers,"
  }
}
```

**Expected Response:**
- Content-Type: `application/pdf`
- Returns PDF file
- In Postman: Click "Send and Download" to save PDF file
- The PDF will be downloaded automatically

---

### 6. Render Template (HTML) - Template 1 (Section 355)
**POST** `http://localhost:6000/api/templates/render`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "templateId": 1,
  "format": "html",
  "formData": {
    "caseNumber": "S.C.No. 325 of 2025",
    "courtName": "COIMBATORE",
    "accused": [
      {
        "name": "SANJEEVKUMAR",
        "AccusedName": "SANJEEVKUMAR"
      },
      {
        "name": "ASWINKUMAR",
        "AccusedName": "ASWINKUMAR"
      }
    ],
    "respondentName": "INSPECTOR OF POLICE,",
    "respondentStation": "PERIYANAIKENPALAYAM POLICE STATION,",
    "respondentAddress": "COIMBATORE.",
    "sectionNumber": "355(1)",
    "point1": "The Petitioners /Accused case is posted today.",
    "point2": "The Petitioners/Accused could not able to attend the Hon'ble Court today A2 got leg injury and A3 due his illness.",
    "point3": "The Petitioners will be regular in all upcoming hearings.",
    "point4": "This absence is neither wanton nor willful.",
    "prayer": "to condone the absence of the petitioner/accused and to proceed the case with that of his counsel",
    "place": "Coimbatore",
    "executionDay": "30",
    "executionMonth": "December",
    "executionYear": "2025",
    "hearingDate": "30/12/2025",
    "advocateName": "G.JANARTHANAN.BCom.LLB.",
    "advocateAddress": "78/82, Semi Basement, Govt. Arts College Road, Cheran Towers, Coimbatore – 641 018.",
    "advocatePhone": "93444 84069",
    "courtFullName": "PRINCIPAL DISTRICT AND SESSIONS JUDGE OF COIMBATORE",
    "addressSection": true,
    "lawyerSignatureBase64": "data:image/png;base64,iVBORw0KG..." 
  }
}
```

**For PDF format:**
Change `"format": "html"` to `"format": "pdf"` and use "Send and Download" in Postman.

**Template 1 Required Fields:**
- `caseNumber` - Case number (e.g., "S.C.No. 325 of 2025")
- `courtName` - Court name (e.g., "COIMBATORE")
- `accused` - Array of accused names
- `respondentName` - Respondent name
- `respondentAddress` - Respondent address
- `sectionNumber` - Section number (default: "355(1)")
- `point1`, `point2`, `point3`, `point4` - Four petition points
- `prayer` - Prayer text
- `place` - Place name
- `executionDay`, `executionMonth`, `executionYear` - Date components
- `hearingDate` - Hearing date (DD/MM/YYYY format)
- `advocateName`, `advocateAddress`, `advocatePhone` - Advocate details
- `lawyerSignatureBase64` - Optional: Base64 signature image
- `addressSection` - Boolean: Show/hide address section (default: true)

---

### 7. Preview Template in Browser (GET)
**GET** `http://localhost:6000/api/templates/render/2`

Opens template with default data in browser.

**With Query Parameters:**
**GET** `http://localhost:6000/api/templates/render/2?formData={"oaNumber":"182","oaYear":"2025"}`

---

## Postman Collection Setup

### Creating a Postman Collection:

1. **Create New Collection**: "Template Server API"

2. **Add Environment Variables** (optional):
   - `base_url`: `http://localhost:6000`

3. **Add Requests:**

   **Request 1: Health Check**
   - Method: GET
   - URL: `{{base_url}}/health`

   **Request 2: Get All Templates**
   - Method: GET
   - URL: `{{base_url}}/api/templates`

   **Request 3: Render Template HTML**
   - Method: POST
   - URL: `{{base_url}}/api/templates/render`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON): Use the JSON examples above

   **Request 4: Render Template PDF**
   - Method: POST
   - URL: `{{base_url}}/api/templates/render`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON): Same as HTML but with `"format": "pdf"`
   - **Important**: Use "Send and Download" option to save PDF

---

## Testing Tips

1. **For HTML responses:**
   - Copy the response body
   - Save as `.html` file
   - Open in browser to see rendered template

2. **For PDF responses:**
   - Use "Send and Download" button in Postman
   - PDF will be saved to your Downloads folder
   - Open with any PDF viewer

3. **Error Testing:**
   - Try invalid templateId (e.g., 999) - should return 404
   - Try missing templateId - should return 400
   - Try invalid JSON - should return 400

4. **View Response in Postman:**
   - HTML: Click "Preview" tab in Postman to see rendered HTML
   - PDF: Use "Send and Download" to view PDF

---

## Common Issues

1. **Server not running:**
   - Error: "ECONNREFUSED"
   - Solution: Start server with `npm start`

2. **PDF generation fails:**
   - Error: "Failed to launch browser"
   - Solution: Puppeteer needs Chrome/Chromium. Install dependencies properly.

3. **CORS errors:**
   - The server has CORS enabled for all origins, so this shouldn't be an issue

4. **Invalid template data:**
   - Check that formData matches the expected structure
   - Missing fields will use default values

