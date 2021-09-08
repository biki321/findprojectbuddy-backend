import { IsEmail } from 'class-validator';
export class CreateUserDto {
  id: number;

  handle: string;

  name: string;

  githubId: number;

  githubUrl: string;

  @IsEmail()
  email: string;

  avatar: string;
}
