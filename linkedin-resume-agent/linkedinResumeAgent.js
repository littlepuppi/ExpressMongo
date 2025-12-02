const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } = require('docx');

class Experience {
    constructor(title, company, duration, responsibilities, achievements) {
        this.title = title;
        this.company = company;
        this.duration = duration;
        this.responsibilities = responsibilities;
        this.achievements = achievements;
    }
}

class Education {
    constructor(degree, institution, year, details = null) {
        this.degree = degree;
        this.institution = institution;
        this.year = year;
        this.details = details;
    }
}

class UserProfile {
    constructor(name, email, phone, location, linkedin, summary, experiences, education, skills, certifications, projects) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.linkedin = linkedin;
        this.summary = summary;
        this.experiences = experiences;
        this.education = education;
        this.skills = skills;
        this.certifications = certifications;
        this.projects = projects;
    }
}

class LinkedInResumeAgent {
    constructor(userProfile) {
        this.profile = userProfile;
    }

    extractKeywords(jobDescription) {
        const jdLower = jobDescription.toLowerCase();
        const technicalSkills = [];
        const softSkills = [];

        const techKeywords = [
            'python', 'java', 'javascript', 'react', 'node.js', 'sql', 'aws', 'docker', 'kubernetes',
            'machine learning', 'ai', 'data analysis', 'tensorflow', 'pytorch', 'git', 'agile', 
            'scrum', 'rest api', 'microservices', 'cloud', 'azure', 'gcp', 'ci/cd', 'devops', 
            'tableau', 'power bi', 'excel', 'bloomberg', 'portfolio management', 'financial analysis', 
            'investment', 'etl', 'capiq', 'crm', 'r', 'vba', 'macros', 'operations', 'compliance',
            'reporting', 'dashboard', 'data visualization', 'performance metrics'
        ]; 
        
        const softKeywords = [
            'leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 'creative', 
            'collaborative', 'strategic thinking', 'project management', 'mentoring', 'cross-functional', 
            'client relationship', 'detail-oriented', 'organized', 'resourceful', 'efficient'
        ];

        techKeywords.forEach(skill => {
            if (jdLower.includes(skill)) {
                technicalSkills.push(skill);
            }
        });

        softKeywords.forEach(skill => {
            if (jdLower.includes(skill)) {
                softSkills.push(skill);
            }
        });

        const experienceMatch = jdLower.match(/(\d+)\+?\s*years?/);
        const yearsRequired = experienceMatch ? experienceMatch[1] : null;

        return {
            technical: technicalSkills,
            soft: softSkills,
            yearsRequired: yearsRequired
        };
    }

    matchSkills(jobKeywords) {
        const userSkillsLower = this.profile.skills.map(skill => skill.toLowerCase());
        const matchedSkills = [];

        jobKeywords.technical.forEach(skill => {
            if (userSkillsLower.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))) {
                const originalSkill = this.profile.skills.find(s => 
                    s.toLowerCase().includes(skill) || skill.includes(s.toLowerCase())
                );
                if (originalSkill && !matchedSkills.includes(originalSkill)) {
                    matchedSkills.push(originalSkill);
                }
            }
        });

        jobKeywords.soft.forEach(skill => {
            if (userSkillsLower.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))) {
                const originalSkill = this.profile.skills.find(s => 
                    s.toLowerCase().includes(skill) || skill.includes(s.toLowerCase())
                );
                if (originalSkill && !matchedSkills.includes(originalSkill)) {
                    matchedSkills.push(originalSkill);
                }
            }
        });

        return matchedSkills;
    }

    calculateYearsOfExperience() {
        let totalMonths = 0;
        
        this.profile.experiences.forEach(exp => {
            if (exp.duration) {
                const duration = exp.duration.toLowerCase();
                
                if (duration.includes('present')) {
                    const startMatch = duration.match(/(\d{2})\/(\d{4})/);
                    if (startMatch) {
                        const startDate = new Date(startMatch[2], startMatch[1] - 1);
                        const now = new Date();
                        const months = (now.getFullYear() - startDate.getFullYear()) * 12 + 
                                      (now.getMonth() - startDate.getMonth());
                        totalMonths += months;
                    }
                } else {
                    const dateMatch = duration.match(/(\d{2})\/(\d{4})\s*-\s*(\d{2})\/(\d{4})/);
                    if (dateMatch) {
                        const startDate = new Date(dateMatch[2], dateMatch[1] - 1);
                        const endDate = new Date(dateMatch[4], dateMatch[3] - 1);
                        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                                      (endDate.getMonth() - startDate.getMonth());
                        totalMonths += months;
                    }
                }
            }
        });
        
        return Math.round(totalMonths / 12);
    }

    tailorSummary(jobKeywords) {
        const matchedSkills = this.matchSkills(jobKeywords);
        const topSkills = matchedSkills.slice(0, 5).join(', ');
        const yearsOfExperience = this.calculateYearsOfExperience();
        
        return `${this.profile.summary.split('.')[0]}. Specialized in ${topSkills} with ${yearsOfExperience}+ years of experience delivering impactful solutions.`;
    }

    rankExperiences(jobKeywords) {
        const rankedExperiences = this.profile.experiences.map(exp => {
            let relevanceScore = 0;
            const expText = `${exp.title} ${exp.responsibilities.join(' ')} ${exp.achievements.join(' ')}`.toLowerCase();

            jobKeywords.technical.forEach(keyword => {
                if (expText.includes(keyword)) {
                    relevanceScore += 2;
                }
            });

            jobKeywords.soft.forEach(keyword => {
                if (expText.includes(keyword)) {
                    relevanceScore += 1;
                }
            });

            return { ...exp, relevanceScore };
        });

        return rankedExperiences.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    generateResumeText(jobDescription) {
        const keywords = this.extractKeywords(jobDescription);
        const tailoredSummary = this.tailorSummary(keywords);
        const matchedSkills = this.matchSkills(keywords);
        const rankedExperiences = this.rankExperiences(keywords);

        let resumeText = `${this.profile.name.toUpperCase()}\n${'='.repeat(10)}\n`;
        resumeText += `${this.profile.email} | ${this.profile.phone} | ${this.profile.location}\n`;
        resumeText += `LinkedIn: ${this.profile.linkedin}\n\n`;

        resumeText += `PROFESSIONAL SUMMARY\n${'-'.repeat(50)}\n`;
        resumeText += `${tailoredSummary}\n\n`;

        resumeText += `CORE COMPETENCIES\n${'-'.repeat(50)}\n`;
        resumeText += `${matchedSkills.slice(0, 10).join(' • ')}\n\n`;

        resumeText += `PROFESSIONAL EXPERIENCE\n${'-'.repeat(50)}\n`;
        rankedExperiences.forEach(exp => {
            resumeText += `\n${exp.title}\n`;
            resumeText += `${exp.company} | ${exp.duration}\n`;
            exp.responsibilities.forEach(resp => {
                resumeText += `  • ${resp}\n`;
            });
            if (exp.achievements && exp.achievements.length > 0) {
                resumeText += `  Key Achievements:\n`;
                exp.achievements.forEach(ach => {
                    resumeText += `    ◦ ${ach}\n`;
                });
            }
            resumeText += '\n';
        });

        resumeText += `\nEDUCATION\n${'-'.repeat(50)}\n`;
        this.profile.education.forEach(edu => {
            resumeText += `${edu.degree} - ${edu.institution} (${edu.year})\n`;
            if (edu.details) {
                resumeText += `  ${edu.details}\n`;
            }
        });

        if (this.profile.certifications && this.profile.certifications.length > 0) {
            resumeText += `\n\nCERTIFICATIONS\n${'-'.repeat(50)}\n`;
            this.profile.certifications.forEach(cert => {
                resumeText += `  • ${cert}\n`;
            });
        }

        if (this.profile.projects && this.profile.projects.length > 0) {
            resumeText += `\n\nKEY PROJECTS\n${'-'.repeat(50)}\n`;
            this.profile.projects.forEach(proj => {
                resumeText += `  • ${proj.name}: ${proj.description}\n`;
            });
        }

        return resumeText;
    }

    generateResumeJSON(jobDescription) {
        const keywords = this.extractKeywords(jobDescription);
        const tailoredSummary = this.tailorSummary(keywords);
        const matchedSkills = this.matchSkills(keywords);
        const rankedExperiences = this.rankExperiences(keywords);

        return {
            personal_info: {
                name: this.profile.name,
                email: this.profile.email,
                phone: this.profile.phone,
                location: this.profile.location,
                linkedin: this.profile.linkedin
            },
            summary: tailoredSummary,
            skills: matchedSkills.slice(0, 10),
            experience: rankedExperiences.map(exp => ({
                title: exp.title,
                company: exp.company,
                duration: exp.duration,
                responsibilities: exp.responsibilities,
                achievements: exp.achievements
            })),
            education: this.profile.education,
            certifications: this.profile.certifications,
            projects: this.profile.projects
        };
    }

    async generateResumeWord(jobDescription, filename) {
        const keywords = this.extractKeywords(jobDescription);
        const tailoredSummary = this.tailorSummary(keywords);
        const matchedSkills = this.matchSkills(keywords);
        const rankedExperiences = this.rankExperiences(keywords);

        const sections = [];

        // Header - Name
        sections.push(
            new Paragraph({
                text: this.profile.name.toUpperCase(),
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
            })
        );

        // Contact Info
        sections.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: `${this.profile.email} | ${this.profile.phone} | ${this.profile.location}`,
                        size: 20
                    })
                ],
                spacing: { after: 100 }
            })
        );

        sections.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: `LinkedIn: ${this.profile.linkedin}`,
                        size: 20
                    })
                ],
                spacing: { after: 300 }
            })
        );

        // Professional Summary
        sections.push(
            new Paragraph({
                text: "PROFESSIONAL SUMMARY",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 }
            })
        );

        sections.push(
            new Paragraph({
                text: tailoredSummary,
                spacing: { after: 300 }
            })
        );

        // Core Competencies
        sections.push(
            new Paragraph({
                text: "CORE COMPETENCIES",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 }
            })
        );

        sections.push(
            new Paragraph({
                text: matchedSkills.slice(0, 10).join(' • '),
                spacing: { after: 300 }
            })
        );

        // Professional Experience
        sections.push(
            new Paragraph({
                text: "PROFESSIONAL EXPERIENCE",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 }
            })
        );

        rankedExperiences.forEach(exp => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: exp.title,
                            bold: true,
                            size: 24
                        })
                    ],
                    spacing: { before: 100, after: 50 }
                })
            );

            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${exp.company} | ${exp.duration}`,
                            italics: true,
                            size: 22
                        })
                    ],
                    spacing: { after: 100 }
                })
            );

            // Combine responsibilities and achievements into one bullet list
            const allBullets = [...exp.responsibilities, ...(exp.achievements || [])];

            allBullets.forEach(item => {
              sections.push(
                new Paragraph({
                  text: item,
                  bullet: { level: 0 },
                  spacing: { after: 50 }
          })
    );
});

            sections.push(new Paragraph({ text: "", spacing: { after: 100 } }));
        });

        // Education
        sections.push(
            new Paragraph({
                text: "EDUCATION",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 100 }
            })
        );

        this.profile.education.forEach(edu => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${edu.degree}`,
                            bold: true
                        })
                    ],
                    spacing: { after: 50 }
                })
            );

            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${edu.institution} (${edu.year})`,
                            italics: true
                        })
                    ],
                    spacing: { after: 50 }
                })
            );

            if (edu.details) {
                sections.push(
                    new Paragraph({
                        text: edu.details,
                        spacing: { after: 100 }
                    })
                );
            }
        });

        // Certifications
        if (this.profile.certifications && this.profile.certifications.length > 0) {
            sections.push(
                new Paragraph({
                    text: "CERTIFICATIONS",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 200, after: 100 }
                })
            );

            this.profile.certifications.forEach(cert => {
                sections.push(
                    new Paragraph({
                        text: cert,
                        bullet: { level: 0 },
                        spacing: { after: 50 }
                    })
                );
            });
        }

        // Projects
        if (this.profile.projects && this.profile.projects.length > 0) {
            sections.push(
                new Paragraph({
                    text: "KEY PROJECTS",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 200, after: 100 }
                })
            );

            this.profile.projects.forEach(proj => {
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${proj.name}: `,
                                bold: true
                            }),
                            new TextRun({
                                text: proj.description
                            })
                        ],
                        bullet: { level: 0 },
                        spacing: { after: 50 }
                    })
                );
            });
        }

        const doc = new Document({
            sections: [{
                properties: {},
                children: sections
            }]
        });

        const buffer = await Packer.toBuffer(doc);
        fs.writeFileSync(filename, buffer);
        console.log(`\nWord document saved to ${filename}`);
    }
}

function loadResumeFromJSON(filename) {
    try {
        const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
        
        const experiences = data.experience.map(exp => 
            new Experience(
                exp.title,
                exp.company,
                exp.duration,
                exp.responsibilities,
                exp.achievements
            )
        );
        
        const education = data.education.map(edu => 
            new Education(
                edu.degree,
                edu.institution,
                edu.year,
                edu.details
            )
        );
        
        return new UserProfile(
            data.personal_info.name,
            data.personal_info.email,
            data.personal_info.phone,
            data.personal_info.location,
            data.personal_info.linkedin,
            data.summary,
            experiences,
            education,
            data.skills,
            data.certifications,
            data.projects
        );
    } catch (error) {
        console.error('Error loading resume from JSON:', error);
        throw error;
    }
}

if (require.main === module) {
    const emilyProfile = loadResumeFromJSON('Emily_Lam_Tailored_Resume.json');
    
    const jobDescription = `
    Senior Data Analyst / Investment Operations Analyst
    
    We're seeking a talented professional with 5+ years of experience in financial services and data analysis.
    
    Requirements:
    - 5+ years of experience in investment operations or financial analysis
    - Strong proficiency in Python, SQL, and Excel
    - Experience with portfolio management and performance reporting
    - Knowledge of financial data analysis and visualization tools (Tableau, Power BI)
    - Experience with CRM systems and client relationship management
    - Strong problem-solving and analytical skills
    - Bachelor's degree in Finance, Business, or related field
    - Series 7 and 63 licenses preferred
    
    Responsibilities:
    - Analyze portfolio performance metrics and create comprehensive reports
    - Develop automated solutions using SQL and Excel macros
    - Collaborate with portfolio managers on customized reporting
    - Create dashboards for operational efficiency
    - Streamline client communications and onboarding processes
  `;
    
    const agent = new LinkedInResumeAgent(emilyProfile);
    
    console.log("TAILORED RESUME FOR EMILY LAM");
    console.log("=".repeat(70));
    const tailoredResume = agent.generateResumeText(jobDescription);
    console.log(tailoredResume);
    
    console.log("\n\n" + "=".repeat(70));
    console.log("JSON FORMAT (for ATS systems)");
    console.log("=".repeat(70));
    const jsonResume = agent.generateResumeJSON(jobDescription);
    console.log(JSON.stringify(jsonResume, null, 2));
    
    // Save all formats
    fs.writeFileSync('Emily_Lam_Tailored_Resume_Output.txt', tailoredResume);
    fs.writeFileSync('Emily_Lam_Tailored_Resume_Output.json', JSON.stringify(jsonResume, null, 2));
    
    // Generate Word document
    agent.generateResumeWord(jobDescription, 'Emily_Lam_Tailored_Resume_Output.docx')
        .then(() => {
            console.log("\n✅ All resume formats generated successfully!");
            console.log("   - Text: Emily_Lam_Tailored_Resume_Output.txt");
            console.log("   - JSON: Emily_Lam_Tailored_Resume_Output.json");
            console.log("   - Word: Emily_Lam_Tailored_Resume_Output.docx");
        })
        .catch(err => {
            console.error("Error generating Word document:", err);
        });
}

module.exports = { LinkedInResumeAgent, UserProfile, Experience, Education, loadResumeFromJSON };