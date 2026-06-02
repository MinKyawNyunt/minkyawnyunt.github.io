
import React from 'react';
import { Project, Skill, Experience, Education } from './types';
import fdaImage from './assets/images/fda.jpeg';
import mohtImage from './assets/images/moht.png';
import ucsbImage from './assets/images/ucsb.webp';
import moaliImg from './assets/images/moali.png';
import disiImg from './assets/images/disi.png';
import hanaImg from './assets/images/hana.jpg';
import sayaImg from './assets/images/saya.png';
import grandeWhiskyImg from './assets/images/grande-whisky.webp';
import boaImg from './assets/images/boa_logo.png';
import roseHillImg from './assets/images/rose-hill.png';
import asahiImg from './assets/images/asahi.png';
import cryptoSwapImg from './assets/images/crypto-swap.png';
import threeDWebsiteImg from './assets/images/3d-website.png';

export const BIO_NAME = "MIN KYAW NYUNT";
export const BIO_TAGLINE = "Full-Stack Developer";
const calculateYearsOfExperience = (): number => {
  const startYear = 2017;
  const currentYear = new Date().getFullYear();
  return currentYear - startYear;
};

export const BIO_SUMMARY = `I engineer mission-critical software in a high-stakes digital world - ${calculateYearsOfExperience()}+ years building scalable Fintech and Government systems designed to success!`;

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Submission System For FDA Myanmar',
    description: 'Modernized the FDA application process in Myanmar, significantly improving accessibility, efficiency, and security for citizens and government authorities.',
    tags: ['Laravel', 'React', 'MySQL', 'On-Premise Server'],
    imageUrl: fdaImage,
    link: 'https://www.fda.gov.mm/'
  },
  {
    id: '2',
    title: 'Electronic Document Management System For Ministry of Hotels and Tourism',
    description: 'In-house letter management system that streamlined and modernized letter workflows, significantly enhancing administrative efficiency and responsiveness',
    tags: ['Laravel', 'React', 'MariaDB', 'On-Premise Server'],
    imageUrl: mohtImage,
    link: ''
  },
  {
    id: '3',
    title: 'Online Examination System For Union Civil Service Board',
    description: 'Built a nationwide online examination platform that transformed the Union Civil Service Board’s exam process, delivering a standardized, transparent, and accessible experience for government staff candidates across Myanmar.',
    tags: ['Laravel', 'React', 'API', 'Postgres', 'On-Premise Server'],
    imageUrl: ucsbImage,
    link: 'https://play.google.com/store/apps/details?id=com.erss.recruitment.ucsb&hl=en'
  },
  {
    id: '4',
    title: 'ERP System For Ministry Of Agriculture And Irrigation',
    description: 'Developed a comprehensive ERP system for the Ministry of Agriculture and Irrigation, integrating administrative and operational functions through modules for project management, resource allocation, financial management, and reporting to ensure efficient coordination and oversight.',
    tags: ['Laravel', 'JQuery', 'MySQL', 'On-Premise Server'],
    imageUrl: moaliImg,
    link: ''
  },
  {
    id: '5',
    title: 'ERP System For Directorate Of Industrial Supervision And Inspection',
    description: 'Developed a comprehensive ERP system to enhance the management and oversight of industrial operations and inspections, featuring modules for inspection scheduling, compliance tracking, reporting, and centralized data management to streamline regulatory supervision.',
    tags: ['Laravel', 'JQuery', 'MySQL', 'On-Premise Server'],
    imageUrl: disiImg,
    link: 'https://disi.gov.mm/'
  },
  {
    id: '6',
    title: 'Hana Microfinance In-House ERP',
    description: 'Designed and developed an in-house ERP solution covering client information management, loan processing, savings management, and repayment tracking, supported by a dedicated client mobile app and a field application to streamline office staff operations.',
    tags: ['Laravel', 'React', 'React Native', 'MySQL', 'Docker', 'AWS'],
    imageUrl: hanaImg,
    link: 'https://hanamyanmar.com/'
  },
  {
    id: '7',
    title: 'Automation for Saya Foundation',
    description: 'Automated Zoom class recordings and student attendance tracking, seamlessly syncing data to Google Drive through a custom solution leveraging Google Apps Script and AWS Lambda.',
    tags: ['Lambda', 'AppScript', 'ES6', 'Google Drive', 'Zoom API'],
    imageUrl: sayaImg,
    link: 'https://saya-foundation.org/'
  },
  {
    id: '8',
    title: 'Grande Whisky Museum Web Portal',
    description: "Developed digital presence of The Grande Whisky Museum, showcasing curated whisky experiences, private tours, events, and membership offerings for Asia's first rare whisky museum.",
    tags: ['Node.JS', 'Next.JS', 'Postgres', 'Cloud Server'],
    imageUrl: grandeWhiskyImg,
    link: 'https://www.grandewhisky.com/'
  },
  {
    id: '9',
    title: 'Bay Of Andaman Travel and Tour',
    description: "Built a comprehensive travel and tour platform supporting online tour package bookings, flight and bus reservations, and informative travel content for customers.",
    tags: ['PHP', 'ES6', 'Yii2', 'MySql', 'Cloud Server'],
    imageUrl: boaImg,
    link: ''
  },
  {
    id: '10',
    title: 'Rose Hill Hospital Website',
    description: "Website for Rose Hill Hospital, Myanmar.",
    tags: ['Wordpress'],
    imageUrl: roseHillImg,
    link: 'https://rosehillhospital.com/'
  },
  {
    id: '11',
    title: 'Asahi Sushi Restaurant',
    description: "Website for Asahi Sushi Resturant, America.",
    tags: ['Wordpress'],
    imageUrl: asahiImg,
    link: 'https://asahijapanesesushirestaurant.com/'
  },
  {
    id: '12',
    title: 'Crypto Swap UI',
    description: "Open Source Crypto Swap UI",
    tags: ['React', 'Vite', 'Github'],
    imageUrl: cryptoSwapImg,
    link: 'https://minkyawnyunt.github.io/code-challenge/'
  },
  {
    id: '13',
    title: '3D Website',
    description: "3d Website using Three.JS",
    tags: ['Three.JS', 'Next.JS', 'Github'],
    imageUrl: threeDWebsiteImg,
    link: 'https://minkyawnyunt.github.io/3d-website/'
  },


  
];

export const SKILLS: Skill[] = [
  { name: 'React / Next.JS / React Native', level: 95, category: 'Frontend' },
  { name: 'Tailwind / Bootstrap', level: 90, category: 'Frontend' },
  { name: 'TypeScript / JavaScript', level: 95, category: 'Frontend' },
  { name: 'HTML / CSS / JQuery', level: 95, category: 'Frontend' },
  { name: 'Three.JS / Cannon.JS', level: 40, category: 'Frontend' },
  

  { name: 'Node.JS / PHP', level: 95, category: 'Backend' },
  { name: 'Laravel / Yii2 / Express.JS', level: 95, category: 'Backend' },
  { name: 'Wordpress', level: 95, category: 'Backend' },
  { name: 'MySQL / MariaDB / PostgreSQL', level: 90, category: 'Backend' },
  { name: 'MongoDB / NoSQL', level: 80, category: 'Backend' },

  { name: 'Figma / Canva', level: 60, category: 'Design' },
  { name: 'UI / UX', level: 50, category: 'Design' },

  { name: 'Docker', level: 80, category: 'Dev-Ops' },
  { name: 'AWS', level: 50, category: 'Dev-Ops' },
  { name: 'Digital Ocean', level: 90, category: 'Dev-Ops' }
];

export const EXPERIENCES: Experience[] = [
  {
    company: 'HANA MICROFINANCE',
    role: 'Solution Architect / Senior Developer',
    period: 'Jul 2021 - Oct 2025',
    description: 'Designed system architecture supporting 300k+ users, reducing processing time by 35%. Translated business and regulatory requirements into scalable technical solutions. Defined technology stack, coding standards, and system integration strategies.'
  },

  {
    company: 'SECURELINK',
    role: 'Team Leader',
    period: 'May 2019 - May 2021',
    description: 'Led a cross-functional development team delivering large-scale Government ERP systems used nationwide. Coordinated project planning, task allocation, and sprint execution to ensure on-time delivery. Acted as the primary technical point of contact between government stakeholders and the development team.'
  },

  {
    company: 'IRRAHUB',
    role: 'Developer',
    period: 'Feb 2017 - Apr 2018',
    description: 'Implemented backend modules, database schemas, and business logic based on project requirements. Assisted in system testing, bug fixing, and performance optimization. Participated in deployment support and post-release maintenance for production systems.'
  },

  {
    company: 'EMPOWER',
    role: 'Data Operator',
    period: 'May 2014 - May 2016',
    description: 'Collected quantative surveys for drought villages in Myanmar. Data Entry using SPSS, Microsoft Word, and Excel.'
  },
];

export const EDUCATION: Education[] = [
  {
    institution: 'NCC Education - UK',
    degree: 'LEVEL 5 DIPLOMA IN COMPUTING (L5DC)',
    period: '2018 - 2019',
    // description: 'Specialized in software engineering and database management systems. Developed foundational skills in algorithms, data structures, and system design.',
    // achievements: ['Dean\'s List', 'Software Development Club Lead']
  },
  {
    institution: 'Lashio University',
    degree: 'BACHELOR OF ARTS IN PSYCHOLOGY',
    period: '2016 - 2019',
    // description: 'Specialized in software engineering and database management systems. Developed foundational skills in algorithms, data structures, and system design.',
    // achievements: ['Dean\'s List', 'Software Development Club Lead']
  },
  {
    institution: 'Yangon University of Distance Education',
    degree: 'DIPLOMA IN WEB DEVELOPMENT',
    period: '2016 - 2017',
    // description: 'Specialized in software engineering and database management systems. Developed foundational skills in algorithms, data structures, and system design.',
    // achievements: ['Dean\'s List', 'Software Development Club Lead']
  },
];
