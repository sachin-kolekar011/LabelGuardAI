// ─── Products ────────────────────────────────────────────────────────────────
export const products = [
  { id: "P001", name: "Amul Butter (500g)", brand: "Amul", category: "Dairy", sku: "AMB-500", labelImage: "/labels/amul-butter-compliant.svg" },
  { id: "P002", name: "Dabur Honey (500g)", brand: "Dabur", category: "Food", sku: "DBH-500", labelImage: "/labels/dabur-honey-compliant.svg" },
  { id: "P003", name: "Britannia Marie Gold (250g)", brand: "Britannia", category: "Biscuits", sku: "BMG-250", labelImage: "/labels/britannia-marie-noncompliant.svg" },
  { id: "P004", name: "Haldiram's Aloo Bhujia (200g)", brand: "Haldiram's", category: "Snacks", sku: "HAB-200", labelImage: "/labels/britannia-marie-noncompliant.svg" },
  { id: "P005", name: "Patanjali Dant Kanti (200g)", brand: "Patanjali", category: "Oral Care", sku: "PDK-200", labelImage: "/labels/patanjali-review.svg" },
  { id: "P006", name: "Tata Salt (1kg)", brand: "Tata", category: "Condiments", sku: "TTS-1K", labelImage: "/labels/tata-salt-compliant.svg" },
  { id: "P007", name: "MDH Garam Masala (100g)", brand: "MDH", category: "Spices", sku: "MGM-100", labelImage: "/labels/tata-salt-compliant.svg" },
  { id: "P008", name: "Himalaya Neem Face Wash (150ml)", brand: "Himalaya", category: "Cosmetics", sku: "HNF-150", labelImage: "/labels/borges-olive-noncompliant.svg" },
  { id: "P009", name: "Surf Excel Matic (1kg)", brand: "HUL", category: "Household", sku: "SEM-1K", labelImage: "/labels/tata-salt-compliant.svg" },
  { id: "P010", name: "Maggi Noodles 2-Minute (70g)", brand: "Nestle", category: "Instant Food", sku: "MGN-70", labelImage: "/labels/patanjali-review.svg" },
  { id: "P011", name: "Parle-G Biscuits (250g)", brand: "Parle", category: "Biscuits", sku: "PGB-250", labelImage: "/labels/amul-butter-compliant.svg" },
  { id: "P012", name: "Borges Olive Oil (500ml)", brand: "Borges", category: "Edible Oil", sku: "BOO-500", labelImage: "/labels/borges-olive-noncompliant.svg" },
  { id: "P013", name: "Dove Shampoo (340ml)", brand: "Dove", category: "Cosmetics", sku: "DVS-340", labelImage: "/labels/dabur-honey-compliant.svg" },
  { id: "P014", name: "Mother Dairy Mishti Doi (400g)", brand: "Mother Dairy", category: "Dairy", sku: "MDM-400", labelImage: "/labels/patanjali-review.svg" },
  { id: "P015", name: "Lijjat Urad Papad (200g)", brand: "Lijjat", category: "Snacks", sku: "LUP-200", labelImage: "/labels/amul-butter-compliant.svg" },
  { id: "P016", name: "Real Fruit Power Mango (1L)", brand: "Dabur", category: "Beverages", sku: "RFM-1L", labelImage: "/labels/britannia-marie-noncompliant.svg" },
  { id: "P017", name: "Sensodyne Toothpaste (75g)", brand: "GSK", category: "Oral Care", sku: "SNS-75", labelImage: "/labels/patanjali-review.svg" },
  { id: "P018", name: "Fortune Sunflower Oil (1L)", brand: "Fortune", category: "Edible Oil", sku: "FSO-1L", labelImage: "/labels/borges-olive-noncompliant.svg" },
];

// ─── Rules ───────────────────────────────────────────────────────────────────
export const rules = [
  { id: "R001", name: "Manufacturer Name & Address", citation: "LMPC Rule 6(1)(a), 2011", effectiveDate: "2011-09-01", amendedDate: "2017-04-17", status: "Active", description: "Every package shall bear the name and complete address of the manufacturer, packer, or importer.", versions: ["2011 — initial mandate", "2017 — must include PIN code; PO Box not acceptable"] },
  { id: "R002", name: "Net Quantity Declaration", citation: "LMPC Rule 6(1)(b), 2011 (amended 2022)", effectiveDate: "2011-09-01", amendedDate: "2022-01-01", status: "Active", description: "Net quantity in standard units (g/ml/kg/l) must appear on the principal display panel.", versions: ["2011 — quantity and unit mandatory", "2022 — additional requirement: dual declaration (metric + count) for multi-piece packs"] },
  { id: "R003", name: "MRP & Unit Sale Price", citation: "LMPC Rule 6(1)(c), 2011", effectiveDate: "2011-09-01", amendedDate: "2017-04-17", status: "Active", description: "Maximum Retail Price (MRP) inclusive of all taxes must be declared. Unit sale price required for comparison.", versions: ["2011 — MRP mandatory, inclusive of taxes", "2017 — unit sale price (per gram or per ml) now mandatory for all packages"] },
  { id: "R004", name: "Month & Year of Manufacture / Import", citation: "LMPC Rule 6(1)(e), 2011", effectiveDate: "2011-09-01", amendedDate: null, status: "Active", description: "Month and year of manufacture or import. Best before / expiry date mandatory where applicable.", versions: ["2011 — month/year minimum required"] },
  { id: "R005", name: "Consumer Care / Grievance Contact", citation: "LMPC Rule 6(1)(f), 2011 (amended 2022)", effectiveDate: "2011-09-01", amendedDate: "2022-01-01", status: "Active", description: "Name, address, and telephone/email of person to contact for consumer queries or complaints.", versions: ["2011 — address mandatory", "2022 — email or phone number now also required"] },
  { id: "R006", name: "Minimum Font Size — Principal Display Panel", citation: "LMPC Schedule II, 2011 (amended 2017, 2025)", effectiveDate: "2011-09-01", amendedDate: "2025-01-01", status: "Active", description: "Declarations must be in a minimum font height of 1mm for packages ≤ 10g/10ml; 2mm for 10–50g/ml; 4mm for >50g/ml up to 200g/ml; 6mm above 200g/ml.", versions: ["2011 — initial size table", "2017 — table revised; minimum increased for mid-range packages", "2025 — 4mm minimum now applies from 50g/ml (was 100g/ml)"] },
  { id: "R007", name: "Barcode / QR Code — Digital Readable Identity", citation: "LMPC Notification 2023, Rule 6A", effectiveDate: "2023-06-01", amendedDate: null, status: "Active", description: "Every packaged commodity exceeding ₹500 MRP must include a QR code or barcode linking to product identity and recall information.", versions: ["2023 — new requirement; applies to premium segment"] },
  { id: "R008", name: "Declaration Size — Principal Display Panel", citation: "LMPC Rule 7, 2011", effectiveDate: "2011-09-01", amendedDate: "2022-01-01", status: "Active", description: "The total area of mandatory declarations must cover at least 20% of the principal display panel.", versions: ["2011 — 15% minimum", "2022 — increased to 20%"] },
  { id: "R009", name: "Country of Origin (Imported Goods)", citation: "LMPC Rule 6(1)(g), 2011", effectiveDate: "2011-09-01", amendedDate: null, status: "Active", description: "Imported packaged commodities must declare country of origin on the label.", versions: ["2011 — mandatory for all imports"] },
  { id: "R010", name: "Declaration in Hindi / English", citation: "LMPC Rule 5, 2011", effectiveDate: "2011-09-01", amendedDate: null, status: "Active", description: "All mandatory declarations must appear in Hindi or English. Regional language may be added additionally.", versions: ["2011 — Hindi/English mandatory"] },
];

// ─── Scans ───────────────────────────────────────────────────────────────────
const fieldVerdicts = {
  compliant: [
    { field: "Manufacturer Name & Address", status: "Pass", extracted: "Amul (Anand Milk Union Ltd.), Anand-388001, Gujarat. PIN: 388001", reason: "Name, address and PIN code present", citation: "LMPC Rule 6(1)(a)" },
    { field: "Net Quantity", status: "Pass", extracted: "500 g", reason: "Quantity in standard units present on principal display panel", citation: "LMPC Rule 6(1)(b)" },
    { field: "MRP & Unit Sale Price", status: "Pass", extracted: "MRP ₹58 incl. taxes | ₹11.6/100g", reason: "MRP and unit sale price both declared", citation: "LMPC Rule 6(1)(c)" },
    { field: "Mfg / Best Before Date", status: "Pass", extracted: "Mfg: OCT 2025 | Best Before: FEB 2026", reason: "Manufacturing month/year and best-before date present", citation: "LMPC Rule 6(1)(e)" },
    { field: "Consumer Care Contact", status: "Pass", extracted: "1800-258-3333 | consumer@amul.com", reason: "Phone and email both provided", citation: "LMPC Rule 6(1)(f) amended 2022" },
    { field: "Font Size", status: "Pass", extracted: "Avg 4.2mm (A4-calibrated)", reason: "Font height above 4mm minimum for this package weight", citation: "LMPC Schedule II (2025)" },
    { field: "Barcode / QR Code", status: "Pass", extracted: "EAN-13 barcode present", reason: "Barcode detected and readable", citation: "LMPC Notification 2023" },
  ],
  fontFail: [
    { field: "Manufacturer Name & Address", status: "Pass", extracted: "Britannia Industries Ltd., Bengaluru-560001", reason: "Name, address and PIN code present", citation: "LMPC Rule 6(1)(a)" },
    { field: "Net Quantity", status: "Pass", extracted: "250 g", reason: "Quantity in standard units on principal panel", citation: "LMPC Rule 6(1)(b)" },
    { field: "MRP & Unit Sale Price", status: "Fail", extracted: "MRP ₹35 incl. taxes | Unit price MISSING", reason: "MRP present but unit sale price (₹/100g) not declared", citation: "LMPC Rule 6(1)(c) amended 2017" },
    { field: "Mfg / Best Before Date", status: "Pass", extracted: "Mfg: SEP 2025 | Best Before: MAR 2026", reason: "Dates present", citation: "LMPC Rule 6(1)(e)" },
    { field: "Consumer Care Contact", status: "Pass", extracted: "1800-103-1414", reason: "Phone number present", citation: "LMPC Rule 6(1)(f)" },
    { field: "Font Size", status: "Fail", extracted: "Avg 1.8mm (A4-calibrated)", reason: "Font height 1.8mm — below 2mm minimum for 250g package", citation: "LMPC Schedule II (2025)" },
    { field: "Barcode / QR Code", status: "Pass", extracted: "EAN-13 barcode present", reason: "Barcode detected", citation: "LMPC Notification 2023" },
  ],
  reviewNeeded: [
    { field: "Manufacturer Name & Address", status: "Pass", extracted: "Patanjali Ayurved Ltd., Haridwar-249401", reason: "Name and address present", citation: "LMPC Rule 6(1)(a)" },
    { field: "Net Quantity", status: "Review", extracted: "~200g (low confidence)", reason: "Quantity detected but confidence below threshold — glare on lower panel", citation: "LMPC Rule 6(1)(b)" },
    { field: "MRP & Unit Sale Price", status: "Pass", extracted: "MRP ₹45 incl. taxes | ₹22.5/100g", reason: "Both declarations present", citation: "LMPC Rule 6(1)(c)" },
    { field: "Mfg / Best Before Date", status: "Review", extracted: "Mfg: ? 2025 (month unclear)", reason: "Year detected but month partially obscured — needs manual verification", citation: "LMPC Rule 6(1)(e)" },
    { field: "Consumer Care Contact", status: "Pass", extracted: "1800-180-8080", reason: "Phone present", citation: "LMPC Rule 6(1)(f)" },
    { field: "Font Size", status: "Review", extracted: "Est. 1.9–2.4mm (no A4 reference)", reason: "No physical reference — relative ratio estimate only; flagged for review", citation: "LMPC Schedule II (2025)" },
    { field: "Barcode / QR Code", status: "Fail", extracted: "Not detected", reason: "No barcode or QR code found on label", citation: "LMPC Notification 2023" },
  ],
  importFail: [
    { field: "Manufacturer Name & Address", status: "Pass", extracted: "Borges Mediterranean SLU, Reus, Spain", reason: "Importer address also present: K. Importers, Mumbai", citation: "LMPC Rule 6(1)(a)" },
    { field: "Net Quantity", status: "Pass", extracted: "500 ml", reason: "Volume in standard units", citation: "LMPC Rule 6(1)(b)" },
    { field: "MRP & Unit Sale Price", status: "Pass", extracted: "MRP ₹380 incl. taxes | ₹76/100ml", reason: "Both present", citation: "LMPC Rule 6(1)(c)" },
    { field: "Mfg / Best Before Date", status: "Pass", extracted: "Best Before: DEC 2026", reason: "Date present", citation: "LMPC Rule 6(1)(e)" },
    { field: "Consumer Care Contact", status: "Fail", extracted: "Not found", reason: "No Indian consumer care contact — importer grievance contact missing", citation: "LMPC Rule 6(1)(f) amended 2022" },
    { field: "Font Size", status: "Pass", extracted: "Avg 3.6mm (A4-calibrated)", reason: "Above 2mm minimum for 500ml package", citation: "LMPC Schedule II" },
    { field: "Country of Origin", status: "Fail", extracted: "Not declared on Indian sticker", reason: "Country of origin missing on the Indian regulatory sticker overlay", citation: "LMPC Rule 6(1)(g)" },
  ],
};

function overallStatus(verdicts) {
  if (verdicts.some(v => v.status === "Fail")) return "Non-Compliant";
  if (verdicts.some(v => v.status === "Review")) return "Needs Review";
  return "Compliant";
}
function severity(verdicts) {
  const fails = verdicts.filter(v => v.status === "Fail").length;
  if (fails >= 2) return "High";
  if (fails === 1) return "Medium";
  if (verdicts.some(v => v.status === "Review")) return "Low";
  return "None";
}

export const scans = [
  { id: "SC001", productId: "P001", timestamp: "2025-09-01T09:14:00", calibration: "A4", status: "Compliant", severity: "None", verdicts: fieldVerdicts.compliant, reviewer: null, notes: "" },
  { id: "SC002", productId: "P003", timestamp: "2025-09-01T11:32:00", calibration: "A4", status: "Non-Compliant", severity: "High", verdicts: fieldVerdicts.fontFail, reviewer: null, notes: "" },
  { id: "SC003", productId: "P005", timestamp: "2025-09-02T10:05:00", calibration: "Relative", status: "Needs Review", severity: "Low", verdicts: fieldVerdicts.reviewNeeded, reviewer: null, notes: "" },
  { id: "SC004", productId: "P012", timestamp: "2025-09-02T14:22:00", calibration: "A4", status: "Non-Compliant", severity: "Medium", verdicts: fieldVerdicts.importFail, reviewer: null, notes: "" },
  { id: "SC005", productId: "P006", timestamp: "2025-09-03T09:00:00", calibration: "A4", status: "Compliant", severity: "None", verdicts: fieldVerdicts.compliant.map(v => ({ ...v, extracted: v.extracted.replace("Amul", "Tata") })), reviewer: null, notes: "" },
  { id: "SC006", productId: "P010", timestamp: "2025-09-03T11:45:00", calibration: "Relative", status: "Needs Review", severity: "Low", verdicts: fieldVerdicts.reviewNeeded, reviewer: "Priya Sharma", notes: "Reviewed — glare issue confirmed, manual measurement 2.1mm. Font borderline." },
  { id: "SC007", productId: "P002", timestamp: "2025-09-04T08:30:00", calibration: "A4", status: "Compliant", severity: "None", verdicts: fieldVerdicts.compliant.map(v => ({ ...v, extracted: v.extracted.replace("Amul", "Dabur") })), reviewer: null, notes: "" },
  { id: "SC008", productId: "P004", timestamp: "2025-09-04T10:10:00", calibration: "A4", status: "Non-Compliant", severity: "High", verdicts: fieldVerdicts.fontFail, reviewer: null, notes: "" },
  { id: "SC009", productId: "P008", timestamp: "2025-09-04T13:00:00", calibration: "A4", status: "Non-Compliant", severity: "Medium", verdicts: fieldVerdicts.importFail, reviewer: null, notes: "" },
  { id: "SC010", productId: "P011", timestamp: "2025-09-05T09:50:00", calibration: "A4", status: "Compliant", severity: "None", verdicts: fieldVerdicts.compliant, reviewer: null, notes: "" },
  { id: "SC011", productId: "P014", timestamp: "2025-09-05T11:20:00", calibration: "Relative", status: "Needs Review", severity: "Low", verdicts: fieldVerdicts.reviewNeeded, reviewer: null, notes: "" },
  { id: "SC012", productId: "P016", timestamp: "2025-09-05T14:00:00", calibration: "A4", status: "Non-Compliant", severity: "High", verdicts: fieldVerdicts.fontFail, reviewer: null, notes: "" },
];

// ─── Chart aggregated data ────────────────────────────────────────────────────
export const violationsByCategory = [
  { name: "Font Size", count: 4 },
  { name: "MRP/Unit Price", count: 3 },
  { name: "Consumer Care", count: 2 },
  { name: "Barcode/QR", count: 2 },
  { name: "Net Quantity", count: 1 },
  { name: "Country of Origin", count: 1 },
];

export const complianceTimeline = [
  { date: "Apr", rate: 68 },
  { date: "May", rate: 72 },
  { date: "Jun", rate: 69 },
  { date: "Jul", rate: 75 },
  { date: "Aug", rate: 80 },
  { date: "Sep", rate: 83 },
];

export const severityDistribution = [
  { name: "High", value: 3, color: "#ef4444" },
  { name: "Medium", value: 2, color: "#f59e0b" },
  { name: "Low (Review)", value: 3, color: "#3b82f6" },
  { name: "Compliant", value: 4, color: "#10b981" },
];

// ─── Reports ─────────────────────────────────────────────────────────────────
export const reports = [
  { id: "RPT001", scanId: "SC002", productName: "Britannia Marie Gold (250g)", generatedAt: "2025-09-01T11:45:00", status: "Non-Compliant", severity: "High", generatedBy: "Ramesh Kumar" },
  { id: "RPT002", scanId: "SC004", productName: "Borges Olive Oil (500ml)", generatedAt: "2025-09-02T14:35:00", status: "Non-Compliant", severity: "Medium", generatedBy: "Anjali Desai" },
  { id: "RPT003", scanId: "SC008", productName: "Haldiram's Aloo Bhujia (200g)", generatedAt: "2025-09-04T10:25:00", status: "Non-Compliant", severity: "High", generatedBy: "Ramesh Kumar" },
  { id: "RPT004", scanId: "SC001", productName: "Amul Butter (500g)", generatedAt: "2025-09-01T09:30:00", status: "Compliant", severity: "None", generatedBy: "System" },
];

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = [
  { id: "U001", name: "Ramesh Kumar", role: "Regulator", designation: "Senior Inspector", dept: "Legal Metrology Dept., Maharashtra" },
  { id: "U002", name: "Anjali Desai", role: "Manufacturer", designation: "Compliance Manager", dept: "Amul — Quality & Regulatory" },
  { id: "U003", name: "Siddharth Nair", role: "Marketplace", designation: "Marketplace Risk Officer", dept: "NovaMart India Pvt. Ltd." },
  { id: "U004", name: "Priya Sharma", role: "Admin", designation: "System Administrator", dept: "LabelGuard AI Ops" },
];

export const alerts = [
  { id: "A001", type: "violation", message: "MRP Mismatch detected — Haldiram's Aloo Bhujia batch #HB2409", time: "2h ago", severity: "High" },
  { id: "A002", type: "amendment", message: "Rule update synced — LMPC Schedule II (2025 amendment) now active", time: "1d ago", severity: "Info" },
  { id: "A003", type: "review", message: "3 scans pending human review — queue growing", time: "3h ago", severity: "Medium" },
  { id: "A004", type: "violation", message: "Imported product missing Country of Origin — Borges Olive Oil", time: "5h ago", severity: "High" },
];
