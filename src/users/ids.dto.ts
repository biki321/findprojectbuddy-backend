import { ArrayNotEmpty } from 'class-validator';

export class IdsDto {
  @ArrayNotEmpty()
  ids: number[];
}
