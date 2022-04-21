import {
  IsArray,
  IsBoolean,
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

  @IsArray()
  @IsOptional()
  imgUrl?: string[];

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsBoolean()
  @IsOptional()
  activeStatus?: boolean;
}
