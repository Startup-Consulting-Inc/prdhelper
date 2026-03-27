/**
 * Blog Post: 5 BRD Templates for Different Industries (With Examples)
 */

import { BlogPostLayout } from '../../../components/blog/BlogPostLayout';

export default function BRDTemplatesByIndustryPost() {
  return (
    <BlogPostLayout
      title="5 BRD Templates for Different Industries (With Examples)"
      author="Sarah Chen"
      date="2026-02-18"
      readTime="12 min read"
      category="Templates"
      excerpt="One BRD template doesn't fit all industries. Here are 5 specialized BRD templates for SaaS, healthcare, finance, e-commerce, and enterprise IT — with examples for each."
      slug="brd-templates-by-industry"
      coverImage="📋"
      coverGradient="from-teal-600 via-emerald-600 to-green-600"
    >
      <h2>Why Generic BRD Templates Fall Short</h2>
      <p>
        Most BRD templates circulating online were written for a generic enterprise context —
        typically a large corporation implementing a new internal system in the early 2000s.
        The template is fine for what it is. But it was never designed for a HIPAA-regulated
        healthcare platform, a PCI-DSS compliant payments product, or a modern SaaS business
        operating under subscription economics and API-first architecture.
      </p>
      <p>
        The problem isn't that those generic templates are wrong. It's that they're incomplete
        in ways that matter enormously by industry. A healthcare BRD that doesn't include patient
        data handling and clinical workflow sections isn't a BRD — it's a liability. A financial
        services BRD without regulatory compliance sections will be sent back by compliance
        on the first review. An e-commerce BRD that doesn't address tax logic and fulfillment
        complexity is missing half the hard work.
      </p>
      <p>
        Industry context shapes three things in a BRD:
      </p>
      <ul>
        <li>
          <strong>Regulatory requirements:</strong> Healthcare has HIPAA. Finance has SOX, PCI-DSS,
          and increasingly complex AML/KYC requirements. E-commerce has tax nexus obligations
          and consumer protection regulations that vary by jurisdiction. SaaS has GDPR and
          data residency concerns. These aren't optional sections — they're legally mandatory.
        </li>
        <li>
          <strong>Stakeholder types:</strong> A healthcare BRD has clinical stakeholders who
          speak in workflows and patient outcomes, not software features. A financial BRD has
          compliance officers and risk committees who care about audit trails and regulatory
          reporting. Knowing your stakeholders shapes how you write every section.
        </li>
        <li>
          <strong>Domain-specific requirements:</strong> Subscription tiers and trial conversion
          are SaaS-specific. Inventory management and fulfillment are e-commerce-specific.
          No generic template will prompt you to think about these if you're operating in
          a niche that the template author never considered.
        </li>
      </ul>
      <p>
        What follows are five industry-specific BRD templates — their key sections, what makes
        each one distinctive, and concrete requirement examples for each.
      </p>

      <h2>Template 1: SaaS Product BRD</h2>
      <p>
        SaaS BRDs are written for products delivered over the internet on a subscription basis.
        The unique characteristics are the subscription-based commercial model, the multi-tenant
        architecture, the API-first integration expectations from customers, and the emphasis
        on scalability and reliability as core business requirements (not just technical ones).
      </p>

      <h3>Key Sections</h3>
      <ul>
        <li>
          <strong>User Tiers and Subscription Model:</strong> Define the user types (free trial,
          starter, professional, enterprise), what each tier can access, and how the pricing
          model shapes feature availability. This section belongs in the BRD — not the PRD —
          because it's a business decision that constrains all subsequent product decisions.
        </li>
        <li>
          <strong>Integration Requirements:</strong> Most SaaS products must integrate with
          the customer's existing software ecosystem. The BRD should enumerate which integrations
          are in scope (Salesforce, HubSpot, Slack, Zapier, etc.) and whether these are required
          for launch or planned for subsequent phases.
        </li>
        <li>
          <strong>API Requirements:</strong> SaaS customers — especially in B2B — increasingly
          expect public APIs. The BRD should specify whether a public API is in scope, what
          authentication method it will use (OAuth 2.0, API keys), and what the API rate limiting
          strategy will be.
        </li>
        <li>
          <strong>Scalability Targets:</strong> Investor and enterprise customer due diligence
          will ask about these. The BRD should document the expected user scale (Year 1: 1,000
          accounts; Year 3: 50,000 accounts), data volume projections, and peak load assumptions.
        </li>
        <li>
          <strong>Data Privacy and GDPR Compliance:</strong> Any SaaS product with EU customers
          must address data residency, right to deletion, data processing agreements, and cookie
          consent. These are business requirements, not technical details.
        </li>
      </ul>

      <h3>Sample Requirements</h3>
      <ul>
        <li>
          The platform shall support three subscription tiers: Free (up to 3 users, 5 projects),
          Professional ($49/month per seat, unlimited projects, API access), and Enterprise
          (custom pricing, SSO, dedicated support SLA, custom data retention).
        </li>
        <li>
          The platform shall provide a REST API with OAuth 2.0 authentication. API rate limits
          shall be enforced per subscription tier: Free: 100 requests/hour; Professional:
          1,000 requests/hour; Enterprise: configurable up to 10,000 requests/hour.
        </li>
        <li>
          EU customer data shall be stored exclusively in EU-region data centers. The platform
          shall support GDPR Article 17 (right to erasure) requests, completing full data
          deletion within 30 days of a verified request.
        </li>
      </ul>

      <h2>Template 2: Healthcare BRD</h2>
      <p>
        Healthcare is one of the most regulated and highest-stakes domains in software. A healthcare
        BRD must address HIPAA compliance, clinical workflows, patient safety implications, and
        often FDA regulatory classification before a single line of code is written. Non-compliance
        isn't a product risk — it's a legal liability for the organization.
      </p>

      <h3>Key Sections</h3>
      <ul>
        <li>
          <strong>HIPAA Compliance:</strong> Any system that stores, transmits, or processes
          Protected Health Information (PHI) must address the HIPAA Security Rule and Privacy Rule.
          The BRD must define what constitutes PHI in this system, who has access, how access
          is logged, and what the breach notification procedure is.
        </li>
        <li>
          <strong>Patient Data Handling:</strong> Beyond HIPAA, document data minimization
          principles (collect only what's needed), data retention schedules (PHI retention
          requirements vary by state), and de-identification procedures for analytics use cases.
        </li>
        <li>
          <strong>Clinical Workflow Integration:</strong> Healthcare software must fit existing
          clinical workflows, not force clinical staff to adapt their workflows to software.
          This section documents the current-state workflow (as-is), the desired future-state
          workflow (to-be), and the specific pain points the system must address.
        </li>
        <li>
          <strong>Regulatory Approvals:</strong> If the product is or might be a medical device
          under FDA 21 CFR Part 11 or EU MDR regulations, this must be identified in the BRD.
          The regulatory pathway should be defined before product design begins.
        </li>
        <li>
          <strong>Audit Trail Requirements:</strong> Healthcare systems require comprehensive
          audit trails for all actions on patient data — who accessed what, when, and from
          where. The BRD should define retention periods for audit logs and access review procedures.
        </li>
      </ul>

      <h3>Sample Requirements</h3>
      <ul>
        <li>
          The system shall implement HIPAA-compliant encryption for all PHI: AES-256 at rest,
          TLS 1.2+ in transit. All access to PHI shall be logged with user ID, timestamp,
          action type, and patient record identifier. Audit logs shall be retained for a minimum
          of 6 years.
        </li>
        <li>
          The system shall integrate with the organization's existing Epic EHR via HL7 FHIR R4
          APIs. Patient demographics, encounter history, and medication lists shall be available
          within the application without duplicate data entry.
        </li>
        <li>
          Clinical staff shall be able to access patient records within 3 clicks from login.
          Emergency access (break-glass) shall be available for situations where normal authorization
          pathways are unavailable, with all break-glass accesses flagged for compliance review.
        </li>
      </ul>

      <h2>Template 3: Financial Services BRD</h2>
      <p>
        Financial services BRDs operate under one of the densest regulatory environments in any
        industry. SOX compliance for public companies, PCI-DSS for payment handling, BSA/AML for
        transaction monitoring, and a growing patchwork of state-level regulations all impose
        specific technical and procedural requirements that must appear in the BRD before any
        implementation begins.
      </p>

      <h3>Key Sections</h3>
      <ul>
        <li>
          <strong>Regulatory Compliance (SOX, PCI-DSS):</strong> For public companies, SOX
          requires controls around financial reporting systems. For any system that stores or
          processes cardholder data, PCI-DSS compliance is mandatory. The BRD must identify
          which regulations apply and what controls are required.
        </li>
        <li>
          <strong>Data Security and Encryption:</strong> Financial data has specific encryption
          requirements. This section documents encryption standards for data at rest and in transit,
          key management procedures, tokenization requirements for sensitive data (card numbers,
          account numbers), and data masking rules for non-production environments.
        </li>
        <li>
          <strong>Transaction Integrity:</strong> Financial transactions require ACID-compliant
          database operations, idempotency guarantees for payment operations, reconciliation
          mechanisms, and clear rollback procedures for failed transactions.
        </li>
        <li>
          <strong>Fraud Prevention:</strong> The BRD should document the fraud detection approach:
          rule-based systems, machine learning models, velocity limits, geographic restrictions,
          and manual review workflows for flagged transactions.
        </li>
        <li>
          <strong>Audit Requirements:</strong> Financial systems require immutable audit trails.
          The BRD should specify what events are audited, retention periods (often 7 years for
          financial records), and how audit data is protected from modification.
        </li>
      </ul>

      <h3>Sample Requirements</h3>
      <ul>
        <li>
          The system shall be PCI-DSS Level 1 compliant. Primary Account Numbers (PANs) shall
          never be stored in plain text. Tokenization shall be implemented using a PCI-validated
          payment processor. The system shall pass an annual PCI-DSS QSA audit.
        </li>
        <li>
          All financial transactions shall be recorded in an immutable ledger. Transactions
          shall be idempotent — duplicate submission of the same transaction request shall
          return the result of the original transaction without processing it twice.
        </li>
        <li>
          The fraud detection system shall flag transactions exceeding $5,000 for manual review.
          Velocity rules shall block more than 5 transactions from a single card within a
          60-minute window. All fraud decisions shall be logged with the rule triggered and
          analyst review notes.
        </li>
      </ul>

      <h2>Template 4: E-commerce BRD</h2>
      <p>
        E-commerce BRDs are deceptively complex. The surface looks familiar — a product catalog,
        a cart, a checkout — but the operational requirements underneath are substantial. Tax
        nexus calculations across jurisdictions, fulfillment integration with warehouse management
        systems, carrier rate shopping, inventory synchronization across channels, and return
        logistics all require explicit specification in the BRD or they will be discovered
        painfully during implementation.
      </p>

      <h3>Key Sections</h3>
      <ul>
        <li>
          <strong>Product Catalog:</strong> Document the product taxonomy, attribute model,
          variant structure (size/color combinations), digital vs. physical product handling,
          and how the catalog integrates with supplier or ERP systems.
        </li>
        <li>
          <strong>Payment Processing:</strong> Specify accepted payment methods, the payment
          processor(s) to be used, how payment failures are handled, subscription or installment
          payment support, and refund workflows.
        </li>
        <li>
          <strong>Inventory Management:</strong> Describe how inventory levels are tracked
          (real-time vs. batch), how out-of-stock products are handled in the catalog, whether
          backorder or pre-order scenarios are supported, and how inventory syncs with physical
          locations or 3PLs.
        </li>
        <li>
          <strong>Fulfillment:</strong> Document the fulfillment model (in-house, 3PL, dropship,
          or hybrid), carrier integrations for rate calculation and label generation, delivery
          options (standard, expedited, same-day), and order tracking communication to customers.
        </li>
        <li>
          <strong>Tax and Shipping Logic:</strong> Tax nexus rules vary by state and country.
          The BRD must specify which markets the platform serves, how sales tax is calculated
          (real-time API vs. rate tables), how VAT is handled for international orders, and
          how shipping rates are calculated.
        </li>
      </ul>

      <h3>Sample Requirements</h3>
      <ul>
        <li>
          The catalog shall support product variants with up to 3 variant dimensions (e.g.,
          size, color, material) and up to 100 SKUs per parent product. Variant-level inventory
          shall be tracked independently. Products with zero inventory across all variants shall
          display as "Out of Stock" with optional email notification signup.
        </li>
        <li>
          Sales tax shall be calculated in real-time using the Avalara AvaTax API for all US
          orders. The system shall support tax-exempt orders with exemption certificate upload
          and validation. International orders shall display VAT-inclusive pricing for EU customers.
        </li>
        <li>
          The system shall integrate with ShipStation for order fulfillment. Carrier rate
          shopping shall occur at checkout for all orders, displaying actual carrier rates
          from UPS, FedEx, and USPS. Shipping labels shall be generated automatically upon
          payment confirmation.
        </li>
      </ul>

      <h2>Template 5: Enterprise IT BRD</h2>
      <p>
        Enterprise IT projects — ERP implementations, CRM deployments, ITSM upgrades, data
        warehouse migrations — involve the most complex stakeholder environments, the largest
        budgets, and the highest risk of scope creep of any BRD category. These BRDs must
        address legacy system integration, change management, data migration risk, and IT
        security governance requirements that don't appear in any other category.
      </p>

      <h3>Key Sections</h3>
      <ul>
        <li>
          <strong>Legacy System Integration:</strong> Document all systems the new solution must
          integrate with, the integration mechanism (real-time API, batch ETL, middleware), data
          flows between systems, and the sunset plan for legacy systems being replaced.
        </li>
        <li>
          <strong>Change Management:</strong> Enterprise IT projects fail at the people level
          as often as at the technical level. The BRD should document the training plan, the
          communication strategy, the go-live cutover approach, and who owns user adoption.
        </li>
        <li>
          <strong>Data Migration:</strong> Define what data must be migrated from legacy systems,
          the data quality validation approach, how data conflicts are resolved, what the
          migration testing strategy is, and what the rollback plan is if migration fails.
        </li>
        <li>
          <strong>SSO and LDAP Integration:</strong> Enterprise IT deployments must integrate
          with the organization's identity provider. Document the identity provider (Active
          Directory, Okta, Azure AD), the authentication protocol (SAML 2.0, OIDC), and
          how user provisioning and de-provisioning are handled.
        </li>
        <li>
          <strong>Disaster Recovery:</strong> Enterprise systems require formal DR planning.
          The BRD should document the RTO (Recovery Time Objective), RPO (Recovery Point
          Objective), the backup strategy, and the failover procedure.
        </li>
      </ul>

      <h3>Sample Requirements</h3>
      <ul>
        <li>
          The new ERP system shall integrate bi-directionally with the existing Salesforce CRM.
          Customer account data, order history, and contract information shall sync within
          15 minutes of any change in either system. Integration shall use Salesforce's REST API
          with OAuth 2.0 authentication.
        </li>
        <li>
          The system shall support Single Sign-On via SAML 2.0 with the organization's Azure
          Active Directory. All user accounts shall be provisioned and de-provisioned via
          Azure AD group membership. Local user accounts shall not be permitted.
        </li>
        <li>
          All historical data from the legacy system (minimum 7 years) shall be migrated to
          the new platform. A data validation report comparing record counts and key field
          values shall be approved by Finance before go-live. The migration shall include
          a tested rollback procedure executable within 4 hours.
        </li>
      </ul>

      <h2>How Clearly Adapts to Different Industries</h2>
      <p>
        Writing an industry-specific BRD from scratch requires knowing which questions to ask —
        and most teams don't have that knowledge until they've shipped their first HIPAA audit
        finding or their first PCI compliance gap.
      </p>
      <p>
        Clearly's AI is trained on requirements patterns across industries. When you describe
        your product and industry context, Clearly automatically surfaces the relevant regulatory,
        operational, and domain-specific requirements sections for your industry. Building a
        healthcare platform? Clearly prompts for HIPAA controls, PHI data handling, and clinical
        workflow documentation. Building a payments product? PCI-DSS and fraud prevention
        requirements appear automatically.
      </p>
      <p>
        You don't need to remember every industry-specific section. Clearly remembers for you.
      </p>
    </BlogPostLayout>
  );
}
