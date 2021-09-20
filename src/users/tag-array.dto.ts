import { ArrayNotEmpty } from 'class-validator';

export class TagArrayDto {
  @ArrayNotEmpty()
  tags: number[];
}
