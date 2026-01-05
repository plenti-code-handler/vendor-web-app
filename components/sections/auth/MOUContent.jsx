"use client";
import React from "react";

const MOUContent = ({ vendorData = null }) => {
  // Helper function to format date
  const formatDate = () => {
    const now = new Date();
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return {
      day: now.getDate(),
      month: months[now.getMonth()],
      year: now.getFullYear(),
      formatted: now.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    };
  };

  const date = formatDate();
  
  // Replace placeholders with actual vendor data or fallback values
  const vendorName = vendorData?.vendor_name || "{vendor_name}";
  const ownerName = vendorData?.owner_name || "{owner_name}";
  const address = vendorData?.address || "{address}";
  const formattedDate = date.formatted;

  const MOU_TEXT = `MEMORANDUM OF UNDERSTANDING
This MEMORANDUM OF UNDERSTANDING is made on this ${date.day} day of ${date.month}, ${date.year} (Effective Date)

BY and BETWEEN

SURGESLAMCO PRIVATE LIMITED, a private limited Company duly constituted under the Companies Act 2013, having its registered office at Building No. 455/9 Firdouse, Thamarkulam, Kaniyampuram, Pallippuram, Thiruvananthapuram, Kerala-695316 represented herein by its COO, hereinafter referred to as "PLENTI" (which expression shall unless excluded by or repugnant to the context or meaning thereof, be deemed to include their directors, successors in business, administrators, executors and permitted assigns) of the FIRST PART

AND

${vendorName}, a restaurant with its principal place of business located at ${address} represented through ${ownerName}, herein referred to as the "PARTNER", which expression shall unless excluded by or repugnant to the context or meaning thereof, be deemed to include their directors, successors in business, administrators, executors and permitted assigns) of the SECOND PART.

All the parts are hereinafter collectively referred to as "Parties";

RECITALS

WHEREAS, Plenti operates a digital marketplace/e-commerce platform intended to facilitate the connection between its Partners and end consumers, by enabling the sale and distribution of surplus food and related goods at reduced prices, thereby offering higher value compared to conventional food delivery services;

WHEREAS, the Partner is engaged in the domain of food business and possesses all valid licenses, permits, and registrations as required under applicable laws, and has expressed interest in enrolling in Plenti’s Partner Program for the purpose of listing its restaurant and/or food products on Plenti’s digital platform;

WHEREAS, the Restaurant Partner acknowledges that Plenti’s role is solely that of a technology platform provider and marketplace facilitator, and that the Restaurant Partner shall remain exclusively responsible for the preparation, safety, quality, and compliance of the food and related products with all applicable laws, regulations, and food safety standards;

WHEREAS, the Parties wish to formalize their mutual understanding and collaboration by entering into this Memorandum of Understanding, with the objective of ensuring mutual benefit, enhancing customer satisfaction, and compliance with all applicable laws, rules, and regulations.

NOW, THEREFORE, in consideration of the foregoing recitals and mutual agreements herein contained, and for other good and consideration, adequacy of which is hereby acknowledged, the Parties agree as follows;

1. TERM
1.1 This agreement commences on the Effective Date and shall be binding the parties until terminated in accordance with the provisions herein.
1.2 The Parties may renew/terminate this MoU by mutual consent.

2. BINDING
2.1 The parties hereby acknowledge and agree that the terms of this Memorandum are intended to be legally binding on the Parties hereto.

3. TERMINATION
3.1 The agreement shall be effective from the Effective Date and shall continue to be in full force and effect unless terminated (a) by mutual consent of both parties; or (b) upon the insolvency, cessation of business operations, or bankruptcy of either party.
3.2 Notwithstanding anything in this clause to the contrary, either party may terminate this MoU for convenience by providing thirty (30) days prior written notice to the other party.
3.3 Either party may also terminate this MoU immediately upon written notice if the other party commits a material breach and fails to remedy such breach within fifteen (15) days of receiving written notice thereof.
3.4 Plenti may suspend the Partner’s access or terminate this MoU immediately without notice upon: (a) suspicious, fraudulent, or illegal activity by the partner; (b) breach of any intellectual property right of Plenti or any third party by the Restaurant Partner; (c) any material misrepresentation or false declaration by the Restaurant Partner; and/or (d) material breach of food safety, quality, or operational requirements set forth in Clauses 2 through 6; (e) upon written direction from any competent regulatory authority including FSSAI, Central Consumer Protection Authority (CCPA), or any court of competent jurisdiction.

4. FORCE MEJEURE
4.1 Neither Party shall be liable for any failure or delay in performance of its obligations under this MoU if such failure or delay is caused by events beyond its reasonable control, including but not limited to "Force Majeure Event". The affected Party shall notify the other Party in writing within fifteen (15) days of becoming aware of such event, provide reasonable documentation of the Force Majeure Event and its impact, and make all commercially reasonable efforts to mitigate the effects and resume performance. If the Force Majeure Event continues for more than sixty (60) consecutive days, either Party may terminate this MoU by giving thirty (30) days written notice to the other Party.

5. LICENSE & LEGAL COMPLIANCE
5.1 The Partner represents, warrants and covenants that he/she/it holds and maintains throughout the term of the MoU a current, valid Food Business Operator License/ Registration issued by the Food Safety and Standards Authority of India (FSSAI) that permits all activities contemplated under this MoU.
5.2 The Partner shall also for the full Term prepare, store, handle and sell all Food Products strictly in accordance with: (i) the Food Safety and Standards Act 2006 and rules thereunder; (ii) the Food Safety and Standards (Licensing & Registration) Regulations 2011; (iii) the Legal Metrology (Packaged Commodities) Rules 2011; (iv) all applicable central and state tax laws including GST provisions; (v) all applicable municipal bye-laws, environmental laws and local authority regulations, and (vii) all other applicable laws, regulations, and standards relating to food safety, public health, and business operations.
5.3 The Partner agrees that he/she/it will maintain complete records of compliance, permit inspections by regulatory authorities and PLENTI’s authorized representatives, and immediately notify PLENTI of any regulatory violations, notices, or legal actions.

6. INDEMNITY & LIABILITY
6.1 “The Partner shall indemnify, defend and hold harmless Plenti, and its officers, directors, agents, contractors, employees, accessories and affiliates from and against any claims, demands, actions, suits, losses, damages, costs, expenses, penalties, fines and liabilities (including reasonable legal fees/costs) arising out of or related to: (a) the Partner’s material breach of Clauses 1 through 6; (b) any illness, ailments, injury or property damage alleged to be caused by Food Products supplied, prepared or handled by the Partner; or (c) any violation by the Partner of applicable laws, regulations and guidelines pertaining to food safety, consumer protection, health and safety, environmental compliance or business operations; (d) any acts or omissions by the Partner and its employees, agents or subcontractors in the performance of services under this MoU; or (e) any third-party claims arising from the Partner's use of intellectual property, trade secrets, or proprietary information without proper authorization.
6.2 For the avoidance of doubt it is hereby expressly acknowledged and agreed that Plenti operates solely as a technology platform provider and market place facilitator only responsible for providing a Platform to the Partner to list, offer and sell the Services to the Customers and that Plenti will not be responsible or liable for (i) the quality of the Services listed and advertised on the Platform; and/or (ii) the processing of the orders which have been placed by the Customers with the partner on the Platform; and/or (iii) any delay in preparation of the order by the Partner.

7. PACKAGING & HANDLING STANDARD
7.1 The Partner agrees to ensure that all food products are packaged using clean, food-grade containers that are reusable, recyclable, or compostable. The Partner shall also agree to utilize suitable packaging materials that preserve the integrity of the food, prevent leakage, and uphold all applicable food safety standards during transit and delivery.
7.2 The partner agrees to employ proper and requisite segregation protocols with respect to wet items which shall be packed in leak proof containers separate from dry items. The partner would further agree to pack items in accordance with the characteristic specific to each item and shall not compromise with segregation in any event.
7.3 The Partner assures and agrees that no single Plenti bag shall contain more than two (2) kilograms of net weight or exceed eight (8) distinct items, unless the Partner opts to divide the contents into multiple separate bags to ensure compliance with this limitation.
7.4 The partner agrees to inspect all packaging material for contamination/damage, and further assures that he/she shall not use any compromised containers as packages are expected to be maintained in proper storage and under strict hygiene protocols.

8. QUALITY OF FOOD/SERVICE & SAFETY WARRANTY
8.1 The Partner warrants that each Food Product made available through the Plenti Platform shall be wholesome, unadulterated, free from spoilage, contamination, and any off-odour, and shall be fit for human consumption at the time of handover to the Customer.
8.2 The Partner further warrants that all food and beverages provided to Customers are:
a) of merchantable quality and fit for human consumption;
b) have been prepared, stored, and handled in full compliance with the Food Safety and Standards Act, 2006, along with all applicable rules, regulations, licenses, standards, and guidelines issued thereunder; and
c) are in compliance with all other applicable laws and regulations in force in India, including those governing the food industry.
8.3 The Partner acknowledges and agrees to support Plenti's unique value proposition to end customers, wherein the platform aims to deliver approximately 3x value in terms of price and quality compared to conventional food delivery options. This enhanced value is expected to achieve by offering surplus food or packaged goods at significantly reduced prices. The Restaurant Partner agrees to support this proposition by: (a) listing only genuine, high quality surplus items that substantively reflect this value promise while maintaining all food safety and quality standards set forth; (b) ensuring that all surplus items, despite being offered at reduced prices, meet the same quality and safety standards as regularly priced items; (c) maintaining consistency in quality and value delivery to contribute to customer satisfaction, trust and retention on the Plenti platform.
8.4 The Partner expressly acknowledges and agrees that the value proposition is a projection estimated to be achieved by Plenti however shall not be considered as a guaranteed value, promise, or binding commitment by the Restaurant Partner as it is subject to numerous variables including but not limited to market conditions, customer demand, product availability, pricing strategies and operational factors beyond the control of either party.
8.5 The Partner acknowledges that failure to maintain quality standards or misrepresentation of surplus items may result in customer dissatisfaction and potential harm to the Plenti brand and platform reputation.

9. PICKUP WINDOW & CANCELLATION
9.1 The Partner shall (i) offer surplus items only within the pickup windows set in the Plenti Portal, (ii) prepare each order not earlier than sixty (60) minutes before the start of the window, and (iii) hold such items on-site until collected or window closure whichever happens first. If the partner is unable to honour a confirmed reservation, it shall cancel in the Portal no later than fifteen (15) minutes before the pickup window opens and immediately notify the Customer. More than three (3) late cancellations in any rolling thirty day period shall constitute a material breach.

10. SHELF LIFE & EXPIRY OBLIGATION
10.1 The Partner shall not list or supply through the Platform any food product that (a) has exceeded its 'Use-By', 'Best Before' or 'Expiry Date' as marked on the product packaging; (b) is a packaged product with less than thirty percent (30%) of its statutory shelf life remaining; or (c) is a packaged product with less than forty five (45) calendar days remaining until expiry, whichever standard in clause (b) or (c) provides the longer remaining shelf life period.
10.2 The foregoing restrictions shall not apply where: (i) expressly permitted under applicable FSSAI regulations, guidelines, or notifications for the specific category; (ii) Plenti has expressly provided written authorization specifying the product, conditions and duration of such waiver.

11. VEG / NON-VEG & ALLERGEN LABELLING
11.1 The Partner agrees to prominently display in each food product listed in the application shall show the FSSAI prescribed vegetarian symbol (green-filled circle) or non-vegetarian symbol (brown triangle) in accordance with requisite statutory requirements.
11.2 The Partner agrees to make visible/display wherever required, the declaration of any major allergens recognized under FSSAI guidelines including but not limited to the eight (8) major allergens as specified by it.
11.3 The partner will implement and maintain strict protocols to prevent cross contamination between vegetarian and non-vegetarian products as well as between allergen-containing and allergen-free products.
11.4 Any mis-declaration of vegetarian/non-vegetarian status, inaccurate or incomplete allergen information, failure to prevent cross-contamination or non-compliance with mandatory labelling requirements will constitute a material breach. The restaurant partner hereby agrees to indemnify Plenti against all such related costs, claims, damages, and legal expenses that may arise consequent to non compliance to terms mentioned herein.

12. TEMPARATURE CONTROL COVENANT
12.1 All perishable food products shall be stored and held at ≤5°C (cold foods) or ≥60°C (hot foods). The partner shall maintain calibrated thermometers, record temperatures at least twice daily and preserve such logs for no fewer than twelve (12) months for audit by Plenti or any Competent Authority.
12.2 Any hot food product that has been exposed to the temperature outside the specified ranges for more than an hour shall be removed from service and shall be a material breach to the context of this MoU. The Partner will notify Plenti of any significant temperature control failures that may affect food safety or quality.

13. SUSTAINABLE PACKAGING & ENVIRONMENTAL COMMITMENT
13.1 The Partner agrees to use only reusable, recyclable, compostable, or FSSAI-approved recycled packaging materials for all Plenti orders, and shall progressively eliminate the use of single-use plastic items as prohibited under the Plastic Waste Management Rules. Plenti shall provide the Partner with food-grade takeaway bags in standardized sizes (small, medium, and large) as necessary for the fulfilment of customer orders placed by the Customers with the partner on the Plenti Platform. The Partner undertakes to use these bags for all applicable orders unless otherwise directed by Plenti. In instances where a Customer indicates their intent to provide their own carry bag at the time of placing the order, Plenti shall notify the Partner in advance via the platform or through any mutually agreed communication channel. Upon request by Plenti, the Partner agrees to display disposal icons on packaging and to participate in sustainability or impact-driven initiatives, such as 'Bring-Your-Own-Bag' campaigns. The Partner further acknowledges and consents to Plenti’s right to publicly display carbon dioxide (CO₂) savings data derived from the Partner’s transaction volumes on the Plenti Platform.

14. LISTING ACCURACY
14.1 All product descriptions, expiry/best-before dates and time, vegetarian or allergen declarations and retail value estimates uploaded to the Portal shall be true, complete and not misleading.

15. SPECIFIC FOOD RESTRICTIONS
15.1 The Partner shall not include mayonnaise, whether as a standalone item or as an ingredient in any food product, in any order fulfilled via the Plenti Platform. This prohibition is imposed in view of Plenti’s handling of surplus food and is intended to safeguard customer health and maintain food quality standards. Any breach of this clause shall constitute a material non-conformity under this MoU and may result in suspension or termination of the Partner’s access to the Platform.

16. TRACEABILITY, DATA & PHOTO USAGE
16.1 The Partner hereby consents to and authorise Plenti to capture, process, store and retain transactional photographs (e.g. sealed bag images, expiry date scans, temperature log photos) and QR scan data solely for (a) food-safety verification and quality assurance; (b) dispute resolution between Partner(s), Customer(s), and Plenti; (c) regulatory compliance and audit requirements in accordance with the Information Technology Act 2000 and any applicable data protection rules.
16.2 Such data collection, processing, and retention activities shall be carried out in strict compliance with the Information Technology Act, 2000; the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011; the Digital Personal Data Protection Act, 2023; and any other applicable data protection laws and regulations. Plenti shall implement appropriate technical and organizational safeguards to ensure the confidentiality, integrity, and security of such data. Plenti shall retain the data only for as long as necessary to achieve the specified purposes or as mandated under applicable law, whichever period is longer.

17. INCIDENT REPORTING
17.1 The Partner shall notify Plenti within two (2) hours of becoming aware of any temperature excursion, equipment malfunction/failure, foodborne illness complaint, regulatory inspection, seizure, or recall notice pertaining to Food Products offered via the Plenti Platform. Furthermore, the Partner shall submit a written corrective action report to Plenti within twenty-four (24) hours of such notification.

18. PAYMENT FEES & INVOICING
18.1 Plenti shall remit the Net Pay outs (defined as the Gross Order Value less applicable Platform Fees, taxes, and any penalties) to the Partner’s designated bank account, upon initiation by the Partner once the allocated pay-out threshold is reached and be made on a [weekly / fortnightly / monthly] basis, as mutually agreed. Platform Fees shall be: (i) ₹10, ₹15 / ₹20 / ₹25 / ₹30 / ₹35, or such other amount per order as agreed upon with the Partner for Small, Medium, and Large order tiers; or (ii) such revised fees as may be notified by Plenti with no less than thirty (30) days’ prior notice. All payments made under this Agreement shall be subject to applicable Goods and Services Tax (GST), Tax Collected at Source (TCS), and any other statutory deductions as required under prevailing law.

19. TAXES
19.1 The Partner acknowledges and agrees that it shall be solely responsible for determining all applicable direct and indirect taxes, levies and statuory charges related to its services and supply of food articles through plenti platform.
19.2 The Partner also agrees to compute, report and file returns and remit all such taxes/levies to authorities in accordance with applicable law and shall also maintain accurate records and documents as required by law, applicable taxes related to its services and supply of goods via the Plenti platform. This responsibility includes, without limitation, GST, TDS, income tax, professional tax and any other central, state or local taxes, duties or levies that may be applicable from time to time.
19.3 Plenti may, in accordance with applicable laws and based on the Partner’s instructions, collect applicable taxes from Customers on behalf of the Partner and remit the amounts so collected to the Partner. Notwithstanding the above, the Partner shall remain solely and entirely responsible for verifying the accuracy of such tax calculations, filing all requisite tax returns, remitting payments to the appropriate tax authorities, and ensuring full compliance with all applicable tax laws, rules, and regulations.
19.4 For supplies under Section 9(5) of the CGST Act (effective from 1st Jan 2022), Plenti shall collect and deposit taxes for restaurant services as an e-commerce operator. However for other supplies (e.g. packaged goods), the partner remains liable.
19.5 Plenti shall deduct TDS under Section 194-O of the Income Tax Act on gross sales (excluding applicable taxes) and remit to the Government. TDS certificates will be issued quarterly. Any discrepancy must be reported by the Partner within 15 days of receipt of the certificate. No correction requests will be entertained after 31st July of the subsequent financial year.
19.6 The Partner must ensure correct PAN and GSTIN details are provided. Plenti shall not be liable for tax credit loss due to incorrect or delayed information from the Partner.
19.7 TCS under GST (w.e.f. 1 Oct 2018) shall be collected on non-restaurant services, remitted to the Government, and reflected in monthly transaction statements issued by Plenti.
19.8 The Partner indemnifies Plenti against any claims, penalties, or liabilities arising from non-compliance or inaccurate reporting of taxes under applicable law.

20. AUDIT & RECORD INSPECTION
20.1 Plenti reserves the right to conduct audits of the Partner’s premises, records, temperature logs, and packaging practices to verify compliance with this Agreement, upon providing twenty-four (24) hours’ prior notice. In cases where consumer safety is deemed to be at risk, such audits may be conducted without prior notice.
20.2 The occurrence of two (2) or more material non-conformities within any rolling ninety (90)-day period shall entitle Plenti to immediately suspend or terminate the Partner’s access to the Platform and/or this Agreement.

21. DATA RIGHTS AND CONFIDENTIALITY
21.1 The Partner acknowledges and agrees that, by virtue of entering into this Memorandum of Understanding (MoU), it may gain access to or become aware of confidential and proprietary information belonging to Plenti. Except as strictly necessary for the performance of its obligations under this MoU, or as expressly authorized in writing by Plenti, the Partner shall not, directly or indirectly, disclose, divulge, report, publish, transfer, or otherwise communicate any such confidential information to any third party. For the purposes of this clause, "Confidential Information" shall include, without limitation, the terms of this MoU and any amendments thereto, business strategies, pricing structures, revenue details, customer and order data, expense reports, vendor and partner lists, and any other information that is reasonably understood to be confidential by its nature or based on standard business practices.
21.2 The Partner also agrees that he/she/it shall take all reasonable precautions to protect the confidentiality of such information. The Partner's obligations under this clause shall survive the termination or expiry of these Terms and shall continue for a period of three (3) years thereafter.
21.3 Plenti is hereby authorized to collect, process, and anonymize transactional, operational, and sustainability-related data including but not limited to order volumes, surplus food quantities, temperature logs, estimated carbon savings, and other relevant metrics for the purposes of service delivery, fraud prevention, and impact reporting. Plenti shall not disclose the Partner’s non-public, identifiable data to any third party except: (a) to the Partner itself; (b) as required under applicable law or by lawful order of a competent authority; or (c) with the Partner’s prior written consent. Both Parties agree to maintain the confidentiality of each other’s Confidential Information and not to disclose such information to any third party for a period of five (5) years following the termination or expiration of this MoU, except as otherwise permitted herein or required by law.
21.4 Except as required for the provision of Services under this MoU, Plenti shall not retain, use, or disclose any information pertaining to the Restaurant Partner to any third party, unless such disclosure is mandated by applicable law or pursuant to a valid request or order issued by a government authority or regulatory body.

22. REFUND & RECALL COOPERATION
22.1 Plenti may, at its sole and absolute discretion, issue a full or partial refund or credit to any Customer in cases where a Food Product is found to be unsafe, spoiled, or materially misrepresented. The Partner agrees to reimburse Plenti for any such amounts within seven (7) days. Additionally, the Partner shall provide full cooperation and proactive assistance in connection with any product recall, withdrawal, regulatory inquiry, or internal investigation initiated by Plenti or any competent authority.

23. CUSTOMER DATA
23.1 The Partner shall use Customer Data solely for the limited purpose of fulfilling orders and providing related customer service. The Partner is expressly prohibited from sharing, selling, disclosing, or otherwise transferring Customer Data to any third party, and shall not use such data in any manner that would contravene applicable data protection laws in India. The Partner shall implement appropriate technical and organizational measures to ensure the security, confidentiality, and integrity of Customer Data and shall comply at all times with all applicable data protection laws, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023. The Partner’s obligations with respect to the protection and handling of Customer Data shall survive the termination or expiration of this MoU. Upon termination of this MoU, or upon written request from Plenti, the Partner shall immediately return to Plenti or securely destroy all Customer Data in its possession, custody, or control.

24. PENALTIES FOR BREACH
24.1 For each verified breach of Clauses 2 through 6, the Partner shall pay Plenti pre estimated damage equal to the greater of (i) Indian Rupees two-thousand five-hundred (₹ 2,500) or (ii) two (2) times the total Gross Order Value of the affected Orders, in addition to reimbursing all Customer refund amounts. Such penalties are without prejudice to Plenti’s right to terminate or seek further damages.

25. USE OF NAMES, TRADEMARKS & MARETING ASSETS
25.1 Each Party hereby grants to the other a non-exclusive, revocable, royalty-free license to use and display the other Party’s name, marks, and logos solely for the limited purpose of promoting the availability of surplus food on the Plenti Platform and publicizing the collaborative relationship between the parties. All such usage shall be in strict accordance with the brand usage guidelines provided by the respective Party.
25.2 Neither Party shall imply or suggest any endorsement of the other Party’s products or services beyond the scope of this MoU without the express prior written consent of the other Party.
25.3 Any content, information, materials, images, or data submitted or transmitted by the Partner to Plenti via the Platform or through any other means in connection with this MoU shall be deemed non-confidential and may be treated as such by Plenti unless designated as confidential in writing, subject to Plenti’s obligations under applicable data protection laws.
25.4 The Partner hereby grants to Plenti a royalty-free, perpetual, irrevocable, non-exclusive, worldwide license to use, reproduce, copy, modify, adapt, translate, publish, and distribute such Content for the purposes of (i) providing the services contemplated under these terms, and (ii) advertising, marketing, and promoting the Plenti Platform.

26. OPTIONAL EXCLUSIVITY
26.1 The Parties may, by executing a separate Addendum, agree to geographic or category exclusivity (e.g. sole surplus-food partner within a 2 km radius). Any exclusivity shall (a) be time-bound, (b) respect the Competition Act 2002, and (c) automatically terminate upon material breach by either Party.

27. QR CODE & TRACEABILITY
27.1 Every packaged order shall prominently display the unique Plenti QR code or one-time passcode generated through the platform. The Partner shall not alter, obscure, or tamper with the QR code or passcode in any manner. Scanning the QR code or entering the passcode shall constitute conclusive proof of order handover, trigger payment capture, and facilitate the logging of temperature and CO₂-related data associated with the transaction.
27.2 Any tampering with the QR code or passcode, including but not limited to re-use on a different order, is strictly prohibited and shall constitute a material breach of this MoU, entitling Plenti to immediate suspension of the Partner’s access to the Platform and/or termination of this Agreement.

28. PLENTI BUDDY (DELEGATED PICKUP)
28.1 The Partner shall release an order only to a bearer who presents a valid PlentiBuddy QR code or one-time passcode granted and displayed within the Plenti application. Upon successful verification of such code or passcode, risk and title in the goods shall transfer to the Customer, and the Partner shall be deemed to have fully discharged its obligations with respect to that order.

29. MISCELLANEOUS
29.1 Governing Law and Dispute Resolution: This Form shall be governed by the Laws of India, for the time being in force, and the courts of Thiruvananthapuram shall have exclusive jurisdiction over matters arising hereunder. Parties shall first attempt to resolve disputes amicably within fifteen (15) days from the date of notice. Failing which, the dispute shall be referred to court.
29.2 Waiver: Failure of either party to assert any rights under the Form, including the right to terminate due to breach or default, will not constitute a waiver of those rights for future enforcement.
29.3 Severability: If any provision of these Terms is found to be invalid or unenforceable, it shall not affect the validity of the remaining provisions.
29.4 No Third-Party Rights: No provision of this MoU shall be enforceable by any third party.
29.5 No Assignment: The Partner shall not assign, transfer, charge, or otherwise deal with this MoU or any rights or obligations under it without prior written consent.
29.6 Independent Contractors: This MoU establishes an independent contractor relationship between Plenti and the Partner. Nothing contained in this MoU shall be construed to create, constitute, establish, or imply any agency, employment, partnership, joint venture, franchise, or any other form of legal association between the parties. Each party is and shall remain an independent contractor with respect to all activities undertaken pursuant to the terms of this MoU. Neither party has any authority, express or implied, to act as agent for the other party or to bind the other party to any obligation, contract, representation, or commitment with any third party. Each party shall be solely responsible for its own employees, contractors, taxes, benefits, insurance, and compliance with applicable laws. Any actions taken by either party shall be solely on its own behalf and not as a representative or agent of the other party.
29.7 Change of Control: The Partner acknowledges that Plenti’s business or assets may be sold in the future and consents to the transfer or disclosure of this MoU and related information to the purchaser.
29.8 Acceptance of Plenti’s Privacy Policy: By executing this MoU, the Partner acknowledges that it has agreed to comply with Plenti’s Privacy Policy as published on Plenti’s website and as may be updated from time to time. The Partner shall immediately notify Plenti in writing upon becoming aware of any actual or suspected unauthorized access, use, disclosure, or breach of user data, customer information, or any confidential information related to Plenti or its customers. Such notification shall be provided within twenty-four (24) hours of discovery. The Partner agrees to cooperate fully with Plenti in any investigation, remediation, or mitigation efforts related to such security incidents, including providing access to relevant records, personnel, and systems as reasonably requested by Plenti. The Partner shall take immediate steps to contain and remedy any security breach and shall not publicly disclose any such incident without Plenti’s prior written consent, except as required by applicable law.

IN WITNESS WHEREOF, the Parties (through their duly authorized representatives) have executed this Memorandum of Understanding on the dates shown below.
`;

return (
  <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
    {MOU_TEXT}
    
    {/* Signature Section with table for perfect alignment */}
    <div className="mt-6">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left font-semibold pb-3 w-1/2">For PLENTI</th>
            <th className="text-left font-semibold pb-3 w-1/2">For {vendorName}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1">Name: BHARATH MOHAN S.</td>
            <td className="py-1">Name: {ownerName}</td>
          </tr>
          <tr>
            <td className="py-1">Title: COO</td>
            <td className="py-1">Title: OWNER/MANAGER</td>
          </tr>
          <tr>
            <td className="py-1">Signature: BHARATH MOHAN S.</td>
            <td className="py-1">Signature: {ownerName}</td>
          </tr>
          <tr>
            <td className="py-1">Date: {formattedDate}</td>
            <td className="py-1">Date: {formattedDate}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
};

export default MOUContent;