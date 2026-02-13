import { useState, useEffect, useRef, useMemo } from "react";

// ============================================================
// CLIMATE STANDARDS INTELLIGENCE ASSISTANT
// Personal productivity tool for Managing Directors
// ============================================================

// --- STANDARDS KNOWLEDGE BASE ---
const STANDARDS_DB = {
  "IFRS S1": {
    fullName: "IFRS S1 – General Requirements for Disclosure of Sustainability-related Financial Information",
    body: "ISSB / IFRS Foundation",
    jurisdiction: "Global",
    effectiveDate: "2024-01-01",
    status: "Effective",
    sector: "All",
    summary: "Establishes the overarching framework for sustainability-related financial disclosures. Requires entities to disclose material information about sustainability-related risks and opportunities that could reasonably be expected to affect the entity's cash flows, access to finance, or cost of capital. Built around four pillars: Governance, Strategy, Risk Management, and Metrics & Targets.",
    keyRequirements: [
      "Disclose sustainability-related risks and opportunities over short, medium, and long term",
      "Governance processes, controls, and procedures for oversight of sustainability risks",
      "Strategy: business model and value chain impacts",
      "Risk management: processes to identify, assess, prioritize, and monitor",
      "Metrics and targets used to measure, monitor, and manage",
      "Connected disclosures with financial statements",
      "Materiality aligned with IFRS accounting concept (investor-focused)"
    ],
    consumerRetailNotes: "Consumer/retail companies face particular scrutiny on value chain sustainability — upstream sourcing (agriculture, raw materials, manufacturing) and downstream product lifecycle. IFRS S1 requires consideration of the full value chain for material sustainability topics.",
    relatedStandards: ["IFRS S2", "ESRS 1", "AASB S1"],
    keyDifferences: {
      "vs ESRS": "Single materiality (financial) vs double materiality. IFRS S1 focuses on enterprise value impact; ESRS also considers outward impact on people and environment.",
      "vs SEC": "Broader than SEC rule — covers all sustainability topics, not just climate.",
      "vs AASB S1": "Australia's AASB S1 is closely aligned but includes Australian-specific modifications and phased implementation."
    }
  },
  "IFRS S2": {
    fullName: "IFRS S2 – Climate-related Disclosures",
    body: "ISSB / IFRS Foundation",
    jurisdiction: "Global",
    effectiveDate: "2024-01-01",
    status: "Effective",
    sector: "All",
    summary: "Climate-specific standard requiring disclosure of climate-related risks and opportunities. Incorporates and builds on TCFD recommendations. Requires Scope 1, 2, and 3 GHG emissions disclosure, scenario analysis, transition plans, and climate resilience assessment.",
    keyRequirements: [
      "Scope 1 and Scope 2 GHG emissions (absolute, using GHG Protocol)",
      "Scope 3 GHG emissions (with transition relief in year 1)",
      "Climate-related scenario analysis",
      "Transition plan disclosure",
      "Climate resilience assessment",
      "Industry-based metrics (derived from SASB)",
      "Carbon credits and offsets: separate disclosure",
      "Internal carbon pricing if used"
    ],
    consumerRetailNotes: "Consumer/retail companies typically have very large Scope 3 footprints relative to Scope 1+2 — particularly in purchased goods/services (Category 1), upstream/downstream transportation (Cat 4 & 9), and use of sold products (Cat 11). Industry metrics from SASB for consumer goods and retail sectors apply.",
    relatedStandards: ["IFRS S1", "GHG Protocol Corporate Standard", "TCFD", "ESRS E1"],
    keyDifferences: {
      "vs ESRS E1": "IFRS S2 is investor-focused (financial materiality). ESRS E1 requires double materiality and more granular transition plan details including CapEx/OpEx alignment.",
      "vs SEC": "IFRS S2 requires Scope 3; SEC rule made Scope 3 voluntary. IFRS S2 requires scenario analysis; SEC does not.",
      "vs AASB S2": "Closely aligned. Australia adopted IFRS S2 with modifications — phased Scope 3 timeline and additional Australian regulatory context."
    }
  },
  "ESRS E1": {
    fullName: "ESRS E1 – Climate Change",
    body: "EFRAG / European Commission",
    jurisdiction: "European Union",
    effectiveDate: "2024-01-01",
    status: "Effective (phased by company size)",
    sector: "All",
    summary: "The EU's climate disclosure standard under CSRD. Requires double materiality assessment, detailed transition plan disclosure, Scope 1/2/3 emissions, energy consumption, carbon credits, internal carbon pricing, and financial effects of climate risks and opportunities. More prescriptive than IFRS S2 in many areas.",
    keyRequirements: [
      "Double materiality assessment (impact + financial)",
      "Transition plan for climate change mitigation aligned with 1.5°C",
      "GHG emissions: Scope 1, 2, 3 — gross and net",
      "GHG reduction targets (absolute and intensity)",
      "Energy consumption and mix",
      "Carbon credits: detailed disclosure of quality, type, and use",
      "CapEx and OpEx aligned with taxonomy-eligible and taxonomy-aligned activities",
      "Financial effects of climate risks and opportunities (quantified)",
      "Engagement with value chain on climate"
    ],
    consumerRetailNotes: "Consumer/retail companies in the EU or with significant EU operations face full ESRS reporting. The taxonomy alignment requirements for CapEx/OpEx are particularly relevant for companies investing in sustainable product lines, store retrofits, cold chain improvements, and supply chain decarbonization.",
    relatedStandards: ["ESRS 1", "ESRS 2", "ESRS E2-E5", "EU Taxonomy", "IFRS S2"],
    keyDifferences: {
      "vs IFRS S2": "Double materiality. More prescriptive transition plan requirements. Requires taxonomy alignment of CapEx/OpEx. More detailed carbon credit disclosures.",
      "vs SEC": "Significantly more comprehensive. Double materiality, mandatory Scope 3, scenario analysis, taxonomy alignment.",
      "vs TCFD": "ESRS E1 builds on TCFD but goes much further — quantified financial effects, taxonomy alignment, detailed transition plans."
    }
  },
  "ESRS (Cross-cutting)": {
    fullName: "ESRS 1 & ESRS 2 – General Requirements and General Disclosures",
    body: "EFRAG / European Commission",
    jurisdiction: "European Union",
    effectiveDate: "2024-01-01",
    status: "Effective (phased)",
    sector: "All",
    summary: "ESRS 1 sets the architecture: double materiality, value chain scope, time horizons, and reporting principles. ESRS 2 requires mandatory disclosures regardless of materiality assessment — governance, strategy, impact/risk/opportunity management, and metrics. These are the foundation for all topical standards (E1-E5, S1-S4, G1).",
    keyRequirements: [
      "Double materiality assessment (mandatory process, documented)",
      "Governance: roles, expertise, incentives linked to sustainability",
      "Strategy: business model, value chain, stakeholder engagement",
      "Impact, risk, and opportunity (IRO) identification and management",
      "Due diligence processes",
      "Targets: required for all material topics",
      "Action plans with resources and timelines",
      "ESRS 2 disclosures are always mandatory regardless of materiality"
    ],
    consumerRetailNotes: "Consumer/retail companies must conduct thorough double materiality assessments across their often-complex value chains. The mandatory nature of ESRS 2 disclosures means even topics assessed as not material require explanation of why they are not.",
    relatedStandards: ["ESRS E1-E5", "ESRS S1-S4", "ESRS G1", "CSRD"],
    keyDifferences: {
      "vs IFRS S1": "Double vs single materiality. ESRS 2 has mandatory disclosures even if a topic is not material. More prescriptive on due diligence and stakeholder engagement.",
      "vs SEC": "Much broader scope — covers all sustainability topics, not just climate."
    }
  },
  "ESRS E2-E5": {
    fullName: "ESRS E2 (Pollution), E3 (Water), E4 (Biodiversity), E5 (Resource Use & Circular Economy)",
    body: "EFRAG / European Commission",
    jurisdiction: "European Union",
    effectiveDate: "2024-01-01",
    status: "Effective (subject to materiality)",
    sector: "All",
    summary: "Environmental topical standards beyond climate. E2 covers pollution of air, water, soil, and substances of concern. E3 addresses water and marine resources. E4 covers biodiversity and ecosystems. E5 addresses resource use and circular economy. All subject to double materiality — only disclosed if material.",
    keyRequirements: [
      "E2: Pollution prevention targets, substances of concern, microplastics",
      "E3: Water consumption, water stress areas, marine resource impacts",
      "E4: Biodiversity impact assessment, ecosystem services, land use change, deforestation",
      "E5: Resource inflows/outflows, waste generation, circular design, product lifecycle"
    ],
    consumerRetailNotes: "Highly material for consumer/retail: E4 (biodiversity/deforestation in agricultural supply chains), E5 (packaging, product circularity, waste), E2 (chemicals in products, microplastics from textiles). These often drive as much stakeholder concern as climate for consumer-facing brands.",
    relatedStandards: ["ESRS E1", "ESRS 1", "EU Taxonomy", "EU Deforestation Regulation"],
    keyDifferences: {
      "vs IFRS": "No equivalent topical standards from ISSB yet (though biodiversity and human capital are in development).",
      "vs GHG Protocol": "GHG Protocol is climate-only. ESRS E2-E5 cover the broader environmental footprint."
    }
  },
  "SEC Climate Rule": {
    fullName: "SEC Climate-Related Disclosure Rule (Final Rule S7-10-22)",
    body: "U.S. Securities and Exchange Commission",
    jurisdiction: "United States",
    effectiveDate: "2026-01-01",
    status: "Finalized but subject to legal challenges; phased implementation",
    sector: "SEC registrants",
    summary: "Requires SEC registrants to disclose climate-related risks, governance, strategy, targets, Scope 1 and Scope 2 GHG emissions (for large accelerated and accelerated filers), and financial statement impacts. Scope 3 was dropped from final rule. Scenario analysis not required. Currently facing legal challenges.",
    keyRequirements: [
      "Climate-related risks: physical and transition risks material to business",
      "Governance of climate risks",
      "Strategy and business model impacts",
      "Scope 1 and 2 GHG emissions (LAFs and AFs only, phased)",
      "Third-party assurance: limited then reasonable (phased)",
      "Financial statement footnotes: climate-related impacts >1% of line item",
      "Targets and goals if set, with progress tracking",
      "Scope 3 NOT required (dropped from proposal)"
    ],
    consumerRetailNotes: "Consumer/retail SEC registrants will need to report Scope 1 and 2 if they are large accelerated or accelerated filers. The 1% financial statement threshold for climate impacts could surface costs related to extreme weather events, supply chain disruptions, carbon pricing exposure, and stranded assets.",
    relatedStandards: ["IFRS S2", "California SB 253", "California SB 261", "TCFD"],
    keyDifferences: {
      "vs IFRS S2": "Narrower — no Scope 3, no scenario analysis requirement. Financial statement footnote threshold is unique to SEC.",
      "vs ESRS E1": "Significantly narrower. No double materiality, no Scope 3, no taxonomy alignment, less prescriptive transition plans.",
      "vs California": "California SB 253 goes further by requiring Scope 3 from companies with >$1B revenue operating in CA, regardless of SEC status."
    }
  },
  "California SB 253": {
    fullName: "California Climate Corporate Data Accountability Act (SB 253)",
    body: "California State Legislature / CARB",
    jurisdiction: "California / United States",
    effectiveDate: "2026-01-01",
    status: "Enacted; CARB rulemaking underway. Implementation dates pushed back.",
    sector: "Companies with >$1B revenue doing business in CA",
    summary: "Requires large companies doing business in California to publicly disclose Scope 1, 2, and 3 GHG emissions annually, verified by an independent third party. Applies regardless of whether the company is publicly traded. One of the broadest U.S. emissions disclosure mandates.",
    keyRequirements: [
      "Scope 1, 2, 3 GHG emissions disclosure (annual)",
      "GHG Protocol-aligned methodology",
      "Independent third-party assurance: limited (initially) then reasonable",
      "Applies to entities with >$1B annual revenue doing business in CA",
      "Public companies AND private companies",
      "Reporting begins 2026 for Scope 1 & 2; 2027 for Scope 3"
    ],
    consumerRetailNotes: "Major consumer/retail companies almost certainly have >$1B revenue and do business in California. This captures many companies that the SEC rule does not (private companies, non-registrants). Scope 3 requirement is significant for the sector.",
    relatedStandards: ["California SB 261", "SEC Climate Rule", "GHG Protocol"],
    keyDifferences: {
      "vs SEC": "Broader entity scope (includes private companies). Requires Scope 3. Lower revenue threshold for coverage.",
      "vs SB 261": "SB 253 is emissions-focused; SB 261 is climate risk-focused (see SB 261 entry)."
    }
  },
  "California SB 261": {
    fullName: "California Climate-Related Financial Risk Act (SB 261)",
    body: "California State Legislature",
    jurisdiction: "California / United States",
    effectiveDate: "2026-01-01",
    status: "Enacted; implementation pushed back",
    sector: "Companies with >$500M revenue doing business in CA",
    summary: "Requires covered entities to prepare and publicly disclose climate-related financial risk reports in line with TCFD recommendations. Biennial reporting. Covers physical and transition risks.",
    keyRequirements: [
      "Climate-related financial risk report (biennial)",
      "Aligned with TCFD framework",
      "Physical and transition risk assessment",
      "Applies to entities with >$500M annual revenue doing business in CA",
      "Public companies AND private companies"
    ],
    consumerRetailNotes: "Lower revenue threshold than SB 253 means this captures a wider set of mid-to-large consumer/retail companies. TCFD-aligned risk reports require scenario thinking about climate impacts on supply chains, stores, distribution, and consumer demand shifts.",
    relatedStandards: ["California SB 253", "TCFD", "SEC Climate Rule"],
    keyDifferences: {
      "vs SB 253": "Risk-focused (not emissions-focused). Lower revenue threshold ($500M vs $1B). Biennial vs annual.",
      "vs SEC": "Broader entity scope. TCFD-aligned risk report rather than SEC's specific disclosure framework."
    }
  },
  "AASB S1": {
    fullName: "AASB S1 – General Requirements for Disclosure of Sustainability-related Financial Information",
    body: "Australian Accounting Standards Board",
    jurisdiction: "Australia",
    effectiveDate: "2025-01-01",
    status: "Effective (phased by entity group)",
    sector: "Large Australian entities (phased)",
    summary: "Australia's adoption of IFRS S1 with Australian modifications. Applies to large entities first (Group 1: >$500M revenue or >$1B assets from Jan 2025), then phasing to smaller entities. Requires sustainability-related financial disclosures aligned with ISSB but with Australian-specific transition provisions.",
    keyRequirements: [
      "Sustainability-related financial disclosures (ISSB-aligned)",
      "Group 1 (largest): reporting from 1 Jan 2025",
      "Group 2: from 1 Jul 2026",
      "Group 3: from 1 Jul 2027",
      "Australian-specific modifications to IFRS S1 baseline",
      "Connected disclosures with financial statements"
    ],
    consumerRetailNotes: "Major consumer/retail companies operating in Australia (or Australian-listed) will be Group 1 or 2 filers. The phased approach means largest companies are already in scope.",
    relatedStandards: ["IFRS S1", "AASB S2", "ASRS Standards"],
    keyDifferences: {
      "vs IFRS S1": "Closely aligned but includes Australian-specific transitional provisions and phased implementation by entity size.",
      "vs ESRS": "Single materiality (like IFRS), not double materiality."
    }
  },
  "AASB S2": {
    fullName: "AASB S2 – Climate-related Disclosures",
    body: "Australian Accounting Standards Board",
    jurisdiction: "Australia",
    effectiveDate: "2025-01-01",
    status: "Effective (phased by entity group)",
    sector: "Large Australian entities (phased)",
    summary: "Australia's adoption of IFRS S2 for climate-related disclosures. Requires Scope 1, 2, and 3 GHG emissions, scenario analysis, transition plans, and climate resilience — with Australian-specific modifications including phased Scope 3 reporting and modified liability provisions.",
    keyRequirements: [
      "Scope 1 and 2 GHG emissions from year 1",
      "Scope 3: phased — Group 1 from year 2, Groups 2&3 later",
      "Climate scenario analysis (qualitative initially, quantitative phased in)",
      "Transition plan disclosures",
      "Climate resilience assessment",
      "Modified 'safe harbour' / liability protections for certain disclosures",
      "Same entity group phasing as AASB S1"
    ],
    consumerRetailNotes: "Australian consumer/retail companies will face particular challenges around Scope 3 given complex agricultural and manufacturing supply chains. The phased approach to Scope 3 and scenario analysis provides some breathing room but preparation should begin immediately.",
    relatedStandards: ["IFRS S2", "AASB S1", "GHG Protocol"],
    keyDifferences: {
      "vs IFRS S2": "Modified Scope 3 phasing. Liability safe harbour provisions unique to Australia. Qualitative scenario analysis permitted initially.",
      "vs SEC": "Broader — requires Scope 3 (phased) and scenario analysis, unlike SEC.",
      "vs ESRS E1": "Single materiality, less prescriptive than ESRS E1. No taxonomy alignment requirement."
    }
  },
  "GHG Protocol Corporate": {
    fullName: "GHG Protocol Corporate Accounting and Reporting Standard",
    body: "WRI / WBCSD",
    jurisdiction: "Global",
    effectiveDate: "2004 (revised 2015)",
    status: "Effective; foundational standard referenced by all disclosure frameworks",
    sector: "All",
    summary: "The foundational standard for corporate GHG accounting. Establishes principles and requirements for Scope 1 and 2 emissions measurement. Defines organizational boundaries (equity share, control approaches), operational boundaries (Scope 1 and 2), and reporting principles (relevance, completeness, consistency, transparency, accuracy).",
    keyRequirements: [
      "Define organizational boundary (equity share, financial control, or operational control)",
      "Classify emissions as Scope 1 (direct) or Scope 2 (indirect from purchased energy)",
      "Report Scope 2 using both location-based and market-based methods (per Scope 2 Guidance)",
      "Base year and recalculation policy",
      "Seven GHGs covered (CO2, CH4, N2O, HFCs, PFCs, SF6, NF3)",
      "Third-party verification encouraged"
    ],
    consumerRetailNotes: "For consumer/retail: Scope 1 typically includes refrigerants (HFCs from cold chain), natural gas for heating, fleet vehicles. Scope 2 is electricity for stores, warehouses, offices. Organizational boundary choice matters significantly for franchised businesses.",
    relatedStandards: ["GHG Protocol Scope 2", "GHG Protocol Scope 3", "IFRS S2", "ESRS E1"],
    keyDifferences: {
      "vs ISO 14064": "GHG Protocol is the de facto global standard and is explicitly referenced by ISSB, ESRS, SEC, and others. ISO 14064 is compatible but less widely adopted as the baseline.",
      "vs Scope 3 Standard": "Corporate Standard covers Scope 1 and 2 only. Scope 3 Standard is the companion for value chain emissions."
    }
  },
  "GHG Protocol Scope 2": {
    fullName: "GHG Protocol Scope 2 Guidance (2015) + Draft Update (2025)",
    body: "WRI / WBCSD",
    jurisdiction: "Global",
    effectiveDate: "2015 (current); Draft update 2025",
    status: "Current guidance effective; draft update under public consultation",
    sector: "All",
    summary: "Provides detailed guidance on accounting for Scope 2 (purchased energy) emissions. Requires dual reporting: location-based and market-based methods. The 2025 draft update proposes significant changes to market-based accounting, EAC (energy attribute certificate) quality criteria, and temporal/geographic matching requirements.",
    keyRequirements: [
      "Dual reporting: location-based AND market-based methods (both required)",
      "Location-based: grid average emission factors",
      "Market-based: contractual instruments (EACs, PPAs, utility contracts)",
      "Quality criteria for market-based instruments",
      "DRAFT UPDATE proposes: stricter temporal matching (hourly/annual), geographic matching requirements, enhanced EAC quality criteria, additionality considerations, and potential retirement of certain instrument types"
    ],
    consumerRetailNotes: "Critical for consumer/retail: large electricity footprints across stores and distribution centers. The draft update's stricter matching requirements could significantly impact companies relying on unbundled RECs to claim zero Scope 2 emissions. Companies should monitor the draft closely and assess current renewable energy procurement strategies.",
    relatedStandards: ["GHG Protocol Corporate", "RE100", "IFRS S2", "ESRS E1"],
    keyDifferences: {
      "Draft vs Current": "Draft proposes much stricter rules on what counts for market-based method — temporal matching, geographic proximity, additionality. Could invalidate some current REC-based claims.",
      "vs RE100": "RE100 criteria may need to be updated to align with new Scope 2 guidance. Companies in RE100 should track draft closely."
    }
  },
  "GHG Protocol Scope 3": {
    fullName: "GHG Protocol Corporate Value Chain (Scope 3) Accounting and Reporting Standard",
    body: "WRI / WBCSD",
    jurisdiction: "Global",
    effectiveDate: "2011 (update in progress)",
    status: "Effective; update underway alongside overall GHGP modernization",
    sector: "All",
    summary: "Defines 15 categories of Scope 3 emissions covering the full value chain — upstream and downstream. Provides calculation methodologies ranging from spend-based (least accurate) to supplier-specific (most accurate). Being updated as part of the broader GHG Protocol modernization.",
    keyRequirements: [
      "15 categories of Scope 3 emissions",
      "Upstream: purchased goods/services, capital goods, fuel/energy, transportation, waste, business travel, commuting, leased assets",
      "Downstream: transportation, processing, use of sold products, end-of-life, leased assets, franchises, investments",
      "Screening to identify material categories",
      "Calculation approaches: spend-based, average-data, supplier-specific, hybrid",
      "Reporting on all material categories"
    ],
    consumerRetailNotes: "Scope 3 typically dominates consumer/retail emissions (often 80-95%+ of total). Key categories: Cat 1 (purchased goods/services — raw materials, ingredients, packaging), Cat 4/9 (transportation), Cat 11 (use of sold products for electronics/appliances), Cat 12 (end-of-life treatment). Moving from spend-based to supplier-specific data is a multi-year journey.",
    relatedStandards: ["GHG Protocol Corporate", "SBTi", "IFRS S2", "ESRS E1", "CDP"],
    keyDifferences: {
      "vs Land Sector guidance": "Scope 3 Standard handles most value chain emissions, but the Land Sector / FLAG guidance provides specific methodologies for agriculture, forestry, and land use change emissions."
    }
  },
  "GHG Protocol FLAG": {
    fullName: "GHG Protocol Land Sector and Removals Guidance (Draft) + FLAG Considerations",
    body: "WRI / WBCSD",
    jurisdiction: "Global",
    effectiveDate: "Draft; expected finalization 2025-2026",
    status: "Draft guidance under development",
    sector: "Agriculture, forestry, food, land use",
    summary: "Provides guidance on accounting for GHG emissions and removals from land use, land use change, biogenic sources, and the land sector broadly. Critical companion to the Scope 3 Standard for companies with agricultural and forestry value chains. Works alongside SBTi FLAG guidance for target-setting.",
    keyRequirements: [
      "Accounting for land use change emissions (including deforestation)",
      "Biogenic carbon accounting (CO2 from biomass)",
      "Carbon removals and sequestration accounting",
      "Soil carbon changes",
      "Agricultural emissions (enteric fermentation, manure, rice, fertilizers)",
      "Separation of FLAG vs non-FLAG (fossil/industrial) emissions"
    ],
    consumerRetailNotes: "Essential for consumer/retail companies with food, beverage, apparel (cotton, leather), paper/packaging, or other agricultural supply chains. FLAG emissions can be substantial — particularly for food retailers and FMCG companies. Separating FLAG from non-FLAG emissions is important for SBTi target-setting.",
    relatedStandards: ["GHG Protocol Scope 3", "SBTi FLAG", "ESRS E1", "ESRS E4"],
    keyDifferences: {
      "vs Scope 3 Standard": "Scope 3 Standard provides the overall framework; FLAG guidance provides specific methodologies for the land sector within that framework.",
      "vs SBTi FLAG": "GHG Protocol FLAG is about accounting; SBTi FLAG is about target-setting. They are designed to work together."
    }
  },
  "SBTi Corporate Net-Zero": {
    fullName: "SBTi Corporate Net-Zero Standard (v1.0 + v2.0 consultation)",
    body: "Science Based Targets initiative",
    jurisdiction: "Global",
    effectiveDate: "2021 (v1.0); v2.0 under development",
    status: "v1.0 effective; v2.0 consultation ongoing",
    sector: "All",
    summary: "Defines the requirements for companies to set science-based near-term and long-term (net-zero) GHG reduction targets. Requires both near-term targets (5-10 years, typically 4.2% annual linear reduction for 1.5°C) and long-term targets (by 2050) covering Scope 1, 2, and 3 (if Scope 3 is >40% of total). Neutralization of residual emissions at net-zero.",
    keyRequirements: [
      "Near-term target: 5-10 year timeframe, minimum 4.2% annual reduction for 1.5°C",
      "Long-term target: 90-95% reduction by 2050 (net-zero)",
      "Scope 1 and 2 targets required for all companies",
      "Scope 3 target required if Scope 3 > 40% of total",
      "No offsets for abatement — real reductions only",
      "Neutralization of residual 5-10% at net-zero through permanent removals",
      "Annual progress reporting through CDP",
      "Recalculation and revalidation requirements"
    ],
    consumerRetailNotes: "Consumer/retail companies almost always have Scope 3 > 40% — so Scope 3 targets are mandatory. The no-offsets requirement for abatement means companies must pursue real supply chain decarbonization. This is the most significant commitment lever for the sector. Near-term targets typically cover at least 67% of Scope 3.",
    relatedStandards: ["SBTi FLAG", "GHG Protocol", "CDP", "IFRS S2"],
    keyDifferences: {
      "vs Paris Agreement alignment generally": "SBTi provides the most rigorous, validated methodology for Paris-aligned targets. Other 'Paris-aligned' claims without SBTi validation lack the same credibility.",
      "vs carbon neutral claims": "SBTi net-zero is fundamentally different from 'carbon neutral' — requires actual emissions reductions, not offsetting."
    }
  },
  "SBTi FLAG": {
    fullName: "SBTi Forest, Land and Agriculture (FLAG) Science-Based Target-Setting Guidance",
    body: "Science Based Targets initiative",
    jurisdiction: "Global",
    effectiveDate: "2022",
    status: "Effective; mandatory for companies with FLAG emissions ≥20% of total",
    sector: "Food, agriculture, forestry, land use, paper/packaging",
    summary: "Requires companies with significant land-sector emissions to set separate FLAG targets alongside their standard (energy/industry) targets. Mandatory for companies where FLAG emissions are ≥20% of total Scope 1+2+3. Uses FLAG-specific pathways requiring deforestation-free supply chains by 2025 and land-sector emission reductions.",
    keyRequirements: [
      "Mandatory for companies with FLAG emissions ≥20% of total",
      "Separate FLAG pathway from energy/industry pathway",
      "Commodity-specific targets (beef, dairy, poultry, pork, rice, soy, palm oil, leather, timber, etc.)",
      "No-deforestation commitment by 2025",
      "Land management and agricultural practice improvements",
      "Carbon removals from land sector can count toward FLAG targets only",
      "Must use FLAG-specific emission factors and methodologies"
    ],
    consumerRetailNotes: "Most food retailers, FMCG companies, and apparel companies with natural fiber supply chains will trigger the 20% FLAG threshold. This is one of the most operationally complex SBTi requirements — it requires commodity-level supply chain data, deforestation monitoring, and supplier engagement at scale. The 2025 no-deforestation deadline has already passed.",
    relatedStandards: ["SBTi Corporate Net-Zero", "GHG Protocol FLAG", "ESRS E4", "EU Deforestation Regulation"],
    keyDifferences: {
      "vs standard SBTi targets": "FLAG targets use different pathways and allow removals. Must be set separately but reported alongside standard targets.",
      "vs GHG Protocol FLAG": "SBTi FLAG is target-setting; GHG Protocol FLAG is accounting methodology. Both needed."
    }
  },
  "TCFD": {
    fullName: "Task Force on Climate-related Financial Disclosures – Final Recommendations",
    body: "Financial Stability Board (now subsumed into ISSB)",
    jurisdiction: "Global",
    effectiveDate: "2017",
    status: "Recommendations adopted; TCFD disbanded 2023; legacy lives on in ISSB, ESRS, and regulatory frameworks",
    sector: "All (originally focused on financial sector)",
    summary: "The foundational framework that shaped all modern climate disclosure standards. Four pillars: Governance, Strategy, Risk Management, Metrics & Targets. Introduced scenario analysis into mainstream climate risk assessment. While TCFD itself has been subsumed by the ISSB, its framework DNA is in virtually every major climate disclosure regulation.",
    keyRequirements: [
      "Governance: board and management oversight of climate risks",
      "Strategy: climate risks/opportunities over short, medium, long term; scenario analysis",
      "Risk Management: processes for identifying, assessing, managing climate risks",
      "Metrics & Targets: Scope 1, 2, 3 emissions; climate-related targets",
      "Scenario analysis: at minimum 2°C or lower"
    ],
    consumerRetailNotes: "TCFD remains the reference framework for many companies that haven't yet transitioned to regulatory reporting. For consumer/retail, the strategy pillar is key — physical risks to supply chains and stores, transition risks from changing consumer preferences and regulations.",
    relatedStandards: ["IFRS S2", "ESRS E1", "SEC Climate Rule", "California SB 261"],
    keyDifferences: {
      "vs ISSB": "TCFD is the predecessor. ISSB (IFRS S2) codifies TCFD into a formal standard with more detailed requirements.",
      "Current relevance": "TCFD is still referenced in many regulations (e.g., SB 261) and remains useful as a communication framework even as regulatory standards take over."
    }
  },
  "CDP": {
    fullName: "CDP (formerly Carbon Disclosure Project) Questionnaire Framework",
    body: "CDP",
    jurisdiction: "Global",
    effectiveDate: "Annual (updated each cycle)",
    status: "Active; aligning with ISSB and ESRS",
    sector: "All (sector-specific questionnaires)",
    summary: "The world's largest environmental disclosure platform. Annual questionnaires for Climate Change, Forests, and Water Security. Scored A to D-. Increasingly aligned with ISSB and ESRS. Used by SBTi for annual target progress reporting. Score is widely used by investors, customers, and supply chain partners.",
    keyRequirements: [
      "Annual disclosure questionnaire (climate, forests, water)",
      "Governance, risks/opportunities, strategy, targets, emissions data",
      "Scope 1, 2, 3 emissions with methodology detail",
      "Scored by CDP (A, A-, B, B-, C, C-, D, D-)",
      "Supply chain program: customers can request supplier disclosure",
      "SBTi progress tracked through CDP",
      "Sector-specific questions for high-impact sectors"
    ],
    consumerRetailNotes: "Consumer/retail companies face CDP requests from both investors and customers (through supply chain program). A high CDP score (A/A-) is increasingly expected for major brands. The supply chain module is particularly relevant — large retailers use CDP to assess and engage their own suppliers.",
    relatedStandards: ["ISSB", "ESRS", "SBTi", "GHG Protocol"],
    keyDifferences: {
      "vs ISSB/ESRS": "CDP is a voluntary disclosure platform and scoring system, not a regulatory standard. But CDP is actively aligning its questionnaire with ISSB and ESRS to reduce reporting burden.",
      "Unique value": "CDP provides a score and benchmarking that regulatory frameworks do not. The supply chain program is unique — no regulatory equivalent."
    }
  }
};

// --- REGULATORY TIMELINE DATA ---
const TIMELINE_DATA = [
  { date: "2024-01-01", standard: "IFRS S1 & S2", event: "Effective date (voluntary adoption by jurisdictions)", status: "active" },
  { date: "2024-01-01", standard: "ESRS (CSRD)", event: "First reporting period begins for Group 1 (large PIEs >500 employees)", status: "active" },
  { date: "2025-01-01", standard: "AASB S1 & S2", event: "Group 1 entities begin reporting (>$500M revenue or >$1B assets)", status: "active" },
  { date: "2025-01-01", standard: "ESRS (CSRD)", event: "First reports due for Group 1; Group 2 reporting period begins (large companies meeting 2 of 3 criteria)", status: "active" },
  { date: "2025-06-01", standard: "GHG Protocol Scope 2 Draft", event: "Public consultation on updated Scope 2 Guidance", status: "upcoming" },
  { date: "2026-01-01", standard: "ESRS (CSRD)", event: "Group 2 first reports due; Group 3 (listed SMEs) reporting begins", status: "upcoming" },
  { date: "2026-01-01", standard: "SEC Climate Rule", event: "Large accelerated filers begin reporting (if litigation resolved)", status: "upcoming" },
  { date: "2026-01-01", standard: "California SB 253", event: "Scope 1 & 2 reporting begins for companies >$1B revenue", status: "upcoming" },
  { date: "2026-01-01", standard: "California SB 261", event: "First climate risk reports due for companies >$500M revenue", status: "upcoming" },
  { date: "2026-07-01", standard: "AASB S1 & S2", event: "Group 2 entities begin reporting", status: "upcoming" },
  { date: "2027-01-01", standard: "California SB 253", event: "Scope 3 reporting begins", status: "upcoming" },
  { date: "2027-01-01", standard: "AASB S2", event: "Group 1 Scope 3 reporting begins", status: "upcoming" },
  { date: "2027-01-01", standard: "SEC Climate Rule", event: "Accelerated filers begin; LAF limited assurance begins", status: "upcoming" },
  { date: "2027-01-01", standard: "ESRS (CSRD)", event: "Group 3 (listed SMEs) first reports due", status: "upcoming" },
  { date: "2027-07-01", standard: "AASB S1 & S2", event: "Group 3 entities begin reporting", status: "upcoming" },
  { date: "2028-01-01", standard: "ESRS (CSRD)", event: "Non-EU companies with >€150M EU revenue begin reporting", status: "upcoming" },
  { date: "2029-01-01", standard: "SEC Climate Rule", event: "LAF reasonable assurance begins", status: "future" },
  { date: "2030-01-01", standard: "SBTi", event: "Typical near-term target year for companies that committed in 2020-2025", status: "future" },
  { date: "2050-01-01", standard: "SBTi / Paris Agreement", event: "Net-zero target year", status: "future" },
];

// --- COMPARISON TOPICS ---
const COMPARISON_TOPICS = {
  "Scope 3 Requirements": {
    standards: {
      "IFRS S2": "Required (1-year transition relief). All material Scope 3 categories using GHG Protocol methodology.",
      "ESRS E1": "Required under double materiality. Must disclose total Scope 3 and by significant category. Value chain engagement required.",
      "SEC Climate Rule": "Not required. Dropped from final rule.",
      "California SB 253": "Required from 2027. GHG Protocol-aligned. Third-party assurance required.",
      "AASB S2": "Required but phased — Group 1 from year 2, later groups subsequently.",
      "SBTi": "Target required if Scope 3 > 40% of total (covers at least 67% of Scope 3 emissions)."
    }
  },
  "Materiality Approach": {
    standards: {
      "IFRS S1/S2": "Single (financial) materiality — focused on enterprise value and investor decision-making.",
      "ESRS": "Double materiality — both impact materiality (outward effects on people/planet) AND financial materiality (inward effects on enterprise).",
      "SEC Climate Rule": "Investor-focused materiality consistent with existing SEC standards.",
      "AASB S1/S2": "Single (financial) materiality, aligned with IFRS.",
      "TCFD": "Financial materiality focused on risks and opportunities to the entity."
    }
  },
  "Assurance Requirements": {
    standards: {
      "IFRS S2": "Jurisdiction-dependent. ISSB encourages but does not mandate assurance.",
      "ESRS E1": "Limited assurance initially, moving to reasonable assurance (EU timeline TBD).",
      "SEC Climate Rule": "Limited then reasonable assurance for Scope 1+2 (LAFs/AFs only). Phased.",
      "California SB 253": "Independent third-party verification required. Limited then reasonable.",
      "AASB S2": "Assurance required under Australian framework — phased with entity groups."
    }
  },
  "Scenario Analysis": {
    standards: {
      "IFRS S2": "Required. Must consider climate resilience under different scenarios.",
      "ESRS E1": "Required as part of transition plan and resilience assessment.",
      "SEC Climate Rule": "Not required.",
      "AASB S2": "Required but qualitative permitted initially; quantitative phased in.",
      "TCFD": "Required — at minimum a 2°C or lower scenario.",
      "California SB 261": "TCFD-aligned risk reports implicitly require scenario thinking."
    }
  },
  "Transition Plans": {
    standards: {
      "IFRS S2": "Disclosure required if the entity has a transition plan.",
      "ESRS E1": "Detailed transition plan required: aligned with 1.5°C, including CapEx/OpEx, actions, timelines, locked-in emissions.",
      "SEC Climate Rule": "Disclosure of targets/goals if set. Less prescriptive than ESRS.",
      "SBTi": "Implicit — the target IS the transition plan backbone. Must demonstrate credible pathway.",
      "AASB S2": "Aligned with IFRS S2 — disclose if you have one."
    }
  },
  "Carbon Credits & Offsets": {
    standards: {
      "IFRS S2": "Must disclose separately; cannot be netted against gross emissions.",
      "ESRS E1": "Detailed disclosure: type, quality, certification, how used. Cannot net against emissions. Must disclose reliance on credits in transition plan.",
      "SBTi": "Credits cannot count toward near-term or long-term abatement targets. Only for neutralization of residual emissions at net-zero.",
      "GHG Protocol": "Emissions inventory must be gross. Credits reported separately.",
      "California SB 253": "Follows GHG Protocol — gross emissions. Credits reported separately if at all."
    }
  },
  "Entity Coverage": {
    standards: {
      "IFRS S2": "Jurisdiction-dependent adoption. Applies to entities required by their jurisdiction.",
      "ESRS": "EU large companies, listed SMEs, and non-EU companies with >€150M EU revenue (phased).",
      "SEC Climate Rule": "SEC registrants (public companies listed in the US).",
      "California SB 253": "Any entity with >$1B revenue doing business in California (public AND private).",
      "California SB 261": "Any entity with >$500M revenue doing business in California (public AND private).",
      "AASB S1/S2": "Large Australian entities, phased by size (Group 1/2/3)."
    }
  }
};

// --- MAIN APP COMPONENT ---
function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [selectedComparison, setSelectedComparison] = useState(null);
  const [timelineFilter, setTimelineFilter] = useState("all");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("csa-api-key") || "");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [prepForm, setPrepForm] = useState({
    clientName: "",
    industry: "Consumer Products",
    jurisdiction: [],
    companyType: "Public (SEC registrant)",
    revenue: ">$1B",
    topics: []
  });
  const [briefing, setBriefing] = useState(null);
  const [briefingLoading, setBriefingLoading] = useState(false);

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    if (apiKey) localStorage.setItem("csa-api-key", apiKey);
    else localStorage.removeItem("csa-api-key");
  }, [apiKey]);
  const chatEndRef = useRef(null);

  const industries = [
    "Consumer Products", "Food & Beverage", "Retail", "Apparel & Textiles",
    "Food Retail / Grocery", "Quick Service Restaurants", "Hospitality",
    "Consumer Electronics", "Personal Care & Household Products"
  ];

  const jurisdictions = ["United States", "European Union", "Australia", "United Kingdom", "Global / Multi-jurisdiction"];
  const companyTypes = ["Public (SEC registrant)", "Public (EU-listed)", "Public (ASX-listed)", "Private", "Private (PE-backed)"];
  const revenueRanges = ["<$500M", "$500M–$1B", ">$1B", ">$5B", ">$10B"];
  const meetingTopics = [
    "GHG Inventory / Emissions Measurement",
    "SBTi Target Setting",
    "CSRD / ESRS Readiness",
    "SEC Climate Rule Compliance",
    "California Climate Laws",
    "Australian Climate Reporting",
    "CDP Response Strategy",
    "Scope 3 Measurement & Reduction",
    "Transition Planning",
    "Assurance Readiness",
    "FLAG / Deforestation",
    "Scope 2 / Renewable Energy Procurement",
    "Carbon Credit Strategy",
    "Cross-Standard Alignment"
  ];

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // --- QUICK SEARCH ---
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    const results = [];
    Object.entries(STANDARDS_DB).forEach(([key, std]) => {
      const searchable = `${key} ${std.fullName} ${std.summary} ${std.keyRequirements.join(" ")} ${std.consumerRetailNotes} ${JSON.stringify(std.keyDifferences)}`.toLowerCase();
      if (searchable.includes(query)) {
        const relevanceScore = (searchable.match(new RegExp(query, "g")) || []).length;
        results.push({ key, standard: std, relevanceScore });
      }
    });
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    setSearchResults(results);
  };

  // --- MEETING PREP GENERATOR ---
  const generateBriefing = async () => {
    setBriefingLoading(true);
    const relevantStandards = [];
    const { jurisdiction, companyType, revenue, topics, clientName, industry } = prepForm;

    // Determine applicable standards
    if (jurisdiction.includes("European Union") || jurisdiction.includes("Global / Multi-jurisdiction")) {
      relevantStandards.push("ESRS E1", "ESRS (Cross-cutting)", "ESRS E2-E5");
    }
    if (jurisdiction.includes("United States") || jurisdiction.includes("Global / Multi-jurisdiction")) {
      if (companyType.includes("SEC")) relevantStandards.push("SEC Climate Rule");
      if (revenue === ">$1B" || revenue === ">$5B" || revenue === ">$10B") relevantStandards.push("California SB 253");
      if (revenue !== "<$500M") relevantStandards.push("California SB 261");
    }
    if (jurisdiction.includes("Australia") || jurisdiction.includes("Global / Multi-jurisdiction")) {
      relevantStandards.push("AASB S1", "AASB S2");
    }
    relevantStandards.push("IFRS S1", "IFRS S2", "GHG Protocol Corporate", "GHG Protocol Scope 3");
    if (topics.some(t => t.includes("SBTi") || t.includes("Target"))) {
      relevantStandards.push("SBTi Corporate Net-Zero");
    }
    if (topics.some(t => t.includes("FLAG") || t.includes("Deforestation"))) {
      relevantStandards.push("SBTi FLAG", "GHG Protocol FLAG");
    }
    if (topics.some(t => t.includes("CDP"))) {
      relevantStandards.push("CDP");
    }
    if (topics.some(t => t.includes("Scope 2") || t.includes("Renewable"))) {
      relevantStandards.push("GHG Protocol Scope 2");
    }

    const uniqueStandards = [...new Set(relevantStandards)];

    // Build the briefing context
    const standardDetails = uniqueStandards
      .filter(s => STANDARDS_DB[s])
      .map(s => {
        const std = STANDARDS_DB[s];
        return `${s}: ${std.summary}\nKey Requirements: ${std.keyRequirements.join("; ")}\nConsumer/Retail Notes: ${std.consumerRetailNotes}`;
      }).join("\n\n");

    const prompt = `You are a climate and sustainability standards expert supporting a Managing Director at EY's Climate Change and Sustainability Services practice. Generate a concise ONE-PAGE meeting prep briefing.

CLIENT PROFILE:
- Name: ${clientName || "[Client]"}
- Industry: ${industry}
- Jurisdictions: ${jurisdiction.join(", ") || "Not specified"}
- Company Type: ${companyType}
- Revenue: ${revenue}
- Meeting Topics: ${topics.join(", ") || "General climate disclosure readiness"}

APPLICABLE STANDARDS:
${standardDetails}

Generate a briefing with these sections:
1. CLIENT APPLICABILITY SNAPSHOT (which standards apply and when, in a compact table format)
2. KEY DISCUSSION POINTS (3-5 most important items for this meeting, specific to their profile)
3. CONSUMER/RETAIL SECTOR CONSIDERATIONS (2-3 sector-specific insights)
4. POTENTIAL CLIENT QUESTIONS & SUGGESTED RESPONSES (3-4 questions they might ask, with authoritative answers)
5. COMPETITIVE CONTEXT (what peers in their industry are doing — general trends)

Be specific, authoritative, and practical. Use the exact standard names and cite specific requirements. Format for quick scanning — use bold, short paragraphs, no fluff. This is for an MD who needs to sound knowledgeable in 5 minutes.`;

    if (!apiKey) {
      setBriefing("Please set your Claude API key first (click the 🔑 button in the header).");
      setBriefingLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      if (data.error) {
        setBriefing(`API Error: ${data.error.message}`);
      } else {
        const text = data.content?.map(c => c.text || "").join("\n") || "Unable to generate briefing.";
        setBriefing(text);
      }
    } catch (err) {
      setBriefing("Error generating briefing. Please try again.");
    }
    setBriefingLoading(false);
  };

  // --- AI CHAT ---
  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return;

    if (!apiKey) {
      setChatMessages(prev => [...prev, { role: "user", content: chatInput.trim() }, { role: "assistant", content: "Please set your Claude API key first (click the 🔑 button in the header)." }]);
      setChatInput("");
      return;
    }

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    // Build context from standards DB
    const allStandardsSummary = Object.entries(STANDARDS_DB)
      .map(([key, std]) => `${key} (${std.fullName}): ${std.summary}\nKey Requirements: ${std.keyRequirements.join("; ")}\nConsumer/Retail Notes: ${std.consumerRetailNotes}\nKey Differences: ${JSON.stringify(std.keyDifferences)}`)
      .join("\n\n---\n\n");

    const comparisonContext = Object.entries(COMPARISON_TOPICS)
      .map(([topic, data]) => `${topic}: ${JSON.stringify(data.standards)}`)
      .join("\n\n");

    const systemPrompt = `You are a climate standards intelligence assistant for a Managing Director at EY's Climate Change and Sustainability Services practice. You specialize in consumer and retail sector clients.

Your knowledge base includes the following standards (with full details):
${allStandardsSummary}

Cross-standard comparisons:
${comparisonContext}

INSTRUCTIONS:
- Be precise, authoritative, and cite specific standards and paragraph references where possible
- Focus on practical implications for consumer/retail sector clients
- When comparing standards, be specific about differences
- Keep answers concise but comprehensive — this is for quick reference during meetings
- If asked about something not in your knowledge base, say so clearly
- Use standard abbreviations (ESRS, ISSB, SBTi, etc.) as the user is an expert`;

    const messages = [
      ...chatMessages.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: userMsg }
    ];

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: systemPrompt,
          messages
        })
      });
      const data = await response.json();
      if (data.error) {
        setChatMessages(prev => [...prev, { role: "assistant", content: `API Error: ${data.error.message}` }]);
      } else {
        const text = data.content?.map(c => c.text || "").join("\n") || "I wasn't able to process that query.";
        setChatMessages(prev => [...prev, { role: "assistant", content: text }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Error connecting to AI. Please try again." }]);
    }
    setChatLoading(false);
  };

  // --- RENDER ---
  const tabs = [
    { id: "search", label: "Search", icon: "🔍" },
    { id: "chat", label: "AI Chat", icon: "💬" },
    { id: "prep", label: "Meeting Prep", icon: "📋" },
    { id: "compare", label: "Compare", icon: "⚖️" },
    { id: "timeline", label: "Timeline", icon: "📅" },
    { id: "library", label: "Library", icon: "📚" }
  ];

  const filteredTimeline = useMemo(() => {
    if (timelineFilter === "all") return TIMELINE_DATA;
    return TIMELINE_DATA.filter(t => t.status === timelineFilter);
  }, [timelineFilter]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #0a0f1a 0%, #0d1929 40%, #0a1628 100%)",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .glass-panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          backdrop-filter: blur(20px);
        }

        .glass-panel-hover:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(100,200,180,0.2);
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }

        .accent-glow {
          box-shadow: 0 0 30px rgba(56,189,159,0.08);
        }

        .tab-active {
          background: rgba(56,189,159,0.12) !important;
          border-color: rgba(56,189,159,0.3) !important;
          color: #38bd9f !important;
        }

        .input-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #e2e8f0;
          padding: 10px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          width: 100%;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-color: rgba(56,189,159,0.4);
        }
        .input-field::placeholder {
          color: rgba(226,232,240,0.3);
        }

        .btn-primary {
          background: linear-gradient(135deg, #38bd9f 0%, #2a9d8f 100%);
          color: #0a0f1a;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(56,189,159,0.3);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.05);
          color: #e2e8f0;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(56,189,159,0.3);
        }

        .chip {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          margin: 2px;
        }
        .chip-active { background: rgba(56,189,159,0.15); color: #38bd9f; border: 1px solid rgba(56,189,159,0.3); }
        .chip-inactive { background: rgba(255,255,255,0.04); color: rgba(226,232,240,0.5); border: 1px solid rgba(255,255,255,0.06); cursor: pointer; }
        .chip-inactive:hover { background: rgba(255,255,255,0.08); color: rgba(226,232,240,0.7); }

        .status-active { color: #38bd9f; }
        .status-upcoming { color: #f0b429; }
        .status-future { color: rgba(226,232,240,0.4); }

        .chat-msg {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .chat-user {
          background: rgba(56,189,159,0.12);
          border: 1px solid rgba(56,189,159,0.2);
          margin-left: auto;
        }
        .chat-assistant {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        .briefing-content h1, .briefing-content h2, .briefing-content h3 {
          color: #38bd9f;
          margin-top: 16px;
          margin-bottom: 8px;
        }
        .briefing-content h1 { font-size: 18px; }
        .briefing-content h2 { font-size: 16px; }
        .briefing-content h3 { font-size: 14px; }
        .briefing-content strong { color: #5dd8ba; }
        .briefing-content p { margin-bottom: 8px; }

        .mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.3s ease; }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .loading-dot { animation: pulse 1.2s infinite; }
      `}</style>

      {/* HEADER */}
      <div style={{ padding: "20px 24px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #38bd9f, #2a9d8f)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "#0a0f1a"
          }}>C</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
              Climate Standards Intelligence
            </div>
            <div style={{ fontSize: 11, color: "rgba(226,232,240,0.4)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Consumer & Retail Sector Focus
            </div>
          </div>
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            style={{
              background: apiKey ? "rgba(56,189,159,0.15)" : "rgba(240,180,41,0.15)",
              border: `1px solid ${apiKey ? "rgba(56,189,159,0.3)" : "rgba(240,180,41,0.3)"}`,
              borderRadius: 10,
              padding: "6px 12px",
              fontSize: 13,
              color: apiKey ? "#38bd9f" : "#f0b429",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              display: "flex", alignItems: "center", gap: 6,
              whiteSpace: "nowrap"
            }}
          >
            🔑 {apiKey ? "API Key Set" : "Set API Key"}
          </button>
        </div>

        {showApiKeyInput && (
          <div className="glass-panel" style={{ padding: 14, marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <input
              className="input-field"
              type="password"
              placeholder="Paste your Claude API key (sk-ant-...)"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              style={{ flex: 1 }}
            />
            {apiKey && (
              <button
                className="btn-secondary"
                onClick={() => { setApiKey(""); }}
                style={{ fontSize: 12, whiteSpace: "nowrap" }}
              >
                Clear
              </button>
            )}
            <button
              className="btn-primary"
              onClick={() => setShowApiKeyInput(false)}
              style={{ fontSize: 12, whiteSpace: "nowrap" }}
            >
              Done
            </button>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 12 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? "tab-active" : ""}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                padding: "8px 14px",
                color: "rgba(226,232,240,0.6)",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 6
              }}
            >
              <span style={{ fontSize: 14 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "16px 24px 24px", maxHeight: "calc(100vh - 120px)", overflow: "auto" }} className="scrollbar-thin">

        {/* ==================== SEARCH TAB ==================== */}
        {activeTab === "search" && (
          <div className="fade-in">
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                className="input-field"
                placeholder="Search standards... (e.g., 'Scope 3', 'transition plan', 'assurance')"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <button className="btn-primary" onClick={handleSearch}>Search</button>
            </div>

            {/* Quick Links */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {["Scope 3", "transition plan", "assurance", "materiality", "carbon credits", "FLAG", "Scope 2 draft", "deforestation"].map(q => (
                <button
                  key={q}
                  className="btn-secondary"
                  onClick={() => { setSearchQuery(q); setTimeout(() => handleSearch(), 50); setSearchQuery(q); }}
                  style={{ fontSize: 12, padding: "4px 10px" }}
                >
                  {q}
                </button>
              ))}
            </div>

            {searchResults && (
              <div>
                <div style={{ fontSize: 12, color: "rgba(226,232,240,0.4)", marginBottom: 12 }}>
                  {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
                </div>
                {searchResults.map(({ key, standard }) => (
                  <div
                    key={key}
                    className="glass-panel glass-panel-hover"
                    style={{ padding: 16, marginBottom: 10, cursor: "pointer" }}
                    onClick={() => { setSelectedStandard(key); setActiveTab("library"); }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#38bd9f" }}>{key}</div>
                      <span className="chip chip-active" style={{ fontSize: 11 }}>{standard.jurisdiction}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(226,232,240,0.5)", marginBottom: 6 }}>{standard.fullName}</div>
                    <div style={{ fontSize: 13, color: "rgba(226,232,240,0.7)", lineHeight: 1.5 }}>
                      {standard.summary.slice(0, 200)}...
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!searchResults && (
              <div className="glass-panel accent-glow" style={{ padding: 24, textAlign: "center", marginTop: 40 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Search the Standards</div>
                <div style={{ fontSize: 13, color: "rgba(226,232,240,0.4)", maxWidth: 400, margin: "0 auto" }}>
                  Type any term — standard name, requirement, topic — and get instant results across the full corpus of climate disclosure standards.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== AI CHAT TAB ==================== */}
        {activeTab === "chat" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 160px)" }}>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }} className="scrollbar-thin">
              {chatMessages.length === 0 && (
                <div style={{ textAlign: "center", marginTop: 60 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Standards AI Assistant</div>
                  <div style={{ fontSize: 13, color: "rgba(226,232,240,0.4)", maxWidth: 420, margin: "0 auto 20px" }}>
                    Ask me anything about climate disclosure standards. I have deep knowledge of ISSB, ESRS, SEC, California, Australian standards, GHG Protocol, SBTi, TCFD, and CDP — with consumer/retail sector expertise.
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                    {[
                      "What's the difference between ESRS E1 and IFRS S2 on Scope 3?",
                      "What does the Scope 2 draft update mean for our clients' REC strategies?",
                      "Which standards require scenario analysis?",
                      "When do Australian companies need to report Scope 3?"
                    ].map(q => (
                      <button
                        key={q}
                        className="btn-secondary"
                        style={{ fontSize: 12, padding: "6px 12px", textAlign: "left", maxWidth: 280 }}
                        onClick={() => { setChatInput(q); }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: "flex", marginBottom: 10, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div className={`chat-msg ${msg.role === "user" ? "chat-user" : "chat-assistant"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
                  <div className="chat-msg chat-assistant" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span className="loading-dot" style={{ animationDelay: "0s" }}>●</span>
                    <span className="loading-dot" style={{ animationDelay: "0.3s" }}>●</span>
                    <span className="loading-dot" style={{ animationDelay: "0.6s" }}>●</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <input
                className="input-field"
                placeholder="Ask about any climate standard..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleChat()}
              />
              <button className="btn-primary" onClick={handleChat} disabled={chatLoading || !chatInput.trim()}>
                Send
              </button>
            </div>
          </div>
        )}

        {/* ==================== MEETING PREP TAB ==================== */}
        {activeTab === "prep" && (
          <div className="fade-in">
            {!briefing ? (
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Meeting Prep Generator</div>
                <div style={{ fontSize: 13, color: "rgba(226,232,240,0.4)", marginBottom: 20 }}>
                  Enter client details to generate a one-page briefing you can review in 5 minutes before your meeting.
                </div>

                <div className="glass-panel" style={{ padding: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, color: "rgba(226,232,240,0.5)", display: "block", marginBottom: 4 }}>Client Name</label>
                      <input
                        className="input-field"
                        placeholder="e.g., Acme Retail Co."
                        value={prepForm.clientName}
                        onChange={e => setPrepForm(f => ({ ...f, clientName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: "rgba(226,232,240,0.5)", display: "block", marginBottom: 4 }}>Industry</label>
                      <select
                        className="input-field"
                        value={prepForm.industry}
                        onChange={e => setPrepForm(f => ({ ...f, industry: e.target.value }))}
                        style={{ cursor: "pointer" }}
                      >
                        {industries.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: "rgba(226,232,240,0.5)", display: "block", marginBottom: 4 }}>Company Type</label>
                      <select
                        className="input-field"
                        value={prepForm.companyType}
                        onChange={e => setPrepForm(f => ({ ...f, companyType: e.target.value }))}
                        style={{ cursor: "pointer" }}
                      >
                        {companyTypes.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: "rgba(226,232,240,0.5)", display: "block", marginBottom: 4 }}>Revenue</label>
                      <select
                        className="input-field"
                        value={prepForm.revenue}
                        onChange={e => setPrepForm(f => ({ ...f, revenue: e.target.value }))}
                        style={{ cursor: "pointer" }}
                      >
                        {revenueRanges.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: "rgba(226,232,240,0.5)", display: "block", marginBottom: 6 }}>Jurisdictions</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {jurisdictions.map(j => (
                        <span
                          key={j}
                          className={`chip ${prepForm.jurisdiction.includes(j) ? "chip-active" : "chip-inactive"}`}
                          onClick={() => setPrepForm(f => ({
                            ...f,
                            jurisdiction: f.jurisdiction.includes(j) ? f.jurisdiction.filter(x => x !== j) : [...f.jurisdiction, j]
                          }))}
                          style={{ cursor: "pointer" }}
                        >
                          {j}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, color: "rgba(226,232,240,0.5)", display: "block", marginBottom: 6 }}>Meeting Topics</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {meetingTopics.map(t => (
                        <span
                          key={t}
                          className={`chip ${prepForm.topics.includes(t) ? "chip-active" : "chip-inactive"}`}
                          onClick={() => setPrepForm(f => ({
                            ...f,
                            topics: f.topics.includes(t) ? f.topics.filter(x => x !== t) : [...f.topics, t]
                          }))}
                          style={{ cursor: "pointer" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="btn-primary" onClick={generateBriefing} disabled={briefingLoading} style={{ width: "100%", padding: "12px" }}>
                    {briefingLoading ? "Generating Briefing..." : "Generate One-Page Briefing"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>
                    Meeting Briefing: {prepForm.clientName || "Client"}
                  </div>
                  <button className="btn-secondary" onClick={() => setBriefing(null)}>← New Briefing</button>
                </div>
                <div className="glass-panel accent-glow briefing-content" style={{ padding: 24, lineHeight: 1.7, fontSize: 13.5, whiteSpace: "pre-wrap" }}>
                  {briefing}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== COMPARE TAB ==================== */}
        {activeTab === "compare" && (
          <div className="fade-in">
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Cross-Standard Comparator</div>
            <div style={{ fontSize: 13, color: "rgba(226,232,240,0.4)", marginBottom: 16 }}>
              Compare how major standards handle key topics side by side.
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {Object.keys(COMPARISON_TOPICS).map(topic => (
                <button
                  key={topic}
                  className={selectedComparison === topic ? "btn-primary" : "btn-secondary"}
                  onClick={() => setSelectedComparison(selectedComparison === topic ? null : topic)}
                >
                  {topic}
                </button>
              ))}
            </div>

            {selectedComparison && (
              <div className="fade-in">
                <div style={{ fontSize: 16, fontWeight: 600, color: "#38bd9f", marginBottom: 16 }}>{selectedComparison}</div>
                {Object.entries(COMPARISON_TOPICS[selectedComparison].standards).map(([std, desc]) => (
                  <div key={std} className="glass-panel" style={{ padding: 14, marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#5dd8ba", marginBottom: 4 }}>{std}</div>
                    <div style={{ fontSize: 13, color: "rgba(226,232,240,0.7)", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            )}

            {!selectedComparison && (
              <div className="glass-panel" style={{ padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
                <div style={{ fontSize: 14, color: "rgba(226,232,240,0.4)" }}>
                  Select a topic above to see how different standards compare.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TIMELINE TAB ==================== */}
        {activeTab === "timeline" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Regulatory Timeline</div>
                <div style={{ fontSize: 13, color: "rgba(226,232,240,0.4)" }}>Key dates and milestones across all standards</div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { id: "all", label: "All" },
                  { id: "active", label: "Active" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "future", label: "Future" }
                ].map(f => (
                  <button
                    key={f.id}
                    className={timelineFilter === f.id ? "btn-primary" : "btn-secondary"}
                    onClick={() => setTimelineFilter(f.id)}
                    style={{ fontSize: 12, padding: "4px 10px" }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredTimeline.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 2 }}>
                {/* Timeline line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: item.status === "active" ? "#38bd9f" : item.status === "upcoming" ? "#f0b429" : "rgba(226,232,240,0.2)",
                    flexShrink: 0, marginTop: 14
                  }} />
                  {i < filteredTimeline.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.06)", minHeight: 40 }} />
                  )}
                </div>

                <div className="glass-panel" style={{ padding: "10px 14px", flex: 1, marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span className={`mono status-${item.status}`} style={{ fontSize: 12, fontWeight: 500 }}>
                      {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                    <span className="chip chip-active" style={{ fontSize: 10 }}>{item.standard}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(226,232,240,0.7)" }}>{item.event}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== LIBRARY TAB ==================== */}
        {activeTab === "library" && (
          <div className="fade-in">
            {!selectedStandard ? (
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Standards Library</div>
                <div style={{ fontSize: 13, color: "rgba(226,232,240,0.4)", marginBottom: 16 }}>
                  Full reference for all climate disclosure standards in the corpus.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {Object.entries(STANDARDS_DB).map(([key, std]) => (
                    <div
                      key={key}
                      className="glass-panel glass-panel-hover"
                      style={{ padding: 14, cursor: "pointer" }}
                      onClick={() => setSelectedStandard(key)}
                    >
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#38bd9f", marginBottom: 2 }}>{key}</div>
                      <div style={{ fontSize: 11, color: "rgba(226,232,240,0.4)", marginBottom: 6 }}>{std.body} · {std.jurisdiction}</div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <span className={`chip ${std.status.includes("Effective") ? "chip-active" : "chip-inactive"}`} style={{ fontSize: 10 }}>
                          {std.status.split(";")[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <button className="btn-secondary" onClick={() => setSelectedStandard(null)} style={{ marginBottom: 12 }}>
                  ← Back to Library
                </button>
                {(() => {
                  const std = STANDARDS_DB[selectedStandard];
                  if (!std) return null;
                  return (
                    <div className="glass-panel accent-glow" style={{ padding: 24 }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#38bd9f", fontFamily: "'Playfair Display', serif", marginBottom: 2 }}>
                        {selectedStandard}
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(226,232,240,0.5)", marginBottom: 16 }}>{std.fullName}</div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                        <span className="chip chip-active">{std.jurisdiction}</span>
                        <span className="chip chip-active">{std.body}</span>
                        <span className="chip chip-inactive">{std.status.split(";")[0]}</span>
                        <span className="chip chip-inactive">Effective: {std.effectiveDate}</span>
                      </div>

                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#5dd8ba", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 11 }}>Summary</div>
                        <div style={{ fontSize: 13.5, color: "rgba(226,232,240,0.75)", lineHeight: 1.7 }}>{std.summary}</div>
                      </div>

                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#5dd8ba", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Key Requirements</div>
                        {std.keyRequirements.map((req, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "rgba(226,232,240,0.7)" }}>
                            <span style={{ color: "#38bd9f", flexShrink: 0 }}>→</span>
                            {req}
                          </div>
                        ))}
                      </div>

                      <div className="glass-panel" style={{ padding: 16, marginBottom: 20, background: "rgba(56,189,159,0.04)", borderColor: "rgba(56,189,159,0.15)" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#38bd9f", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          🛒 Consumer & Retail Sector Notes
                        </div>
                        <div style={{ fontSize: 13.5, color: "rgba(226,232,240,0.8)", lineHeight: 1.7 }}>{std.consumerRetailNotes}</div>
                      </div>

                      {std.keyDifferences && (
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#5dd8ba", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Key Differences</div>
                          {Object.entries(std.keyDifferences).map(([vs, diff]) => (
                            <div key={vs} className="glass-panel" style={{ padding: 12, marginBottom: 6 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#f0b429", marginBottom: 2 }}>{vs}</div>
                              <div style={{ fontSize: 13, color: "rgba(226,232,240,0.7)", lineHeight: 1.5 }}>{diff}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {std.relatedStandards && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#5dd8ba", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Related Standards</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {std.relatedStandards.map(rs => (
                              <span
                                key={rs}
                                className="chip chip-inactive"
                                style={{ cursor: STANDARDS_DB[rs] ? "pointer" : "default" }}
                                onClick={() => STANDARDS_DB[rs] && setSelectedStandard(rs)}
                              >
                                {rs}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
