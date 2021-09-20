import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Tag } from './tags.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  getTags(ids?: number[], options?: FindManyOptions): Promise<Tag[]> {
    return this.tagsRepository.findByIds(ids, options);
  }

  getAllTags(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  create(tag: string): Promise<Tag> {
    return this.tagsRepository.save({ tag: tag });
  }

  async isTagById(id: number): Promise<boolean> {
    const res = await this.tagsRepository.findOne(id);
    return res !== undefined;
  }

  async isTagByName(tagName: string): Promise<boolean> {
    const res = await this.tagsRepository.findOne({ tag: tagName });
    return res !== undefined;
  }

  getTag(id: number): Promise<Tag> {
    return this.tagsRepository.findOne(id);
  }
}
