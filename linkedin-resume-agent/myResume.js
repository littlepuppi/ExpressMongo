const fs = require('fs');
const { LinkedInResumeAgent, UserProfile, Experience, Education } = require('./linkedinResumeAgent');

// Emily Lam's Professional Profile
const myProfile = new UserProfile(
  "Emily Lam",
  "emilyjolam@gmail.com",
  "(626) 731-1291",
  "Boston, MA",
  "linkedin.com/in/emilylam", // Update with your actual LinkedIn URL
  "Resourceful and intelligent professional with seven years of experience in investment management and financial services. Experienced in market research, competitive data analysis, and financial analysis with advanced ability to facilitate operations in high volume, fast-paced environments",
  [
    new Experience(
      "Investment Operations Associate Analyst",
      "Poplar Forest Capital LLC",
      "09/2023 - Present",
      [
        "Calculate performance metrics of various portfolios and partner with portfolio managers on customized reporting related to model portfolios",
        "Utilize SQL and various Excel Macros to facilitate client communications and streamline operations",
        "Create dashboards to research and resolve trade discrepancies across multiple accounts",
        "Facilitate and complete all support team requests, including distributions and account information requests",
        "Participate in investment committee meetings providing operational insights",
        "Perform end-of-day trade reporting ensuring accuracy and compliance"
      ],
      [
        "Improved client communication efficiency through automated SQL queries and Excel macro development",
        "Successfully resolved complex trade discrepancies through comprehensive dashboard analysis"
      ]
    ),
    new Experience(
      "New Accounts Onboarding Specialist",
      "Kayne Anderson Rudnick",
      "06/2021 - 09/2023",
      [
        "Served as primary service and administrative contact for high-net-worth investors and their professional advisors specializing in onboarding",
        "Prepared and processed custodial and internal new account forms, reviewing all paperwork to ensure completeness and compliance",
        "Verified accounts were fully funded via check deposits, wires, EFTs, or ACAT/non-ACAT transfers ensuring seamless transitions",
        "Supported service teams with questions on transfers processed and pending requests",
        "Maintained and updated client files, CRM, and portfolio data while collaborating with management to improve practices and procedures"
      ],
      [
        "Successfully onboarded high-net-worth clients managing complex account structures and transfer processes",
        "Improved onboarding procedures through collaboration with management team"
      ]
    ),
    new Experience(
      "Data Analyst",
      "Springboard (Online Certificate Program)",
      "2020 - 2021",
      [
        "Collected business intelligence data from available public information and field reports",
        "Reviewed large amounts of data across multiple platforms and sources to determine operational impacts and needed actions",
        "Designed and developed financial reports and analytics using modern data visualization tools including Tableau and Excel",
        "Extracted key observations and insights from internal and external data sources to drive decision-making"
      ],
      [
        "Developed comprehensive financial reports using Tableau that improved data-driven decision making",
        "Successfully analyzed multi-platform datasets to identify actionable business insights"
      ]
    ),
    new Experience(
      "Advisor Onboarding Associate, Team Lead",
      "First Republic Investment Management",
      "2019 - 2020",
      [
        "Led transition of private wealth advisory teams from contra-firms",
        "Assisted wealth managers in managing investment needs of ultra high net worth clients",
        "Completed paperwork for variety of portfolio strategies ensuring accuracy and compliance",
        "Coordinated with multiple stakeholders to ensure smooth onboarding process"
      ],
      [
        "Successfully led team in transitioning multiple advisory teams and their client portfolios",
        "Managed complex onboarding processes for ultra high net worth client accounts"
      ]
    ),
    new Experience(
      "Assistant and Project Manager",
      "Rick Seibold",
      "2017 - 2019",
      [
        "Facilitated communication for producer/songwriter Rick Seibold managing multiple stakeholder relationships",
        "Tracked royalties through ASCAP, BMI, Harry Fox, Music Reports, SoundExchange, Pandora, Spotify, and iTunes",
        "Updated business website and managed various social media platforms",
        "Assisted in writing and recording studio sessions providing administrative support"
      ],
      [
        "Successfully managed complex royalty tracking across 8+ platforms ensuring accurate compensation",
        "Improved online presence through strategic website and social media management"
      ]
    )
  ],
  [
    new Education(
      "Bachelor of Science in Business Administration, Concentration in Finance",
      "University of Southern California (USC)",
      "2017",
      "Finance concentration with strong foundation in investment management and financial analysis"
    )
  ],
  [
    "SQL", "Python", "R", "Excel", "Tableau", "Power BI", "Bloomberg",
    "Financial Analysis", "Data Analysis", "Data Visualization", "Investment Analysis",
    "Portfolio Management", "Client Relationship Management", "ETL", "CapIQ",
    "Market Research", "Competitive Analysis", "CRM Management", "Excel Macros",
    "Trade Reporting", "Account Onboarding", "Compliance", "Communication",
    "Project Management", "Research", "Problem Solving"
  ],
  [
    "Series 7",
    "Series 63",
    "California Insurance License",
    "Wall Street Prep Accounting and Financial Statement Analysis",
    "Springboard Data Analytics Certificate",
    "Level 10 Certificate of Merit in Piano with Honors, Music Teacher's Association of California"
  ],
  [
    {
      name: "Automated Trade Reporting Dashboard",
      description: "Developed SQL-based dashboard for tracking and resolving trade discrepancies, improving operational efficiency"
    },
    {
      name: "Client Communication Automation",
      description: "Created Excel macros and SQL queries to streamline client communications and reporting processes"
    },
    {
      name: "Financial Data Visualization Suite",
      description: "Designed comprehensive financial reports and analytics using Tableau for data-driven decision making"
    }
  ]
);

// PASTE JOB DESCRIPTION HERE
const jobDescription = `
[Paste the full job description here]

Example format:
Senior Investment Analyst
Company XYZ

We're seeking an experienced investment professional...

Requirements:
- 5+ years in investment management
- Strong SQL and data analysis skills
- Experience with portfolio reporting
...etc
`;

// Generate and save the tailored resume
console.log("=".repeat(70));
console.log("EMILY LAM - TAILORED RESUME GENERATOR");
console.log("=".repeat(70));
console.log("\nGenerating tailored resume...\n");

const agent = new LinkedInResumeAgent(myProfile);

// Generate text version
const resumeText = agent.generateResumeText(jobDescription);
console.log(resumeText);

// Save to file
const outputFilename = "Emily_Lam_Tailored_Resume.txt";
fs.writeFileSync(outputFilename, resumeText);

console.log("\n" + "=".repeat(70));
console.log(`✅ Resume saved to ${outputFilename}`);
console.log("=".repeat(70));

// Also save JSON version for ATS systems
const jsonResume = agent.generateResumeJSON(jobDescription);
const jsonFilename = "Emily_Lam_Tailored_Resume.json";
fs.writeFileSync(jsonFilename, JSON.stringify(jsonResume, null, 2));

console.log(`✅ JSON version saved to ${jsonFilename}`);
console.log("\n💡 TIP: Update the 'jobDescription' variable with the actual job posting");
console.log("   you're applying to, then run this script again to generate a tailored resume!");
console.log("=".repeat(70));