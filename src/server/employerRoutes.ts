import { db } from './db.ts';

export async function handleGetCompanyProfile(req: Request, userId: string) {
  try {
    const profile = await db.companyProfile.findUnique({
      where: { userId },
      include: {
        jobListings: true,
      }
    });

    if (!profile) {
      return new Response(JSON.stringify({ success: false, error: 'Profile not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, profile }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[JADEER API ERROR] GET /api/employer/profile:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function handleUpdateCompanyProfile(req: Request, userId: string) {
  try {
    const body = await req.json();

    let workModel = undefined;
    if (body.workModel) {
       const wMap: Record<string, string> = {
         'remote': 'REMOTE',
         'hybrid': 'HYBRID',
         'on-site': 'ON_SITE',
       };
       workModel = wMap[body.workModel.toLowerCase()] || 'ON_SITE';
    }

    const data: any = {
      companyName: body.companyName,
      companyInitials: body.companyInitials,
      industry: body.industry,
      companySize: body.companySize,
      location: body.location,
      website: body.website,
      commercialRegistrationNumber: body.commercialRegistrationNumber,
      isCRVerified: body.isCRVerified,
      contactName: body.contactName,
      contactRole: body.contactRole,
    };

    if (workModel) {
       data.workModel = workModel;
    }

    // Clean undefined values
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    const profile = await db.companyProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        companyName: data.companyName || 'Company', // Required by Prisma
        ...data,
      },
    });

    return new Response(JSON.stringify({ success: true, profile }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[JADEER API ERROR] PUT /api/employer/profile:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function handleGetJobListings(req: Request, userId: string) {
  try {
    const profile = await db.companyProfile.findUnique({ where: { userId } });
    if (!profile) return new Response(JSON.stringify({ success: false, error: "Company profile not found" }), { status: 404 });
    const jobs = await db.jobListing.findMany({ where: { companyId: profile.id }, orderBy: { createdAt: "desc" } });
    return new Response(JSON.stringify({ success: true, jobs }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
  }
}

export async function handleCreateJobListing(req: Request, userId: string) {
  try {
    const profile = await db.companyProfile.findUnique({ where: { userId } });
    if (!profile) return new Response(JSON.stringify({ success: false, error: "Company profile not found" }), { status: 404 });
    
    const body = await req.json();

    const trackMap: Record<string, string> = {
      'Frontend Development': 'FRONTEND',
      'Backend Development': 'BACKEND',
      'Full-Stack Engineering': 'FULLSTACK',
      'Mobile Development': 'MOBILE',
      'Data Engineering': 'DATA_ENGINEERING',
      'AI/ML Engineering': 'AI_ML',
      'DevOps / SRE': 'DEVOPS',
      'Cybersecurity': 'CYBERSECURITY',
      'Embedded Systems': 'EMBEDDED_SYSTEMS'
    };

    const levelMap: Record<string, string> = {
      'Internship': 'INTERN',
      'Junior (0-2 years)': 'JUNIOR',
      'Mid-Level (2-5 years)': 'MID_LEVEL'
    };

    const typeMap: Record<string, string> = {
      'Full-Time': 'FULL_TIME',
      'Part-Time': 'PART_TIME',
      'Contract': 'CONTRACT',
      'Freelance': 'FREELANCE',
      'Internship': 'INTERNSHIP'
    };

    const locMap: Record<string, string> = {
      'On-site': 'ON_SITE',
      'Hybrid': 'HYBRID',
      'Remote': 'REMOTE'
    };

    const job = await db.jobListing.create({
      data: {
        companyId: profile.id,
        title: body.title,
        description: body.description,
        requirements: body.requirements || '',
        responsibilities: body.responsibilities || '',
        softwareTrack: (trackMap[body.track] || 'SOFTWARE_ENGINEERING') as any,
        seniorityLevel: (levelMap[body.seniorityLevel] || 'JUNIOR') as any,
        employmentType: (typeMap[body.employmentType] || 'FULL_TIME') as any,
        locationType: (locMap[body.locationType] || 'ON_SITE') as any,
        location: body.location || '',
        skills: body.skills || [],
        status: (body.status === 'Draft' ? 'DRAFT' : 'ACTIVE') as any,
        publishedAt: body.status !== 'Draft' ? new Date() : null,
      }
    });

    return new Response(JSON.stringify({ success: true, job }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error('[JADEER API ERROR] POST /api/employer/jobs:', err);
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
  }
}
