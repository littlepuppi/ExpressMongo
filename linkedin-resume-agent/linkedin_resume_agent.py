import os
import json
import re
from dataclasses import dataclass
from typing import List, Dict, Optional
from datetime import datetime

@dataclass
class Experience:
    title: str
    company: str
    duration: str
    responsibilities: List[str]
    achievements: List[str]

@dataclass
class Education:
    degree: str
    institution: str
    year: str
    details: Optional[str] = None

@dataclass
class UserProfile:
    name: str
    email: str
    phone: str
    location: str
    linkedin: str
    summary: str
    experiences: List[Experience]
    education: List[Education]
    skills: List[str]
    certifications: List[str]
    projects: List[Dict[str, str]]

class LinkedInResumeAgent:
    def __init__(self, user_profile: UserProfile):
        self.profile = user_profile
    
    def extract_keywords(self, job_description: str) -> Dict[str, List[str]]:
        """Extract key requirements and skills from job description"""
        jd_lower = job_description.lower()
        
        # Common skill patterns
        technical_skills = []
        soft_skills = []
        
        # Technical skills keywords
        tech_keywords = ['python', 'java', 'javascript', 'react', 'node.js', 'sql', 'aws', 
                        'docker', 'kubernetes', 'machine learning', 'ai', 'data analysis',
                        'tensorflow', 'pytorch', 'git', 'agile', 'scrum', 'rest api',
                        'microservices', 'cloud', 'azure', 'gcp', 'ci/cd', 'devops']
        
        soft_keywords = ['leadership', 'communication', 'teamwork', 'problem solving',
                        'analytical', 'creative', 'collaborative', 'strategic thinking',
                        'project management', 'mentoring', 'cross-functional']
        
        for skill in tech_keywords:
            if skill in jd_lower:
                technical_skills.append(skill)
        
        for skill in soft_keywords:
            if skill in jd_lower:
                soft_skills.append(skill)
        
        # Extract years of experience required
        experience_match = re.search(r'(\d+)\+?\s*years?', jd_lower)
        years_required = experience_match.group(1) if experience_match else None
        
        # Extract education requirements
        education_keywords = ['bachelor', 'master', 'phd', 'degree', 'bs', 'ms', 'mba']
        education_required = any(keyword in jd_lower for keyword in education_keywords)
        
        return {
            'technical_skills': technical_skills,
            'soft_skills': soft_skills,
            'years_required': years_required,
            'education_required': education_required,
            'full_text': job_description
        }
    
    def match_skills(self, required_skills: List[str]) -> List[str]:
        """Match user skills with job requirements"""
        user_skills_lower = [skill.lower() for skill in self.profile.skills]
        matched = []
        
        for req_skill in required_skills:
            for user_skill in self.profile.skills:
                if req_skill.lower() in user_skill.lower() or user_skill.lower() in req_skill.lower():
                    if user_skill not in matched:
                        matched.append(user_skill)
        
        return matched
    
    def tailor_summary(self, job_keywords: Dict[str, List[str]]) -> str:
        """Generate a tailored professional summary"""
        matched_tech = self.match_skills(job_keywords['technical_skills'])
        
        # Create focused summary highlighting relevant skills
        summary_parts = [self.profile.summary.split('.')[0]]
        
        if matched_tech:
            skills_str = ', '.join(matched_tech[:5])
            summary_parts.append(f"Specialized in {skills_str}")
        
        if job_keywords['years_required']:
            summary_parts.append(f"with extensive experience delivering impactful solutions")
        
        return '. '.join(summary_parts) + '.'
    
    def tailor_experience(self, job_keywords: Dict[str, List[str]]) -> List[Experience]:
        """Prioritize and tailor experience entries based on job requirements"""
        tailored = []
        required_skills_lower = [s.lower() for s in job_keywords['technical_skills'] + job_keywords['soft_skills']]
        
        for exp in self.profile.experiences:
            # Score each experience based on keyword matches
            score = 0
            relevant_responsibilities = []
            relevant_achievements = []
            
            for resp in exp.responsibilities:
                resp_lower = resp.lower()
                if any(skill in resp_lower for skill in required_skills_lower):
                    relevant_responsibilities.append(resp)
                    score += 2
            
            for ach in exp.achievements:
                ach_lower = ach.lower()
                if any(skill in ach_lower for skill in required_skills_lower):
                    relevant_achievements.append(ach)
                    score += 3
            
            if score > 0 or len(tailored) < 3:  # Include at least 3 experiences
                # Keep most relevant items, max 4 responsibilities and 2 achievements
                tailored_exp = Experience(
                    title=exp.title,
                    company=exp.company,
                    duration=exp.duration,
                    responsibilities=relevant_responsibilities[:4] if relevant_responsibilities else exp.responsibilities[:3],
                    achievements=relevant_achievements[:2] if relevant_achievements else exp.achievements[:2]
                )
                tailored.append((score, tailored_exp))
        
        # Sort by relevance score and return top experiences
        tailored.sort(key=lambda x: x[0], reverse=True)
        return [exp for score, exp in tailored[:4]]
    
    def generate_resume_text(self, job_description: str) -> str:
        """Generate complete tailored resume in text format"""
        keywords = self.extract_keywords(job_description)
        tailored_summary = self.tailor_summary(keywords)
        tailored_experiences = self.tailor_experience(keywords)
        matched_skills = self.match_skills(keywords['technical_skills'] + keywords['soft_skills'])
        
        # Build resume
        resume = []
        resume.append(f"{self.profile.name.upper()}")
        resume.append("=" * len(self.profile.name))
        resume.append(f"{self.profile.email} | {self.profile.phone} | {self.profile.location}")
        resume.append(f"LinkedIn: {self.profile.linkedin}\n")
        
        resume.append("PROFESSIONAL SUMMARY")
        resume.append("-" * 50)
        resume.append(f"{tailored_summary}\n")
        
        resume.append("CORE COMPETENCIES")
        resume.append("-" * 50)
        # Prioritize matched skills
        priority_skills = matched_skills[:8] if matched_skills else self.profile.skills[:8]
        other_skills = [s for s in self.profile.skills if s not in priority_skills][:4]
        all_display_skills = priority_skills + other_skills
        resume.append(" • ".join(all_display_skills) + "\n")
        
        resume.append("PROFESSIONAL EXPERIENCE")
        resume.append("-" * 50)
        for exp in tailored_experiences:
            resume.append(f"\n{exp.title}")
            resume.append(f"{exp.company} | {exp.duration}")
            
            if exp.responsibilities:
                for resp in exp.responsibilities:
                    resume.append(f"  • {resp}")
            
            if exp.achievements:
                resume.append("  Key Achievements:")
                for ach in exp.achievements:
                    resume.append(f"    ◦ {ach}")
        
        resume.append("\n\nEDUCATION")
        resume.append("-" * 50)
        for edu in self.profile.education:
            resume.append(f"{edu.degree} - {edu.institution} ({edu.year})")
            if edu.details:
                resume.append(f"  {edu.details}")
        
        if self.profile.certifications:
            resume.append("\n\nCERTIFICATIONS")
            resume.append("-" * 50)
            for cert in self.profile.certifications:
                resume.append(f"  • {cert}")
        
        if self.profile.projects:
            resume.append("\n\nKEY PROJECTS")
            resume.append("-" * 50)
            for project in self.profile.projects[:2]:  # Show top 2 projects
                resume.append(f"  • {project['name']}: {project['description']}")
        
        return "\n".join(resume)
    
    def generate_resume_json(self, job_description: str) -> Dict:
        """Generate tailored resume in JSON format for ATS systems"""
        keywords = self.extract_keywords(job_description)
        tailored_summary = self.tailor_summary(keywords)
        tailored_experiences = self.tailor_experience(keywords)
        matched_skills = self.match_skills(keywords['technical_skills'] + keywords['soft_skills'])
        
        return {
            "personal_info": {
                "name": self.profile.name,
                "email": self.profile.email,
                "phone": self.profile.phone,
                "location": self.profile.location,
                "linkedin": self.profile.linkedin
            },
            "summary": tailored_summary,
            "skills": matched_skills[:12] if matched_skills else self.profile.skills[:12],
            "experience": [
                {
                    "title": exp.title,
                    "company": exp.company,
                    "duration": exp.duration,
                    "responsibilities": exp.responsibilities,
                    "achievements": exp.achievements
                } for exp in tailored_experiences
            ],
            "education": [
                {
                    "degree": edu.degree,
                    "institution": edu.institution,
                    "year": edu.year,
                    "details": edu.details
                } for edu in self.profile.education
            ],
            "certifications": self.profile.certifications,
            "projects": self.profile.projects[:2]
        }


# Example Usage
if __name__ == "__main__":
    # Sample user profile
    sample_profile = UserProfile(
        name="Jane Smith",
        email="jane.smith@email.com",
        phone="(555) 123-4567",
        location="San Francisco, CA",
        linkedin="linkedin.com/in/janesmith",
        summary="Results-driven Software Engineer with 6+ years of experience building scalable applications. Passionate about solving complex problems with innovative solutions",
        experiences=[
            Experience(
                title="Senior Software Engineer",
                company="Tech Corp",
                duration="2021 - Present",
                responsibilities=[
                    "Developed microservices architecture using Python and Docker, improving system scalability by 40%",
                    "Led team of 5 engineers in implementing CI/CD pipelines with Jenkins and AWS",
                    "Designed and built REST APIs serving 1M+ daily requests",
                    "Collaborated with product managers to define technical requirements"
                ],
                achievements=[
                    "Reduced deployment time by 60% through automation",
                    "Mentored 3 junior developers, 2 promoted within 1 year"
                ]
            ),
            Experience(
                title="Software Engineer",
                company="StartUp Inc",
                duration="2019 - 2021",
                responsibilities=[
                    "Built full-stack web applications using React and Node.js",
                    "Implemented machine learning models for customer segmentation",
                    "Optimized database queries reducing load time by 50%",
                    "Participated in Agile sprints and code reviews"
                ],
                achievements=[
                    "Launched feature that increased user engagement by 35%",
                    "Won company hackathon for innovative AI solution"
                ]
            )
        ],
        education=[
            Education(
                degree="Bachelor of Science in Computer Science",
                institution="University of California",
                year="2019",
                details="GPA: 3.8/4.0, Dean's List"
            )
        ],
        skills=["Python", "Java", "JavaScript", "React", "Node.js", "AWS", "Docker", 
                "Kubernetes", "SQL", "MongoDB", "Machine Learning", "REST APIs", 
                "Git", "Agile", "Problem Solving", "Leadership"],
        certifications=["AWS Certified Solutions Architect", "Certified Scrum Master"],
        projects=[
            {
                "name": "E-commerce Platform",
                "description": "Built scalable e-commerce platform handling 10K concurrent users using microservices"
            },
            {
                "name": "AI Chatbot",
                "description": "Developed NLP-powered customer service chatbot reducing support tickets by 30%"
            }
        ]
    )
    
    # Sample job description
    job_description = """
    Senior Software Engineer
    
    We're seeking a talented Senior Software Engineer with 5+ years of experience to join our team.
    
    Requirements:
    - 5+ years of experience in software development
    - Strong proficiency in Python and JavaScript
    - Experience with AWS cloud services and Docker
    - Knowledge of microservices architecture
    - Experience with CI/CD pipelines
    - Strong problem-solving and leadership skills
    - Bachelor's degree in Computer Science or related field
    
    Responsibilities:
    - Design and implement scalable backend services
    - Lead technical projects and mentor junior engineers
    - Collaborate with cross-functional teams
    - Optimize application performance
    """
    
    # Create agent and generate tailored resume
    agent = LinkedInResumeAgent(sample_profile)
    
    print("TAILORED RESUME")
    print("=" * 70)
    tailored_resume = agent.generate_resume_text(job_description)
    print(tailored_resume)
    
    print("\n\n" + "=" * 70)
    print("JSON FORMAT (for ATS systems)")
    print("=" * 70)
    json_resume = agent.generate_resume_json(job_description)
    print(json.dumps(json_resume, indent=2))