import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  PlatformAuthGuard,
  RequireRoleGuard,
  CurrentUser,
  User,
  RequirePermission,
  PermissionGuard,
  CurrentTenant,
  Tenant,
} from '@r3/backend';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@ApiTags('Bookmarks')
@ApiBearerAuth('session-token')
@Controller('bookmarks')
@UseGuards(PlatformAuthGuard, RequireRoleGuard, PermissionGuard)
// NOSONAR(typescript:S101): the module-name placeholder in this class name is a
// scaffold token; scaffold-module.cjs substitutes it with a real PascalCase
// module name (e.g. `WidgetsController`) when this blueprint is copied into a
// generated module.
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @RequirePermission('bookmarks.view')
  @ApiOperation({ summary: 'List bookmarks for current tenant' })
  @ApiResponse({ status: 200, description: 'List of bookmarks' })
  findBookmarks(
    @Query('search') search: string | undefined,
    @CurrentTenant() tenant: Tenant | undefined,
  ) {
    if (!tenant) {
      throw new Error('Tenant context required');
    }
    return this.bookmarksService.findBookmarks(tenant.id, search);
  }

  @Get(':id')
  @RequirePermission('bookmarks.view')
  @ApiOperation({ summary: 'Get Bookmark by ID' })
  @ApiResponse({ status: 200, description: 'Bookmark details' })
  findById(
    @Param('id') id: string,
    @CurrentTenant() tenant: Tenant | undefined,
  ) {
    if (!tenant) {
      throw new Error('Tenant context required');
    }
    return this.bookmarksService.findById(id, tenant.id);
  }

  @Post()
  @RequirePermission('bookmarks.create')
  @ApiOperation({ summary: 'Create a new Bookmark' })
  @ApiResponse({ status: 201, description: 'Bookmark created' })
  create(
    @Body() dto: CreateBookmarkDto,
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant | undefined,
  ) {
    if (!tenant) {
      throw new Error('Tenant context required');
    }
    return this.bookmarksService.createEntity({
      name: dto.name,
      url: dto.url,
      createdById: user.id,
      tenantId: tenant.id,
    });
  }

  @Patch(':id')
  @RequirePermission('bookmarks.update')
  @ApiOperation({ summary: 'Update a Bookmark' })
  @ApiResponse({ status: 200, description: 'Bookmark updated' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBookmarkDto,
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant | undefined,
  ) {
    if (!tenant) {
      throw new Error('Tenant context required');
    }
    return this.bookmarksService.updateEntity({
      id,
      name: dto.name,
      url: dto.url,
      tenantId: tenant.id,
      updatedById: user.id,
    });
  }

  @Delete(':id')
  @RequirePermission('bookmarks.delete')
  @ApiOperation({ summary: 'Delete a Bookmark' })
  @ApiResponse({ status: 200, description: 'Bookmark deleted' })
  delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant | undefined,
  ) {
    if (!tenant) {
      throw new Error('Tenant context required');
    }
    return this.bookmarksService.delete(id, tenant.id, user.id);
  }
}
