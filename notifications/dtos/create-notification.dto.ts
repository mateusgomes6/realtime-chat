import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  type?: string; 

  @IsString()
  @IsOptional()
  metadata?: any;
}