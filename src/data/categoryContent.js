export const categoryContent = {
  'health-insurance': {
    slug: 'health-insurance',
    name: 'Health Insurance',
    seo: { 
      title: 'Health Insurance Plans - Comprehensive Medical Coverage | Radhe Investments', 
      description: 'Discover comprehensive health insurance plans to safeguard your family against rising medical costs. Expert guidance from Radhe Investments for your healthcare needs.' 
    },
    hero: { 
      title: 'Secure Your Health, Secure Your Wealth', 
      subtitle: 'Comprehensive Health Insurance Solutions', 
      description: 'Medical emergencies shouldn\'t derail your financial goals. Explore health insurance plans that provide robust coverage for hospitalization, day-care procedures, and critical illnesses, ensuring you focus on recovery, not bills.' 
    },
    finder: [
      { title: 'Protect My Family', icon: 'Shield', description: 'Comprehensive coverage for you, your spouse, and dependent children under a single plan with shared sum insured.' },
      { title: 'Individual Protection', icon: 'User', description: 'Dedicated health coverage tailored for single individuals to handle unexpected medical expenses with maximum tax benefits.' },
      { title: 'Senior Citizen Care', icon: 'Heart', description: 'Specialized health policies designed for older parents covering age-related medical conditions and frequent hospital visits.' }
    ],
    types: [
      { title: 'Individual Health Insurance', description: 'Covers the medical expenses of a single individual up to the chosen sum insured.', whoItSuits: 'Young professionals, unmarried individuals, or those wanting separate coverage from their family.', considerations: 'Premiums are determined based on the age, medical history, and lifestyle of the individual.' },
      { title: 'Family Floater Health Insurance', description: 'A single policy that covers the entire family under a single sum insured pool.', whoItSuits: 'Nuclear families with young children.', considerations: 'The premium is usually based on the age of the oldest family member. If one member claims, the sum insured reduces for others.' },
      { title: 'Senior Citizen Health Insurance', description: 'Tailored specifically for individuals above the age of 60, offering coverage for age-related illnesses.', whoItSuits: 'Elderly parents or individuals over 60.', considerations: 'Often comes with co-payment clauses and specific waiting periods for pre-existing diseases.' },
      { title: 'Critical Illness Insurance', description: 'Provides a lump sum amount upon the diagnosis of specified life-threatening diseases like cancer, heart attack, or stroke.', whoItSuits: 'Individuals with a family history of critical illnesses or those seeking a financial safety net.', considerations: 'Acts as a supplement to regular health insurance; survival period clauses apply.' }
    ],
    benefits: [
      { title: 'Cashless Hospitalization', icon: 'CheckCircle', description: 'Avail treatment at network hospitals without paying out of pocket, as the insurer settles the bill directly.' },
      { title: 'Tax Benefits', icon: 'TrendingUp', description: 'Save on income tax under Section 80D of the Income Tax Act for premiums paid for yourself, family, and parents.' },
      { title: 'Financial Security', icon: 'Shield', description: 'Protects your savings from being wiped out by sudden and steep medical bills.' },
      { title: 'Preventive Care', icon: 'Heart', description: 'Many plans include annual health check-ups, promoting early detection and proactive health management.' }
    ],
    howItWorks: [
      { step: 1, title: 'Assess Your Needs', description: 'Evaluate your health profile, family medical history, and budget to determine the required sum insured and coverage type.' },
      { step: 2, title: 'Compare Plans', description: 'Look at various policies available, checking network hospitals, waiting periods, co-pays, and sub-limits.' },
      { step: 3, title: 'Purchase Policy', description: 'Fill out the application with honest medical disclosures, undergo pre-policy medical checkups if required, and pay the premium.' },
      { step: 4, title: 'Claim Assistance', description: 'In a medical event, notify the insurer and use the cashless facility at a network hospital or file for reimbursement later.' }
    ],
    factors: [
      { title: 'Age and Health Profile', description: 'Younger individuals generally pay lower premiums. Pre-existing conditions may increase premiums or introduce waiting periods.' },
      { title: 'Sum Insured', description: 'The maximum limit of coverage. Higher sum insured means better protection but comes with a higher premium.' },
      { title: 'Network Hospitals', description: 'The breadth and quality of hospitals tied up with the insurer for cashless treatment in your city.' },
      { title: 'Sub-Limits & Co-Pay', description: 'Caps on specific expenses (like room rent) or clauses where you must bear a percentage of the claim amount.' }
    ],
    coverage: { 
      included: ['In-patient Hospitalization (more than 24 hours)', 'Pre and Post Hospitalization expenses', 'Day Care Procedures', 'Ambulance Charges', 'Organ Donor Expenses', 'Domiciliary Hospitalization (under specific conditions)'], 
      subjectToTerms: ['Pre-existing diseases (after waiting period)', 'Specific ailments (cataract, hernia, etc., after waiting period)', 'Modern treatments (Robotic surgery, CyberKnife)'], 
      notSpecified: ['Cosmetic surgeries', 'Unproven/Experimental treatments', 'Dental care (unless accidental)', 'Maternity (unless a specific add-on or rider is chosen)'] 
    },
    eligibility: [
      'Entry Age: Typically 18 to 65 years for adults. Children can be covered from 91 days onwards.',
      'Renewability: Lifelong renewability is mandated by IRDAI.',
      'Medical Check-up: May be required for individuals above a certain age (e.g., 45 or 50 years) or higher sum insured.'
    ],
    waitingPeriods: [
      { title: 'Initial Waiting Period', description: 'Typically 30 days from policy inception during which non-accidental claims are not covered.' },
      { title: 'Specific Disease Waiting Period', description: 'Usually 12 to 24 months for slow-growing illnesses like cataracts, hernia, and joint replacements.' },
      { title: 'Pre-Existing Disease (PED) Waiting Period', description: 'Ranges from 24 to 48 months for conditions diagnosed or treated prior to buying the policy.' }
    ],
    documents: [
      'Proof of Identity (Aadhaar Card, PAN Card, Passport)',
      'Proof of Address (Utility Bills, Voter ID, Aadhaar)',
      'Age Proof (Birth Certificate, 10th Marksheet, Passport)',
      'Medical Reports (If requested by the insurer)'
    ],
    howToChoose: [
      '1. Assess adequate coverage based on rising medical inflation (target at least ₹10 Lakhs for a family in a metro city).',
      '2. Check for policies with no or high room rent caps to avoid proportionate deductions on claims.',
      '3. Opt for minimal or zero co-payment clauses.',
      '4. Look for restoration benefits that replenish your sum insured if exhausted within a policy year.',
      '5. Verify the insurer\'s Claim Settlement Ratio (CSR) and Incurred Claim Ratio (ICR).'
    ],
    claims: [
      { step: 1, title: 'Intimation', description: 'Notify the insurer or TPA at least 48 hours before planned hospitalization or within 24 hours of an emergency.' },
      { step: 2, title: 'Cashless Process', description: 'Submit the pre-authorization form at the network hospital\'s TPA desk. The insurer approves the amount, and bills are settled directly.' },
      { step: 3, title: 'Reimbursement Process', description: 'For non-network hospitals, pay the bills out of pocket, collect all original documents, and file a claim within 15-30 days of discharge.' }
    ],
    renewals: { 
      description: 'Health insurance policies are typically annual contracts and must be renewed before the expiry date to maintain continuity benefits (like waiting periods).', 
      points: [
        'Grace Period: 30 days are given post-expiry to renew, but coverage is paused during this period.', 
        'Review Coverage: Renewal is the best time to increase sum insured or add family members.',
        'No Claim Bonus: Earn cumulative bonus or discount on premiums for claim-free years.'
      ] 
    },
    whyRadhe: [
      { title: 'Unbiased Advisory', description: 'We don\'t push products; we analyze your specific healthcare needs to recommend the right fit from top insurers.' },
      { title: 'Claim Support', description: 'A dedicated desk to assist you in documentation and liaisoning with insurers during stressful medical emergencies.' },
      { title: 'Portfolio Management', description: 'Regular reviews of your coverage to ensure it keeps pace with medical inflation and your changing life stages.' }
    ],
    education: [
      { h3: 'Understanding Room Rent Limits', content: 'Many health plans cap room rent at 1% of the sum insured per day. If you choose a room exceeding this limit, the insurer won\'t just pay the capped amount; they will proportionately reduce all associated hospital charges (doctor fees, surgery, etc.), leading to massive out-of-pocket expenses. We always recommend plans with no room rent capping.' },
      { h3: 'The Truth About Pre-Existing Diseases', content: 'Non-disclosure of pre-existing diseases is the leading cause of claim rejections. A pre-existing disease (PED) is any condition diagnosed or treated up to 48 months before buying the policy. It is crucial to declare everything—from asthma to hypertension—even if you feel completely fine now. The insurer may apply a waiting period or charge extra premium, but your claim will be secure.' }
    ],
    glossary: [
      { term: 'Sum Insured', definition: 'The maximum amount an insurance company will pay in a given policy year for medical treatments.' },
      { term: 'TPA (Third Party Administrator)', definition: 'An intermediary appointed by the insurance company to process health insurance claims and provide customer support.' },
      { term: 'Co-Payment', definition: 'A clause where the policyholder agrees to pay a fixed percentage of the medical bill out of pocket, while the insurer pays the rest.' },
      { term: 'Cumulative Bonus', definition: 'An increase in the sum insured granted by the insurer for every claim-free year, without increasing the premium.' }
    ],
    articles: [
      { title: 'Why Corporate Cover Isn\'t Enough', excerpt: 'Relying solely on your employer\'s health insurance can leave you vulnerable if you change jobs or retire. Here is why you need a personal policy.', link: '#' },
      { title: 'Decoding Health Insurance Exclusions', excerpt: 'Understand what your policy does NOT cover to avoid surprises during a medical emergency.', link: '#' }
    ],
    faq: [
      { 
        category: 'General', 
        items: [ 
          { q: 'Is maternity covered by default?', a: 'No, standard health insurance policies usually exclude maternity expenses. You need to purchase a specific add-on or a plan tailored for maternity, which often comes with a waiting period of 9 to 48 months.' },
          { q: 'Can I port my health insurance policy?', a: 'Yes, IRDAI allows policyholders to port their existing health insurance to another insurer while retaining continuity benefits like waiting periods and No Claim Bonus. This must be initiated at least 45 days before renewal.' }
        ] 
      }
    ]
  },
  
  'life-insurance': {
    slug: 'life-insurance',
    name: 'Life Insurance',
    seo: { 
      title: 'Life Insurance Plans - Wealth Creation & Protection | Radhe Investments', 
      description: 'Explore life insurance solutions that offer a perfect blend of family protection and long-term wealth creation to secure your financial future.' 
    },
    hero: { 
      title: 'Build Wealth, Leave a Legacy', 
      subtitle: 'Insurance That Does More Than Protect', 
      description: 'Life insurance is a fundamental pillar of a sound financial plan. Whether you want to secure your family\'s future in your absence, save for a child\'s education, or build a retirement corpus, our life insurance solutions offer the perfect synergy of protection and growth.' 
    },
    finder: [
      { title: 'Wealth Accumulation', icon: 'TrendingUp', description: 'Participating and unit-linked plans designed to grow your capital over the long term for major life milestones.' },
      { title: 'Child Future Planning', icon: 'Smile', description: 'Policies that guarantee funds for your child\'s higher education or marriage, regardless of life\'s uncertainties.' },
      { title: 'Retirement Solutions', icon: 'Clock', description: 'Pension and annuity plans to ensure a steady, guaranteed income stream when you hang up your boots.' }
    ],
    types: [
      { title: 'Endowment Plans', description: 'Traditional policies that offer a life cover along with a savings component, paying a lump sum at maturity or on death.', whoItSuits: 'Conservative investors looking for guaranteed returns and disciplined savings.', considerations: 'Returns are generally lower compared to market-linked products; requires long-term commitment.' },
      { title: 'Unit Linked Insurance Plans (ULIPs)', description: 'Products that combine life insurance with market-linked investments (equity or debt funds).', whoItSuits: 'Investors comfortable with market risk aiming for higher long-term wealth creation.', considerations: 'Carries market risk; charges are deducted for mortality and fund management.' },
      { title: 'Money Back Plans', description: 'A variant of endowment plans that pays out a percentage of the sum assured at regular intervals during the policy term.', whoItSuits: 'Individuals requiring periodic liquidity while maintaining life cover.', considerations: 'Overall returns may be lower than plain endowment plans.' },
      { title: 'Whole Life Insurance', description: 'Provides coverage for the policyholder\'s entire life (usually up to 99 or 100 years), with a survival benefit.', whoItSuits: 'Those aiming to leave a guaranteed legacy for their heirs.', considerations: 'Premiums are typically higher than fixed-term policies.' }
    ],
    benefits: [
      { title: 'Financial Independence for Dependents', icon: 'Shield', description: 'Ensures that your family maintains their standard of living and achieves their goals even in your absence.' },
      { title: 'Forced Savings', icon: 'Save', description: 'Inculcates the habit of disciplined, long-term saving, which is crucial for wealth accumulation.' },
      { title: 'Tax Efficiencies', icon: 'Percent', description: 'Premiums paid qualify for deduction under Section 80C, and maturity proceeds are often tax-free under Section 10(10D).' },
      { title: 'Loan Facility', icon: 'CreditCard', description: 'Many traditional life insurance policies allow you to borrow against the accumulated cash value in emergencies.' }
    ],
    howItWorks: [
      { step: 1, title: 'Identify Your Goal', description: 'Determine if your primary need is pure protection, wealth accumulation, tax saving, or retirement planning.' },
      { step: 2, title: 'Select the Plan', description: 'Choose between traditional plans (guaranteed returns) or ULIPs (market-linked returns) based on your risk appetite.' },
      { step: 3, title: 'Determine Premium & Term', description: 'Decide how much you can afford to pay regularly and the duration for which you want the coverage and investment to run.' },
      { step: 4, title: 'Receive Benefits', description: 'Get a maturity payout if you survive the term, or your nominees receive the death benefit in an unfortunate event.' }
    ],
    factors: [
      { title: 'Financial Goals', description: 'The time horizon of your goals (e.g., child\'s education in 15 years) dictates the policy term and type.' },
      { title: 'Risk Tolerance', description: 'Choose ULIPs if you can handle market volatility; stick to Endowment plans if you want capital safety.' },
      { title: 'Premium Payment Capacity', description: 'Ensure the premium is affordable over the long term; lapsing a policy results in significant financial loss.' },
      { title: 'Inflation', description: 'Ensure the maturity amount projected will actually hold value when you receive it 10 or 20 years down the line.' }
    ],
    coverage: { 
      included: ['Death benefit payable to the nominee', 'Maturity benefit payable upon surviving the term (for savings plans)', 'Riders (Accidental death, premium waiver) if opted', 'Bonuses declared by the insurer (for participating plans)'], 
      subjectToTerms: ['Suicide within the first year (usually only premium is refunded)', 'Lapsed policies where premiums are unpaid'], 
      notSpecified: ['Death due to participation in hazardous sports (unless declared)', 'Death due to criminal acts'] 
    },
    eligibility: [
      'Age: Entry age varies from 0 days (for child plans) up to 60-65 years.',
      'Income: Required to justify the sum assured and premium paying capacity.',
      'Health: Underwriting based on current health status and medical history.'
    ],
    waitingPeriods: [
      { title: 'Suicide Clause', description: 'If the insured commits suicide within 12 months of inception or revival, the nominee typically receives only 80% of premiums paid or the surrender value.' },
      { title: 'Rider Waiting Periods', description: 'Specific riders like Critical Illness may have a 90-day waiting period before coverage kicks in.' }
    ],
    documents: [
      'Proof of Identity and Address',
      'Age Proof (Standard age proof required)',
      'Income Proof (ITR, Salary Slips, Form 16)',
      'Passport size photographs and completed proposal form'
    ],
    howToChoose: [
      '1. Separate protection from investment if you want maximum coverage (Buy Term for protection, Mutual Funds for wealth).',
      '2. If choosing a ULIP, evaluate the fund options, historical performance, and charge structure.',
      '3. For child plans, always look for the Premium Waiver Benefit rider so the policy continues even if you pass away.',
      '4. Understand the difference between Guaranteed Returns and Projected Returns (which depend on company performance).',
      '5. Read the surrender value rules carefully—life insurance is not a short-term liquid instrument.'
    ],
    claims: [
      { step: 1, title: 'Notification', description: 'Nominee must inform the insurer immediately and obtain the claim forms.' },
      { step: 2, title: 'Document Submission', description: 'Submit original policy bond, death certificate, identity proofs, and medical records.' },
      { step: 3, title: 'Processing & Settlement', description: 'Upon verification, the insurer deposits the sum assured plus any accrued bonuses into the nominee\'s bank account.' }
    ],
    renewals: { 
      description: 'Life insurance requires disciplined, regular premium payments to keep the policy active and the investment growing.', 
      points: [
        'Grace Period: 15 to 30 days depending on payment frequency.', 
        'Lapse & Revival: If unpaid beyond the grace period, the policy lapses. It can be revived within a specific window by paying arrears with interest.',
        'Paid-up Value: If stopped after a certain number of years, the policy may continue with a reduced sum assured.'
      ] 
    },
    whyRadhe: [
      { title: 'Goal-Based Matching', description: 'We don\'t sell policies; we map products to your specific life goals like education, marriage, and retirement.' },
      { title: 'Transparent Disclosures', description: 'We clearly explain IRR (Internal Rate of Return), charges, and surrender penalties before you commit.' },
      { title: 'Lifecycle Management', description: 'We manage your portfolio, remind you of premiums, and help you switch ULIP funds as your risk profile changes.' }
    ],
    education: [
      { h3: 'The Reality of Endowment Returns', content: 'Traditional endowment and money-back plans are excellent for forced savings and capital preservation. However, investors must set realistic expectations. Due to stringent regulatory requirements on how insurers must invest (mostly in safe government and corporate bonds), the Internal Rate of Return (IRR) typically hovers around 5% to 6%. They should form the conservative, risk-free debt portion of your overall portfolio, not the engine for aggressive wealth creation.' },
      { h3: 'Understanding MWP Act', content: 'The Married Women\'s Property (MWP) Act is a powerful tool for business owners and individuals with liabilities. If you buy a life insurance policy under the MWP Act, the policy proceeds are legally protected from creditors, court attachments, and tax authorities. The payout strictly belongs to your wife and/or children, ensuring your family\'s financial safety net cannot be claimed to settle your debts.' }
    ],
    glossary: [
      { term: 'Sum Assured', definition: 'The guaranteed minimum amount the insurer will pay the nominee upon the death of the policyholder.' },
      { term: 'Participating Policy', definition: 'A policy that is eligible to receive a share of the insurance company\'s profits in the form of bonuses.' },
      { term: 'Surrender Value', definition: 'The amount the policyholder will get if they decide to terminate the policy before its maturity date.' },
      { term: 'Premium Waiver Benefit', definition: 'A rider that waives all future premiums if the policyholder dies or becomes totally disabled, keeping the policy intact.' }
    ],
    articles: [
      { title: 'ULIPs vs Mutual Funds', excerpt: 'A detailed comparison of costs, lock-in periods, tax benefits, and wealth creation potential.', link: '#' },
      { title: 'Planning Your Child\'s Education Fund', excerpt: 'How to calculate the future cost of education and choose the right mix of insurance and investment.', link: '#' }
    ],
    faq: [
      { 
        category: 'General', 
        items: [ 
          { q: 'Can I withdraw money from my life insurance policy?', a: 'Traditional policies do not allow partial withdrawals, but you can take a loan against them. ULIPs permit partial withdrawals after a lock-in period of 5 years.' },
          { q: 'What happens if I stop paying the premium?', a: 'If stopped early (usually before 2-3 years), the policy lapses and you lose all premiums paid. If stopped later, the policy acquires a "paid-up" value with reduced benefits, or you can surrender it for a penalty.' }
        ] 
      }
    ]
  },
  
  'term-insurance': {
    slug: 'term-insurance',
    name: 'Term Insurance',
    seo: { 
      title: 'Term Insurance - Pure Life Protection Plans | Radhe Investments', 
      description: 'Secure your family\'s future with high-coverage term insurance plans at affordable premiums. The purest form of life protection.' 
    },
    hero: { 
      title: 'Maximum Protection, Minimal Cost', 
      subtitle: 'Pure Life Cover for Total Peace of Mind', 
      description: 'Term insurance is the most fundamental and cost-effective form of life insurance. It provides an exceptionally large financial safety net for your family at a fraction of the cost of traditional plans, ensuring that your liabilities are covered and your family\'s dreams are protected if you are no longer around.' 
    },
    finder: [
      { title: 'Pure Protection', icon: 'Shield', description: 'Standard term plans offering a high lump sum payout to the nominee in case of the policyholder\'s demise.' },
      { title: 'Income Replacement', icon: 'TrendingUp', description: 'Term plans that pay out the benefit as a staggered monthly income to ensure your family manages day-to-day expenses.' },
      { title: 'Return of Premium', icon: 'RefreshCcw', description: 'Term plans that return all the premiums you\'ve paid if you survive the policy term, blending protection with capital return.' }
    ],
    types: [
      { title: 'Level Term Insurance', description: 'The most basic form where the sum assured and premium remain constant throughout the policy term.', whoItSuits: 'Individuals wanting simple, predictable, and maximum coverage for a set budget.', considerations: 'Easiest to understand and cheapest form of life cover.' },
      { title: 'Increasing Term Insurance', description: 'The sum assured increases by a specific percentage every year to combat inflation, while the premium may remain constant.', whoItSuits: 'Young professionals anticipating a rise in responsibilities and standard of living.', considerations: 'Initial premiums are slightly higher than level term plans.' },
      { title: 'Decreasing Term Insurance', description: 'The sum assured decreases over time, usually in line with a large amortizing debt like a home loan.', whoItSuits: 'Individuals seeking to cover a specific, decreasing liability like a mortgage.', considerations: 'Often bought directly with home loans (Mortgage Redemption policies).' },
      { title: 'Term Insurance with Return of Premium (TROP)', description: 'Refunds all the base premiums paid (excluding GST and rider charges) if the policyholder survives the term.', whoItSuits: 'Those who view standard term insurance as an "expense" and want their money back if they survive.', considerations: 'Premiums are significantly higher than pure term plans, lowering the overall ROI.' }
    ],
    benefits: [
      { title: 'High Coverage at Low Premium', icon: 'Percent', description: 'You can secure a cover of ₹1 Crore for a premium as low as ₹500-₹800 per month (depending on age).' },
      { title: 'Financial Security', icon: 'Shield', description: 'Ensures that your family can pay off debts (home loans) and maintain their lifestyle without financial stress.' },
      { title: 'Tax Benefits', icon: 'Save', description: 'Premiums are tax-deductible under Section 80C, and the death benefit is tax-free under Section 10(10D).' },
      { title: 'Customizable Riders', icon: 'PlusCircle', description: 'Enhance your base cover with add-ons like Critical Illness, Accidental Death, or Waiver of Premium.' }
    ],
    howItWorks: [
      { step: 1, title: 'Determine the Cover Amount', description: 'Calculate required coverage using the Human Life Value concept—factor in current income, expenses, debts, and future goals.' },
      { step: 2, title: 'Choose Term & Options', description: 'Select a policy term that covers your working years (e.g., up to age 60-65) and choose payout options (lump sum or income).' },
      { step: 3, title: 'Medical Underwriting', description: 'Complete a detailed proposal form and undergo required medical tests to ensure accurate risk assessment.' },
      { step: 4, title: 'Policy Issuance', description: 'Pay the premium to initiate the cover. If you pass away during the term, the insurer pays the sum assured to your nominee.' }
    ],
    factors: [
      { title: 'Current Age', description: 'The most critical factor. Buying early locks in an incredibly low premium for the rest of your life.' },
      { title: 'Lifestyle Habits', description: 'Smokers and tobacco users pay significantly higher premiums due to higher mortality risk.' },
      { title: 'Health & Medical History', description: 'Pre-existing conditions or a family history of critical illness can increase the premium or lead to policy rejection.' },
      { title: 'Policy Term', description: 'Opting for coverage till age 85 or 99 (Whole Life Term) drastically increases the premium compared to coverage till age 60.' }
    ],
    coverage: { 
      included: ['Death due to natural causes', 'Death due to illness or disease', 'Death due to accidents'], 
      subjectToTerms: ['Death by suicide is only covered after 1 year (initial premiums are refunded)'], 
      notSpecified: ['Death due to involvement in illegal activities', 'Death due to drug overdose or alcohol abuse', 'Death in war or acts of terrorism (varies by insurer)'] 
    },
    eligibility: [
      'Age: Minimum entry age is 18 years; maximum entry age is typically 65 years.',
      'Income Requirement: Standard financial underwriting requires a minimum annual income (e.g., ₹3-5 Lakhs) with ITR proofs.',
      'Profession: High-risk professions (mining, aviation, armed forces) may face different underwriting guidelines.'
    ],
    waitingPeriods: [
      { title: 'Suicide Clause', description: 'Coverage for suicide is excluded for the first 12 months. If death occurs by suicide in year 1, the nominee receives 80-100% of the premiums paid, not the sum assured.' },
      { title: 'Rider Waiting Periods', description: 'If a Critical Illness rider is attached, there is usually a 90-day waiting period and a 30-day survival period post-diagnosis.' }
    ],
    documents: [
      'Identity Proof (Aadhaar, PAN)',
      'Address Proof',
      'Recent Income Proof (Last 3 years ITR and 6 months salary slips)',
      'Medical Test Reports (Arranged by the insurance company)'
    ],
    howToChoose: [
      '1. Calculate Adequacy: A thumb rule is a Sum Assured of 15-20 times your annual income plus all outstanding loans.',
      '2. Policy Tenure: Buy coverage up to your expected retirement age (usually 60-65), when your active income stops and liabilities end.',
      '3. Claim Settlement Ratio: Choose an insurer with a consistently high CSR (above 95%) and a good reputation for hassle-free claims.',
      '4. Beware of TROP: Return of Premium plans are expensive. You are better off buying a pure term plan and investing the difference in mutual funds.',
      '5. Add Riders Wisely: Consider an Accidental Death Benefit rider for extra protection at a nominal cost.'
    ],
    claims: [
      { step: 1, title: 'Immediate Intimation', description: 'The nominee must inform the insurance company or broker immediately after the policyholder\'s demise.' },
      { step: 2, title: 'Document Submission', description: 'Submit the original policy document, death certificate, claimant\'s ID/address proof, and cancelled cheque.' },
      { step: 3, title: 'Verification', description: 'Insurers may conduct an investigation, especially if the claim happens within 3 years of policy issuance (Early Claim).' }
    ],
    renewals: { 
      description: 'Term insurance requires timely premium payment. Unlike savings plans, there is no maturity or surrender value if you stop paying.', 
      points: [
        'Grace Period: 30 days for annual premiums.', 
        'Lapsation: Non-payment leads to immediate loss of coverage, which defeats the entire purpose of the policy.',
        'No Premium Increases: In a standard level term plan, the premium remains locked for the entire tenure.'
      ] 
    },
    whyRadhe: [
      { title: 'Accurate Needs Analysis', description: 'We help you scientifically calculate your Human Life Value so you are neither under-insured nor over-paying.' },
      { title: 'Application Assistance', description: 'Term plan underwriting is stringent. We ensure your application and medical disclosures are flawless to prevent future claim rejections.' },
      { title: 'Nominee Support', description: 'We act as the first point of contact for your family, guiding them through the entire claim settlement process with empathy and speed.' }
    ],
    education: [
      { h3: 'The Problem with Coverage Till Age 99', content: 'Many insurers now push "Whole Life Term Plans" that offer coverage up to 99 or 100 years of age. While it sounds appealing to guarantee a payout to your heirs, the premiums for such plans are substantially higher. The fundamental purpose of term insurance is to replace your economic value (income) when you die prematurely and to protect your dependents. By the time you are 60 or 65, you should have built enough assets, retired, and paid off your liabilities. Paying high premiums in your 70s and 80s for life cover is financially inefficient.' },
      { h3: 'Section 45 of the Insurance Act', content: 'A crucial protection for policyholders in India. Under Section 45, no life insurance policy can be called into question (i.e., a claim cannot be rejected) on any ground whatsoever after the completion of three years from the date of issuance. This means if you have been truthful and the policy has completed 3 years, your family\'s claim is virtually guaranteed, providing absolute peace of mind.' }
    ],
    glossary: [
      { term: 'Pure Protection', definition: 'An insurance policy that only pays out on death and has no investment or savings component.' },
      { term: 'Human Life Value (HLV)', definition: 'The present value of all future income that an individual is expected to earn for their family.' },
      { term: 'Claim Settlement Ratio (CSR)', definition: 'The percentage of death claims settled by an insurance company against the total claims received.' },
      { term: 'Underwriting', definition: 'The process by which the insurance company evaluates the risk of insuring you based on health, age, and lifestyle.' }
    ],
    articles: [
      { title: 'How Much Term Cover Do You Really Need?', excerpt: 'A step-by-step guide to calculating your Human Life Value and required sum assured.', link: '#' },
      { title: 'Why You Must Not Hide Your Smoking Habit', excerpt: 'Non-disclosure of tobacco use is a primary reason for term insurance claim rejections. Understand the consequences.', link: '#' }
    ],
    faq: [
      { 
        category: 'General', 
        items: [ 
          { q: 'Can NRIs buy term insurance in India?', a: 'Yes, NRIs and PIOs can easily purchase term insurance in India. They may require a medical check-up in their country of residence or via tele-medical underwriting.' },
          { q: 'What is MWP Act in Term Insurance?', a: 'Buying a term plan under the Married Women\'s Property (MWP) Act ensures the death benefit can only be claimed by your wife and children, protecting the money from your creditors or business liabilities.' }
        ] 
      }
    ]
  }
};
