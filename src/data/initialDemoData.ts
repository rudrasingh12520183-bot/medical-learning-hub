import {
  Book,
  Subject,
  Chapter,
  StudyMaterial,
  MCQ,
  MindMap,
  User,
  Progress,
  Bookmark
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_student_1',
    name: 'Dr. Aarav Sharma (Intern)',
    email: 'student@medicalhub.edu',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    collegeOrHospital: 'All India Institute of Medical Sciences',
    yearOfStudy: 'Final Year MBBS / Intern',
    streakDays: 14,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'user_admin_1',
    name: 'Prof. R. Sengupta (MD, FACP)',
    email: 'admin@medicalhub.edu',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    collegeOrHospital: 'Academic Medical Council',
    yearOfStudy: 'Head of Clinical Curriculum',
    streakDays: 45,
    createdAt: '2025-11-01T08:00:00Z',
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book_med',
    title: 'Manipal Prep Manual of Medicine',
    edition: 'Third Edition',
    author: 'Manthappa M.',
    publisher: 'CBS Publishers & Distributors',
    shortCode: 'medicine',
    description: 'Comprehensive undergraduate & postgraduate medicine manual organized across 20 distinct clinical sections covering diagnostic criteria, therapeutics, and clinical bedside reasoning.',
    coverColor: 'blue',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    orderIndex: 1,
    isPublished: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'book_gyn',
    title: 'D.C. Dutta’s Textbook of Gynecology',
    edition: '8th Edition',
    author: 'Hiralal Konar',
    publisher: 'Jaypee Brothers Medical Publishers',
    shortCode: 'gynecology',
    description: 'Comprehensive clinical guide on menstrual physiology, reproductive endocrinology, pelvic pathologies, surgical operative gynecology, and oncology.',
    coverColor: 'rose',
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    orderIndex: 2,
    isPublished: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'book_obs',
    title: 'D.C. Dutta’s Textbook of Obstetrics',
    edition: 'Standard Edition',
    author: 'Hiralal Konar',
    publisher: 'Jaypee Brothers Medical Publishers',
    shortCode: 'obstetrics',
    description: 'Authoritative manual on antenatal surveillance, physiological adaptations of pregnancy, labor mechanisms, high-risk pregnancies, and postpartum management.',
    coverColor: 'emerald',
    coverImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&auto=format&fit=crop&q=80',
    orderIndex: 3,
    isPublished: true,
    createdAt: '2026-01-01T00:00:00Z',
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  // Book 1: Manipal Prep Manual of Medicine — 20 Sections from Table of Contents
  { id: 'sub_med_infect', bookId: 'book_med', title: '1. Infectious Diseases', description: 'Malaria, dengue, enteric fever, tuberculosis, HIV, and antimicrobial stewardship', iconName: 'ShieldAlert', orderIndex: 1, isPublished: true },
  { id: 'sub_med_resp', bookId: 'book_med', title: '2. Diseases of Respiratory System', description: 'Pneumonia, bronchial asthma, COPD, bronchiectasis, and pleurisy', iconName: 'Wind', orderIndex: 2, isPublished: true },
  { id: 'sub_med_cvs', bookId: 'book_med', title: '3. Diseases of Cardiovascular System', description: 'Coronary artery disease, heart failure, rheumatic fever, valvular disease, and arrhythmias', iconName: 'Heart', orderIndex: 3, isPublished: true },
  { id: 'sub_med_git', bookId: 'book_med', title: '4. Gastrointestinal System', description: 'Peptic ulcer disease, GERD, malabsorption, and inflammatory bowel diseases', iconName: 'Layers', orderIndex: 4, isPublished: true },
  { id: 'sub_med_cns', bookId: 'book_med', title: '5. Diseases of Nervous System', description: 'Cerebrovascular accidents, epilepsy, meningitis, peripheral neuropathies, and dementia', iconName: 'Brain', orderIndex: 5, isPublished: true },
  { id: 'sub_med_blood', bookId: 'book_med', title: '6. Diseases of Blood', description: 'Anemias, coagulopathies, thrombocytopenia, leukemias, and lymphomas', iconName: 'Droplet', orderIndex: 6, isPublished: true },
  { id: 'sub_med_liver', bookId: 'book_med', title: '7. Diseases of Liver and Biliary System', description: 'Viral hepatitis, cirrhosis, portal hypertension, and liver abscess', iconName: 'Activity', orderIndex: 7, isPublished: true },
  { id: 'sub_med_kidney', bookId: 'book_med', title: '8. Diseases of Kidney and Urinary Tract', description: 'Acute kidney injury, CKD, nephrotic and nephritic syndromes, and glomerulonephritis', iconName: 'Filter', orderIndex: 8, isPublished: true },
  { id: 'sub_med_endo', bookId: 'book_med', title: '9. Endocrinology and Diabetes Mellitus', description: 'Type 1 and 2 diabetes mellitus, DKA, thyrotoxicosis, Addison disease, and Cushing syndrome', iconName: 'Sparkles', orderIndex: 9, isPublished: true },
  { id: 'sub_med_immune', bookId: 'book_med', title: '10. Diseases of Immune System, Connective Tissue, and Joints', description: 'Systemic lupus erythematosus, rheumatoid arthritis, gout, and systemic sclerosis', iconName: 'Bone', orderIndex: 10, isPublished: true },
  { id: 'sub_med_nutr', bookId: 'book_med', title: '11. Nutritional Disorders', description: 'Protein energy malnutrition, vitamin A/D/C deficiencies, scurvy, and trace minerals', iconName: 'PieChart', orderIndex: 11, isPublished: true },
  { id: 'sub_med_psych', bookId: 'book_med', title: '12. Psychiatric Disorders', description: 'Depression, schizophrenia, delirium vs dementia, anxiety disorders, and somatoform illness', iconName: 'Smile', orderIndex: 12, isPublished: true },
  { id: 'sub_med_fluid', bookId: 'book_med', title: '13. Fluid and Electrolyte Disorders', description: 'Hyponatremia, hyperkalemia, acid-base disorders, and arterial blood gas analysis', iconName: 'Gauge', orderIndex: 13, isPublished: true },
  { id: 'sub_med_oncol', bookId: 'book_med', title: '14. Oncology', description: 'Cancer biology, paraneoplastic syndromes, tumor lysis syndrome, and chemotherapy principles', iconName: 'Crosshair', orderIndex: 14, isPublished: true },
  { id: 'sub_med_genet', bookId: 'book_med', title: '15. Genetic Disorders', description: 'Mendelian inheritance, chromosomal anomalies, Down syndrome, and genetic screening', iconName: 'CircleDot', orderIndex: 15, isPublished: true },
  { id: 'sub_med_skin', bookId: 'book_med', title: '16. Diseases of the Skin', description: 'Psoriasis, eczema, drug reactions (SJS/TEN), pemphigus, and fungal skin infections', iconName: 'Sun', orderIndex: 16, isPublished: true },
  { id: 'sub_med_tox', bookId: 'book_med', title: '17. Poisoning, Venomous Bites and Environmental Diseases', description: 'Organophosphorus poisoning, snakebite envenomation, scorpion sting, and heat exhaustion', iconName: 'AlertTriangle', orderIndex: 17, isPublished: true },
  { id: 'sub_med_emrg', bookId: 'book_med', title: '18. Emergency Medicine and Critical Care', description: 'Septic shock, cardiopulmonary arrest (ACLS), anaphylaxis, and acute respiratory failure', iconName: 'Flame', orderIndex: 18, isPublished: true },
  { id: 'sub_med_cases', bookId: 'book_med', title: '19. Case Scenario Based Discussion', description: 'Diagnostic bedside decision making, problem oriented clinical workups, and lab interpretations', iconName: 'UserCheck', orderIndex: 19, isPublished: true },
  { id: 'sub_med_ethics', bookId: 'book_med', title: '20. Role of Physician in the Community, Medicolegal and Ethical Issues in Health Care', description: 'Doctor-patient relationship, informed consent, medical negligence, and community health duties', iconName: 'ShieldCheck', orderIndex: 20, isPublished: true },

  // Book 2: Gynecology Topics
  { id: 'sub_gyn_menstr', bookId: 'book_gyn', title: 'Menstrual Disorders', description: 'Abnormal uterine bleeding, amenorrhea, dysmenorrhea, and endocrine axes', iconName: 'Calendar', orderIndex: 1, isPublished: true },
  { id: 'sub_gyn_infert', bookId: 'book_gyn', title: 'Infertility', description: 'Male and female factor etiology, ovulation induction, and assisted reproduction', iconName: 'Sparkles', orderIndex: 2, isPublished: true },
  { id: 'sub_gyn_contra', bookId: 'book_gyn', title: 'Contraception', description: 'Barrier, hormonal, intrauterine devices, and surgical sterilization methods', iconName: 'ShieldCheck', orderIndex: 3, isPublished: true },
  { id: 'sub_gyn_infect', bookId: 'book_gyn', title: 'Gynecological Infections', description: 'Pelvic inflammatory disease, vaginitis syndromes, and genital ulcers', iconName: 'AlertCircle', orderIndex: 4, isPublished: true },
  { id: 'sub_gyn_benign', bookId: 'book_gyn', title: 'Benign Gynecological Conditions', description: 'Uterine leiomyomas, endometriosis, adenomyosis, and ovarian cysts', iconName: 'CircleDot', orderIndex: 5, isPublished: true },
  { id: 'sub_gyn_oncol', bookId: 'book_gyn', title: 'Gynecological Oncology', description: 'Cervical, endometrial, and epithelial ovarian malignant neoplasms', iconName: 'Crosshair', orderIndex: 6, isPublished: true },
  { id: 'sub_gyn_meno', bookId: 'book_gyn', title: 'Menopause', description: 'Perimenopausal transition, vasomotor symptoms, and hormone replacement', iconName: 'Sun', orderIndex: 7, isPublished: true },
  { id: 'sub_gyn_urogyn', bookId: 'book_gyn', title: 'Urogynecology', description: 'Pelvic organ prolapse, stress urinary incontinence, and fistula repair', iconName: 'Compass', orderIndex: 8, isPublished: true },

  // Book 3: Obstetrics Topics
  { id: 'sub_obs_ante', bookId: 'book_obs', title: 'Antenatal Care', description: 'First trimester screening, nutritional guidance, and physiological changes', iconName: 'UserCheck', orderIndex: 1, isPublished: true },
  { id: 'sub_obs_normpreg', bookId: 'book_obs', title: 'Normal Pregnancy', description: 'Placental development, amniotic fluid dynamics, and fetal well-being tests', iconName: 'HeartPulse', orderIndex: 2, isPublished: true },
  { id: 'sub_obs_normlab', bookId: 'book_obs', title: 'Normal Labour', description: 'Stages of labor, cardinal movements, partogram, and delivery mechanics', iconName: 'Clock', orderIndex: 3, isPublished: true },
  { id: 'sub_obs_highrisk', bookId: 'book_obs', title: 'High Risk Pregnancy', description: 'Rh isoimmunization, multiple gestation, intrauterine growth restriction', iconName: 'AlertTriangle', orderIndex: 4, isPublished: true },
  { id: 'sub_obs_hyper', bookId: 'book_obs', title: 'Hypertensive Disorders', description: 'Gestational hypertension, preeclampsia, eclampsia, and HELLP syndrome', iconName: 'Gauge', orderIndex: 5, isPublished: true },
  { id: 'sub_obs_gdm', bookId: 'book_obs', title: 'Gestational Diabetes', description: 'Screening protocols, glycemic control targets, and fetal monitoring', iconName: 'PieChart', orderIndex: 6, isPublished: true },
  { id: 'sub_obs_emerg', bookId: 'book_obs', title: 'Obstetric Emergencies', description: 'Postpartum hemorrhage, umbilical cord prolapse, and uterine rupture', iconName: 'Flame', orderIndex: 7, isPublished: true },
  { id: 'sub_obs_fetal', bookId: 'book_obs', title: 'Fetal Medicine', description: 'Non-stress test, biophysical profile, and Doppler velocimetry', iconName: 'Eye', orderIndex: 8, isPublished: true },
  { id: 'sub_obs_postpart', bookId: 'book_obs', title: 'Postpartum Care', description: 'Puerperal involution, lactation management, and puerperal sepsis', iconName: 'Smile', orderIndex: 9, isPublished: true },
];


export const INITIAL_CHAPTERS: Chapter[] = [
  // Medicine Chapters (Mapped across Manipal 20 Sections)
  {
    id: 'chap_med_malaria',
    bookId: 'book_med',
    subjectId: 'sub_med_infect',
    title: 'Malaria (Falciparum vs Vivax) & Antimalarial Guidelines',
    description: 'Pathophysiology of cytoadherence and cerebral malaria, diagnostic smear & rapid antigen tests, and ACT treatment regimens.',
    orderIndex: 1,
    estimatedMinutes: 20,
    isPublished: true,
    createdAt: '2026-01-08T00:00:00Z',
  },
  {
    id: 'chap_med_tb',
    bookId: 'book_med',
    subjectId: 'sub_med_infect',
    title: 'Pulmonary Tuberculosis & NTEP Diagnostic Algorithms',
    description: 'Ghon complex, CBNAAT / GeneXpert molecular testing, daily fixed-dose combination anti-tubercular therapy (HRZE).',
    orderIndex: 2,
    estimatedMinutes: 22,
    isPublished: true,
    createdAt: '2026-01-09T00:00:00Z',
  },
  {
    id: 'chap_med_cap',
    bookId: 'book_med',
    subjectId: 'sub_med_resp',
    title: 'Community-Acquired Pneumonia (CAP) & CURB-65',
    description: 'Microbial etiology, severity risk stratification via CURB-65 score, empiric antimicrobial regimens, and complications.',
    orderIndex: 1,
    estimatedMinutes: 16,
    isPublished: true,
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'chap_med_asthma',
    bookId: 'book_med',
    subjectId: 'sub_med_resp',
    title: 'Bronchial Asthma & Stepwise Management (GINA)',
    description: 'Type 2 airway inflammation, peak flow spirometry, acute severe asthma assessment, and ICS-formoterol reliever strategies.',
    orderIndex: 2,
    estimatedMinutes: 18,
    isPublished: true,
    createdAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 'chap_med_acs',
    bookId: 'book_med',
    subjectId: 'sub_med_cvs',
    title: 'Acute Coronary Syndromes (STEMI vs NSTEMI)',
    description: 'Pathophysiology of plaque rupture, ECG diagnostic criteria, cardiac biomarkers, and primary PCI timeline guidelines.',
    orderIndex: 1,
    estimatedMinutes: 20,
    isPublished: true,
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'chap_med_hf',
    bookId: 'book_med',
    subjectId: 'sub_med_cvs',
    title: 'Heart Failure with Reduced Ejection Fraction (HFrEF)',
    description: 'Guideline-directed medical therapy (GDMT), neurohormonal blockade, SGLT2 inhibitors, and device therapy indications.',
    orderIndex: 2,
    estimatedMinutes: 18,
    isPublished: true,
    createdAt: '2026-01-11T00:00:00Z',
  },
  {
    id: 'chap_med_pud',
    bookId: 'book_med',
    subjectId: 'sub_med_git',
    title: 'Peptic Ulcer Disease & H. pylori Eradication',
    description: 'Gastric vs duodenal ulceration, triple vs quadruple eradication regimens, and upper gastrointestinal endoscopy indications.',
    orderIndex: 1,
    estimatedMinutes: 16,
    isPublished: true,
    createdAt: '2026-01-14T00:00:00Z',
  },
  {
    id: 'chap_med_stroke',
    bookId: 'book_med',
    subjectId: 'sub_med_cns',
    title: 'Acute Ischemic Stroke & Intravenous Thrombolysis',
    description: 'Vascular territories (MCA, ACA, PCA), Alberta Stroke Program Early CT score (ASPECTS), and IV-rtPA 4.5-hour window protocol.',
    orderIndex: 1,
    estimatedMinutes: 24,
    isPublished: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'chap_med_anemia',
    bookId: 'book_med',
    subjectId: 'sub_med_blood',
    title: 'Megaloblastic Anemia & Vitamin B12 / Folate Deficiency',
    description: 'Nuclear-cytoplasmic asynchrony, hypersegmented neutrophils, subacute combined degeneration of spinal cord, and Schilling test.',
    orderIndex: 1,
    estimatedMinutes: 18,
    isPublished: true,
    createdAt: '2026-01-16T00:00:00Z',
  },
  {
    id: 'chap_med_cirrhosis',
    bookId: 'book_med',
    subjectId: 'sub_med_liver',
    title: 'Cirrhosis of Liver, Ascites & Hepatic Encephalopathy',
    description: 'Child-Pugh and MELD scores, spontaneous bacterial peritonitis (SBP), lactulose titration, and variceal band ligation.',
    orderIndex: 1,
    estimatedMinutes: 22,
    isPublished: true,
    createdAt: '2026-01-17T00:00:00Z',
  },
  {
    id: 'chap_med_aki',
    bookId: 'book_med',
    subjectId: 'sub_med_kidney',
    title: 'Acute Kidney Injury (AKI) & KDIGO Criteria',
    description: 'Prerenal azotemia vs acute tubular necrosis, fractional excretion of sodium (FeNa), and urgent hemodialysis indications (AEIOU).',
    orderIndex: 1,
    estimatedMinutes: 19,
    isPublished: true,
    createdAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 'chap_med_dka',
    bookId: 'book_med',
    subjectId: 'sub_med_endo',
    title: 'Diabetic Ketoacidosis (DKA) & Hyperosmolar State',
    description: 'Diagnostic triad of hyperglycemia, high anion-gap metabolic acidosis, ketonemia, and fluid/potassium resuscitation protocol.',
    orderIndex: 1,
    estimatedMinutes: 22,
    isPublished: true,
    createdAt: '2026-01-13T00:00:00Z',
  },
  {
    id: 'chap_med_sle',
    bookId: 'book_med',
    subjectId: 'sub_med_immune',
    title: 'Systemic Lupus Erythematosus (SLE) & ACR / EULAR Criteria',
    description: 'Autoantibody spectrum (ANA, anti-dsDNA, anti-Smith), ISN/RPS lupus nephritis classification, and hydroxychloroquine baseline.',
    orderIndex: 1,
    estimatedMinutes: 20,
    isPublished: true,
    createdAt: '2026-01-19T00:00:00Z',
  },
  {
    id: 'chap_med_pem',
    bookId: 'book_med',
    subjectId: 'sub_med_nutr',
    title: 'Protein-Energy Malnutrition & Micronutrient Deficiencies',
    description: 'Kwashiorkor vs marasmus, refeeding syndrome hypophosphatemia, and vitamin deficiencies (Wernicke-Korsakoff, scurvy).',
    orderIndex: 1,
    estimatedMinutes: 16,
    isPublished: true,
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'chap_med_delirium',
    bookId: 'book_med',
    subjectId: 'sub_med_psych',
    title: 'Delirium vs Dementia: Bedside Neuropsychiatric Assessment',
    description: 'CAM (Confusion Assessment Method) diagnostic algorithm, fluctuating sensorium vs progressive cognitive decline.',
    orderIndex: 1,
    estimatedMinutes: 15,
    isPublished: true,
    createdAt: '2026-01-21T00:00:00Z',
  },
  {
    id: 'chap_med_hyponatremia',
    bookId: 'book_med',
    subjectId: 'sub_med_fluid',
    title: 'Hyponatremia Evaluation & SIADH Management',
    description: 'Serum osmolality, volume status evaluation, urine sodium, and osmotic demyelination syndrome avoidance guidelines.',
    orderIndex: 1,
    estimatedMinutes: 20,
    isPublished: true,
    createdAt: '2026-01-22T00:00:00Z',
  },
  {
    id: 'chap_med_chemo',
    bookId: 'book_med',
    subjectId: 'sub_med_oncol',
    title: 'Febrile Neutropenia & Oncologic Emergencies',
    description: 'Absolute neutrophil count <500/µL, empiric antipseudomonal monotherapy, tumor lysis syndrome, and spinal cord compression.',
    orderIndex: 1,
    estimatedMinutes: 21,
    isPublished: true,
    createdAt: '2026-01-23T00:00:00Z',
  },
  {
    id: 'chap_med_down',
    bookId: 'book_med',
    subjectId: 'sub_med_genet',
    title: 'Chromosomal Aneuploidies & Down Syndrome (Trisomy 21)',
    description: 'Nondisjunction genetics, prenatal quadruple screening, endocardial cushion defects, and atlantoaxial subluxation surveillance.',
    orderIndex: 1,
    estimatedMinutes: 17,
    isPublished: true,
    createdAt: '2026-01-24T00:00:00Z',
  },
  {
    id: 'chap_med_psoriasis',
    bookId: 'book_med',
    subjectId: 'sub_med_skin',
    title: 'Psoriasis Vulgaris & Cutaneous Drug Eruptions (SJS/TEN)',
    description: 'Auspitz sign, Koebner phenomenon, psoriatic arthropathy, and SCORTEN score mortality prediction in toxic epidermal necrolysis.',
    orderIndex: 1,
    estimatedMinutes: 18,
    isPublished: true,
    createdAt: '2026-01-25T00:00:00Z',
  },
  {
    id: 'chap_med_op',
    bookId: 'book_med',
    subjectId: 'sub_med_tox',
    title: 'Organophosphorus Poisoning & Snakebite Envenomation',
    description: 'Muscarinic & nicotinic SLUDGE syndrome, atropinization endpoints, pralidoxime, and polyvalent anti-snake venom (ASV).',
    orderIndex: 1,
    estimatedMinutes: 23,
    isPublished: true,
    createdAt: '2026-01-26T00:00:00Z',
  },
  {
    id: 'chap_med_sepsis',
    bookId: 'book_med',
    subjectId: 'sub_med_emrg',
    title: 'Septic Shock & Surviving Sepsis Campaign Hour-1 Bundle',
    description: 'SOFA vs qSOFA scores, lactate clearance, broad-spectrum antibiotics within 1 hour, crystalloid resuscitation, and norepinephrine.',
    orderIndex: 1,
    estimatedMinutes: 24,
    isPublished: true,
    createdAt: '2026-01-27T00:00:00Z',
  },
  {
    id: 'chap_med_cases',
    bookId: 'book_med',
    subjectId: 'sub_med_cases',
    title: 'Clinical Approach to Fever with Thrombocytopenia',
    description: 'Systematic diagnostic algorithm distinguishing dengue, severe malaria, scrub typhus, leptospirosis, and sepsis with DIC.',
    orderIndex: 1,
    estimatedMinutes: 25,
    isPublished: true,
    createdAt: '2026-01-28T00:00:00Z',
  },
  {
    id: 'chap_med_ethics',
    bookId: 'book_med',
    subjectId: 'sub_med_ethics',
    title: 'Informed Consent, Medical Negligence & Medicolegal Duties',
    description: 'Bolam test, consumer protection act, professional misconduct, brain death certification, and medical records maintenance.',
    orderIndex: 1,
    estimatedMinutes: 18,
    isPublished: true,
    createdAt: '2026-01-29T00:00:00Z',
  },


  // Gynecology Chapters
  {
    id: 'chap_gyn_endo',
    bookId: 'book_gyn',
    subjectId: 'sub_gyn_benign',
    title: 'Endometriosis & Adenomyosis',
    description: 'Retrograde menstruation hypothesis, Sampson theory, dysmenorrhea triad, laparoscopic chocolate cyst staging, and medical management.',
    orderIndex: 1,
    estimatedMinutes: 24,
    isPublished: true,
    createdAt: '2026-01-14T00:00:00Z',
  },
  {
    id: 'chap_gyn_pcos',
    bookId: 'book_gyn',
    subjectId: 'sub_gyn_menstr',
    title: 'Polycystic Ovarian Syndrome (Rotterdam Criteria)',
    description: 'Hyperandrogenism, chronic anovulation, LH:FSH ratio alteration, insulin resistance, and ovulation induction with letrozole.',
    orderIndex: 1,
    estimatedMinutes: 19,
    isPublished: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'chap_gyn_cin',
    bookId: 'book_gyn',
    subjectId: 'sub_gyn_oncol',
    title: 'Cervical Intraepithelial Neoplasia (CIN) & Screening',
    description: 'High-risk HPV genotypes (16, 18), Bethesda cytology classification, colposcopy guided punch biopsy, and LEEP excision.',
    orderIndex: 1,
    estimatedMinutes: 20,
    isPublished: true,
    createdAt: '2026-01-16T00:00:00Z',
  },

  // Obstetrics Chapters
  {
    id: 'chap_obs_preecl',
    bookId: 'book_obs',
    subjectId: 'sub_obs_hyper',
    title: 'Hypertension in Pregnancy & Preeclampsia',
    description: 'Abnormal trophoblastic invasion, endothelial dysfunction, proteinuria threshold, Magnesium Sulfate Pritchard regimen, and delivery criteria.',
    orderIndex: 1,
    estimatedMinutes: 25,
    isPublished: true,
    createdAt: '2026-01-17T00:00:00Z',
  },
  {
    id: 'chap_obs_pph',
    bookId: 'book_obs',
    subjectId: 'sub_obs_emerg',
    title: 'Postpartum Hemorrhage (PPH) & The 4 T’s',
    description: 'Definition (>500 mL vaginal / >1000 mL CS), Tone, Trauma, Tissue, Thrombin, active management of 3rd stage, and balloon tamponade.',
    orderIndex: 1,
    estimatedMinutes: 22,
    isPublished: true,
    createdAt: '2026-01-18T00:00:00Z',
  },
  {
    id: 'chap_obs_gdm',
    bookId: 'book_obs',
    subjectId: 'sub_obs_gdm',
    title: 'Gestational Diabetes Mellitus (DIPSI & IADPSG)',
    description: 'Human placental lactogen anti-insulin resistance, 75g OGTT thresholds, macrosomia risk, polyhydramnios, and neonatal hypoglycemia prevention.',
    orderIndex: 1,
    estimatedMinutes: 18,
    isPublished: true,
    createdAt: '2026-01-19T00:00:00Z',
  }
];

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat_med_acs',
    chapterId: 'chap_med_acs',
    overview: 'Acute Coronary Syndrome (ACS) represents an umbrella term for myocardial ischemia resulting from sudden plaque rupture and coronary arterial thrombosis. It encompasses ST-Elevation Myocardial Infarction (STEMI), Non-ST-Elevation Myocardial Infarction (NSTEMI), and Unstable Angina.',
    sections: [
      {
        id: 'sec_acs_1',
        heading: 'Pathophysiology of Plaque Disruption',
        content: 'The core event is atherosclerotic fibroatheroma cap thinning mediated by matrix metalloproteinases. When the fibrous cap fissures, subendothelial tissue factor is exposed to flowing blood, triggering platelet adhesion (GP Ia/IIa, GP Ib-IX) followed by platelet aggregation via glycoprotein IIb/IIIa receptors and coagulation cascade activation.'
      },
      {
        id: 'sec_acs_2',
        heading: 'Clinical Presentation & Risk Stratification',
        content: 'Patients present with retrosternal crushing chest pain radiating to the left arm, neck, or jaw, often accompanied by diaphoresis, dyspnea, and nausea. Atypical presentations (angina equivalents) are prevalent in diabetic patients, elderly females, and post-cardiac transplant individuals.'
      },
      {
        id: 'sec_acs_3',
        heading: 'Electrocardiographic Localization',
        content: 'STEMI diagnosis requires persistent ST-segment elevation in at least two contiguous leads: ≥2 mm in men (or ≥1.5 mm in women) in leads V2–V3, or ≥1 mm in other leads. Reciprocal ST depression in reciprocal leads confirms localized transmural injury.'
      },
      {
        id: 'sec_acs_4',
        heading: 'Initial Pharmacotherapy & Reperfusion Timing',
        content: 'Dual Antiplatelet Therapy (DAPT) with Aspirin 300 mg chewed plus a potent P2Y12 inhibitor (Ticagrelor 180 mg or Prasugrel 60 mg) is initiated immediately. High-intensity Statin (Atorvastatin 80 mg) and anticoagulation (Unfractionated Heparin or Enoxaparin) are standard. Door-to-Balloon time for Primary PCI target is <90 minutes.'
      }
    ],
    clinicalPearls: [
      {
        id: 'cp_acs_1',
        title: 'Avoid Nitrates in Right Ventricular Infarction',
        content: 'If ECG shows inferior MI (II, III, aVF), always record right-sided leads (V3R, V4R). Nitrates and diuretics cause severe profound hypotension in RV infarction due to acute preload dependence. Give IV fluid bolus instead!',
        type: 'warning'
      },
      {
        id: 'cp_acs_2',
        title: 'High-Sensitivity Troponin Biomarker Window',
        content: 'High-sensitivity cardiac Troponin T/I rises within 2–3 hours of ischemic insult, peaks at 12–24 hours, and can remain elevated for 10–14 days. For re-infarction evaluation within 48–72 hours, CK-MB is preferred due to its shorter 48-hour half-life.',
        type: 'pearl'
      },
      {
        id: 'cp_acs_3',
        title: 'MONA Regimen Modern Nuance',
        content: 'Morphine, Oxygen, Nitrates, Aspirin. Remember: Supplemental oxygen is ONLY indicated if arterial SaO2 is <90% or PaO2 <60 mmHg. Hyperoxia induces coronary vasoconstriction and generates damaging reactive oxygen species.',
        type: 'high_yield'
      }
    ],
    tables: [
      {
        id: 'tab_acs_leads',
        title: 'Contiguous ECG Leads and Culprit Arteries',
        headers: ['ECG Leads', 'Anatomic Wall', 'Culprit Coronary Artery'],
        rows: [
          ['V1, V2', 'Septal Wall', 'Left Anterior Descending (LAD) - Septal Branches'],
          ['V3, V4', 'Anterior Wall', 'Left Anterior Descending (LAD) - Diagonal Branches'],
          ['V5, V6, I, aVL', 'Lateral Wall', 'Left Circumflex (LCx) or Diagonal LAD'],
          ['II, III, aVF', 'Inferior Wall', 'Right Coronary Artery (85%) or LCx (15%)'],
          ['V1–V3 ST depression + Tall R', 'Posterior Wall', 'Posterior Descending Artery (PDA) / LCx']
        ]
      }
    ],
    references: [
      '2023 ESC Guidelines for the management of acute coronary syndromes.',
      'AHA/ACC Guideline for the Management of Patients With Non–ST-Elevation Acute Coronary Syndromes.'
    ],
    updatedAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 'mat_obs_preecl',
    chapterId: 'chap_obs_preecl',
    overview: 'Preeclampsia is a multisystem disorder of pregnancy characterized by new-onset hypertension (Systolic BP ≥140 mmHg or Diastolic BP ≥90 mmHg) presenting after 20 weeks of gestation, accompanied by proteinuria or evidence of maternal organ dysfunction.',
    sections: [
      {
        id: 'sec_pre_1',
        heading: 'Two-Stage Pathophysiological Model',
        content: 'Stage 1 involves failure of the second wave of endovascular trophoblastic invasion into maternal spiral arteries between 16–20 weeks. Spiral arteries remain high-resistance, narrow muscular vessels, resulting in placental hypoperfusion, oxidative stress, and secretion of anti-angiogenic factors (sFlt-1 and soluble endoglin) into maternal circulation. Stage 2 is widespread maternal endothelial dysfunction, capillary leak, platelet activation, and vasospasm.'
      },
      {
        id: 'sec_pre_2',
        heading: 'Diagnostic Criteria & Severe Features',
        content: 'Hypertension (≥140/90 mmHg on two occasions 4 hours apart) after 20 weeks. Proteinuria is defined as ≥300 mg/24 hours or urine protein:creatinine ratio ≥0.3. Severe features include: BP ≥160/110 mmHg, platelets <100,000/µL, serum creatinine >1.1 mg/dL, transaminases twice normal, pulmonary edema, or new cerebral/visual disturbances.'
      },
      {
        id: 'sec_pre_3',
        heading: 'Seizure Prophylaxis: Magnesium Sulfate Regimen',
        content: 'Magnesium Sulfate is the drug of choice for seizure prophylaxis in severe preeclampsia and treatment of eclampsia. Pritchard Regimen: 4g IV loading dose (20% solution) slowly over 10 min + 10g IM (5g in each buttock as 50% solution). Maintenance: 5g IM deep in alternate buttocks every 4 hours, monitored with patellar reflex, respiratory rate (≥12/min), and urine output (≥30 mL/hr).'
      },
      {
        id: 'sec_pre_4',
        heading: 'Definitive Management & Timing of Delivery',
        content: 'Delivery is the only definitive cure. In preeclampsia without severe features, delivery is planned at 37 weeks. With severe features, delivery is indicated at ≥34 weeks, or immediately at any gestational age if maternal stabilization fails, eclampsia occurs, or non-reassuring fetal status is documented.'
      }
    ],
    clinicalPearls: [
      {
        id: 'cp_pre_1',
        title: 'Antidote for Magnesium Toxicity',
        content: 'Loss of patellar tendon reflex is the earliest clinical sign of hypermagnesemia (Plasma Mg 8–10 mEq/L). If respiratory depression occurs (<12 breaths/min), immediately stop the MgSO4 infusion and administer 10 mL of 10% Calcium Gluconate IV slowly over 10 minutes!',
        type: 'warning'
      },
      {
        id: 'cp_pre_2',
        title: 'First-Line Antihypertensives in Pregnancy',
        content: 'Labetalol (alpha/beta blocker), Hydralazine (direct vasodilator), and oral extended-release Nifedipine (calcium channel blocker) are the cornerstones. ACE Inhibitors and ARBs are strictly CONTRAINDICATED due to fetal renal dysgenesis and oligohydramnios.',
        type: 'high_yield'
      }
    ],
    tables: [
      {
        id: 'tab_pre_stages',
        title: 'Preeclampsia Severity Classification Matrix',
        headers: ['Clinical Parameter', 'Non-Severe Preeclampsia', 'Preeclampsia with Severe Features'],
        rows: [
          ['Systolic BP', '140–159 mmHg', '≥ 160 mmHg'],
          ['Diastolic BP', '90–109 mmHg', '≥ 110 mmHg'],
          ['Platelet Count', 'Normal (>100,000 /µL)', '< 100,000 /µL (Thrombocytopenia)'],
          ['Serum Creatinine', 'Normal (≤1.0 mg/dL)', '> 1.1 mg/dL or doubling of baseline'],
          ['Liver Transaminases', 'Normal levels', 'AST / ALT elevated >2× upper normal'],
          ['Neurological Signs', 'Absent', 'Persistent severe frontal headache, scotomata']
        ]
      }
    ],
    references: [
      'ACOG Practice Bulletin No. 222: Gestational Hypertension and Preeclampsia.',
      'NICE Clinical Guideline [NG133]: Hypertension in pregnancy: diagnosis and management.'
    ],
    updatedAt: '2026-02-05T14:00:00Z'
  },
  {
    id: 'mat_gyn_endo',
    chapterId: 'chap_gyn_endo',
    overview: 'Endometriosis is a chronic benign gynecological disorder defined by the presence of viable endometrial-like stroma and glands outside the uterine cavity, most frequently affecting the pelvic peritoneum, ovaries, and pouch of Douglas.',
    sections: [
      {
        id: 'sec_endo_1',
        heading: 'Theories of Histogenesis',
        content: 'Sampsons theory of Retrograde Menstruation proposes transtubal dissemination of viable desquamated endometrial fragments into the peritoneal cavity. Additional mechanisms include coelomic metaplasia (Meyer hypothesis), lymphatic and hematogenous metastasis (Halban theory), and immune dysfunction with impaired natural killer cell clearance.'
      },
      {
        id: 'sec_endo_2',
        heading: 'Clinical Manifestations: The Classic Triad',
        content: 'The clinical triad consists of Progressive Secondary Dysmenorrhea (starting 24-48 hours before menses and persisting throughout), Deep Dyspareunia (due to uterosacral ligament involvement), and Infertility (peritoneal inflammation, altered folliculogenesis, and pelvic distorted anatomy). Chronic pelvic pain and dyschezia during menstruation are also frequent.'
      },
      {
        id: 'sec_endo_3',
        heading: 'Diagnostic Evaluation & Staging',
        content: 'Transvaginal ultrasonography (TVS) exhibits high sensitivity for ovarian endometriomas (ground-glass echogenicity with low-level homogeneous internal echoes). Gold standard for definitive diagnosis and staging remains Diagnostic Laparoscopy with histopathological verification.'
      },
      {
        id: 'sec_endo_4',
        heading: 'Medical vs Surgical Interventions',
        content: 'Medical therapy aims to induce pseudo-pregnancy or pseudo-menopause to suppress estrogenic stimulation: combined oral contraceptives, Dienogest 2mg daily, LNG-IUS, or GnRH agonists with add-back estrogen therapy. Conservative laparoscopic excision is preferred for women desiring fertility.'
      }
    ],
    clinicalPearls: [
      {
        id: 'cp_endo_1',
        title: 'Ovarian Chocolate Cyst (Endometrioma)',
        content: 'Chocolate cysts are filled with thick, tarry, altered hemolyzed blood. The pseudocapsule is formed by invagination of the ovarian cortex. CA-125 can be mildly elevated (35–100 U/mL) in severe endometriosis without malignancy.',
        type: 'pearl'
      },
      {
        id: 'cp_endo_2',
        title: 'Distinguishing Adenomyosis from Uterine Fibroids',
        content: 'Adenomyosis presents with a diffusely enlarged, globular, tender uterus (typically <14 weeks size) with junctional zone thickness >12 mm on MRI. Fibroids produce an irregularly enlarged, firm, non-tender uterus.',
        type: 'high_yield'
      }
    ],
    tables: [
      {
        id: 'tab_endo_rASRM',
        title: 'Revised American Society for Reproductive Medicine (rASRM) Staging',
        headers: ['Stage', 'Classification', 'Pathological Extent'],
        rows: [
          ['Stage I', 'Minimal', '1–5 points: superficial lesions, filmy adhesions'],
          ['Stage II', 'Mild', '6–15 points: deep lesions in pouch of Douglas'],
          ['Stage III', 'Moderate', '16–40 points: endometriomas with extensive pelvic adhesions'],
          ['Stage IV', 'Severe', '>40 points: bilateral large endometriomas, obliterated cul-de-sac']
        ]
      }
    ],
    references: [
      'ESHRE Guideline: Endometriosis (2022 Update).',
      'D.C. Dutta’s Textbook of Gynecology, 8th Edition.'
    ],
    updatedAt: '2026-02-10T11:00:00Z'
  }
];

export const INITIAL_MCQS: MCQ[] = [
  // Medicine MCQs
  {
    id: 'mcq_med_1',
    chapterId: 'chap_med_acs',
    question: 'A 58-year-old male with hypertension presents to the emergency room with severe retrosternal squeezing chest pain radiating to his left shoulder for 2 hours. His ECG reveals 3 mm ST-segment elevation in leads II, III, and aVF with reciprocal ST depression in leads I and aVL. Which coronary artery is most likely occluded?',
    options: [
      'Left Anterior Descending artery (LAD)',
      'Right Coronary Artery (RCA)',
      'Left Circumflex artery (LCx)',
      'Left Main Coronary Artery (LMCA)'
    ],
    correctIndex: 1,
    difficulty: 'Medium',
    isClinicalCase: true,
    clinicalCase: {
      patientAge: '58 years',
      gender: 'Male',
      presentingSymptoms: 'Crushing retrosternal chest pain radiating to the left arm and jaw for 2 hours',
      medicalHistory: 'Hypertension for 10 years, 20 pack-year smoking history',
      vitalsAndExam: 'BP 110/70 mmHg, Pulse 56 bpm regular, S4 gallop on cardiac auscultation',
      imagingAndECG: 'ST elevation of 3 mm in leads II, III, aVF with reciprocal ST depression in leads I and aVL',
      clinicalQuestion: 'Identify the culprit coronary vessel responsible for this acute transmural myocardial infarction.'
    },
    explanation: 'Leads II, III, and aVF look at the inferior wall of the left ventricle. In approximately 85% to 90% of individuals (right-dominant circulation), the inferior wall and the posterior descending artery (PDA) are supplied by the Right Coronary Artery (RCA). Sinus bradycardia (56 bpm) also supports RCA occlusion, as RCA supplies the sinoatrial node.',
    orderIndex: 1,
    tags: ['Cardiology', 'ECG', 'STEMI']
  },
  {
    id: 'mcq_med_2',
    chapterId: 'chap_med_acs',
    question: 'In a patient with Acute ST-Elevation Myocardial Infarction, what is the guideline-recommended target Door-to-Balloon time for primary percutaneous coronary intervention (PCI)?',
    options: [
      'Within 30 minutes',
      'Within 60 minutes',
      'Within 90 minutes',
      'Within 120 minutes'
    ],
    correctIndex: 2,
    difficulty: 'Easy',
    isClinicalCase: false,
    explanation: 'The standard ACC/AHA and ESC guideline target for primary PCI in STEMI is a Door-to-Balloon time of ≤90 minutes at a PCI-capable hospital. If fibrinolytic therapy is chosen because PCI is unavailable within 120 minutes, the Door-to-Needle time target is ≤30 minutes.',
    orderIndex: 2,
    tags: ['Cardiology', 'Guidelines', 'PCI']
  },
  {
    id: 'mcq_med_3',
    chapterId: 'chap_med_acs',
    question: 'A 62-year-old female presents with acute inferior wall STEMI. Within 30 minutes of receiving sublingual nitroglycerin, her blood pressure drops precipitously from 135/85 mmHg to 72/40 mmHg. Clear breath sounds are heard on lung auscultation. What is the immediate treatment of choice?',
    options: [
      'Intravenous Furosemide 40 mg push',
      'Intravenous 0.9% Normal Saline fluid bolus',
      'High-dose Norepinephrine infusion',
      'Immediate sublingual Nifedipine'
    ],
    correctIndex: 1,
    difficulty: 'Hard',
    isClinicalCase: true,
    clinicalCase: {
      patientAge: '62 years',
      gender: 'Female',
      presentingSymptoms: 'Severe chest tightness, dizziness, and diaphoresis',
      medicalHistory: 'Type 2 Diabetes Mellitus',
      vitalsAndExam: 'Post-nitroglycerin BP 72/40 mmHg, Heart rate 88 bpm, clear chest bilaterally without crackles',
      imagingAndECG: 'Inferior MI on standard 12-lead; Lead V4R demonstrates 1.5 mm ST elevation',
      clinicalQuestion: 'What is the immediate pharmacological intervention to restore hemodynamic stability?'
    },
    explanation: 'ST elevation in right-sided lead V4R confirms Right Ventricular Myocardial Infarction (RV MI). The infarcted right ventricle loses contractility and relies entirely on high right atrial filling pressure (preload) to maintain cardiac output. Nitrates cause profound venodilation and preload reduction, triggering severe hypotension. Intravenous isotonic fluid resuscitation (Normal Saline) is the critical immediate therapy.',
    orderIndex: 3,
    tags: ['Cardiology', 'RV Infarction', 'Emergency']
  },

  // Obstetrics MCQs
  {
    id: 'mcq_obs_1',
    chapterId: 'chap_obs_preecl',
    question: 'A 24-year-old primigravida at 34 weeks gestation presents with persistent frontal headache, visual blurring, and epigastric discomfort. Her blood pressure is 172/114 mmHg and 24-hour urine reveals 3.5 g of protein. Which medication is the drug of choice for the prevention of eclamptic convulsions?',
    options: [
      'Phenytoin',
      'Diazepam',
      'Magnesium Sulfate',
      'Sodium Nitroprusside'
    ],
    correctIndex: 2,
    difficulty: 'Easy',
    isClinicalCase: true,
    clinicalCase: {
      patientAge: '24 years',
      gender: 'Female (Primigravida, 34 weeks gestation)',
      presentingSymptoms: 'Throbbing frontal headache, photophobia, epigastric pain',
      medicalHistory: 'Uneventful pregnancy until 32 weeks',
      vitalsAndExam: 'BP 172/114 mmHg, 3+ brisk deep tendon reflexes, bilateral ankle clonus',
      labValues: 'Platelets 92,000 /µL, AST 110 IU/L, ALT 125 IU/L, Urine Protein 3+',
      clinicalQuestion: 'Which anticonvulsant is standard of care to prevent eclamptic seizures?'
    },
    explanation: 'The Collaborative Eclampsia Trial decisively proved that Magnesium Sulfate (MgSO4) is superior to phenytoin and diazepam for both the prevention and treatment of eclamptic convulsions. It works via central NMDA receptor antagonism, cerebral vasodilatation, and peripheral neuromuscular blockade.',
    orderIndex: 1,
    tags: ['Obstetrics', 'Preeclampsia', 'Pharmacology']
  },
  {
    id: 'mcq_obs_2',
    chapterId: 'chap_obs_preecl',
    question: 'During maintenance therapy with intravenous Magnesium Sulfate for preeclampsia, which clinical sign is the earliest indicator of impending magnesium toxicity?',
    options: [
      'Respiratory rate drop below 10 breaths/min',
      'Loss of patellar (knee jerk) tendon reflex',
      'Oliguria (<20 mL/hr urine output)',
      'Cardiac arrest in diastole'
    ],
    correctIndex: 1,
    difficulty: 'Medium',
    isClinicalCase: false,
    explanation: 'Loss of deep tendon reflexes (patellar reflex) occurs at serum magnesium concentrations of 8 to 10 mEq/L (4 to 5 mmol/L), making it the earliest and most reliable bedside clinical warning sign. Respiratory depression occurs later at 12–15 mEq/L, and cardiac arrest occurs at >15 mEq/L.',
    orderIndex: 2,
    tags: ['Obstetrics', 'Magnesium Toxicity', 'Clinical Pearls']
  },
  {
    id: 'mcq_obs_3',
    chapterId: 'chap_obs_preecl',
    question: 'Which of the following antihypertensive agents is strictly contraindicated in pregnancy due to risks of fetal renal dysgenesis and oligohydramnios?',
    options: [
      'Labetalol',
      'Methyldopa',
      'Nifedipine',
      'Enalapril'
    ],
    correctIndex: 3,
    difficulty: 'Easy',
    isClinicalCase: false,
    explanation: 'Angiotensin-Converting Enzyme (ACE) Inhibitors (such as Enalapril, Ramipril) and Angiotensin Receptor Blockers (ARBs like Losartan) are fetotoxic. They cross the placenta and cause fetal renal tubular dysgenesis, oligohydramnios (Potter sequence), pulmonary hypoplasia, and neonatal anuria.',
    orderIndex: 3,
    tags: ['Obstetrics', 'Teratogenicity', 'Antihypertensives']
  },

  // Gynecology MCQs
  {
    id: 'mcq_gyn_1',
    chapterId: 'chap_gyn_endo',
    question: 'A 28-year-old nulliparous woman presents with severe progressive secondary dysmenorrhea, deep dyspareunia, and primary infertility for 3 years. Pelvic examination reveals fixed retroverted uterus and tender nodularity in the pouch of Douglas. What is the gold-standard diagnostic modality?',
    options: [
      'Serum CA-125 measurement',
      'Diagnostic Laparoscopy with biopsy',
      'High-resolution Pelvic CT scan',
      'Hysterosalpingography'
    ],
    correctIndex: 1,
    difficulty: 'Medium',
    isClinicalCase: true,
    clinicalCase: {
      patientAge: '28 years',
      gender: 'Female',
      presentingSymptoms: 'Progressive pelvic pain worsening during menses, dyspareunia, inability to conceive for 36 months',
      medicalHistory: 'Menarche at 12 years, cycles 28 days with heavy dysmenorrheic bleeding',
      vitalsAndExam: 'Fixed retroverted uterus, tender bead-like induration palpated along uterosacral ligaments',
      imagingAndECG: 'Pelvic ultrasound shows bilateral 4 cm cystic ovarian masses with diffuse ground-glass low-level echoes',
      clinicalQuestion: 'Which diagnostic intervention provides definitive confirmation and clinical staging?'
    },
    explanation: 'Diagnostic Laparoscopy with direct visualization and histological biopsy confirmation of ectopic endometrial glands and stroma remains the gold standard for definitive diagnosis and staging of endometriosis according to the revised ASRM criteria.',
    orderIndex: 1,
    tags: ['Gynecology', 'Endometriosis', 'Laparoscopy']
  },
  {
    id: 'mcq_gyn_2',
    chapterId: 'chap_gyn_endo',
    question: 'What is the characteristic sonographic finding of an ovarian endometrioma (chocolate cyst)?',
    options: [
      'Thick septations with high-velocity vascular solid projections',
      'Homogeneous low-level internal echoes (ground-glass appearance) without internal vascularity',
      'Purely anechoic thin-walled fluid collection with acoustic enhancement',
      'Echogenic tip of the iceberg sign with posterior acoustic shadowing'
    ],
    correctIndex: 1,
    difficulty: 'Medium',
    isClinicalCase: false,
    explanation: 'An ovarian endometrioma characteristically appears on transvaginal ultrasound as a round, thick-walled cyst containing homogeneous low-level internal echoes ("ground-glass" appearance) produced by hemolyzed cellular debris, lacking internal Doppler flow.',
    orderIndex: 2,
    tags: ['Gynecology', 'Ultrasound', 'Endometrioma']
  },
  {
    id: 'mcq_gyn_3',
    chapterId: 'chap_gyn_pcos',
    question: 'According to the Rotterdam Consensus Criteria (2003), how many of the three diagnostic features are required to confirm the diagnosis of Polycystic Ovarian Syndrome (PCOS)?',
    options: [
      'At least 1 feature',
      'At least 2 out of 3 features',
      'All 3 features must be present',
      'Only elevated LH:FSH ratio >3:1'
    ],
    correctIndex: 1,
    difficulty: 'Easy',
    isClinicalCase: false,
    explanation: 'The Rotterdam criteria require the presence of at least 2 out of the following 3 features (after excluding other etiologies like CAH or Cushing syndrome): (1) Oligo- or anovulation, (2) Clinical and/or biochemical signs of hyperandrogenism, (3) Polycystic ovarian morphology on ultrasound (≥12 follicles of 2–9 mm or ovarian volume >10 mL).',
    orderIndex: 1,
    tags: ['Gynecology', 'PCOS', 'Rotterdam Criteria']
  },

  // Additional MCQs for breadth
  {
    id: 'mcq_med_cap',
    chapterId: 'chap_med_cap',
    question: 'A 72-year-old woman is evaluated for cough with purulent sputum, fever, and confusion. Her respiratory rate is 32/min, Blood Urea Nitrogen (BUN) is 26 mg/dL, and BP is 86/54 mmHg. What is her CURB-65 score, and what is the recommended management site?',
    options: [
      'Score 1: Outpatient oral antibiotics',
      'Score 2: Short stay observation ward',
      'Score 4: Immediate inpatient hospitalization, evaluate for Intensive Care Unit (ICU)',
      'Score 0: Reassurance and home therapy'
    ],
    correctIndex: 2,
    difficulty: 'Hard',
    isClinicalCase: true,
    clinicalCase: {
      patientAge: '72 years',
      gender: 'Female',
      presentingSymptoms: 'Cough with rust-colored sputum, disorientation to time and place for 24 hours',
      medicalHistory: 'COPD and Osteoarthritis',
      vitalsAndExam: 'Confusion present (C=1), BUN 26 mg/dL (U=1, >19 mg/dL), RR 32/min (R=1, ≥30), BP 86/54 mmHg (B=1, SBP<90), Age 72 (65=1, ≥65)',
      imagingAndECG: 'Right middle lobe dense alveolar consolidation on chest X-ray',
      clinicalQuestion: 'Calculate the CURB-65 score and dictate appropriate hospital disposition.'
    },
    explanation: 'All 5 criteria are positive: C (Confusion) = 1, U (Urea/BUN >19 mg/dL) = 1, R (Resp rate ≥30) = 1, B (BP <90/60) = 1, 65 (Age ≥65) = 1. Total score = 5 (or at least 4 in any clinical tier), indicating high 30-day mortality (>25%). Inpatient hospital admission and urgent consideration for ICU management is mandated.',
    orderIndex: 1,
    tags: ['Respiratory', 'Pneumonia', 'CURB-65']
  },
  {
    id: 'mcq_obs_pph',
    chapterId: 'chap_obs_pph',
    question: 'What is the single most common cause of Primary Postpartum Hemorrhage (PPH) accounting for approximately 70–80% of all cases?',
    options: [
      'Retained placental cotyledons (Tissue)',
      'Uterine atony (Tone)',
      'Cervical laceration (Trauma)',
      'Disseminated Intravascular Coagulation (Thrombin)'
    ],
    correctIndex: 1,
    difficulty: 'Easy',
    isClinicalCase: false,
    explanation: 'Uterine Atony (loss of myometrial contractile tone, "Tone" in the 4 T mnemonic) is responsible for ~75% to 80% of primary postpartum hemorrhage. Without vigorous myometrial contraction, the criss-cross "living ligatures" around spiral vessels fail to compress, resulting in rapid massive maternal hemorrhage.',
    orderIndex: 1,
    tags: ['Obstetrics', 'PPH', 'Emergency']
  }
];

export const INITIAL_MIND_MAPS: MindMap[] = [
  {
    id: 'mm_med_acs',
    chapterId: 'chap_med_acs',
    title: 'Acute Coronary Syndrome Clinical Map',
    rootNodeId: 'node_acs_root',
    nodes: [
      { id: 'node_acs_root', text: 'Acute Coronary Syndrome (ACS)', type: 'root' },
      // Categories
      { id: 'node_acs_etio', parentId: 'node_acs_root', text: 'Etiology & Triggers', type: 'etiology' },
      { id: 'node_acs_patho', parentId: 'node_acs_root', text: 'Pathophysiology', type: 'pathophysiology' },
      { id: 'node_acs_clin', parentId: 'node_acs_root', text: 'Clinical Presentation', type: 'clinical' },
      { id: 'node_acs_diag', parentId: 'node_acs_root', text: 'Diagnostic Workup', type: 'investigations' },
      { id: 'node_acs_mgmt', parentId: 'node_acs_root', text: 'Management Protocol', type: 'management' },
      { id: 'node_acs_pearl', parentId: 'node_acs_root', text: 'Clinical Pearls & Red Flags', type: 'pearl' },

      // Sub-concepts
      { id: 'node_sub_1', parentId: 'node_acs_etio', text: 'Atheromatous Plaque Rupture (80%)', type: 'etiology', notes: 'Thin fibrous cap fissuring exposes tissue factor' },
      { id: 'node_sub_2', parentId: 'node_acs_etio', text: 'Coronary Vasospasm (Prinzmetal)', type: 'etiology', notes: 'Triggered by cold, smoking, or sympathomimetics' },

      { id: 'node_sub_3', parentId: 'node_acs_patho', text: 'Platelet Adhesion & Aggregation', type: 'pathophysiology', notes: 'GP Ib/IX binding to vWF and GP IIb/IIIa crosslinking' },
      { id: 'node_sub_4', parentId: 'node_acs_patho', text: 'Coronary Thrombosis', type: 'pathophysiology', notes: 'Red thrombus in STEMI; white platelet thrombus in NSTEMI' },

      { id: 'node_sub_5', parentId: 'node_acs_clin', text: 'Retrosternal Angina', type: 'clinical', notes: 'Crushing sensation >20 min radiating to left arm/jaw' },
      { id: 'node_sub_6', parentId: 'node_acs_clin', text: 'Diaphoresis & Dyspnea', type: 'clinical', notes: 'Autonomic hyperactivation' },
      { id: 'node_sub_7', parentId: 'node_acs_clin', text: 'Angina Equivalents', type: 'clinical', notes: 'Isolated nausea/fatigue common in elderly and diabetics' },

      { id: 'node_sub_8', parentId: 'node_acs_diag', text: 'Serial 12-Lead ECG', type: 'investigations', notes: 'ST-elevation ≥1 mm in contiguous leads or new LBBB' },
      { id: 'node_sub_9', parentId: 'node_acs_diag', text: 'Cardiac Biomarkers (hs-cTnI / hs-cTnT)', type: 'investigations', notes: 'Rises in 2–3h; repeat at 1h or 3h protocol' },
      { id: 'node_sub_10', parentId: 'node_acs_diag', text: 'Bedside Echocardiography', type: 'investigations', notes: 'Regional wall motion abnormalities (RWMA)' },

      { id: 'node_sub_11', parentId: 'node_acs_mgmt', text: 'Primary PCI within 90 min', type: 'management', notes: 'Standard of care for STEMI at PCI centers' },
      { id: 'node_sub_12', parentId: 'node_acs_mgmt', text: 'Dual Antiplatelet Therapy (DAPT)', type: 'management', notes: 'Aspirin 300 mg + Ticagrelor 180 mg loading' },
      { id: 'node_sub_13', parentId: 'node_acs_mgmt', text: 'Anticoagulation', type: 'management', notes: 'UFH bolus or subcutaneous Enoxaparin' },

      { id: 'node_sub_14', parentId: 'node_acs_pearl', text: 'Avoid Nitrates in Inferior/RV Infarction', type: 'pearl', notes: 'Causes catastrophic drop in preload and shock' },
      { id: 'node_sub_15', parentId: 'node_acs_pearl', text: 'Target O2 Saturation 90–96%', type: 'pearl', notes: 'Hyperoxia increases myocardial oxidative injury' }
    ],
    edges: [
      { id: 'e1', source: 'node_acs_root', target: 'node_acs_etio' },
      { id: 'e2', source: 'node_acs_root', target: 'node_acs_patho' },
      { id: 'e3', source: 'node_acs_root', target: 'node_acs_clin' },
      { id: 'e4', source: 'node_acs_root', target: 'node_acs_diag' },
      { id: 'e5', source: 'node_acs_root', target: 'node_acs_mgmt' },
      { id: 'e6', source: 'node_acs_root', target: 'node_acs_pearl' },

      { id: 'e7', source: 'node_acs_etio', target: 'node_sub_1' },
      { id: 'e8', source: 'node_acs_etio', target: 'node_sub_2' },

      { id: 'e9', source: 'node_acs_patho', target: 'node_sub_3' },
      { id: 'e10', source: 'node_acs_patho', target: 'node_sub_4' },

      { id: 'e11', source: 'node_acs_clin', target: 'node_sub_5' },
      { id: 'e12', source: 'node_acs_clin', target: 'node_sub_6' },
      { id: 'e13', source: 'node_acs_clin', target: 'node_sub_7' },

      { id: 'e14', source: 'node_acs_diag', target: 'node_sub_8' },
      { id: 'e15', source: 'node_acs_diag', target: 'node_sub_9' },
      { id: 'e16', source: 'node_acs_diag', target: 'node_sub_10' },

      { id: 'e17', source: 'node_acs_mgmt', target: 'node_sub_11' },
      { id: 'e18', source: 'node_acs_mgmt', target: 'node_sub_12' },
      { id: 'e19', source: 'node_acs_mgmt', target: 'node_sub_13' },

      { id: 'e20', source: 'node_acs_pearl', target: 'node_sub_14' },
      { id: 'e21', source: 'node_acs_pearl', target: 'node_sub_15' }
    ],
    updatedAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'mm_obs_preecl',
    chapterId: 'chap_obs_preecl',
    title: 'Preeclampsia Diagnostic & Management Algorithm',
    rootNodeId: 'node_pre_root',
    nodes: [
      { id: 'node_pre_root', text: 'Preeclampsia & Hypertensive Disorders', type: 'root' },
      { id: 'node_pre_patho', parentId: 'node_pre_root', text: 'Defective Trophoblast Invasion', type: 'pathophysiology' },
      { id: 'node_pre_crit', parentId: 'node_pre_root', text: 'Diagnostic Criteria (≥20 Weeks)', type: 'investigations' },
      { id: 'node_pre_sev', parentId: 'node_pre_root', text: 'Severe Features Matrix', type: 'clinical' },
      { id: 'node_pre_anticonv', parentId: 'node_pre_root', text: 'MgSO4 Seizure Prophylaxis', type: 'management' },
      { id: 'node_pre_deliv', parentId: 'node_pre_root', text: 'Definitive Delivery Timing', type: 'management' },

      { id: 'node_p1', parentId: 'node_pre_patho', text: 'Failed Spiral Artery Remodeling', type: 'pathophysiology', notes: 'Narrow high resistance uteroplacental beds' },
      { id: 'node_p2', parentId: 'node_pre_patho', text: 'sFlt-1 & sEng Antiangiogenic Spike', type: 'pathophysiology', notes: 'Antagonizes VEGF, inducing systemic endothelial injury' },

      { id: 'node_p3', parentId: 'node_pre_crit', text: 'BP ≥140/90 mmHg (2 readings 4h apart)', type: 'investigations' },
      { id: 'node_p4', parentId: 'node_pre_crit', text: 'Proteinuria (≥300mg/24h or PCR ≥0.3)', type: 'investigations' },

      { id: 'node_p5', parentId: 'node_pre_sev', text: 'BP ≥160/110 mmHg', type: 'clinical' },
      { id: 'node_p6', parentId: 'node_pre_sev', text: 'Thrombocytopenia (<100,000 /µL)', type: 'clinical' },
      { id: 'node_p7', parentId: 'node_pre_sev', text: 'Elevated AST/ALT & Epigastric Pain', type: 'clinical', notes: 'Glisson capsule stretching' },

      { id: 'node_p8', parentId: 'node_pre_anticonv', text: 'Loading: 4g IV + 10g IM Pritchard', type: 'management' },
      { id: 'node_p9', parentId: 'node_pre_anticonv', text: 'Antidote: Calcium Gluconate 10% 10mL', type: 'pearl', notes: 'Administer IV push if patellar reflex lost or RR <12' },

      { id: 'node_p10', parentId: 'node_pre_deliv', text: '≥37 Weeks: Deliver (Non-severe)', type: 'management' },
      { id: 'node_p11', parentId: 'node_pre_deliv', text: '≥34 Weeks or Unstable: Immediate Delivery', type: 'management' }
    ],
    edges: [
      { id: 'pe1', source: 'node_pre_root', target: 'node_pre_patho' },
      { id: 'pe2', source: 'node_pre_root', target: 'node_pre_crit' },
      { id: 'pe3', source: 'node_pre_root', target: 'node_pre_sev' },
      { id: 'pe4', source: 'node_pre_root', target: 'node_pre_anticonv' },
      { id: 'pe5', source: 'node_pre_root', target: 'node_pre_deliv' },

      { id: 'pe6', source: 'node_pre_patho', target: 'node_p1' },
      { id: 'pe7', source: 'node_pre_patho', target: 'node_p2' },
      { id: 'pe8', source: 'node_pre_crit', target: 'node_p3' },
      { id: 'pe9', source: 'node_pre_crit', target: 'node_p4' },
      { id: 'pe10', source: 'node_pre_sev', target: 'node_p5' },
      { id: 'pe11', source: 'node_pre_sev', target: 'node_p6' },
      { id: 'pe12', source: 'node_pre_sev', target: 'node_p7' },
      { id: 'pe13', source: 'node_pre_anticonv', target: 'node_p8' },
      { id: 'pe14', source: 'node_pre_anticonv', target: 'node_p9' },
      { id: 'pe15', source: 'node_pre_deliv', target: 'node_p10' },
      { id: 'pe16', source: 'node_pre_deliv', target: 'node_p11' }
    ],
    updatedAt: '2026-02-05T15:00:00Z'
  },
  {
    id: 'mm_gyn_endo',
    chapterId: 'chap_gyn_endo',
    title: 'Endometriosis Clinical Framework',
    rootNodeId: 'node_endo_root',
    nodes: [
      { id: 'node_endo_root', text: 'Endometriosis Framework', type: 'root' },
      { id: 'node_g_patho', parentId: 'node_endo_root', text: 'Etiopathogenesis', type: 'pathophysiology' },
      { id: 'node_g_symp', parentId: 'node_endo_root', text: 'Cardinal Symptoms', type: 'clinical' },
      { id: 'node_g_diag', parentId: 'node_endo_root', text: 'Diagnostic Modalities', type: 'investigations' },
      { id: 'node_g_rx', parentId: 'node_endo_root', text: 'Therapeutic Strategy', type: 'management' },

      { id: 'node_g1', parentId: 'node_g_patho', text: 'Retrograde Menstruation (Sampson)', type: 'pathophysiology' },
      { id: 'node_g2', parentId: 'node_g_patho', text: 'Coelomic Metaplasia & Genetics', type: 'pathophysiology' },

      { id: 'node_g3', parentId: 'node_g_symp', text: 'Secondary Progressive Dysmenorrhea', type: 'clinical' },
      { id: 'node_g4', parentId: 'node_g_symp', text: 'Deep Dyspareunia', type: 'clinical' },
      { id: 'node_g5', parentId: 'node_g_symp', text: 'Infertility / Subfertility', type: 'clinical' },

      { id: 'node_g6', parentId: 'node_g_diag', text: 'TVS: Ovarian Endometrioma Ground Glass', type: 'investigations' },
      { id: 'node_g7', parentId: 'node_g_diag', text: 'Gold Standard: Diagnostic Laparoscopy', type: 'pearl' },

      { id: 'node_g8', parentId: 'node_g_rx', text: 'Medical: Dienogest 2mg / Combined OCPs', type: 'management' },
      { id: 'node_g9', parentId: 'node_g_rx', text: 'Surgical: Laparoscopic Cystectomy / Ablation', type: 'management' }
    ],
    edges: [
      { id: 'ge1', source: 'node_endo_root', target: 'node_g_patho' },
      { id: 'ge2', source: 'node_endo_root', target: 'node_g_symp' },
      { id: 'ge3', source: 'node_endo_root', target: 'node_g_diag' },
      { id: 'ge4', source: 'node_endo_root', target: 'node_g_rx' },

      { id: 'ge5', source: 'node_g_patho', target: 'node_g1' },
      { id: 'ge6', source: 'node_g_patho', target: 'node_g2' },
      { id: 'ge7', source: 'node_g_symp', target: 'node_g3' },
      { id: 'ge8', source: 'node_g_symp', target: 'node_g4' },
      { id: 'ge9', source: 'node_g_symp', target: 'node_g5' },
      { id: 'ge10', source: 'node_g_diag', target: 'node_g6' },
      { id: 'ge11', source: 'node_g_diag', target: 'node_g7' },
      { id: 'ge12', source: 'node_g_rx', target: 'node_g8' },
      { id: 'ge13', source: 'node_g_rx', target: 'node_g9' }
    ],
    updatedAt: '2026-02-10T16:00:00Z'
  }
];

export const INITIAL_PROGRESS: Progress[] = [
  {
    id: 'prog_1',
    userId: 'user_student_1',
    chapterId: 'chap_med_acs',
    bookId: 'book_med',
    isCompleted: true,
    readingPercent: 100,
    mindMapExplored: true,
    bestScore: 100,
    lastScore: 100,
    attemptsCount: 2,
    lastAccessedAt: '2026-02-15T09:30:00Z'
  },
  {
    id: 'prog_2',
    userId: 'user_student_1',
    chapterId: 'chap_obs_preecl',
    bookId: 'book_obs',
    isCompleted: true,
    readingPercent: 85,
    mindMapExplored: true,
    bestScore: 66.7,
    lastScore: 66.7,
    attemptsCount: 1,
    lastAccessedAt: '2026-02-14T11:20:00Z'
  },
  {
    id: 'prog_3',
    userId: 'user_student_1',
    chapterId: 'chap_gyn_endo',
    bookId: 'book_gyn',
    isCompleted: false,
    readingPercent: 45,
    mindMapExplored: false,
    attemptsCount: 0,
    lastAccessedAt: '2026-02-12T16:45:00Z'
  }
];

export const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm_1',
    userId: 'user_student_1',
    type: 'chapter',
    targetId: 'chap_med_acs',
    chapterId: 'chap_med_acs',
    bookId: 'book_med',
    title: 'Acute Coronary Syndromes (STEMI vs NSTEMI)',
    subtitle: 'Manipal Prep Manual of Medicine • Cardiology',
    createdAt: '2026-02-10T08:00:00Z'
  },
  {
    id: 'bm_2',
    userId: 'user_student_1',
    type: 'studyMaterial',
    targetId: 'cp_acs_1',
    chapterId: 'chap_med_acs',
    bookId: 'book_med',
    title: 'Clinical Pearl: Avoid Nitrates in RV Infarct',
    subtitle: 'Acute Coronary Syndromes',
    createdAt: '2026-02-11T12:00:00Z'
  },
  {
    id: 'bm_3',
    userId: 'user_student_1',
    type: 'mindMap',
    targetId: 'mm_obs_preecl',
    chapterId: 'chap_obs_preecl',
    bookId: 'book_obs',
    title: 'Preeclampsia Diagnostic & Management Algorithm',
    subtitle: 'D.C. Dutta Obstetrics • Hypertensive Disorders',
    createdAt: '2026-02-14T14:30:00Z'
  }
];
