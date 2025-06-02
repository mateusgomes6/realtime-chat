import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class JoinRoomDto {
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  password?: string;
}