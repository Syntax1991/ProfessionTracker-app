import type {
  RequestHandler
} from "express";
import { CharacterService } from "./character.service.js";
import {
  characterIdSchema,
  characterInputSchema
} from "./character.validation.js";

export class CharacterController {
  constructor(
    private readonly service:
      CharacterService
  ) {}

  list: RequestHandler = async (
    _request,
    response
  ) => {
    const characters =
      await this.service.list();

    response.json({
      items: characters,
      total: characters.length
    });
  };

  create: RequestHandler = async (
    request,
    response
  ) => {
    const input =
      characterInputSchema.parse(
        request.body
      );

    const character =
      await this.service.create(
        input
      );

    response
      .status(201)
      .json(character);
  };

  update: RequestHandler = async (
    request,
    response
  ) => {
    const characterId =
      characterIdSchema.parse(
        request.params.characterId
      );

    const input =
      characterInputSchema.parse(
        request.body
      );

    const character =
      await this.service.update(
        characterId,
        input
      );

    response.json(character);
  };

  delete: RequestHandler = async (
    request,
    response
  ) => {
    const characterId =
      characterIdSchema.parse(
        request.params.characterId
      );

    await this.service.delete(
      characterId
    );

    response.status(204).send();
  };
}