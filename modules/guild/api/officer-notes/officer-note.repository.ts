import { prisma } from "../../../../apps/api/src/infrastructure/database/prismaClient.js";

export type GuildOfficerNoteCreateInput = {
  memberId: string;
  authorCharacter: string;
  body: string;
};

export class GuildOfficerNoteRepository {
  findByMember(
    memberId: string
  ) {
    return prisma.guildOfficerNote.findMany({
      where: {
        memberId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  findById(noteId: string) {
    return prisma.guildOfficerNote.findUnique({
      where: {
        id: noteId
      }
    });
  }

  findMemberById(
    memberId: string
  ) {
    return prisma.guildMember.findUnique({
      where: {
        id: memberId
      }
    });
  }

  create(
    input: GuildOfficerNoteCreateInput
  ) {
    return prisma.guildOfficerNote.create({
      data: input
    });
  }

  delete(noteId: string) {
    return prisma.guildOfficerNote.delete({
      where: {
        id: noteId
      }
    });
  }

  count() {
    return prisma.guildOfficerNote.count();
  }
}
