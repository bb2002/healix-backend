import { BadRequestException } from '@nestjs/common';

export class UnknownDiseaseException extends BadRequestException {
  constructor() {
    super('Failed to examine disease.');
  }
}
