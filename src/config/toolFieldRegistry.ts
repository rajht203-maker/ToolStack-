/**
 * SINGLE SOURCE OF TRUTH FOR ALL TOOL FIELD CONFIGURATIONS
 * 
 * Strict Rule:
 * For every tool, the fields shown to the user, the fields mentioned in "How to Work",
 * the preview card, and the fields actually drawn in the generated PDF/document
 * MUST come from this exact same configuration.
 */

export interface ToolFieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'select';
  required: boolean;
  defaultValue?: string;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

export interface ToolFieldSchema {
  toolId: string;
  docType: 'certificate' | 'payslip' | 'agreement' | 'voucher' | 'letter' | 'receipt' | 'document' | 'form' | 'sheet' | 'template' | 'card';
  docTitle: string;
  fields: ToolFieldDefinition[];
  defaultNotes?: string;
}

/**
 * Registry of all independent tool field schemas.
 * Every tool defines ONLY the fields it genuinely needs.
 * NO unsolicited generic fields (ID, address, bank account, PAN, etc.).
 */
export const TOOL_FIELD_REGISTRY: Record<string, ToolFieldSchema> = {
  // 1. SALARY CERTIFICATE / PAYSLIP GENERATOR
  'pdf-salary-slip-payslip-generator': {
    toolId: 'pdf-salary-slip-payslip-generator',
    docType: 'certificate',
    docTitle: 'Salary Certificate & Payslip Voucher',
    fields: [
      {
        name: 'employeeName',
        label: 'Employee Name',
        type: 'text',
        required: true,
        defaultValue: 'Rahul Sharma',
        placeholder: 'e.g. Rahul Sharma'
      },
      {
        name: 'salaryAmount',
        label: 'Salary Amount',
        type: 'text',
        required: true,
        defaultValue: '65,000',
        placeholder: 'e.g. 65,000'
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      },
      {
        name: 'organization',
        label: 'Organization',
        type: 'text',
        required: true,
        defaultValue: 'Global Tech Solutions Pvt. Ltd.',
        placeholder: 'e.g. Global Tech Solutions Pvt. Ltd.'
      }
    ]
  },

  // 2. EMPLOYEE RELIEVING & EXPERIENCE CERTIFICATE
  'pdf-experience-relieving-letter': {
    toolId: 'pdf-experience-relieving-letter',
    docType: 'certificate',
    docTitle: 'Experience & Service Certificate',
    fields: [
      {
        name: 'employeeName',
        label: 'Employee Name',
        type: 'text',
        required: true,
        defaultValue: 'Rahul Sharma',
        placeholder: 'e.g. Rahul Sharma'
      },
      {
        name: 'designation',
        label: 'Designation / Role',
        type: 'text',
        required: true,
        defaultValue: 'Senior Software Engineer',
        placeholder: 'e.g. Senior Software Engineer'
      },
      {
        name: 'organization',
        label: 'Organization',
        type: 'text',
        required: true,
        defaultValue: 'Global Tech Solutions Pvt. Ltd.',
        placeholder: 'e.g. Global Tech Solutions Pvt. Ltd.'
      },
      {
        name: 'servicePeriod',
        label: 'Service Period',
        type: 'text',
        required: true,
        defaultValue: 'January 2022 - September 2026',
        placeholder: 'e.g. January 2022 - September 2026'
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 3. RESIDENTIAL & COMMERCIAL RENT AGREEMENT
  'pdf-rent-agreement-pro-maker': {
    toolId: 'pdf-rent-agreement-pro-maker',
    docType: 'agreement',
    docTitle: 'Tenancy & Rent Agreement',
    fields: [
      {
        name: 'landlordName',
        label: 'Landlord Name',
        type: 'text',
        required: true,
        defaultValue: 'Ramesh Chandra Sharma',
        placeholder: 'e.g. Ramesh Chandra Sharma'
      },
      {
        name: 'tenantName',
        label: 'Tenant Name',
        type: 'text',
        required: true,
        defaultValue: 'Vikram Malhotra',
        placeholder: 'e.g. Vikram Malhotra'
      },
      {
        name: 'monthlyRent',
        label: 'Monthly Rent',
        type: 'text',
        required: true,
        defaultValue: '28,000',
        placeholder: 'e.g. 28,000'
      },
      {
        name: 'propertyAddress',
        label: 'Property Address',
        type: 'text',
        required: true,
        defaultValue: 'Flat 402, Royal Palms Heights, Sector 18',
        placeholder: 'e.g. Flat 402, Royal Palms Heights'
      },
      {
        name: 'date',
        label: 'Agreement Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 4. PROMISSORY NOTE & DEBT ACKNOWLEDGMENT
  'pdf-promissory-note-builder': {
    toolId: 'pdf-promissory-note-builder',
    docType: 'agreement',
    docTitle: 'Promissory Note & Debt Acknowledgment',
    fields: [
      {
        name: 'borrowerName',
        label: 'Borrower Name',
        type: 'text',
        required: true,
        defaultValue: 'Amit Verma',
        placeholder: 'e.g. Amit Verma'
      },
      {
        name: 'lenderName',
        label: 'Lender Name',
        type: 'text',
        required: true,
        defaultValue: 'Karan Kapoor',
        placeholder: 'e.g. Karan Kapoor'
      },
      {
        name: 'principalAmount',
        label: 'Principal Amount',
        type: 'text',
        required: true,
        defaultValue: '150,000',
        placeholder: 'e.g. 150,000'
      },
      {
        name: 'dueDate',
        label: 'Payment Due Date',
        type: 'date',
        required: true,
        defaultValue: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
      },
      {
        name: 'date',
        label: 'Execution Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 5. MUTUAL NON-DISCLOSURE AGREEMENT (NDA)
  'pdf-nda-confidentiality-agreement': {
    toolId: 'pdf-nda-confidentiality-agreement',
    docType: 'agreement',
    docTitle: 'Mutual Non-Disclosure Agreement',
    fields: [
      {
        name: 'disclosingParty',
        label: 'Disclosing Party',
        type: 'text',
        required: true,
        defaultValue: 'Alpha Technologies Inc.',
        placeholder: 'e.g. Alpha Technologies Inc.'
      },
      {
        name: 'receivingParty',
        label: 'Receiving Party',
        type: 'text',
        required: true,
        defaultValue: 'Beta Solutions LLC',
        placeholder: 'e.g. Beta Solutions LLC'
      },
      {
        name: 'purpose',
        label: 'Purpose of Disclosure',
        type: 'text',
        required: true,
        defaultValue: 'Evaluating potential joint venture and software licensing',
        placeholder: 'e.g. Software collaboration evaluation'
      },
      {
        name: 'date',
        label: 'Effective Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 6. FREELANCE MASTER SERVICE AGREEMENT & CONTRACT
  'pdf-nda-freelance-contract': {
    toolId: 'pdf-nda-freelance-contract',
    docType: 'agreement',
    docTitle: 'Freelance Master Service Agreement',
    fields: [
      {
        name: 'clientName',
        label: 'Client Name',
        type: 'text',
        required: true,
        defaultValue: 'Nexus Media Group',
        placeholder: 'e.g. Nexus Media Group'
      },
      {
        name: 'freelancerName',
        label: 'Freelancer Name',
        type: 'text',
        required: true,
        defaultValue: 'Rahul Sharma',
        placeholder: 'e.g. Rahul Sharma'
      },
      {
        name: 'projectScope',
        label: 'Project Scope',
        type: 'text',
        required: true,
        defaultValue: 'Full-stack web application development and UI design',
        placeholder: 'e.g. Full-stack development'
      },
      {
        name: 'compensation',
        label: 'Project Compensation',
        type: 'text',
        required: true,
        defaultValue: '4,500 USD',
        placeholder: 'e.g. 4,500 USD'
      },
      {
        name: 'date',
        label: 'Agreement Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 7. EMPLOYMENT OFFER LETTER & APPOINTMENT ORDER
  'pdf-offer-letter-appointment': {
    toolId: 'pdf-offer-letter-appointment',
    docType: 'letter',
    docTitle: 'Employment Offer Letter & Appointment',
    fields: [
      {
        name: 'candidateName',
        label: 'Candidate Name',
        type: 'text',
        required: true,
        defaultValue: 'Ananya Deshmukh',
        placeholder: 'e.g. Ananya Deshmukh'
      },
      {
        name: 'jobTitle',
        label: 'Job Title',
        type: 'text',
        required: true,
        defaultValue: 'Staff Software Engineer',
        placeholder: 'e.g. Staff Software Engineer'
      },
      {
        name: 'organization',
        label: 'Organization',
        type: 'text',
        required: true,
        defaultValue: 'Vanguard Systems Corp.',
        placeholder: 'e.g. Vanguard Systems Corp.'
      },
      {
        name: 'salary',
        label: 'Annual Salary',
        type: 'text',
        required: true,
        defaultValue: '120,000 USD',
        placeholder: 'e.g. 120,000 USD'
      },
      {
        name: 'startDate',
        label: 'Joining Date',
        type: 'date',
        required: true,
        defaultValue: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
      }
    ]
  },

  // 8. BUSINESS QUOTATION & ESTIMATE
  'pdf-quotation-estimate-maker': {
    toolId: 'pdf-quotation-estimate-maker',
    docType: 'document',
    docTitle: 'Business Quotation & Cost Estimate',
    fields: [
      {
        name: 'clientName',
        label: 'Client Name',
        type: 'text',
        required: true,
        defaultValue: 'Horizon Retail Ltd.',
        placeholder: 'e.g. Horizon Retail Ltd.'
      },
      {
        name: 'providerName',
        label: 'Provider Name',
        type: 'text',
        required: true,
        defaultValue: 'Apex Digital Studio',
        placeholder: 'e.g. Apex Digital Studio'
      },
      {
        name: 'scope',
        label: 'Work Description / Scope',
        type: 'text',
        required: true,
        defaultValue: 'E-commerce platform overhaul and mobile design',
        placeholder: 'e.g. Website development'
      },
      {
        name: 'totalAmount',
        label: 'Total Estimated Amount',
        type: 'text',
        required: true,
        defaultValue: '18,500',
        placeholder: 'e.g. 18,500'
      },
      {
        name: 'date',
        label: 'Quote Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 9. COMMERCIAL DELIVERY CHALLAN & GATE PASS
  'pdf-delivery-challan-generator': {
    toolId: 'pdf-delivery-challan-generator',
    docType: 'document',
    docTitle: 'Delivery Challan & Dispatch Gate Pass',
    fields: [
      {
        name: 'senderName',
        label: 'Sender Name',
        type: 'text',
        required: true,
        defaultValue: 'Precision Industrial Spares',
        placeholder: 'e.g. Precision Industrial Spares'
      },
      {
        name: 'recipientName',
        label: 'Recipient Name',
        type: 'text',
        required: true,
        defaultValue: 'Omni Manufacturing Works',
        placeholder: 'e.g. Omni Manufacturing Works'
      },
      {
        name: 'itemsDescription',
        label: 'Goods / Items Description',
        type: 'text',
        required: true,
        defaultValue: '24 Units Hydraulic High-Pressure Valves (Model HV-200)',
        placeholder: 'e.g. 24 Units Hardware Tools'
      },
      {
        name: 'date',
        label: 'Dispatch Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 10. FREIGHT CARGO BILL OF LADING & LOGISTICS MANIFEST
  'pdf-bill-of-lading-shipping-doc': {
    toolId: 'pdf-bill-of-lading-shipping-doc',
    docType: 'document',
    docTitle: 'Bill of Lading & Shipping Manifest',
    fields: [
      {
        name: 'shipperName',
        label: 'Shipper Name',
        type: 'text',
        required: true,
        defaultValue: 'Global Trans-Freight Logistics',
        placeholder: 'e.g. Global Trans-Freight Logistics'
      },
      {
        name: 'consigneeName',
        label: 'Consignee Name',
        type: 'text',
        required: true,
        defaultValue: 'Pacific Import Enterprises',
        placeholder: 'e.g. Pacific Import Enterprises'
      },
      {
        name: 'cargoDetails',
        label: 'Cargo Description',
        type: 'text',
        required: true,
        defaultValue: 'Electronic Circuit Assemblies (40 Cartons / 850 KG)',
        placeholder: 'e.g. Machinery parts'
      },
      {
        name: 'date',
        label: 'Shipping Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 11. CORPORATE PURCHASE ORDER (PO) BUILDER
  'pdf-purchase-order-po-maker': {
    toolId: 'pdf-purchase-order-po-maker',
    docType: 'document',
    docTitle: 'Corporate Purchase Order (PO)',
    fields: [
      {
        name: 'buyerName',
        label: 'Buyer Name',
        type: 'text',
        required: true,
        defaultValue: 'Enterprise Technologies LLC',
        placeholder: 'e.g. Enterprise Technologies LLC'
      },
      {
        name: 'vendorName',
        label: 'Vendor Name',
        type: 'text',
        required: true,
        defaultValue: 'Cloud Infrastructure Direct',
        placeholder: 'e.g. Cloud Infrastructure Direct'
      },
      {
        name: 'poNumber',
        label: 'Purchase Order Number',
        type: 'text',
        required: true,
        defaultValue: 'PO-2026-8941',
        placeholder: 'e.g. PO-2026-8941'
      },
      {
        name: 'totalAmount',
        label: 'Total Amount',
        type: 'text',
        required: true,
        defaultValue: '45,200',
        placeholder: 'e.g. 45,200'
      },
      {
        name: 'date',
        label: 'Order Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 12. COUNTER RETAIL CASH MEMO & SHOP BILL
  'pdf-cash-memo-retail-receipt': {
    toolId: 'pdf-cash-memo-retail-receipt',
    docType: 'receipt',
    docTitle: 'Retail Cash Memo & Sale Bill',
    fields: [
      {
        name: 'storeName',
        label: 'Store Name',
        type: 'text',
        required: true,
        defaultValue: 'Metro Supermarket & Supplies',
        placeholder: 'e.g. Metro Supermarket'
      },
      {
        name: 'customerName',
        label: 'Customer Name',
        type: 'text',
        required: true,
        defaultValue: 'Rohit Joshi',
        placeholder: 'e.g. Rohit Joshi'
      },
      {
        name: 'amount',
        label: 'Total Amount',
        type: 'text',
        required: true,
        defaultValue: '3,850',
        placeholder: 'e.g. 3,850'
      },
      {
        name: 'date',
        label: 'Bill Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 13. USED VEHICLE SALE DEED & TRANSFER AGREEMENT
  'pdf-vehicle-sale-deed-transfer': {
    toolId: 'pdf-vehicle-sale-deed-transfer',
    docType: 'agreement',
    docTitle: 'Vehicle Sale Deed & Transfer Agreement',
    fields: [
      {
        name: 'sellerName',
        label: 'Seller Name',
        type: 'text',
        required: true,
        defaultValue: 'Sunil Kumar',
        placeholder: 'e.g. Sunil Kumar'
      },
      {
        name: 'buyerName',
        label: 'Buyer Name',
        type: 'text',
        required: true,
        defaultValue: 'Manoj Bajpayee',
        placeholder: 'e.g. Manoj Bajpayee'
      },
      {
        name: 'vehicleDetails',
        label: 'Vehicle Model & Details',
        type: 'text',
        required: true,
        defaultValue: 'Honda City 1.5 i-VTEC (White, 2021 Model)',
        placeholder: 'e.g. Honda City 2021'
      },
      {
        name: 'salePrice',
        label: 'Sale Price',
        type: 'text',
        required: true,
        defaultValue: '850,000',
        placeholder: 'e.g. 850,000'
      },
      {
        name: 'date',
        label: 'Sale Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 14. FITNESS CENTER LIABILITY WAIVER & HEALTH RELEASE
  'pdf-gym-fitness-consent-waiver': {
    toolId: 'pdf-gym-fitness-consent-waiver',
    docType: 'document',
    docTitle: 'Fitness Center Liability Waiver & Health Release',
    fields: [
      {
        name: 'participantName',
        label: 'Participant Name',
        type: 'text',
        required: true,
        defaultValue: 'Aarav Patel',
        placeholder: 'e.g. Aarav Patel'
      },
      {
        name: 'facilityName',
        label: 'Facility / Gym Name',
        type: 'text',
        required: true,
        defaultValue: 'IronPulse Fitness & Crossfit Arena',
        placeholder: 'e.g. IronPulse Fitness'
      },
      {
        name: 'emergencyContact',
        label: 'Emergency Contact',
        type: 'text',
        required: true,
        defaultValue: 'Renu Patel (+91 98220 11223)',
        placeholder: 'e.g. Contact Person & Phone'
      },
      {
        name: 'date',
        label: 'Waiver Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 15. VOLUNTEER & EMPLOYEE CERTIFICATE OF APPRECIATION
  'pdf-certificate-of-appreciation': {
    toolId: 'pdf-certificate-of-appreciation',
    docType: 'certificate',
    docTitle: 'Certificate of Appreciation',
    fields: [
      {
        name: 'recipientName',
        label: 'Recipient Name',
        type: 'text',
        required: true,
        defaultValue: 'Sneha Roy',
        placeholder: 'e.g. Sneha Roy'
      },
      {
        name: 'organization',
        label: 'Organization',
        type: 'text',
        required: true,
        defaultValue: 'Green Earth Foundation',
        placeholder: 'e.g. Green Earth Foundation'
      },
      {
        name: 'reason',
        label: 'Reason for Appreciation',
        type: 'text',
        required: true,
        defaultValue: 'Outstanding volunteer leadership and community tree planting initiative',
        placeholder: 'e.g. Community leadership and excellence'
      },
      {
        name: 'date',
        label: 'Award Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 16. LEGAL STAMP PAPER & NOTARY AFFIDAVIT CREATOR
  'pdf-affidavit-notary-formatter': {
    toolId: 'pdf-affidavit-notary-formatter',
    docType: 'document',
    docTitle: 'General Legal Affidavit & Notary Declaration',
    fields: [
      {
        name: 'deponentName',
        label: 'Deponent Name',
        type: 'text',
        required: true,
        defaultValue: 'Arunav Sengupta',
        placeholder: 'e.g. Arunav Sengupta'
      },
      {
        name: 'statement',
        label: 'Statement of Facts',
        type: 'textarea',
        required: true,
        defaultValue: 'I solemnly declare and affirm that all statements made herein are true and correct to the best of my personal knowledge.',
        placeholder: 'Enter sworn statement of facts'
      },
      {
        name: 'place',
        label: 'Jurisdiction / Place',
        type: 'text',
        required: true,
        defaultValue: 'New Delhi, India',
        placeholder: 'e.g. New Delhi, India'
      },
      {
        name: 'date',
        label: 'Affidavit Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 17. CORPORATE EXECUTIVE COVER LETTER DESIGNER
  'pdf-cover-letter-designer': {
    toolId: 'pdf-cover-letter-designer',
    docType: 'letter',
    docTitle: 'Executive Job Application Cover Letter',
    fields: [
      {
        name: 'applicantName',
        label: 'Applicant Name',
        type: 'text',
        required: true,
        defaultValue: 'Rahul Sharma',
        placeholder: 'e.g. Rahul Sharma'
      },
      {
        name: 'recipientName',
        label: 'Hiring Manager / Recipient',
        type: 'text',
        required: true,
        defaultValue: 'Ms. Sarah Jenkins, Head of Talent',
        placeholder: 'e.g. Hiring Manager Name'
      },
      {
        name: 'companyName',
        label: 'Company Name',
        type: 'text',
        required: true,
        defaultValue: 'Acme Technologies Inc.',
        placeholder: 'e.g. Acme Technologies Inc.'
      },
      {
        name: 'jobTitle',
        label: 'Target Job Title',
        type: 'text',
        required: true,
        defaultValue: 'Lead Full-Stack Architect',
        placeholder: 'e.g. Lead Software Architect'
      },
      {
        name: 'bodyText',
        label: 'Letter Content',
        type: 'textarea',
        required: true,
        defaultValue: 'I am writing to express my strong enthusiasm for the role. With over 8 years of hands-on experience designing cloud-native applications, I am eager to contribute immediately to your product architecture.',
        placeholder: 'Write your cover letter message...'
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 18. MEDICAL CLINIC DOCTOR RX PRESCRIPTION PAD GENERATOR
  'pdf-prescription-pad-rx-creator': {
    toolId: 'pdf-prescription-pad-rx-creator',
    docType: 'document',
    docTitle: 'Medical Clinic Rx Prescription Pad',
    fields: [
      {
        name: 'doctorName',
        label: 'Doctor Name',
        type: 'text',
        required: true,
        defaultValue: 'Dr. Siddharth Mehra, M.D.',
        placeholder: 'e.g. Dr. Siddharth Mehra'
      },
      {
        name: 'clinicName',
        label: 'Clinic / Hospital Name',
        type: 'text',
        required: true,
        defaultValue: 'City Health Specialty Polyclinic',
        placeholder: 'e.g. City Health Polyclinic'
      },
      {
        name: 'patientName',
        label: 'Patient Name',
        type: 'text',
        required: true,
        defaultValue: 'Deepak Varma (Age: 38 / Male)',
        placeholder: 'e.g. Patient Name & Age'
      },
      {
        name: 'rxDetails',
        label: 'Prescription Details',
        type: 'textarea',
        required: true,
        defaultValue: '1. Tab. Amoxicillin 500mg - 1 tablet twice daily after food x 5 days\n2. Tab. Paracetamol 650mg - SOS for fever',
        placeholder: 'Enter medications and dosage instructions'
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 19. MATRIMONIAL BIODATA & PROFILE MAKER
  'pdf-biodata-marriage-maker': {
    toolId: 'pdf-biodata-marriage-maker',
    docType: 'document',
    docTitle: 'Matrimonial Biodata & Profile',
    fields: [
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        required: true,
        defaultValue: 'Rahul Sharma',
        placeholder: 'e.g. Rahul Sharma'
      },
      {
        name: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        defaultValue: '1995-06-15'
      },
      {
        name: 'education',
        label: 'Education Qualification',
        type: 'text',
        required: true,
        defaultValue: 'B.Tech in Computer Science & Engineering',
        placeholder: 'e.g. B.Tech / MBA / MBBS'
      },
      {
        name: 'occupation',
        label: 'Occupation',
        type: 'text',
        required: true,
        defaultValue: 'Lead Software Architect at MNC',
        placeholder: 'e.g. Software Engineer / Entrepreneur'
      },
      {
        name: 'nativePlace',
        label: 'Native Place / Hometown',
        type: 'text',
        required: true,
        defaultValue: 'Jaipur, Rajasthan',
        placeholder: 'e.g. Jaipur, Rajasthan'
      }
    ]
  },

  // 20. AADHAAR CARD 4x6 PRINT SHEET & CUT-MARGIN SCALER
  'pdf-aadhaar-card-print-scaler': {
    toolId: 'pdf-aadhaar-card-print-scaler',
    docType: 'card',
    docTitle: 'Aadhaar Card 4x6 Wallet Cut Sheet',
    fields: [
      {
        name: 'cardHolderName',
        label: 'Cardholder Name',
        type: 'text',
        required: true,
        defaultValue: 'Rahul Sharma',
        placeholder: 'e.g. Rahul Sharma'
      },
      {
        name: 'aadhaarNumber',
        label: 'Aadhaar Number',
        type: 'text',
        required: true,
        defaultValue: 'XXXX XXXX 1234',
        placeholder: 'e.g. XXXX XXXX 1234'
      },
      {
        name: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        defaultValue: '1995-08-15'
      },
      {
        name: 'address',
        label: 'Address',
        type: 'text',
        required: true,
        defaultValue: 'Plot 42, Civil Lines, New Delhi - 110001',
        placeholder: 'e.g. Residential Address'
      }
    ]
  },

  // 21. PAN & NATIONAL ID CARD WALLET PRINT SHEET
  'pdf-pan-card-cut-guide-formatter': {
    toolId: 'pdf-pan-card-cut-guide-formatter',
    docType: 'card',
    docTitle: 'PAN Card Wallet Print Sheet',
    fields: [
      {
        name: 'cardHolderName',
        label: 'Cardholder Name',
        type: 'text',
        required: true,
        defaultValue: 'Rahul Sharma',
        placeholder: 'e.g. Rahul Sharma'
      },
      {
        name: 'panNumber',
        label: 'PAN Number',
        type: 'text',
        required: true,
        defaultValue: 'ABCPS1234F',
        placeholder: 'e.g. ABCPS1234F'
      },
      {
        name: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        defaultValue: '1995-08-15'
      },
      {
        name: 'fathersName',
        label: "Father's Name",
        type: 'text',
        required: true,
        defaultValue: 'Ramesh Sharma',
        placeholder: "e.g. Father's Name"
      }
    ]
  },

  // 22. DRIVING LICENSE POCKET SHEET
  'pdf-driving-license-pocket-sheet': {
    toolId: 'pdf-driving-license-pocket-sheet',
    docType: 'card',
    docTitle: 'Driving License Pocket Sheet',
    fields: [
      {
        name: 'licenseeName',
        label: 'Driver Name',
        type: 'text',
        required: true,
        defaultValue: 'Rahul Sharma',
        placeholder: 'e.g. Rahul Sharma'
      },
      {
        name: 'licenseNumber',
        label: 'License Number',
        type: 'text',
        required: true,
        defaultValue: 'DL-0420110023456',
        placeholder: 'e.g. DL-0420110023456'
      },
      {
        name: 'validUntil',
        label: 'Valid Until Date',
        type: 'date',
        required: true,
        defaultValue: '2035-08-15'
      },
      {
        name: 'vehicleClass',
        label: 'Vehicle Class',
        type: 'text',
        required: true,
        defaultValue: 'MCWG / LMV (Motorcycle with Gear & Light Motor Vehicle)',
        placeholder: 'e.g. MCWG / LMV'
      }
    ]
  },

  // 23. PERFORATED EVENT TICKET WITH SEQUENTIAL QR
  'pdf-event-ticket-qr-numbered': {
    toolId: 'pdf-event-ticket-qr-numbered',
    docType: 'voucher',
    docTitle: 'Numbered Event Ticket with QR',
    fields: [
      {
        name: 'eventName',
        label: 'Event Name',
        type: 'text',
        required: true,
        defaultValue: 'TechSummit 2026 Global Conference',
        placeholder: 'e.g. TechSummit 2026'
      },
      {
        name: 'attendeeName',
        label: 'Attendee Name',
        type: 'text',
        required: true,
        defaultValue: 'Rahul Sharma',
        placeholder: 'e.g. Rahul Sharma'
      },
      {
        name: 'venue',
        label: 'Venue / Location',
        type: 'text',
        required: true,
        defaultValue: 'Grand Convention Center, Hall 4',
        placeholder: 'e.g. Grand Convention Center'
      },
      {
        name: 'ticketPrice',
        label: 'Ticket Price',
        type: 'text',
        required: true,
        defaultValue: '149 USD',
        placeholder: 'e.g. 149 USD'
      },
      {
        name: 'date',
        label: 'Event Date',
        type: 'date',
        required: true,
        defaultValue: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
      }
    ]
  },

  // 24. EVENT ATTENDEE LANYARD BADGE SHEET
  'pdf-conference-badge-lanyard-sheet': {
    toolId: 'pdf-conference-badge-lanyard-sheet',
    docType: 'card',
    docTitle: 'Conference Lanyard Badge Sheet',
    fields: [
      {
        name: 'attendeeName',
        label: 'Attendee Name',
        type: 'text',
        required: true,
        defaultValue: 'Rahul Sharma',
        placeholder: 'e.g. Rahul Sharma'
      },
      {
        name: 'organization',
        label: 'Company / Organization',
        type: 'text',
        required: true,
        defaultValue: 'CloudTech Dynamics',
        placeholder: 'e.g. CloudTech Dynamics'
      },
      {
        name: 'role',
        label: 'Role / Title',
        type: 'text',
        required: true,
        defaultValue: 'VIP Keynote Speaker',
        placeholder: 'e.g. Speaker / Delegate / Organizer'
      },
      {
        name: 'conferenceName',
        label: 'Conference Name',
        type: 'text',
        required: true,
        defaultValue: 'AI Global Builders Summit 2026',
        placeholder: 'e.g. AI Builders Summit'
      }
    ]
  },

  // 25. RESTAURANT & CAFÉ BI-FOLD DINING MENU CARD
  'pdf-menu-card-restaurant-bifold': {
    toolId: 'pdf-menu-card-restaurant-bifold',
    docType: 'sheet',
    docTitle: 'Dining Menu Card',
    fields: [
      {
        name: 'restaurantName',
        label: 'Restaurant Name',
        type: 'text',
        required: true,
        defaultValue: 'The Rustic Olive Bistro',
        placeholder: 'e.g. The Rustic Olive Bistro'
      },
      {
        name: 'tagline',
        label: 'Cuisine / Tagline',
        type: 'text',
        required: true,
        defaultValue: 'Wood-Fired Artisanal Italian Kitchen',
        placeholder: 'e.g. Artisanal Italian Kitchen'
      },
      {
        name: 'menuItems',
        label: 'Highlighted Menu Items & Prices',
        type: 'textarea',
        required: true,
        defaultValue: 'Truffle Margherita Pizza - $18\nWild Mushroom Risotto - $22\nHandcrafted Tiramisu - $10',
        placeholder: 'Enter menu items with pricing'
      }
    ]
  },

  // 26. HUNDRED PDF SUITE: CASH RECEIPT & PAYMENT VOUCHER MAKER
  'pdf-receipt-voucher-generator': {
    toolId: 'pdf-receipt-voucher-generator',
    docType: 'voucher',
    docTitle: 'Cash Payment Receipt & Voucher',
    fields: [
      {
        name: 'companyName',
        label: 'Organization / Issuer',
        type: 'text',
        required: true,
        defaultValue: 'Acme Global Inc.',
        placeholder: 'e.g. Acme Global Inc.'
      },
      {
        name: 'receiptAmount',
        label: 'Amount ($ USD)',
        type: 'text',
        required: true,
        defaultValue: '250.00',
        placeholder: 'e.g. 250.00'
      },
      {
        name: 'receiptClient',
        label: 'Received From (Client / Payer)',
        type: 'text',
        required: true,
        defaultValue: 'Johnathan Doe',
        placeholder: 'e.g. Johnathan Doe'
      },
      {
        name: 'date',
        label: 'Payment Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 27. HUNDRED PDF SUITE: CERTIFICATE AWARD MAKER
  'pdf-certificate-award-maker': {
    toolId: 'pdf-certificate-award-maker',
    docType: 'certificate',
    docTitle: 'Official Certificate of Achievement & Award',
    fields: [
      {
        name: 'recipientName',
        label: 'Recipient Name',
        type: 'text',
        required: true,
        defaultValue: 'Jane Alexander Doe',
        placeholder: 'e.g. Jane Alexander Doe'
      },
      {
        name: 'courseTitle',
        label: 'Course / Achievement Title',
        type: 'text',
        required: true,
        defaultValue: 'Advanced Machine Learning & Data Engineering',
        placeholder: 'e.g. Advanced Machine Learning'
      },
      {
        name: 'companyName',
        label: 'Issuing Institution',
        type: 'text',
        required: true,
        defaultValue: 'International Academy of Computing',
        placeholder: 'e.g. University / Institution Name'
      },
      {
        name: 'date',
        label: 'Issue Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 28. HUNDRED PDF SUITE: CERTIFICATE OF AUTHENTICITY (ART & COLLECTIBLES)
  'pdf-certificate-of-authenticity': {
    toolId: 'pdf-certificate-of-authenticity',
    docType: 'certificate',
    docTitle: 'Certificate of Authenticity',
    fields: [
      {
        name: 'recipientName',
        label: 'Artist Name',
        type: 'text',
        required: true,
        defaultValue: 'Elena Rostova',
        placeholder: 'e.g. Elena Rostova'
      },
      {
        name: 'courseTitle',
        label: 'Artwork Title',
        type: 'text',
        required: true,
        defaultValue: 'Serenade at Dawn (Oil on Canvas, Edition 3 of 50)',
        placeholder: 'e.g. Artwork title and edition'
      },
      {
        name: 'companyName',
        label: 'Issuing Gallery / Studio',
        type: 'text',
        required: true,
        defaultValue: 'Contemporary Fine Arts Guild',
        placeholder: 'e.g. Gallery Name'
      },
      {
        name: 'date',
        label: 'Issue Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 29. HUNDRED PDF SUITE: STANDARD NDA CONTRACT MAKER
  'pdf-standard-nda-contract-maker': {
    toolId: 'pdf-standard-nda-contract-maker',
    docType: 'agreement',
    docTitle: 'Mutual Non-Disclosure Agreement',
    fields: [
      {
        name: 'ndaPartyA',
        label: 'Disclosing Party (Party A)',
        type: 'text',
        required: true,
        defaultValue: 'Apex Innovations Corp.',
        placeholder: 'e.g. Apex Innovations Corp.'
      },
      {
        name: 'ndaPartyB',
        label: 'Receiving Party (Party B)',
        type: 'text',
        required: true,
        defaultValue: 'Quantum Advisory Partners',
        placeholder: 'e.g. Quantum Advisory Partners'
      },
      {
        name: 'date',
        label: 'Effective Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 30. ALL WORLD PDF SUITE: CUSTOM DIPLOMA & CERTIFICATE
  'pdf-diploma-certificate-maker': {
    toolId: 'pdf-diploma-certificate-maker',
    docType: 'certificate',
    docTitle: 'Diploma & Certificate of Achievement',
    fields: [
      {
        name: 'recipientName',
        label: 'Recipient Name',
        type: 'text',
        required: true,
        defaultValue: 'Dr. Sarah Connor',
        placeholder: 'e.g. Recipient Name'
      },
      {
        name: 'courseTitle',
        label: 'Course / Achievement Title',
        type: 'text',
        required: true,
        defaultValue: 'Doctor of Philosophy in Computer Science',
        placeholder: 'e.g. Degree / Course Title'
      },
      {
        name: 'companyName',
        label: 'Issuing Institution',
        type: 'text',
        required: true,
        defaultValue: 'Global Institute of Advanced Science',
        placeholder: 'e.g. University / Institution Name'
      },
      {
        name: 'date',
        label: 'Issue Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 31. ALL WORLD PDF SUITE: COMMERCIAL SALES RECEIPT
  'pdf-commercial-receipt-voucher': {
    toolId: 'pdf-commercial-receipt-voucher',
    docType: 'receipt',
    docTitle: 'Commercial Sales Receipt',
    fields: [
      {
        name: 'recipientName',
        label: 'Customer Name',
        type: 'text',
        required: true,
        defaultValue: 'Acme Corporation Ltd.',
        placeholder: 'e.g. Customer Name'
      },
      {
        name: 'invoiceId',
        label: 'Receipt Number',
        type: 'text',
        required: true,
        defaultValue: 'REC-2026-904',
        placeholder: 'e.g. REC-2026-904'
      },
      {
        name: 'invoiceAmount',
        label: 'Total Amount ($)',
        type: 'text',
        required: true,
        defaultValue: '1,450.00',
        placeholder: 'e.g. 1,450.00'
      },
      {
        name: 'date',
        label: 'Receipt Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 32. ALL WORLD PDF SUITE: EMERGENCY MEDICAL ID SHEET
  'pdf-emergency-id-sheet-generator': {
    toolId: 'pdf-emergency-id-sheet-generator',
    docType: 'card',
    docTitle: 'Emergency Medical ID (I.C.E.) Sheet',
    fields: [
      {
        name: 'recipientName',
        label: 'Full Legal Name',
        type: 'text',
        required: true,
        defaultValue: 'Marcus Aurelius Sterling',
        placeholder: 'e.g. Full Legal Name'
      },
      {
        name: 'emergencyContact',
        label: 'Emergency Contact Phone',
        type: 'text',
        required: true,
        defaultValue: '+1 (555) 019-2831 (Spouse)',
        placeholder: 'e.g. +1 (555) 019-2831'
      },
      {
        name: 'medicalNotes',
        label: 'Blood Group & Allergies',
        type: 'text',
        required: true,
        defaultValue: 'Blood: O-Positive | Allergies: Penicillin, Peanuts',
        placeholder: 'e.g. Blood Group and Medical Notes'
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  },

  // 33. FLAGSHIP BUSINESS CARD STUDIO
  'business-card-maker': {
    toolId: 'business-card-maker',
    docType: 'card',
    docTitle: 'Executive Business Card',
    fields: [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true, defaultValue: 'Alexander Vance' },
      { name: 'jobTitle', label: 'Job Title', type: 'text', required: true, defaultValue: 'Chief Technology Officer' },
      { name: 'companyName', label: 'Company Name', type: 'text', required: true, defaultValue: 'Vance Labs & Co.' },
      { name: 'email', label: 'Email Address', type: 'text', required: true, defaultValue: 'alexander@vancelabs.io' },
      { name: 'phone', label: 'Phone Number', type: 'text', required: true, defaultValue: '+1 (555) 382-9901' },
      { name: 'website', label: 'Website URL', type: 'text', required: true, defaultValue: 'https://vancelabs.io' },
      { name: 'address', label: 'Office Address', type: 'text', required: true, defaultValue: '100 Silicon Ave, San Francisco, CA' }
    ]
  },

  // 34. NEW PDF SUITE: INVOICE TEMPLATE BUILDER
  'pdf-invoice-template-builder': {
    toolId: 'pdf-invoice-template-builder',
    docType: 'receipt',
    docTitle: 'Commercial Billing Invoice',
    fields: [
      {
        name: 'companyName',
        label: 'Company / Sender Name',
        type: 'text',
        required: true,
        defaultValue: 'Apex Creative Studio',
        placeholder: 'e.g. Apex Creative Studio'
      },
      {
        name: 'clientName',
        label: 'Client Name',
        type: 'text',
        required: true,
        defaultValue: 'BluePeak Technologies',
        placeholder: 'e.g. Client Name'
      },
      {
        name: 'invoiceAmount',
        label: 'Invoice Amount ($)',
        type: 'text',
        required: true,
        defaultValue: '3,200.00',
        placeholder: 'e.g. 3,200.00'
      },
      {
        name: 'invoiceDate',
        label: 'Invoice Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      },
      {
        name: 'itemDescription',
        label: 'Service / Item Description',
        type: 'text',
        required: true,
        defaultValue: 'Full-stack application architecture and sprint delivery',
        placeholder: 'e.g. Web development services'
      }
    ]
  }
};

/**
 * Fallback generator for tools not explicitly in registry.
 * Generates an appropriate schema based on tool id, category and naming.
 */
export function getToolSchema(toolIdOrSlug: string, fallbackName?: string): ToolFieldSchema {
  if (TOOL_FIELD_REGISTRY[toolIdOrSlug]) {
    return TOOL_FIELD_REGISTRY[toolIdOrSlug];
  }

  // Check by slug or id normalized
  const found = Object.values(TOOL_FIELD_REGISTRY).find(
    s => s.toolId === toolIdOrSlug || s.toolId === toolIdOrSlug.replace(/_/g, '-')
  );
  if (found) return found;

  const docTitle = fallbackName || 'Custom Document';

  // Default clean schema if none exists
  return {
    toolId: toolIdOrSlug,
    docType: 'document',
    docTitle,
    fields: [
      {
        name: 'title',
        label: 'Document Title',
        type: 'text',
        required: true,
        defaultValue: docTitle
      },
      {
        name: 'partyName',
        label: 'Primary Name / Party',
        type: 'text',
        required: true,
        defaultValue: 'Rahul Sharma'
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0]
      }
    ]
  };
}

/**
 * Get field schema configuration for a tool by its ID or slug.
 */
export function getToolFieldConfig(toolIdOrSlug: string): ToolFieldSchema | undefined {
  return TOOL_FIELD_REGISTRY[toolIdOrSlug];
}

/**
 * DYNAMIC "HOW TO WORK" GENERATOR
 * 
 * Strict Rule 4:
 * The "How to Work" section MUST be dynamically generated from the SAME field configuration.
 * For example, if Salary Certificate has only: Name, Amount, Date, Organization
 * Then "How to Work" says only:
 * "Enter the employee name, salary amount, date and organization details, then generate/download the certificate."
 * It must NOT mention ID, address or bank account!
 */
export function getDynamicHowToWork(tool: { id: string; slug?: string; name: string; howToUse?: string[] }): string[] {
  const schema = TOOL_FIELD_REGISTRY[tool.id] || (tool.slug ? TOOL_FIELD_REGISTRY[tool.slug] : null);

  // If this tool has an explicit field schema registered:
  if (schema && schema.fields && schema.fields.length > 0) {
    const fieldLabels = schema.fields.map(f => f.label.toLowerCase());
    
    let formattedFields: string;
    if (fieldLabels.length === 1) {
      formattedFields = fieldLabels[0];
    } else if (fieldLabels.length === 2) {
      formattedFields = `${fieldLabels[0]} and ${fieldLabels[1]}`;
    } else {
      const allExceptLast = fieldLabels.slice(0, -1).join(', ');
      const last = fieldLabels[fieldLabels.length - 1];
      formattedFields = `${allExceptLast} and ${last}`;
    }

    const docTerm = schema.docType === 'certificate' ? 'certificate' :
                    schema.docType === 'agreement' ? 'agreement' :
                    schema.docType === 'voucher' ? 'voucher' :
                    schema.docType === 'receipt' ? 'receipt' :
                    schema.docType === 'card' ? 'card' :
                    schema.docType === 'letter' ? 'letter' : 'document';

    return [
      `Enter the ${formattedFields} details, then generate/download the ${docTerm}.`,
      `Review the live interactive preview to verify your inputs in real time.`,
      `Click generate to create and download your high-resolution print-ready PDF.`
    ];
  }

  // If no custom field schema exists, clean up any hardcoded generic mentions
  if (tool.howToUse && tool.howToUse.length > 0) {
    return tool.howToUse.map(step => {
      // Remove generic unasked fields from descriptions
      return step
        .replace(/\b(bank account|pan|aadhaar|employee id)\b,?\s*/gi, '')
        .trim();
    });
  }

  return [
    `Configure your parameters and input options for ${tool.name}.`,
    `Preview the output in real time with 100% client-side security.`,
    `Download or copy your processed result instantly.`
  ];
}

/**
 * Validates user values against the tool's schema.
 */
export function validateToolFields(
  schema: ToolFieldSchema,
  values: Record<string, string>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  schema.fields.forEach(field => {
    if (field.required) {
      const val = values[field.name];
      if (!val || val.trim() === '') {
        errors[field.name] = `${field.label} is required`;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
