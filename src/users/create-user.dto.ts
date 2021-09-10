import { IsEmail } from 'class-validator';
export class CreateUserDto {
  handle: string;

  name: string;

  githubId: number;

  githubUrl: string;

  @IsEmail()
  email: string;

  avatar: string;
}
