import { Length, ArrayNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @Length(10, 250)
  title: string;

  @Length(10, 500)
  description: string;

  @ArrayNotEmpty()
  tags: number[];
}
