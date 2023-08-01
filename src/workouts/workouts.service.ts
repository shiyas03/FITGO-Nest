import { Injectable } from '@nestjs/common';
import { WorkoutModel } from './schema/workouts.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Workout } from './workouts.interface';

@Injectable()
export class WorkoutsService {

    constructor(@InjectModel("Workouts") private workoutModel: Model<WorkoutModel>) { }

    async uploadWorkout(details: string[], files: Express.Multer.File[], id: string): Promise<boolean> {
        try {
            const objectId = new mongoose.Types.ObjectId(id);
            const newWorkout = new this.workoutModel({
                title: details[0],
                muscle: details[1],
                level: details[2],
                reps: details[3],
                sets: details[4],
                interval: details[5],
                duration: details[6],
                overview: details[7],
                video: files[0].filename,
                thumbnail: files[1].filename,
                trainerId: objectId
            })
            await newWorkout.save()
            return true
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async fetchWorkouts(): Promise<Workout[]> {
        try {
            const data = <Workout[]>(await this.workoutModel.find({}, { __v: 0 }).populate("trainerId"))
            return data ? data : []
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }
}