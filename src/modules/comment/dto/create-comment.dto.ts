import { IsMongoId, IsString, Length, IsInt, Min, Max } from 'class-validator';
import { CreateCommentMessages } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.invalidFormat })
  @Length(5, 1024, { message: CreateCommentMessages.text.lengthField})
  public text!: string;

  @IsInt({ message: CreateCommentMessages.rating.invalidFormat })
  @Min(1, { message: CreateCommentMessages.rating.min })
  @Max(5, { message: CreateCommentMessages.rating.max })
  public rating!: number;

  public userId!: string;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalidFormat })
  public offerId!: string;
}
