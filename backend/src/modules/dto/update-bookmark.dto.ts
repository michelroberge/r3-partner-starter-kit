import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// NOSONAR(typescript:S101): the entity-name placeholder in this class name is a
// scaffold token; scaffold-module.cjs substitutes it with a real PascalCase
// entity name (e.g. `UpdateWidgetDto`) when this blueprint is copied into a
// generated module.
export class UpdateBookmarkDto {
  @ApiPropertyOptional({ description: 'Bookmark name', example: 'Updated Bookmark' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Bookmark URL', example: 'https://example.com/docs' })
  @IsUrl()
  @IsOptional()
  url?: string;
}
