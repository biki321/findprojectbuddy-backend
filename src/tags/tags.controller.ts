import { Controller, Post, Body } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async createTag(@Body('tag') tag: string) {
    return this.tagsService.create(tag);
  }
}
