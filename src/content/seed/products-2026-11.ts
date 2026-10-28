// November 2026: the ERP becomes a product of its own, and Kara and Design
// Suite gain what now runs between them — engineering changes sent from the
// design to the ERP, the shop floor and field service in Kara.
// Applied by migration "2026-11-erp-shop-floor" (../migrations.ts). As in
// products-2026-10.ts, statements describe what runs in production.
import type { ProductEntry } from '../types';

type Text = Omit<ProductEntry, 'image' | 'headerImage' | 'gallery' | 'schematics' | 'status' | 'order' | 'seo'> & {
  seo: ProductEntry['seo'];
  image: string;
};

export const erpProduct: Text = {
  slug: 'simorgh-erp',
  name: 'SIMORGH ERP',
  short: 'ERP',
  domain: 'enterprise',
  icon: 'ledger',
  accent: 'MANUFACTURING ERP · PLM · QUALITY · SERVICE',
  image: '/images/products/simorgh-erp/banner.jpg',
  featured: true,
  tagline: 'From the signed order to the signed service report, one record for every panel you build.',
  summary:
    'Simorgh ERP runs sales, purchasing, production, quality, stock, accounting and after-sales for engineer-to-order manufacturers. It is built on Odoo Community and the OCA modules, with our own modules for product lifecycle (PLM), measured factory tests, a management view of every customer and an AI assistant that drafts while people decide. Designs arrive from Simorgh Design Suite as engineering changes; people on the shop floor and in the field work in Simorgh Kara.',
  capabilities: [
    { title: 'Order to cash', body: 'Quotation, sales order, delivery, invoice and payment in one chain; a turnkey order for a panel with installation and support opens the manufacturing order, the project and the purchases together.' },
    { title: 'MRP II planning', body: 'Multi-level material planning over the bills of materials, with planned orders for what to make and what to buy, and a daily alert for parts that will run short.' },
    { title: 'PLM and engineering changes', body: 'Every design change is an engineering change order: staged approvals, a new BoM revision, its documents, its cost against the current BoM, and the manufacturing orders it affects.' },
    { title: 'Quality and factory tests', body: 'Receiving inspection with failed goods moved to quarantine; IEC 62271-200 routine tests recorded with measured values, limits and pass or fail; non-conformities and quality alerts that can open a change.' },
    { title: 'Imports and purchasing', body: 'Purchases in foreign currency, freight, insurance, duty and clearance spread over the goods as landed costs, and a second approval above your threshold.' },
    { title: 'Field service and helpdesk', body: 'Installation, commissioning and support visits as field-service orders with the customer’s signature; tickets with an AI-drafted reply that a person edits and sends.' },
    { title: 'Customer 360', body: 'For each customer: ordered, margin, goods and services, collected, due, open pipeline and the cost of serving them, in one pivot for management.' },
  ],
  industries: ['Switchgear', 'Manufacturing', 'Industrial Automation', 'Electricity & Energy'],
  pipeline: [
    { label: 'Order', detail: 'Quotation and sales order; a turnkey order also opens the project and the purchases.' },
    { label: 'Engineering', detail: 'The design arrives from Design Suite as an engineering change with its BoM and documents.' },
    { label: 'Planning', detail: 'MRP II turns orders and BoMs into planned production and purchases.' },
    { label: 'Supply', detail: 'Purchases, imports and landed costs; receiving inspection and quarantine.' },
    { label: 'Production', detail: 'Work orders run from Kara on the shop floor, with consumption and scrap recorded.' },
    { label: 'Test and delivery', detail: 'Routine tests with measured values, then delivery and invoice.' },
    { label: 'Service', detail: 'Installation, commissioning and support, signed by the customer on site.' },
  ],
  metrics: [
    { value: '1', label: 'Record from the order to the service report' },
    { value: 'IEC 62271-200', label: 'Routine tests with measured values' },
    { value: '0', label: 'Licence fees for the ERP core (Odoo Community, LGPL)' },
  ],
  faq: [
    { q: 'Is it Odoo?', a: 'The core is Odoo 19 Community with OCA modules, all open source. Our own modules add PLM, measured tests, the management view, the AI assistant and the interfaces to Kara and Design Suite. No Odoo Enterprise code is used.' },
    { q: 'Does everyone have to work in the ERP?', a: 'No. Accountants, planners, buyers and storekeepers do. Engineers stay in Design Suite, and the rest of the company, including the shop floor and the field technicians, works in Kara.' },
    { q: 'How do designs reach production?', a: 'From Design Suite, Send to PLM turns each panel’s design into an engineering change with its BoM and MTO sheet. Once approved, the new BoM revision is what production and purchasing use.' },
    { q: 'Does the AI change our data?', a: 'No. It drafts replies and flags shortages; a person reads, edits and decides. The model runs on your own servers.' },
  ],
  seo: {
    title: 'Simorgh ERP — manufacturing ERP with PLM, quality and field service',
    description: 'Order to cash, MRP II, PLM with engineering changes, IEC 62271-200 tests with measured values, imports with landed costs, field service and a Customer 360 view, on Odoo Community, on your own servers.',
    keywords: 'manufacturing ERP, engineer to order, switchgear ERP, PLM, engineering change order, MRP II, Odoo Community, field service, quality control',
    image: '',
  },
};

/** What changes on Kara: the shop floor and field service, and the ERP named as its own product. */
export const karaUpdate: Pick<ProductEntry, 'summary' | 'capabilities' | 'pipeline' | 'faq'> = {
  summary:
    'Kara is where people work: tasks and approvals, attendance and leave, partners, products and orders, the shop floor and field service, calls and meetings, all on one screen with one sign-in. Behind it, Simorgh ERP keeps the books, stock, production and quality, while Kara keeps the work moving between people, teams and partner companies.',
  capabilities: [
    { title: 'Companies, holdings and partner networks', body: 'Each company has its own members, roles and permissions; holdings see across their companies; partner companies join a shared project without seeing each other’s data.' },
    { title: 'Kartabl and work desk', body: 'One inbox for every task and approval, with reminders, delegation and a full history of who decided what and when.' },
    { title: 'Attendance, shifts and leave', body: 'Work schedules, holidays, attendance devices and face check-in, leave and mission requests with multi-step approval and an AI leave assistant.' },
    { title: 'Shop floor', body: 'Operators scan a work order’s barcode on a phone or tablet, start, pause and finish it, record the parts they used and the scrap, and read the work instruction, without opening the ERP.' },
    { title: 'Field service', body: 'Technicians see their installation and support visits, write the report on site and the customer signs it on the screen; the signed report goes straight to the ERP.' },
    { title: 'Engineering changes', body: 'Engineers and managers follow and approve the changes sent from Design Suite: the panel, its BoM, its documents and what it costs.' },
    { title: 'ERP backbone without the ERP screens', body: 'Partners, products, employees, orders, work orders and service visits live in Simorgh ERP; Kara reads and writes them through an audited connector.' },
    { title: 'Calls and meetings', body: 'Voice and video calls between colleagues and a meeting room for every company and project, on your own Jitsi server.' },
  ],
  pipeline: [
    { label: 'People and companies', detail: 'Accounts, organisations and roles in one identity service.' },
    { label: 'Work', detail: 'Tasks, approvals and requests in the kartabl.' },
    { label: 'Shop floor and field', detail: 'Work orders scanned and run on the floor; service visits reported and signed on site.' },
    { label: 'Business records', detail: 'Partners, products, orders, production and service in Simorgh ERP through the connector.' },
    { label: 'Events', detail: 'Every change published once on the message bus, in order.' },
    { label: 'Insight', detail: 'Read models, reports and process analytics built from those events.' },
  ],
  faq: [
    { q: 'Do our people have to use the ERP?', a: 'No. Accounting, planning, purchasing and stock specialists use Simorgh ERP directly; everyone else, including operators and field technicians, works in Kara.' },
    { q: 'Does the shop floor need special hardware?', a: 'No. A phone or tablet with a camera scans the barcodes; a USB or Bluetooth scanner works too.' },
    { q: 'Can partner companies work with us in Kara?', a: 'Yes. A partner company gets its own organisation and sees only the projects, files and conversations shared with it.' },
    { q: 'Where does it run?', a: 'On your own servers or private cloud (Kubernetes). Sign-in, files, meetings, the ERP and the AI models all stay inside your network.' },
    { q: 'What is on the roadmap?', a: 'The BPMN process engine with a visual modeller, company chat, and a process lab that simulates what-if changes from your own event logs.' },
  ],
};

/** What changes on Design Suite: the schematic editor and Send to PLM. */
export const designSuiteUpdate: Pick<ProductEntry, 'capabilities' | 'pipeline' | 'faq'> = {
  capabilities: [
    { title: 'Specification and SLD analysis', body: 'Client specifications, load lists and single line diagrams are read by AI; values that agree, are new or conflict with your own rules are marked for an engineer to decide.' },
    { title: 'Project map', body: 'The requisition, scope, requirements and document register of a project in one model, each value with its source.' },
    { title: 'Catalogue and templates', body: 'Cubicles, breakers and basket catalogues with inheritance; templates built from them, with real part codes from your stock system.' },
    { title: 'Simorgh Draw', body: 'A schematic editor in the browser that reads your EPLAN symbol and macro libraries; parts come from your EPLAN parts database with their macros and technical data.' },
    { title: 'Electrical studies', body: 'Load flow, short circuit to IEC 60909, harmonics and busbar sizing from the same project data.' },
    { title: 'EPLAN generation', body: 'The EPLAN project built from the design on your EPLAN workstation, as a background job.' },
    { title: 'Send to PLM', body: 'Each panel’s design goes to Simorgh ERP as an engineering change, with its BoM, its MTO sheet and its documents, for approval before production.' },
    { title: 'Documents and reports', body: 'Project documents versioned in Git; offer reports, project data and MTO exported to your Excel templates.' },
  ],
  pipeline: [
    { label: 'Tender documents', detail: 'Specifications, SLDs, load and I/O lists uploaded to the project.' },
    { label: 'AI analysis', detail: 'Text and vision models extract values and compare them with your rules.' },
    { label: 'Engineer review', detail: 'Proposals accepted or corrected; corrections become training data.' },
    { label: 'Scope and templates', detail: 'Panels built from the catalogue with real part codes.' },
    { label: 'Studies and drawings', detail: 'Load flow, short circuit and harmonics; schematics in Simorgh Draw.' },
    { label: 'Output', detail: 'EPLAN project, MTO and offer reports.' },
    { label: 'To production', detail: 'Send to PLM: an engineering change in Simorgh ERP for each panel.' },
  ],
  faq: [
    { q: 'Does the AI decide the design?', a: 'No. It proposes; an engineer accepts or corrects every value, and the decision is recorded.' },
    { q: 'Can it use our own catalogue and rules?', a: 'Yes. The catalogue, templates and your company rules are part of every analysis and design.' },
    { q: 'Does it work with our existing EPLAN?', a: 'Yes. Simorgh Draw reads your EPLAN symbol and macro libraries and parts database, and a small agent on your EPLAN workstation builds the project from the Design Suite data.' },
    { q: 'How does a design reach the factory?', a: 'Send to PLM creates an engineering change in Simorgh ERP for each panel. After approval its BoM revision drives planning, purchasing and the work orders.' },
  ],
};

/** The products in the order the site shows them after this migration. */
export const productOrder = ['simorgh-kara', 'simorgh-erp', 'simorgh-design-suite', 'simorgh-engineering-ai', 'simorgh-hr-assistant', 'simorgh-cloud'];
