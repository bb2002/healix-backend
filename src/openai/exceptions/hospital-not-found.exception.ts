import { NotFoundException } from '@nestjs/common';

export class HospitalNotFoundException extends NotFoundException {
  constructor() {
    super("There's no hospital nearby.");
  }
}
