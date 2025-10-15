# Eleving-Group-Test-Automation-Task

Requirements:
Node.js - v18+
npm - v8+

P.S On my machine npm 10.9.2, node v22.14.0

Setup project 
- npm run setup

## How execute tests?
- debug: npx playwright test tests/catalog.spec.ts --debug
- run test suite: npx playwright test tests/catalog.spec.ts 
- run test suite with an interface: npx playwright test tests/catalog.spec.ts --headed

## Check test results
- npx playwright show-report

## Additional documentation
- Link for the test scenarious description: [Test Scenarious](https://docs.google.com/document/d/1b7jwyfzP-esHchhLkRfIah3AjfCev2DsdsS12GwiPK8/edit?usp=sharing)

## Test Prioritization

| № | Test Scenario | Priority | Failure Risk |

| **1** | **Validating car filters** (brand, year, fuel type, gearbox) | 🟥 **P0 – Critical** | Core functionality. If filters fail, users can’t find relevant cars that cause direct revenue loss. 

| **2** | **Page navigation to car details** | 🟥 **P0 – Critical** | Users can’t access full info or submit leads. Major blocker for conversions. 

| **3** | **Checking sorting options** (newest listings, price order) | 🟧 **P1 – High** | Impacts trust and UX. Wrong sorting frustrates users and misrepresents offers.

| **4** | **Ensuring currency toggle updates prices** | 🟧 **P1 – High** | Important for international users. Incorrect currency conversion undermines credibility.

| **5** | **Handling cookies banner & dynamic/async content** | 🟨 **P2 – Medium** | Legal (GDPR) and UX compliance. Issues affect user experience.

> **Legend:**   
> - **P0** – must test first (critical for business)  
> - **P1** – high value, but not blocking  
> - **P2** – secondary / nice-to-have coverage
