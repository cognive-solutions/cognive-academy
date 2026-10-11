import { prisma } from "@/lib/prisma";

import SuccessStoriesClient from "./success-stories-client";

export const revalidate = 300;

export default async function SuccessStoriesPage() {
  const learnerPlacedCount = await prisma.user.count({
    where: {
      role: "STUDENT",
    },
  });

  return <SuccessStoriesClient learnerPlacedCount={learnerPlacedCount} />;
}
