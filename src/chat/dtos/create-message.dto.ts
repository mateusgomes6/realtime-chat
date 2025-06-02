import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  text: string;

}