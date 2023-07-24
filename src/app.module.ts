import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { TrainerModule } from './trainer/trainer.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { BlogsModule } from './blogs/blog.module';
import { JwtMiddleware } from './helpers/middleware/jwt.middleware';
import { JwtModule } from '@nestjs/jwt';



@Module({
  imports: [
    UsersModule,
    TrainerModule,
    BlogsModule,
    AdminModule,
    MongooseModule.forRoot("mongodb://localhost:27017/fitness"),
    MailerModule.forRoot({
      transport:{
        host:'smtp.gmail.com',
        auth:{
          user:'ffitgo@gmail.com',
          pass:'zgccaqpwsjigjykc',
        }
      }
    }),
    JwtModule.register({
      global: true,
      secret: "jwtSecretKey",
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
}) 
export class AppModule {}