import { db } from './db.ts';

export async function handleGetCandidateProfile(req: Request, userId: string) {
  try {
    const profile = await db.studentProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        applications: true,
        assessmentSubmissions: true,
      }
    });

    if (!profile) {
      return new Response(JSON.stringify({ success: false, error: 'Profile not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const profileWithEmail = { ...profile, email: profile.user?.email || null }; return new Response(JSON.stringify({ success: true, profile: profileWithEmail }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[JADEER API ERROR] GET /api/candidate/profile:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function handleUpdateCandidateProfile(req: Request, userId: string) {
  try {
    const body = await req.json();
    
    // Convert softwareTrack to Prisma enum if needed
    let softwareTrack = undefined;
    if (body.track) {
      const mapped = {
        'Frontend Development': 'FRONTEND',
        'Backend Development': 'BACKEND',
        'Full-Stack Engineering': 'FULLSTACK',
        'Mobile Development': 'MOBILE',
        'Data Engineering': 'DATA_ENGINEERING',
        'AI/ML Engineering': 'AI_ML',
        'DevOps / SRE': 'DEVOPS',
        'Cybersecurity': 'CYBERSECURITY',
        'Embedded Systems': 'EMBEDDED_SYSTEMS'
      }[body.track as string] || 'SOFTWARE_ENGINEERING';
      softwareTrack = mapped;
    }

    const data: any = {
      fullName: body.fullName,
      university: body.university,
      graduationYear: body.graduationYear ? parseInt(body.graduationYear, 10) : undefined,
      bio: body.bio,
      title: body.title,
      skills: body.skills,
      githubUrl: body.githubUrl,
      linkedinUrl: body.linkedinUrl,
      portfolioUrl: body.portfolioUrl,
      city: body.location, // Mapping location to city
      degree: body.degree,
      gpa: body.gpa,
      startDate: body.startDate,
      endDate: body.endDate,
    };

    if (body.resumeFileName) {
      data.resumeUrl = body.resumeFileName;
    }

    if (softwareTrack) {
      data.softwareTrack = softwareTrack;
    }

    // Clean undefined values
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    // Upsert the profile (if it doesn't exist, create it)
    const profile = await db.studentProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        fullName: data.fullName || 'Candidate', // Required by Prisma
        ...data,
      },
      include: {
        user: true,
      },
    });

    const profileWithEmail = { ...profile, email: profile.user?.email || null }; return new Response(JSON.stringify({ success: true, profile: profileWithEmail }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[JADEER API ERROR] PUT /api/candidate/profile:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
