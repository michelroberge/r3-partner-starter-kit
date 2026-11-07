import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// NOSONAR(typescript:S101): the entity-name placeholder in this class name is a
// scaffold token; scaffold-module.cjs substitutes it with a real PascalCase
// entity name (e.g. `CreateWidgetDto`) when this blueprint is copied into a
// generated module.
export class CreateBookmarkDto {
  @ApiProperty({ description: 'Bookmark name', example: 'R3 Platform docs' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Bookmark URL', example: 'https://example.com/docs' })
  @IsUrl()
  url!: string;
}
