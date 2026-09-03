import { db } from './db.ts';
import { UserRole } from '@prisma/client';

export async function handleGetAdminMetrics(_req: Request, adminUserId: string) {
  try {
    const admin = await db.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 403 });
    }

    const totalUsers = await db.user.count();
    const totalCandidates = await db.user.count({ where: { role: { in: [UserRole.STUDENT, UserRole.GRADUATE] } } });
    const totalEmployers = await db.user.count({ where: { role: UserRole.EMPLOYER } });
    const verifiedEmployers = await db.companyProfile.count({ where: { isCRVerified: true } });
    
    const totalJobListings = await db.jobListing.count();
    const activeJobListings = await db.jobListing.count({ where: { status: 'ACTIVE' } });
    const totalApplications = await db.application.count();

    const metrics = {
      totalUsers,
      totalCandidates,
      totalEmployers,
      verifiedEmployers,
      totalJobListings,
      activeJobListings,
      totalApplications,
      avgTelemetryScore: 85, // Mocked for now
      verificationRate: totalEmployers > 0 ? Math.round((verifiedEmployers / totalEmployers) * 100) : 0,
      totalAssessments: 10,
      activeAssessments: 8,
      totalConsultations: 20,
      upcomingConsultations: 5,
      completedConsultations: 15,
      avgMentorRating: 4.8,
    };

    return new Response(JSON.stringify({ success: true, metrics }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('[JADEER API ERROR] GET /api/admin/metrics:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function handleGetAdminUsers(_req: Request, adminUserId: string) {
  try {
    const admin = await db.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 403 });
    }

    const users = await db.user.findMany({
      include: {
        studentProfile: true,
        companyProfile: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return new Response(JSON.stringify({ success: true, users }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function handleToggleAdminUserStatus(_req: Request, adminUserId: string, targetUserId: string, action: 'active' | 'verified' | 'cr') {
  try {
    const admin = await db.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 403 });
    }

    const target = await db.user.findUnique({ where: { id: targetUserId }, include: { companyProfile: true } });
    if (!target) {
      return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
    }

    if (action === 'active') {
      await db.user.update({ where: { id: targetUserId }, data: { isActive: !target.isActive } });
    } else if (action === 'verified') {
      await db.user.update({ where: { id: targetUserId }, data: { isVerified: !target.isVerified } });
    } else if (action === 'cr' && target.companyProfile) {
      await db.companyProfile.update({ where: { id: target.companyProfile.id }, data: { isCRVerified: !target.companyProfile.isCRVerified } });
    }

    const users = await db.user.findMany({
      include: {
        studentProfile: true,
        companyProfile: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return new Response(JSON.stringify({ success: true, users }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function handleGetAdminJobs(_req: Request, adminUserId: string) {
  try {
    const admin = await db.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 403 });
    }

    const jobs = await db.jobListing.findMany({
      include: {
        company: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return new Response(JSON.stringify({ success: true, jobs }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), { status: 500 });
  }
}
