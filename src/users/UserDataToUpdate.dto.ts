import { ArrayNotEmpty, IsOptional, Length } from 'class-validator';
export class UserDataToUpdateDto {
  @Length(0, 300)
  @IsOptional()
  bio: string | null;

  @ArrayNotEmpty()
  tags: number[];
}
