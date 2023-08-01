import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Trainer } from "../../trainer/schema/trainer.schema";
import { Users } from "../../users/schema/users.schema";

export type WorkoutModel = Document & Workout

@Schema({ collection: "workouts" })
export class Workout {
    @Prop()
    title: string;

    @Prop()
    muscle: string;

    @Prop()
    level: string;

    @Prop()
    reps: number;

    @Prop()
    sets: number;

    @Prop()
    interval: string;

    @Prop()
    duration: string;

    @Prop()
    overview: string;

    @Prop()
    thumbnail: string;

    @Prop()
    video: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Trainer" })
    trainerId: Trainer;
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout)