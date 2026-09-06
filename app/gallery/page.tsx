import { prisma } from "@/lib/prisma";
import PublicGallery from "@/components/PublicGallery";
export const dynamic = "force-dynamic";
export default async function GalleryPage(){const items=await prisma.galleryItem.findMany({where:{published:true},include:{media:{select:{publicUrl:true,altText:true,caption:true,mediaType:true}}},orderBy:[{sortOrder:"asc"},{createdAt:"asc"}]});return <PublicGallery items={items.filter(i=>i.media.publicUrl).map(i=>({id:i.id,url:i.media.publicUrl!,alt:i.media.altText||i.title||"AIJR community gallery image",type:i.media.mediaType}))}/>}
