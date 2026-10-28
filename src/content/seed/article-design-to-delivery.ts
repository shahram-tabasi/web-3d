// The article on the connected platform: Design Suite → PLM → ERP → Kara
// (November 2026). Applied by migration "2026-11-erp-shop-floor".
import type { Article } from '../types';

export const designToDeliveryArticle: Article = {
  slug: 'from-design-to-delivery-one-thread',
  title: 'From design to delivery: one thread from the engineer’s drawing to the customer’s signature',
  kind: 'Technical Article',
  category: 'Platform',
  readTime: '9 min read',
  date: '2026-11-01',
  author: 'SIMORGH Engineering',
  excerpt:
    'How Simorgh Design Suite, Simorgh ERP and Simorgh Kara now work as one platform for an engineer-to-order manufacturer: a panel’s design becomes an engineering change, the change becomes a bill of materials, the bill drives planning, purchasing and the shop floor, and the service visit closes the loop.',
  cover: '/articles/design-to-delivery.jpg',
  video: '',
  status: 'published',
  seo: {
    title: 'From design to delivery: Design Suite, PLM, ERP and the shop floor as one platform',
    description: 'How an engineer-to-order manufacturer connects switchgear design, engineering change orders, MRP II, factory tests, the shop floor and field service with Simorgh Design Suite, Simorgh ERP and Simorgh Kara.',
    keywords: 'engineer to order, switchgear manufacturing, PLM, engineering change order, ERP, MRP II, shop floor, field service, Odoo, Simorgh',
    image: '/articles/design-to-delivery.jpg',
  },
  body: `A switchgear manufacturer does not sell from a shelf. Every order is designed for one customer: the specification, the single line diagram, the panels, the breakers and relays, the busbars. The design is then built, tested, delivered, installed and serviced for years.

In most companies that journey crosses four or five systems that do not talk to each other. The design lives in engineering files, the bill of materials is retyped into the ERP, the shop floor works from printouts, test results are written on paper, and after-sales starts from an email. Every handover is a chance to lose a revision, a part code or a promise.

Over the last months we have connected the Simorgh products so that one thread runs from the engineer’s drawing to the customer’s signature. This article describes that thread, stage by stage, and the decisions behind it.

![From design to delivery: Design Suite, Simorgh ERP and Kara](/articles/design-to-delivery-flow.svg)

## Three products, three kinds of user

We did not build one application for everybody. Each group of people works where its work is:

- **Engineers** work in **Simorgh Design Suite**: specifications, single line diagrams, panels, studies, schematics and the EPLAN project.
- **Planners, buyers, storekeepers, quality and accounting** work in **Simorgh ERP**, built on Odoo Community and the OCA modules with our own additions.
- **Everyone else**, including managers, operators on the shop floor and technicians in the field, works in **Simorgh Kara**, the organisation platform: the kartabl of tasks and approvals, attendance and leave, and now the shop floor and field service.

Behind them sit one sign-in (Keycloak), one message bus for events, an audited connector between Kara and the ERP, and language models running on our own GPU servers.

## 1. The order

A turnkey order is rarely only a panel. It is a panel, its installation and commissioning, and a period of support. In Simorgh ERP these are three product lines on one sales order. Confirming it creates what each line needs: a manufacturing order for the panel, a project with its tasks for the engineering and on-site work, and the purchases for anything bought in.

## 2. The design becomes an engineering change

The engineer designs the panels in Design Suite from the customer’s documents. AI reads the specification and the single line diagram and proposes values; the engineer accepts or corrects each one, and every value keeps a link to the page it came from.

When the design is ready, **Send to PLM** sends each panel to Simorgh ERP as an **engineering change order (ECO)**. The change carries the panel’s bill of materials, its MTO sheet and its documents. It does not overwrite anything: it is a proposal that passes through stages, and each stage has its approvers.

Before anyone approves, the ERP shows what the change means:

- the **cost** of the new bill of materials against the current one, line by line;
- the **manufacturing orders already open** that the change would affect;
- the **documents** attached to it.

Only when the last stage is approved does the new **BoM revision** become the one production and purchasing use. The old revision is kept, so it is always clear which panel was built to which design.

## 3. Planning and purchasing

With the bill of materials in place, **MRP II** (multi-level material planning) works out what has to be made and what has to be bought, and when. A daily check warns the planners about parts that will run short in the next two weeks, unless a planned order already covers them.

A large share of switchgear components is imported. Purchases are made in the supplier’s currency, and freight, insurance, customs duty and clearance are added as **landed costs** and spread over the goods, so the cost of a breaker in stock is what it really cost to bring it in. Purchases above a set amount need a second approval.

## 4. Receiving and quality

Goods are inspected on arrival. If an inspection fails, the goods do not go to stock: they are moved to a **quarantine** location, and a quality alert is raised. A quality alert can open an engineering change of its own when the problem is in the design rather than in the delivery.

## 5. The shop floor, in Kara

Operators do not need the ERP. In Kara, on a phone or tablet, they **scan the barcode** of a work order, start it, pause it, finish it, record the parts they used and any scrap, and read the work instruction for that step. Everything they do is written to the manufacturing order in the ERP through the connector, with who did it and when.

## 6. Factory tests with measured values

A switchgear panel is not finished until it passes its routine tests. The tests of **IEC 62271-200** are recorded as measured values with their limits: the power-frequency voltage test of the main and auxiliary circuits, the resistance of the main circuit, the mechanical operation checks. A value outside its limits fails the test, and a failed test is visible on the manufacturing order before anything is delivered.

## 7. Installation and service, signed on site

After delivery, installation, commissioning and support visits are **field-service orders**. The technician sees their visits in Kara, writes the report on site and the customer **signs it on the screen**. The signed report is stored on the order in the ERP.

Support requests arrive as helpdesk tickets. For each one the AI assistant can **draft a reply** from the ticket and its history; a person reads it, edits it and decides whether to send it. The AI never sends anything by itself.

## 8. Management sees the whole customer

Because every stage is recorded on the same customer, management gets one view per customer, **Customer 360**: what they ordered, the margin, goods and services, what has been collected and what is due, the open pipeline and the cost of serving them after delivery.

## Decisions behind the design

**Each user works in their own tool.** An operator on the shop floor needs three buttons and a scanner, not an ERP menu. The connector lets Kara offer exactly that while the ERP remains the single record.

**Changes are proposals, not overwrites.** A design sent to production is an engineering change with approvals, cost and impact, and the old revision is kept. That is what makes a delivered panel traceable years later.

**AI drafts, people decide.** Specification analysis, ticket replies and shortage warnings all come from AI, and all of them stop at a person. The models run on our own servers; company data does not go to outside AI services.

**Open source at the core.** The ERP core is Odoo Community with the OCA modules. Our own modules add PLM, measured tests, the management view, the AI assistant and the interfaces, without depending on licensed editions.

## What comes next

The next steps are a BPMN process engine in Kara with a visual modeller, so that approval flows can be drawn instead of configured, and a process lab that uses the events this platform already records to simulate what-if changes before making them, as described in our article on [business process simulation with SIMOD](/insights/business-process-simulation-simod-kara).

If you manufacture to order and recognise the handovers described here, [request a demo](/request-demo): we will walk through the thread with one of your own projects.`,
};
