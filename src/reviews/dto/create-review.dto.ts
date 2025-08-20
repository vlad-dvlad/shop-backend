import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Review comment is required' })
  @IsString({ message: 'Comment must be a string' })
  @MaxLength(1000, { message: 'Comment cannot exceed 1000 characters' })
  comment: string;

  @IsNotEmpty({ message: 'Review mark is required' })
  @IsInt({ message: 'Mark must be an integer' })
  @Min(1, { message: 'Mark must be at least 1' })
  @Max(5, { message: 'Mark cannot exceed 5' })
  mark: number;
}
