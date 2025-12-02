from linkedin_resume_agent import LinkedInResumeAgent, UserProfile, Experience, Education

# Emily Lam's Professional Profile
my_profile = UserProfile(
    name="Emily Lam",
    email="emilyjolam@gmail.com",
    phone="(626) 731-1291",
    location="Boston, MA",
    linkedin="linkedin.com/in/emilylam",  # Update with your actual LinkedIn URL
    summary="Resourceful and intelligent professional with seven years of experience in investment management and financial services. Experienced in market research, competitive data analysis, and financial analysis with advanced ability to facilitate operations in high volume, fast-paced environments",
    
    experiences=[
        Experience(
            title="Investment Operations Associate Analyst",
            company="Poplar Forest Capital LLC",
            duration="09/2023 - Present",
            responsibilities=[
                "Calculate performance metrics of various portfolios and partner with portfolio managers on customized reporting related to model portfolios",
                "Utilize SQL and various Excel Macros to facilitate client communications and streamline operations",
                "Create dashboards to research and resolve trade discrepancies across multiple accounts",
                "Facilitate and complete all support team requests, including distributions and account information requests",
                "Participate in investment committee meetings providing operational insights",
                "Perform end-of-day trade reporting ensuring accuracy and compliance"
            ],
            achievements=[
                "Improved client communication efficiency through automated SQL queries and Excel macro development",
                "Successfully resolved complex trade discrepancies through comprehensive dashboard analysis"
            ]
        ),
        Experience(
            title="New Accounts Onboarding Specialist",
            company="Kayne Anderson Rudnick",
            duration="06/2021 - 09/2023",
            responsibilities=[
                "Served as primary service and administrative contact for high-net-worth investors and their professional advisors specializing in onboarding",
                "Prepared and processed custodial and internal new account forms, reviewing all paperwork to ensure completeness and compliance",
                "Verified accounts were fully funded via check deposits, wires, EFTs, or ACAT/non-ACAT transfers ensuring seamless transitions",
                "Supported service teams with questions on transfers processed and pending requests",
                "Maintained and updated client files, CRM, and portfolio data while collaborating with management to improve practices and procedures"
            ],
            achievements=[
                "Successfully onboarded high-net-worth clients managing complex account structures and transfer processes",
                "Improved onboarding procedures through collaboration with management team"
            ]
        ),
        Experience(
            title="Data Analyst",
            company="Springboard (Online Certificate Program)",
            duration="2020 - 2021",
            responsibilities=[
                "Collected business intelligence data from available public information and field reports",
                "Reviewed large amounts of data across multiple platforms and sources to determine operational impacts and needed actions",
                "Designed and developed financial reports and analytics using modern data visualization tools including Tableau and Excel",
                "Extracted key observations and insights from internal and external data sources to drive decision-making"
            ],
            achievements=[
                "Developed comprehensive financial reports using Tableau that improved data-driven decision making",
                "Successfully analyzed multi-platform datasets to identify actionable business insights"
            ]
        ),
        Experience(
            title="Advisor Onboarding Associate, Team Lead",
            company="First Republic Investment Management",
            duration="2019 - 2020",
            responsibilities=[
                "Led transition of private wealth advisory teams from contra-firms",
                "Assisted wealth managers in managing investment needs of ultra high net worth clients",
                "Completed paperwork for variety of portfolio strategies ensuring accuracy and compliance",
                "Coordinated with multiple stakeholders to ensure smooth onboarding process"
            ],
            achievements=[
                "Successfully led team in transitioning multiple advisory teams and their client portfolios",
                "Managed complex onboarding processes for ultra high net worth client accounts"
            ]
        ),
        Experience(
            title="Assistant and Project Manager",
            company="Rick Seibold",
            duration="2017 - 2019",
            responsibilities=[
                "Facilitated communication for producer/songwriter Rick Seibold managing multiple stakeholder relationships",
                "Tracked royalties through ASCAP, BMI, Harry Fox, Music Reports, SoundExchange, Pandora, Spotify, and iTunes",
                "Updated business website and managed various social media platforms",
                "Assisted in writing and recording studio sessions providing administrative support"
            ],
            achievements=[
                "Successfully managed complex royalty tracking across 8+ platforms ensuring accurate compensation",
                "Improved online presence through strategic website and social media management"
            ]
        )
    ],
    
    education=[
        Education(
            degree="Bachelor of Science in Business Administration, Concentration in Finance",
            institution="University of Southern California (USC)",
            year="2017",
            details="Finance concentration with strong foundation in investment management and financial analysis"
        )
    ],
    
    skills=[
        "SQL", "Python", "R", "Excel", "Tableau", "Power BI", "Bloomberg",
        "Financial Analysis", "Data Analysis", "Data Visualization", "Investment Analysis",
        "Portfolio Management", "Client Relationship Management", "ETL", "CapIQ",
        "Market Research", "Competitive Analysis", "CRM Management", "Excel Macros",
        "Trade Reporting", "Account Onboarding", "Compliance", "Communication",
        "Project Management", "Research", "Problem Solving"
    ],
    
    certifications=[
        "Series 7",
        "Series 63",
        "California Insurance License",
        "Wall Street Prep Accounting and Financial Statement Analysis",
        "Springboard Data Analytics Certificate",
        "Level 10 Certificate of Merit in Piano with Honors, Music Teacher's Association of California"
    ],
    
    projects=[
        {
            "name": "Automated Trade Reporting Dashboard",
            "description": "Developed SQL-based dashboard for tracking and resolving trade discrepancies, improving operational efficiency"
        },
        {
            "name": "Client Communication Automation",
            "description": "Created Excel macros and SQL queries to streamline client communications and reporting processes"
        },
        {
            "name": "Financial Data Visualization Suite",
            "description": "Designed comprehensive financial reports and analytics using Tableau for data-driven decision making"
        }
    ]
)

# PASTE JOB DESCRIPTION HERE
job_description = """
The Artificial General Intelligence (AGI) team is looking for a highly skilled and experienced Applied Scientist. You will develop and implement state-of-the-art algorithms and models for advanced information retrieval, and tune LLM-based prompting to optimize Retrieval Augmented Generation (RAG) for customer experiences.

As a Senior Applied Scientist, you will play a critical role developing Amazon's foundational Generative AI (Gen AI) technologies that serve our global customers.

Key job responsibilities

  Collaborate with cross-functional teams of engineers, product managers, and scientists to identify and solve complex problems in Gen AI
 Design and execute experiments to evaluate the performance of different algorithms and models, and iterate quickly to improve results
 Think big about the arc of development of Gen AI over a multi-year horizon, and identify new opportunities to apply these technologies to solve real-world problems
 Communicate results and insights to both technical and non-technical audiences, including through presentations and written reports

Basic Qualifications

  3+ years of building machine learning models for business application experience
 PhD, or Master's degree and 6+ years of applied research experience
 Experience programming in Java, C++, Python or related language
 Experience with neural deep learning methods and machine learning

Preferred Qualifications

  3+ years of building machine learning models or developing algorithms for business application experience
 Experience with popular deep learning frameworks such as MxNet and Tensor Flow.
 Knowledge of programming languages such as C/C++, Python, Java or Perl

Amazon is an equal opportunity employer and does not discriminate on the basis of protected veteran status, disability, or other legally protected status.

Los Angeles County applicants: Job duties for this position include: work safely and cooperatively with other employees, supervisors, and staff; adhere to standards of excellence despite stressful conditions; communicate effectively and respectfully with employees, supervisors, and staff to ensure exceptional customer service; and follow all federal, state, and local laws and Company policies. Criminal history may have a direct, adverse, and negative relationship with some of the material job duties of this position. These include the duties and responsibilities listed above, as well as the abilities to adhere to company policies, exercise sound judgment, effectively manage stress and work safely and respectfully with others, exhibit trustworthiness and professionalism, and safeguard business operations and the Company’s reputation. Pursuant to the Los Angeles County Fair Chance Ordinance, we will consider for employment qualified applicants with arrest and conviction records.

Our inclusive culture empowers Amazonians to deliver the best results for our customers. If you have a disability and need a workplace accommodation or adjustment during the application and hiring process, including support for the interview or onboarding process, please visit https://amazon.jobs/content/en/how-we-hire/accommodations for more information. If the country/region you’re applying in isn’t listed, please contact your Recruiting Partner.

Our compensation reflects the cost of labor across several US geographic markets. The base pay for this position ranges from $150,400/year in our lowest geographic market up to $260,000/year in our highest geographic market. Pay is based on a number of factors including market location and may vary depending on job-related knowledge, skills, and experience. Amazon is a total compensation company. Dependent on the position offered, equity, sign-on payments, and other forms of compensation may be provided as part of a total compensation package, in addition to a full range of medical, financial, and/or other benefits. For more information, please visit https://www.aboutamazon.com/workplace/employee-benefits. This position will remain posted until filled. Applicants should apply via our internal or external career site.


Company - Amazon.com Services LLC

Job ID: A2925354
"""

# Generate and save the tailored resume
print("=" * 70)
print("EMILY LAM - TAILORED RESUME GENERATOR")
print("=" * 70)
print("\nGenerating tailored resume...\n")

agent = LinkedInResumeAgent(my_profile)

# Generate text version
resume_text = agent.generate_resume_text(job_description)
print(resume_text)

# Save to file
output_filename = "Emily_Lam_Tailored_Resume.txt"
with open(output_filename, "w") as f:
    f.write(resume_text)

print("\n" + "=" * 70)
print(f"✅ Resume saved to {output_filename}")
print("=" * 70)

# Also save JSON version for ATS systems
import json
json_resume = agent.generate_resume_json(job_description)
json_filename = "Emily_Lam_Tailored_Resume.json"
with open(json_filename, "w") as f:
    json.dump(json_resume, indent=2, fp=f)

print(f"✅ JSON version saved to {json_filename}")
print("\n💡 TIP: Update the 'job_description' variable with the actual job posting")
print("   you're applying to, then run this script again to generate a tailored resume!")
print("=" * 70)