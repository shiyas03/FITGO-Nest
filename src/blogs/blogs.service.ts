import { Injectable } from "@nestjs/common";
import { BlogModel } from "./schema/blog.schema";
import mongoose, { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Blogs } from "./blog.interface";

@Injectable()
export class BlogsService {
  constructor(@InjectModel("Blogs") private blogModel: Model<BlogModel>) { }

  async uploadBlog(
    data: { details: string[] },
    details: Express.Multer.File,
    id: string
  ): Promise<{ success: true }> {
    try {
      const title = data.details[0];
      const category = data.details[1];
      const blog = data.details[2];
      const objectId = new mongoose.Types.ObjectId(id);
      const newBlog = new this.blogModel({
        title: title,
        category: category,
        blog: blog,
        template: details.filename,
        trainerId: objectId,
        publishedDate: Date.now()
      });
      await newBlog.save();
      return { success: true };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async updateBlog(
    data: { details: string[] },
    details: Express.Multer.File,
    id: string
  ): Promise<boolean> {
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      const update = await this.blogModel.findOneAndUpdate({ _id: objectId }, {
        $set: {
          title: data.details[0],
          category: data.details[1],
          blog: data.details[2],
        }
      })
      if (details) {
        await this.blogModel.findOneAndUpdate({ _id: objectId }, {
          $set: {
            template: details.filename
          }
        })
      }
      if (update) {
        return true 
      }
      return false
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async fetchBlogs(): Promise<Blogs[]> {
    try {
      const data = <Blogs[]>(
        await this.blogModel
          .find({}, { __v: 0 })
          .populate("trainerId")
      );
      return data ? data : [];
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async publishChanges(
    action: boolean,
    id: string
  ): Promise<{ success: boolean }> {
    try {
      const objectId = new mongoose.Types.ObjectId(id);
      const data = await this.blogModel.findOneAndUpdate(
        { _id: objectId },
        {
          $set: { approve: action, publishedDate: Date.now() },
        }
      );
      return data ? { success: true } : { success: false };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }


}
