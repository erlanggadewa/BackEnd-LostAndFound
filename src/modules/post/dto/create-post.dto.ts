import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

enum TypePost {
  Lost = 'Lost',
  Found = 'Found',
}

enum SocialMediaType {
  WhatsApp = 'WhatsApp',
  Line = 'Line',
  Instagram = 'Instagram',
}
export class CreatePostDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  typePost: TypePost;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  chronology?: string;

  @IsString()
  @IsNotEmpty()
  socialMediaType: SocialMediaType;

  @IsString()
  @IsNotEmpty()
  socialMedia: string;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsDate()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  activeStatus?: boolean;
}
