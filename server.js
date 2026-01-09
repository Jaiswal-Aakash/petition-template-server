import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

dotenv.config();

// Register Handlebars helpers
// Note: Handlebars has built-in helpers for 'if', 'unless', 'each', 'with', 'lookup'
// We only register custom helpers here

Handlebars.registerHelper('inc', function(value) {
  // Increment value by 1 (for @index which is 0-based)
  // Handle both number and string inputs
  if (value === null || value === undefined) {
    return 1;
  }
  if (typeof value === 'number') {
    return value + 1;
  }
  if (typeof value === 'string') {
    const num = parseInt(value);
    return isNaN(num) ? 1 : num + 1;
  }
  const num = parseInt(value);
  return isNaN(num) ? 1 : num + 1;
});

Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

const app = express();
const PORT = process.env.PORT || 6000;

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for template server
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Templates data
const templates = [
  {
    PetTemMasId: 1,
    PetitionNumber: "TEMP-001",
    PetitionName: "Petition under Section 355(1) - Absence Condonation",
    TemplateType: "HTML",
    IsActive: true,
    TemplateContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.8;
      margin: 40px;
      color: #000;
      text-align: justify;
    }
    .court-header {
      text-align: center;
      font-weight: bold;
      margin-bottom: 30px;
    }
    .case-number {
      text-align: center;
      margin-bottom: 20px;
      font-weight: bold;
    }
    .parties {
      margin-bottom: 30px;
    }
    .petitioner {
      margin-bottom: 15px;
    }
    .vs {
      text-align: center;
      margin: 15px 0;
      font-weight: bold;
    }
    .respondent {
      margin-bottom: 20px;
    }
    .section-title {
      text-align: center;
      font-weight: bold;
      margin: 30px 0 20px 0;
      text-transform: uppercase;
    }
    .petition-body {
      margin-bottom: 30px;
    }
    .petition-point {
      margin-bottom: 15px;
      text-indent: 30px;
    }
    .prayer {
      margin-top: 30px;
      margin-bottom: 20px;
    }
    .prayer-text {
      text-indent: 30px;
    }
    .date-place {
      margin-top: 40px;
      text-align: center;
    }
    .signature-section {
      margin-top: 60px;
      text-align: right;
    }
    .signature-image {
      max-width: 200px;
      max-height: 80px;
      margin-bottom: 5px;
    }
    .address-section {
      margin-top: 40px;
      border-top: none;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="court-header">
    IN THE COURT OF THE HON'BLE PRINCIPAL DISTRICT JUDGE OF {{courtName}}
  </div>

  <div class="case-number">
    {{caseNumber}}
  </div>

  <div class="parties">
    <div class="petitioner" style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        {{#each petitionerNamesArray}}
        <strong>{{this}}</strong><br>
        {{/each}}
      </div>
      <div style="text-align: right; margin-left: 20px;">
        ...PETITIONER/ACCUSED
      </div>
    </div>
    
    <div class="vs">-VS-</div>
    
    <div class="respondent" style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div style="white-space: normal;">
        <strong>{{respondentName}}</strong><br>
        {{{respondentAddress}}}
      </div>
      <div style="text-align: right; margin-left: 20px;">
        ...RESPONDENT/COMPLAINANT
      </div>
    </div>
  </div>

  <div class="section-title" style="text-decoration: underline;">
    PETITION UNDER SECTION {{sectionNumber}} OF THE B.N.S.S.
  </div>

  <div class="petition-body">
    {{#if petitionPoints}}
      {{#each petitionPoints}}
        <div class="petition-point">{{this}}</div>
      {{/each}}
    {{else}}
      {{#if point1}}<div class="petition-point">1. {{point1}}</div>{{/if}}
      {{#if point2}}<div class="petition-point">2. {{point2}}</div>{{/if}}
      {{#if point3}}<div class="petition-point">3. {{point3}}</div>{{/if}}
      {{#if point4}}<div class="petition-point">4. {{point4}}</div>{{/if}}
    {{/if}}
  </div>

  <div class="prayer">
    <div style="text-indent: 60px;">It is therefore prayed that this Honourable Court may be pleased to {{prayerText}} and thus render justice.</div>
  </div>

  <div class="date-place" style="text-align: center;">
    Dated this {{day}} day {{month}} {{year}} at {{place}}.
  </div>

  <div style="margin-top: 80px; text-align: right;">
    <strong>ADVOCATE FOR PETITIONER/ACCUSED</strong>
  </div>

  {{#if lawyerSignaturePath}}
  <div class="signature-section" style="margin-top: 20px; text-align: right;">
    <img src="{{lawyerSignaturePath}}" alt="Lawyer Signature" class="signature-image" />
  </div>
  {{/if}}

  {{#if addressSection}}
  <div class="address-section">
    <div style="text-align: right; line-height: 1.4;">
      <div style="margin-bottom: 0;">IN THE COURT OF THE</div>
      <div style="margin-bottom: 0;">PRINCIPAL DISTRICT AND</div>
      <div style="margin-bottom: 0;">SESSIONS JUDGE OF</div>
      <div style="margin-bottom: 0;">{{courtName}}</div>
    </div>
    <div style="text-align: right; margin-top: 20px; margin-bottom: 20px;">{{caseNumber}}</div>
    <div style="text-align: right; margin-bottom: 15px;">
      <div style="margin-bottom: 10px;"><strong><u>PETITIONER/ACCUSED</u></strong></div>
      {{#each petitionerNamesArray}}
      <div>{{this}}</div>
      {{/each}}
    </div>
    <div class="vs" style="text-align: right; margin: 15px 0; padding-right: 40px;">-VS-</div>
    <div style="text-align: right; margin-top: 15px; margin-bottom: 20px;">
      <div style="margin-bottom: 10px;"><strong><u>RESPONDENT/COMPLAINANT</u></strong></div>
      <div>{{respondentName}}</div>
      <div>{{{respondentAddress}}}</div>
    </div>
    <div style="text-align: right; font-weight: bold; margin: 30px 0 20px 0; text-transform: uppercase; text-decoration: underline;">
      PETITION UNDER SECTION<br>
      {{sectionNumber}} OF THE B.N.S.S.
    </div>
    <div style="margin-top: 20px; text-align: right;">
      <strong>Pre-on: {{hearingDate}}</strong>
    </div>
    <div style="border: none; margin-top: 40px; text-align: right;">
      <div style="margin-bottom: 15px;"><strong>ADDRESS FOR SERVICE:</strong></div>
      <div>{{advocateName}}</div>
      <div>ADVOCATE,</div>
      {{#if advocateAddressLine1}}<div>{{advocateAddressLine1}}</div>{{/if}}
      {{#if advocateAddressLine2}}<div>{{advocateAddressLine2}}</div>{{/if}}
      {{#if advocateAddressLine3}}<div>{{advocateAddressLine3}}</div>{{/if}}
      {{#if advocateCity}}<div>{{advocateCity}}</div>{{/if}}
      <div>Ph. {{advocatePhone}}.</div>
    </div>
  </div>
  {{/if}}
</body>
</html>`,
    CreatedDate: new Date().toISOString(),
    UpdatedDate: new Date().toISOString()
  },
  {
    PetTemMasId: 2,
    PetitionNumber: "TEMP-002",
    PetitionName: "Vakalathnama - Power of Attorney",
    TemplateType: "HTML",
    IsActive: true,
    TemplateContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.5;
      margin: 40px;
      color: #000;
      text-align: left;
    }
    p {
      margin: 0;
      padding: 0;
      margin-bottom: 0;
      line-height: 1.5;
    }
    .tribunal-header {
      text-align: center;
      font-weight: bold;
      margin-bottom: 15px;
      font-size: 13pt;
    }
    .tribunal-header-line1 {
      margin-bottom: 5px;
    }
    .tribunal-header-line2 {
      margin-bottom: 5px;
    }
    .tribunal-header-line3 {
      margin-bottom: 20px;
    }
    .case-number {
      text-align: center;
      margin-bottom: 25px;
      font-weight: bold;
      font-size: 12pt;
    }
    .applicant-section {
      margin-bottom: 15px;
      text-align: left;
    }
    .applicant-label {
      text-align: right;
      font-weight: bold;
      margin-top: 10px;
    }
    .defendants-section {
      margin-bottom: 20px;
      text-align: left;
    }
    .defendants-label {
      text-align: right;
      font-weight: bold;
      margin-top: 10px;
    }
    .vs {
      text-align: center;
      margin: 15px 0;
      font-weight: bold;
      font-size: 12pt;
    }
        .vakalathnama-title {
            text-align: center;
            font-weight: bold;
            margin: 10px 0 5px 0;
            font-size: 13pt;
            text-decoration: underline;
            line-height: 1.2;
            page-break-after: avoid;
        }
        .vakalathnama-body {
            margin-top: 0;
            margin-bottom: 20px;
            text-align: justify;
            line-height: 1.5;
            word-spacing: -0.1em;
            page-break-after: avoid;
        }
        .vakalathnama-body p {
            margin: 0;
            padding: 0;
            text-indent: 6em;
            line-height: 1.5;
        }
    .advocates-list {
      margin: 15px 0;
      line-height: 2;
    }
    .advocate-item {
      margin-bottom: 8px;
    }
    .advocate-address {
      margin-top: 15px;
      margin-bottom: 20px;
    }
    .powers-list {
      margin: 20px 0;
      text-align: justify;
    }
    .power-item {
      margin-bottom: 12px;
      text-indent: 0;
    }
    .execution-section {
      margin-top: 20px;
      margin-bottom: 15px;
      page-break-after: avoid;
    }
    .execution-date {
      margin-bottom: 10px;
    }
    .signature-section {
      margin-top: 30px;
      margin-bottom: 20px;
    }
    .signature-image {
      max-width: 200px;
      max-height: 100px;
      margin-bottom: 10px;
    }
    .defendant-signature {
      margin-bottom: 15px;
    }
    .advocate-signature {
      margin-top: 15px;
      margin-bottom: 10px;
      text-align: left;
      page-break-after: always;
    }
    .address-for-service {
      margin-top: 0;
      border-top: none;
      padding-top: 20px;
      page-break-before: always;
    }
    .address-for-service-title {
      font-weight: bold;
      text-decoration: underline;
      margin-bottom: 10px;
    }
    .address-lines {
      line-height: 1.8;
      margin-bottom: 5px;
    }
    .email {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="tribunal-header">
    <div class="tribunal-header-line1">BEFORE THE HONOURABLE DEBTS RECOVERY TRIBUNAL</div>
    <div class="tribunal-header-line3">{{tribunalLocation}}</div>
  </div>

  <div class="case-number">
    O.A.No: {{oaNumber}} OF {{oaYear}}
  </div>

  <div class="applicant-section">
    <div><strong>{{applicantName}}</strong></div>
    {{#if applicantBranch}}
    <div>{{applicantBranch}}</div>
    {{/if}}
    {{#if applicantAddress}}
    <div>{{applicantAddress}}</div>
    {{/if}}
    <div class="applicant-label">:: APPLICANT</div>
  </div>

  <div class="vs">-VS-</div>

  <div class="defendants-section">
    {{#if defendants}}
    {{#each defendants}}
    <div>{{this.number}}{{this.name}}</div>
    {{/each}}
    {{else}}
      <div style="color: #999; font-style: italic;">No defendants found. Please select a case with accused details.</div>
    {{/if}}
    <div class="defendants-label">:: DEFENDANTS</div>
  </div>

  <div class="vakalathnama-title">VAKALATHNAMA OF THE DEFENDANTS</div><div class="vakalathnama-body"><p>I/We the petitioner above named do hereby appoint and retain {{advocatesList}} Advocates, {{advocateAddress}} to appear, act, plead and argue for me/us in the above matter and to conduct, prosecute and/or defend the said case and all proceedings arising therefrom or connected therewith and to do all acts, deeds and things necessary for the purpose, including to appear, conduct, prosecute and/or defend the case and all proceedings connected therewith; to file, verify, sign and present all necessary applications, petitions, affidavits, statements, replies, rejoinders, written statements, counter claims and other documents; to represent me/us in all execution proceedings and to receive money, documents and other properties; to appear in all miscellaneous proceedings and interlocutory applications; to obtain return of documents and to receive certified copies of orders, judgments and other documents; to draw money from the Court/Tribunal and to give valid receipts and discharges for the same; and to accept service of notice for and on behalf of me/us in respect of any appeal, revision, review or any other proceedings that may be filed against the order/judgment passed in the above matter before its final disposal in this Honorable Court.</p></div>

  <div class="execution-section">
    {{#if defendantSignatures}}
    {{#with (lookup defendantSignatures 0)}}
    <div class="defendant-signature">
      {{#if this.signaturePath}}
      <img src="{{this.signaturePath}}" alt="Defendant Signature" class="signature-image" />
      {{/if}}
    </div>
    {{/with}}
    {{/if}}

    <div class="execution-date" style="white-space: nowrap; text-align: center;">
      Executed before me this the {{executionDay}} Day of {{executionMonth}} {{executionYear}}
    </div>
  </div>

  <div class="advocate-signature" style="text-align: center;">
    {{#if advocateSignaturePath}}
    <img src="{{advocateSignaturePath}}" alt="Advocate Signature" class="signature-image" style="display: block; margin: 0 auto;" />
    {{/if}}
    <div style="text-align: center; margin-top: 15px;">Advocate, {{advocateCity}}</div>
  </div>

  <div class="address-for-service" style="text-align: right;">
    <div style="margin-bottom: 20px; text-align: right; line-height: 1.5;">
      <div>BEFORE THE</div>
      <div>HONOURABLE DEBTS</div>
      <div>RECOVERY TRIBUNAL</div>
      <div>{{tribunalLocation}}</div>
    </div>
    <div style="margin-bottom: 20px; text-align: right; line-height: 1.5; white-space: nowrap;">
      O.A.No: {{oaNumber}} OF {{oaYear}}
    </div>
    
    <!-- Gap -->
    <div style="margin-bottom: 40px;"></div>
    <div style="margin-bottom: 40px;"></div>
    
    <!-- VAKALATHNAMA FOR THE DEFENDANTS -->
    <div style="margin-bottom: 20px; text-align: right;">
      <div style="margin-bottom: 5px;">{{vakalathnamaTitleLine1}}</div>
      <div>{{vakalathnamaTitleLine2}}</div>
    </div>
    
    <!-- Signature Field -->
    {{#if vakalathnamaSignature}}
    <div style="margin-top: 30px; margin-bottom: 30px; text-align: right;">
      <img src="{{vakalathnamaSignature}}" alt="Vakalathnama Signature" class="signature-image" style="display: block; margin-left: auto; max-width: 400px; max-height: 150px;" />
    </div>
    {{/if}}
    
    <!-- Gap -->
    <div style="margin-bottom: 40px;"></div>
    <div style="margin-bottom: 40px;"></div>
    
    <!-- PRESENTED ON -->
    <div style="margin-bottom: 20px; text-align: right;">
      <div style="margin-bottom: 10px;">PRESENTED ON:</div>
      <div style="margin-bottom: 40px;"></div>
      <div style="margin-bottom: 40px;"></div>
    </div>
    
    <div class="address-for-service-title">ADDRESS FOR SERVICE:</div>
    {{#each advocates}}
    <div class="address-lines">{{this.name}},</div>
    {{/each}}
    <div class="address-lines">ADVOCATES,</div>
    <div class="address-lines">{{advocateAddressLine1}},</div>
    {{#if advocateAddressLine2}}
    <div class="address-lines">{{advocateAddressLine2}},</div>
    {{/if}}
    {{#if advocateAddressLine3}}
    <div class="address-lines">{{advocateAddressLine3}},</div>
    {{/if}}
    <div class="address-lines">{{advocateCity}}.</div>
    <div class="address-lines">Ph. {{advocatePhone}}</div>
    {{#if advocateEmail}}
    <div class="address-lines email">{{advocateEmail}}</div>
    {{/if}}
  </div>
</body>
</html>`,
    CreatedDate: new Date().toISOString(),
    UpdatedDate: new Date().toISOString()
  }
];

// GET all templates
app.get('/api/templates', (req, res) => {
  try {
    const activeTemplates = templates.filter(t => t.IsActive);
    res.json({
      success: true,
      data: activeTemplates,
      count: activeTemplates.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates',
      details: error.message
    });
  }
});

// GET template by ID
app.get('/api/templates/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const template = templates.find(t => t.PetTemMasId === id && t.IsActive);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }
    
    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch template',
      details: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Template server is running',
    templatesCount: templates.filter(t => t.IsActive).length
  });
});

// Helper function to format case number from "SC0002" to "S.C.No. 325 of 2025"
function formatCaseNumber(caseNumber, caseNumberField = null) {
  if (!caseNumber || typeof caseNumber !== 'string') {
    // If caseNumberField is provided (separate case number), use it
    if (caseNumberField && typeof caseNumberField === 'string' && caseNumberField.trim()) {
      const num = parseInt(caseNumberField.trim());
      if (!isNaN(num)) {
        const currentYear = new Date().getFullYear();
        return `S.C.No. ${num} of ${currentYear}`;
      }
    }
    return '';
  }
  
  // Remove any whitespace
  const cleaned = caseNumber.trim();
  
  // If already in format "S.C.No. 325 of 2025", return as is
  if (cleaned.includes('S.C.No.') || cleaned.includes('S.C. No.')) {
    return cleaned;
  }
  
  // Try to parse formats like "SC0002", "SC002", "SC2", etc.
  // Extract number part after "SC" (case insensitive)
  const match = cleaned.match(/^SC\s*0*(\d+)$/i);
  if (match) {
    // Remove leading zeros from the number
    const number = parseInt(match[1]);
    const currentYear = new Date().getFullYear();
    return `S.C.No. ${number} of ${currentYear}`;
  }
  
  // If it's just a number (with or without leading zeros), use it directly
  const numMatch = cleaned.match(/^0*(\d+)$/);
  if (numMatch) {
    const number = parseInt(numMatch[1]);
    const currentYear = new Date().getFullYear();
    return `S.C.No. ${number} of ${currentYear}`;
  }
  
  // If no match, return original
  return cleaned;
}

// Helper function to prepare template data from Flutter request
function prepareTemplateDataForFlutter(formData, templateId) {
  const data = {
    // Common fields
    // Format case number: if case_number is provided separately, use it; otherwise format scNo
    caseNumber: formatCaseNumber(
      formData.caseNumber || formData.SCNo || '', 
      formData.case_number || null
    ),
    courtName: formData.courtName || 'COIMBATORE',
    
    // Date formatting
    day: formData.executionDay || new Date().getDate().toString(),
    month: formData.executionMonth || new Date().toLocaleString('default', { month: 'long' }),
    year: formData.executionYear || new Date().getFullYear().toString(),
    
    // Advocate info
    advocateName: formData.advocateName || formData.lawyerName || '',
    advocateAddress: formData.advocateAddress || '',
    advocateCity: formData.advocateCity || 'Coimbatore',
    advocatePhone: formData.advocatePhone || '',
    advocateEmail: formData.advocateEmail || '',
    
    // Signatures (base64 data URIs)
    lawyerSignaturePath: formData.lawyerSignatureBase64 || formData.advocateSignature || null,
    advocateSignaturePath: formData.advocateSignature || formData.lawyerSignatureBase64 || null,
  };

  // Template 1 specific fields
  if (templateId === 1) {
    const accusedNames = Array.isArray(formData.accused) 
      ? formData.accused.map(acc => acc.name || acc.AccusedName).filter(Boolean).join(' – ')
      : '';
    
    const petitionerNamesArray = Array.isArray(formData.accused) 
      ? formData.accused.map((acc, index) => {
          const name = acc.name || acc.AccusedName;
          const designation = acc.designation || `A${index + 1}`;
          return `${name} – ${designation}`;
        }).filter(Boolean)
      : [];
    
    // Handle respondent address - avoid duplication
    let respondentAddress = '';
    if (formData.respondentAddress) {
      // If respondentAddress is already provided (and may include station), use it directly
      respondentAddress = formData.respondentAddress;
    } else if (formData.respondentStation) {
      // If only station is provided, use it with default location
      respondentAddress = formData.respondentStation + ' Coimbatore.';
    } else {
      // Default address
      respondentAddress = 'PERIYANAIKENPALAYAM POLICE<br>STATION,<br>Coimbatore.';
    }
    
    return {
      ...data,
      petitionerNames: accusedNames,
      petitionerNamesArray: petitionerNamesArray,
      respondentName: formData.respondentName || 'INSPECTOR OF POLICE,',
      respondentAddress: respondentAddress,
      sectionNumber: formData.sectionNumber || '355(1)',
      // Handle dynamic petition points array or individual points
      // Filter out empty/null/undefined points - only keep non-empty strings
      // Pre-number the points to avoid template issues
      petitionPoints: (() => {
        const allPoints = (formData.petitionPoints && Array.isArray(formData.petitionPoints) && formData.petitionPoints.length > 0)
          ? formData.petitionPoints.filter(p => p && typeof p === 'string' && p.trim() !== '')
          : [
              formData.point1,
              formData.point2,
              formData.point3,
              formData.point4
            ].filter(p => p && typeof p === 'string' && p.trim() !== '');
        // Pre-number the points: "1. point text", "2. point text", etc.
        return allPoints.map((point, index) => `${index + 1}. ${point}`);
      })(),
      point1: (formData.petitionPoints?.[0] && formData.petitionPoints[0].trim() !== '') ? formData.petitionPoints[0] : (formData.point1 || ''),
      point2: (formData.petitionPoints?.[1] && formData.petitionPoints[1].trim() !== '') ? formData.petitionPoints[1] : (formData.point2 || ''),
      point3: (formData.petitionPoints?.[2] && formData.petitionPoints[2].trim() !== '') ? formData.petitionPoints[2] : (formData.point3 || ''),
      point4: (formData.petitionPoints?.[3] && formData.petitionPoints[3].trim() !== '') ? formData.petitionPoints[3] : (formData.point4 || ''),
      prayerText: formData.prayer || '',
      place: formData.place || 'Coimbatore',
      hearingDate: formData.hearingDate || new Date().toLocaleDateString('en-GB'),
      courtFullName: formData.courtFullName || `PRINCIPAL DISTRICT AND SESSIONS JUDGE OF ${data.courtName}`,
      addressSection: formData.addressSection !== false,
      advocateAddressLine1: formData.advocateAddressLine1 || '78/82, Semi Basement,',
      advocateAddressLine2: formData.advocateAddressLine2 || 'Govt. Arts College Road,',
      advocateAddressLine3: formData.advocateAddressLine3 || 'Cheran Towers,',
    };
  }

  // Template 2 specific fields
  if (templateId === 2) {
    // Get defendants from formData - prioritize defendants array, then accused array
    let defendants = [];
    if (Array.isArray(formData.defendants) && formData.defendants.length > 0) {
      defendants = formData.defendants.map((acc, index) => ({
        number: `${index + 1}.`,
        name: acc.name || acc.AccusedName || `Defendant ${index + 1}`,
        signature: acc.signature || null
      }));
    } else if (Array.isArray(formData.accused) && formData.accused.length > 0) {
      defendants = formData.accused.map((acc, index) => ({
          number: `${index + 1}.`,
          name: acc.name || acc.AccusedName || `Defendant ${index + 1}`,
          signature: acc.signature || null
      }));
    }

    // Generate defendant numbers string (e.g., "1,2,3" or "1,2" or "1")
    // Only generate if there are actual defendants, otherwise leave empty
    const defendantNumbers = defendants.length > 0 
      ? defendants.map((_, index) => index + 1).join(',')
      : '';

    const defendantSignatures = defendants.map(def => ({
      signaturePath: def.signature || null
    }));

    return {
      ...data,
      tribunalLocation: formData.tribunalLocation || 'COIMBATORE',
      oaNumber: formData.oaNumber || '182',
      oaYear: formData.oaYear || new Date().getFullYear().toString(),
      applicantName: formData.applicantName || 'INDIAN BANK',
      applicantBranch: formData.applicantBranch || 'RAMNAGAR BRANCH',
      applicantAddress: formData.applicantAddress || 'COIMBATORE - 641 062.',
      defendants: defendants,
      defendantSignatures: defendantSignatures,
      defendantNumbers: defendantNumbers, // Add this for dynamic numbering
      advocates: formData.advocates || [
        { 
          name: formData.advocateName1 || formData.advocateName || 'A.AASHIK ALI.B.A.LL.B.', 
          enrollmentNumber: formData.advocateEnrollment1 || 'MS.3368/2022' 
        }
      ],
      advocatesList: formData.advocatesList || 'A.AASHIK ALI.B.A.LL.B., (MS.3368/2022), V.VIJAYA KUMAR.B.A.LL.B., (MS.909/2022), S.SYED AHMED SHERIFF.B.A.LL.B., (MS.1270/2023)',
      executionDay: formData.executionDay || new Date().getDate().toString(),
      executionMonth: formData.executionMonth || new Date().toLocaleString('default', { month: 'long' }),
      executionYear: formData.executionYear || new Date().getFullYear().toString(),
      advocateAddressLine1: formData.advocateAddressLine1 || '78/82, Semi Basement,',
      advocateAddressLine2: formData.advocateAddressLine2 || 'Govt. Arts College Road,',
      advocateAddressLine3: formData.advocateAddressLine3 || 'Cheran Towers,',
      // Auto-generate Vakalathnama title lines (same for all, only defendant numbers change)
      // Only show defendant numbers if there are actual defendants
      vakalathnamaTitleLine1: 'VAKALATHNAMA FOR', // Always the same
      vakalathnamaTitleLine2: defendantNumbers 
        ? `THE DEFENDANTS ${defendantNumbers}` 
        : 'THE DEFENDANTS', // Show without numbers if no defendants
      vakalathnamaSignature: formData.vakalathnamaSignature || null,
    };
  }

  return data;
}

// POST /api/templates/render - Render template with provided data (for Flutter)
app.post('/api/templates/render', async (req, res) => {
  try {
    const { templateId, formData, format = 'html' } = req.body;

    if (!templateId) {
      return res.status(400).json({
        success: false,
        error: 'Template ID is required'
      });
    }

    // Find template
    const template = templates.find(t => t.PetTemMasId === parseInt(templateId) && t.IsActive);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    // Prepare template data
    const templateData = prepareTemplateDataForFlutter(formData || {}, parseInt(templateId));

    // Compile and render template
    const compiledTemplate = Handlebars.compile(template.TemplateContent);
    const renderedHTML = compiledTemplate(templateData);

    // Return HTML or generate PDF
    if (format === 'pdf') {
      try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setContent(renderedHTML, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
          preferCSSPageSize: true,
          displayHeaderFooter: false
        });
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="petition.pdf"');
        res.send(pdfBuffer);
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        res.status(500).json({
          success: false,
          error: 'Failed to generate PDF',
          details: pdfError.message
        });
      }
    } else {
      // Return HTML
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(renderedHTML);
    }
  } catch (error) {
    console.error('Template render error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to render template',
      details: error.message
    });
  }
});

// GET /api/templates/render/:id - Render template as HTML (for preview in browser)
app.get('/api/templates/render/:id', async (req, res) => {
  try {
    const templateId = parseInt(req.params.id);
    const queryData = req.query;
    
    // Parse formData from query string if provided
    let formData = {};
    if (queryData.formData) {
      try {
        formData = JSON.parse(decodeURIComponent(queryData.formData));
      } catch (e) {
        console.warn('Failed to parse formData from query:', e);
      }
    }

    const template = templates.find(t => t.PetTemMasId === templateId && t.IsActive);
    
    if (!template) {
      return res.status(404).send('<html><body><h1>Template not found</h1></body></html>');
    }

    const templateData = prepareTemplateDataForFlutter(formData, templateId);
    const compiledTemplate = Handlebars.compile(template.TemplateContent);
    const renderedHTML = compiledTemplate(templateData);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderedHTML);
  } catch (error) {
    console.error('Template render error:', error);
    res.status(500).send(`<html><body><h1>Error rendering template</h1><p>${error.message}</p></body></html>`);
  }
});

app.listen(PORT, () => {
  console.log(`Template Server running on port ${PORT}`);
  console.log(`Templates API: http://localhost:${PORT}/api/templates`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Render endpoint: POST http://localhost:${PORT}/api/templates/render`);
  console.log(`Available templates: ${templates.filter(t => t.IsActive).length}`);
});

