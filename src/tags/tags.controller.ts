import { Controller, Post, Body, Get } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('api/v1/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async createTag(@Body('tag') tag: string) {
    return this.tagsService.create(tag);
  }

  @Get()
  getAllTags() {
    return this.tagsService.getAllTags();
  }
}
