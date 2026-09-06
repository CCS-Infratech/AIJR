import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set before creating the first admin."
    );
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, active: true, role: "SUPER_ADMIN" },
    create: { email, passwordHash, role: "SUPER_ADMIN" },
  });

  const eventSeeds = [
    { slug: "community-gathering", title: "Community Gathering", category: "Community", body: "A special gathering bringing members of the community together for meaningful conversations, connection and collective progress.", image: "/images/gallery/4.jpeg", day: 15, month: 7, order: 1 },
    { slug: "youth-development-meet", title: "Youth Development Meet", category: "Youth", body: "An initiative focused on connecting young members and encouraging education, leadership and new opportunities.", image: "/images/gallery/5.jpeg", day: 22, month: 8, order: 2 },
    { slug: "community-celebration", title: "Community Celebration", category: "Celebration", body: "Celebrating our shared identity, traditions and the people who continue to strengthen our community.", image: "/images/gallery/6.jpeg", day: 5, month: 9, order: 3 },
  ];

  for (const event of eventSeeds) {
    const media = await prisma.mediaAsset.upsert({
      where: { storageKey: `seed/event/${event.slug}` },
      update: {},
      create: { storageKey: `seed/event/${event.slug}`, publicUrl: event.image, mediaType: "IMAGE", altText: event.title },
    });
    await prisma.eventNews.upsert({
      where: { slug: event.slug },
      update: {},
      create: { type: "EVENT", title: event.title, slug: event.slug, body: event.body, excerpt: event.body, category: event.category, coverMediaId: media.id, eventStart: new Date(2026, event.month, event.day), featured: true, status: "PUBLISHED", publishedAt: new Date(), sortOrder: event.order },
    });
  }

  const galleryImages = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  for (const [index, image] of galleryImages.entries()) {
    const storageKey = `seed/gallery/${image}`;
    const media = await prisma.mediaAsset.upsert({
      where: { storageKey }, update: {},
      create: { storageKey, publicUrl: `/images/gallery/${image}.jpeg`, mediaType: "IMAGE", altText: `AIJR community gallery image ${image}` },
    });
    const existing = await prisma.galleryItem.findFirst({ where: { mediaId: media.id } });
    if (!existing) await prisma.galleryItem.create({ data: { mediaId: media.id, sortOrder: index + 1, published: true } });
  }

  const leadership = [
    ["Zeeshan Aslam Rayeen", "President", "/images/team/zeesha_aslam_rayeen.jpg"],
    ["Suhail Akram Rayeen", "Senior Vice President", "/images/team/suhain_akram_rayeen.jpeg"],
    ["Faisal Aslam Rayeen", "Vice President", "/images/team/faisal_aslam_rayeen.jpeg"],
    ["Mohd Shariq Rayeen", "General Secretary", "/images/team/mohd_shariq_rayeen.jpeg"],
    ["Mohd Imran Rayeen", "Organizing Secretary", "/images/team/mohd_imran_rayeen.jpeg"],
  ];
  for (const [index, [name, designation, image]] of leadership.entries()) {
    const media = await prisma.mediaAsset.upsert({ where: { storageKey: `seed/team/${index + 1}` }, update: {}, create: { storageKey: `seed/team/${index + 1}`, publicUrl: image, mediaType: "IMAGE", altText: name } });
    const existing = await prisma.leadershipMember.findFirst({ where: { name, designation } });
    if (!existing) await prisma.leadershipMember.create({ data: { name, designation, photoMediaId: media.id, sortOrder: index + 1, active: true } });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    await prisma.$disconnect();
    throw error;
  });
