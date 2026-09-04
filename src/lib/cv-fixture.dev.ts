import type { CandidateCV } from './cv-types';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CV ANALYSIS DEVELOPMENT FIXTURE
   ─────────────────────────────────────────────────────────────────────────
   Representative development fixture matching real parser characteristics:
   - Multiple skill categories with varied depth
   - 3 experience entries with nullable fields and empty arrays
   - 4 projects with mixed URL validity
   - 1 education entry with grade: null and free-form expected date
   - Certifications with nullable credential URLs
   - Languages with varying proficiency
   - Free-form dates ("2026", "Present", "Mar 2023", "Ongoing", etc.)
   - Invalid social links (github: "GitHub", linkedin: "LinkedIn")
   - advanced_self_study is ABSENT (key not present at all)

   This fixture is development-only and must never ship to production.
   ═══════════════════════════════════════════════════════════════════════════ */

export function getDevelopmentCVFixture(): CandidateCV {
  return {
    personal_info: {
      name: 'Khalid Al-Rashidi',
      job_title: 'AI Engineer',
      email: 'khalid.rashidi@outlook.com',
      phone: '+966 50 812 3456',
      locations: ['Riyadh, Saudi Arabia', 'Dhahran'],
      github: 'GitHub',         // Invalid — non-URL text
      linkedin: 'LinkedIn',     // Invalid — non-URL text
      portfolio: null,
      website: null,
    },

    summary:
      'AI and Computer Vision engineer with 2+ years of experience building production ML pipelines, real-time object detection systems, and LLM-powered applications. Strong foundation in deep learning, model optimization, and cloud deployment. Passionate about applying AI to solve real-world challenges in the MENA region.',

    technical_skills: [
      { category: 'Programming Languages', skills: ['Python', 'C++', 'SQL', 'JavaScript', 'Bash'] },
      { category: 'ML & AI Frameworks', skills: ['PyTorch', 'TensorFlow', 'Keras', 'Scikit-learn', 'HuggingFace Transformers', 'LangChain'] },
      { category: 'Computer Vision', skills: ['OpenCV', 'YOLOv8', 'MediaPipe', 'Detectron2', 'Albumentations'] },
      { category: 'DevOps & Cloud', skills: ['Docker', 'AWS EC2', 'AWS S3', 'AWS SageMaker', 'Git', 'Linux', 'MLflow'] },
      { category: 'Databases & Data', skills: ['PostgreSQL', 'MongoDB', 'Pandas', 'NumPy', 'Apache Spark'] },
    ],

    experience: [
      {
        title: 'AI Engineer',
        organization: 'TechVision AI',
        employment_type: 'Full-time',
        location: 'Riyadh, Saudi Arabia',
        start_date: '2025',
        end_date: 'Present',
        summary: 'Building production computer vision pipelines for smart city infrastructure monitoring.',
        responsibilities: [
          'Design and deploy real-time object detection models for traffic monitoring using YOLOv8 and TensorRT',
          'Build end-to-end ML pipelines with automated data preprocessing, training, and model serving',
          'Optimize inference latency from 45ms to 12ms per frame through model quantization and TensorRT conversion',
        ],
        achievements: [
          'Reduced false positive rate by 34% through custom anchor optimization',
          'Deployed 3 production models serving 50K+ daily inference requests',
        ],
        technologies: ['PyTorch', 'YOLOv8', 'TensorRT', 'Docker', 'AWS SageMaker', 'PostgreSQL'],
      },
      {
        title: 'ML Research Assistant',
        organization: 'King Fahd University of Petroleum and Minerals',
        employment_type: 'Part-time',
        location: null,             // Nullable location
        start_date: 'Sep 2024',
        end_date: 'Jun 2025',
        summary: null,              // Nullable summary
        responsibilities: [
          'Conducted research on Arabic NLP models for document understanding and question answering',
          'Fine-tuned transformer models (AraBERT, CAMeL) on custom Arabic datasets',
          'Published internal technical reports on model performance benchmarks',
        ],
        achievements: [],           // Empty achievements array
        technologies: ['HuggingFace Transformers', 'PyTorch', 'Weights & Biases', 'LaTeX'],
      },
      {
        title: 'Data Science Intern',
        organization: 'Saudi Aramco',
        employment_type: 'Internship',
        location: 'Dhahran, Saudi Arabia',
        start_date: 'Jun 2024',
        end_date: 'Aug 2024',
        summary: 'Summer internship in the Digital Transformation division.',
        responsibilities: [
          'Developed predictive maintenance models for industrial equipment using sensor data',
          'Created automated data quality monitoring dashboards',
        ],
        achievements: [
          'Achieved 92% accuracy on equipment failure prediction 48 hours in advance',
        ],
        technologies: [],           // Empty technologies array
      },
    ],

    projects: [
      {
        name: 'Real-Time Traffic Sign Detection System',
        category: 'Computer Vision',
        description: 'End-to-end traffic sign detection and classification system optimized for Saudi road infrastructure. Uses custom-trained YOLOv8 model with Saudi-specific sign categories.',
        summary: null,
        technologies: ['Python', 'YOLOv8', 'OpenCV', 'TensorRT', 'Flask'],
        responsibilities: [
          'Collected and annotated 12,000+ Saudi traffic sign images',
          'Trained custom YOLOv8 model achieving 94.2% mAP@0.5',
          'Deployed real-time inference server handling 30 FPS video streams',
        ],
        achievements: ['Won 2nd place in Saudi AI Challenge 2025 Transportation Track'],
        competition: 'Saudi AI Challenge 2025',
        github_url: 'https://github.com/khalid-r/traffic-sign-detection',
        project_url: null,
      },
      {
        name: 'Arabic Document Q&A with LLM',
        category: 'NLP & LLM',
        description: 'RAG-based question answering system for Arabic legal and regulatory documents using LangChain and GPT-4.',
        summary: null,
        technologies: ['LangChain', 'OpenAI API', 'ChromaDB', 'FastAPI', 'React'],
        responsibilities: [
          'Designed retrieval-augmented generation pipeline with Arabic text chunking',
          'Built vector store with 50K+ document embeddings using Arabic sentence transformers',
        ],
        achievements: [],
        competition: null,
        github_url: 'https://github.com/khalid-r/arabic-qa',
        project_url: 'https://arabic-qa-demo.vercel.app',
      },
      {
        name: 'Medical Image Segmentation Pipeline',
        category: 'Computer Vision',
        description: null,          // Nullable description
        summary: 'U-Net based segmentation pipeline for retinal vessel extraction from fundus images.',
        technologies: ['PyTorch', 'Albumentations', 'OpenCV', 'Weights & Biases'],
        responsibilities: [
          'Implemented attention U-Net architecture with dice loss optimization',
          'Achieved 0.89 IoU score on DRIVE retinal dataset benchmark',
        ],
        achievements: ['Results accepted for presentation at KFUPM Annual Research Day'],
        competition: null,
        github_url: 'GitHub',       // Invalid — non-URL text
        project_url: null,
      },
      {
        name: 'Automated Data Pipeline Orchestrator',
        category: 'Data Engineering',
        description: 'Lightweight ETL orchestration framework for scheduling and monitoring data pipelines.',
        summary: null,
        technologies: [],           // Empty technologies
        responsibilities: [],       // Empty responsibilities
        achievements: [],           // Empty achievements
        competition: null,
        github_url: null,
        project_url: null,
      },
    ],

    education: [
      {
        degree: 'Bachelor of Science in Artificial Intelligence',
        institution: 'King Fahd University of Petroleum and Minerals',
        field_of_study: 'Artificial Intelligence & Machine Learning',
        specialization: 'Computer Vision',
        start_date: '2023',
        end_date: '2027 (Expected)',  // Free-form date with parenthetical
        grade: null,                   // Nullable grade
        description: "Dean's List student with focus on deep learning, computer vision, and natural language processing. Active member of the AI Research Club.",
      },
    ],

    certifications: [
      {
        name: 'Deep Learning Specialization',
        issuer: 'DeepLearning.AI',
        date: '2025',
        credential_id: 'DL-SPEC-2025-KR',
        credential_url: 'https://coursera.org/verify/specialization/DL-SPEC-2025-KR',
      },
      {
        name: 'AWS Machine Learning Specialty',
        issuer: 'Amazon Web Services',
        date: '2024',
        credential_id: 'AWS-MLS-2024',
        credential_url: null,        // Nullable credential URL
      },
      {
        name: 'OpenCV Bootcamp',
        issuer: 'OpenCV University',
        date: 'Mar 2023',            // Free-form date
        credential_id: null,          // Nullable credential ID
        credential_url: null,
      },
    ],

    languages: [
      { language: 'Arabic', proficiency: 'Native' },
      { language: 'English', proficiency: 'Professional Working' },
      { language: 'French', proficiency: 'Elementary' },
    ],

    // NOTE: advanced_self_study is intentionally ABSENT (not an empty array).
    // This tests the defensive `candidateCV.advanced_self_study ?? []` behavior.
    // The UI must still render the Self Study section and allow manual additions.
  };
}
