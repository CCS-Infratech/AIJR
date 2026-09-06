"use server";

import { ContactMessageStatus, MediaType, MembershipStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const value = (data: FormData, key: string) => (typeof data.get(key) === "string" ? String(data.get(key)).trim() : "");
const optional = (data: FormData, key: string) => value(data, key) || null;
const integer = (data: FormData, key: string) => Number(value(data, key) || 0);
const validUrl = (url: string) => { try { return !url || ["http:", "https:"].includes(new URL(url).protocol); } catch { return false; } };

export async function saveGallery(data: FormData) {
  await requireAdmin();
  const id = value(data, "id"); const url = value(data, "url"); const mediaType = value(data, "mediaType");
  if (!url || !validUrl(url) || !["IMAGE", "VIDEO"].includes(mediaType)) redirect(`/admin/gallery${id ? `/${id}/edit` : "/new"}?error=invalid`);
  const eventNewsId = optional(data, "eventNewsId");
  if (eventNewsId && !await prisma.eventNews.findUnique({ where: { id: eventNewsId }, select: { id: true } })) redirect("/admin/gallery?error=invalid");
  const content = { title: optional(data,"title"), caption: optional(data,"caption"), category: optional(data,"category"), eventNewsId, sortOrder: integer(data,"sortOrder"), published: data.get("published") === "on" };
  if (id) {
    const item = await prisma.galleryItem.findUnique({ where: { id }, include: { media: true } }); if (!item) redirect("/admin/gallery?error=not-found");
    await prisma.mediaAsset.update({ where: { id: item.mediaId }, data: { publicUrl: url, mediaType: mediaType as MediaType, altText: content.title, caption: content.caption } });
    await prisma.galleryItem.update({ where: { id }, data: content });
  } else {
    const media = await prisma.mediaAsset.create({ data: { storageKey: `external/gallery/${Date.now()}`, publicUrl: url, mediaType: mediaType as MediaType, altText: content.title, caption: content.caption } });
    await prisma.galleryItem.create({ data: { ...content, mediaId: media.id } });
  }
  redirect("/admin/gallery?saved=1");
}

export async function deleteGallery(data: FormData) { await requireAdmin(); const id = value(data,"id"); if (id) await prisma.galleryItem.delete({ where:{id} }).catch(()=>null); redirect("/admin/gallery?deleted=1"); }

export async function saveLeadership(data: FormData) {
  await requireAdmin(); const id=value(data,"id"), name=value(data,"name"), designation=value(data,"designation"), photoUrl=value(data,"photoUrl");
  if (!name || !designation || !validUrl(photoUrl)) redirect(`/admin/leadership${id ? `/${id}/edit` : "/new"}?error=invalid`);
  const details={ name, designation, bio: optional(data,"bio"), sortOrder: integer(data,"sortOrder"), active: data.get("active") === "on" };
  if (id) { const member=await prisma.leadershipMember.findUnique({where:{id}}); if(!member) redirect("/admin/leadership?error=not-found"); let photoMediaId=member.photoMediaId; if(photoUrl){ const media=photoMediaId ? await prisma.mediaAsset.update({where:{id:photoMediaId},data:{publicUrl:photoUrl,mediaType:MediaType.IMAGE,altText:name}}) : await prisma.mediaAsset.create({data:{storageKey:`external/team/${Date.now()}`,publicUrl:photoUrl,mediaType:MediaType.IMAGE,altText:name}}); photoMediaId=media.id; } await prisma.leadershipMember.update({where:{id},data:{...details,photoMediaId}}); }
  else { const media=photoUrl ? await prisma.mediaAsset.create({data:{storageKey:`external/team/${Date.now()}`,publicUrl:photoUrl,mediaType:MediaType.IMAGE,altText:name}}) : null; await prisma.leadershipMember.create({data:{...details,photoMediaId:media?.id}}); }
  redirect("/admin/leadership?saved=1");
}
export async function deleteLeadership(data: FormData) { await requireAdmin(); const id=value(data,"id"); if(id) await prisma.leadershipMember.delete({where:{id}}).catch(()=>null); redirect("/admin/leadership?deleted=1"); }
export async function updateMembership(data: FormData) { await requireAdmin(); const id=value(data,"id"), status=value(data,"status"); if(id && Object.values(MembershipStatus).includes(status as MembershipStatus)) await prisma.membershipApplication.update({where:{id},data:{status:status as MembershipStatus}}).catch(()=>null); redirect("/admin/membership?saved=1"); }
export async function deleteMembership(data: FormData) { await requireAdmin(); const id=value(data,"id"); if(id) await prisma.membershipApplication.delete({where:{id}}).catch(()=>null); redirect("/admin/membership?deleted=1"); }
export async function updateMessage(data: FormData) { await requireAdmin(); const id=value(data,"id"), status=value(data,"status"); if(id && Object.values(ContactMessageStatus).includes(status as ContactMessageStatus)) await prisma.contactMessage.update({where:{id},data:{status:status as ContactMessageStatus}}).catch(()=>null); redirect("/admin/messages?saved=1"); }
export async function deleteMessage(data: FormData) { await requireAdmin(); const id=value(data,"id"); if(id) await prisma.contactMessage.delete({where:{id}}).catch(()=>null); redirect("/admin/messages?deleted=1"); }
export async function saveSettings(data: FormData) { const user=await requireAdmin(); const entries=["phone","email","address","facebookUrl","instagramUrl","rayeenShadiUrl"]; for(const key of entries){const settingValue=value(data,key); await prisma.siteSetting.upsert({where:{key},update:{value:settingValue, valueType:"text",updatedById:user.id},create:{key,value:settingValue,valueType:"text",updatedById:user.id}});} redirect("/admin/settings?saved=1"); }
