import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { cropImage } from "../helpers/multer/multer.config";

@Controller("blogs")
export class BlogsController {
  constructor(private blogServices: BlogsService) { }

  @Post("upload")
  @UseInterceptors(FileInterceptor("details"))
  async uploadBlog(
    @Query() id: string,
    @UploadedFile() details: Express.Multer.File,
    @Body() data: { details: string[] }
  ) {
    cropImage(details, [800, 400])
    return this.blogServices.uploadBlog(data, details, id)
  }

  @Get("fetch")
  async fetchBlogs() {
    return this.blogServices.fetchBlogs();
  }

  @Patch("publish")
  async publishBlogs(@Body() data: { action: boolean }, @Query() id: string) {
    return this.blogServices.publishChanges(data.action, id);
  }

  @Put("update")
  @UseInterceptors(FileInterceptor("details"))
  async updateBlog(
    @Query('id') id: string,
    @UploadedFile() details: Express.Multer.File,
    @Body() data: { details: string[] }
  ) {
    if(details){
      cropImage(details, [800, 400])
    }
    return this.blogServices.updateBlog(data, details, id)
  }
} 
