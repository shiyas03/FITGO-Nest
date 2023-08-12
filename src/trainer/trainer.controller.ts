import { Body, Controller, Post, UseInterceptors, UploadedFiles, Param, Get, Patch, Query, UploadedFile, Res } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { Register, Trainer } from './trainer.interface';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { cropImage } from '../helpers/multer/multer.config';
import { Response } from 'express';
import { join } from 'path';

@Controller('trainer')
export class TrainerController {

    constructor(private trainerServices: TrainerService) { }

    @Post('login')
    async trainerLogin(@Body() trainerData: Trainer) {
        return this.trainerServices.verifyTrainer(trainerData)
    }

    @Post('register')
    async register(@Body() trainerData: Register) {
        return this.trainerServices.register(trainerData)
    }

    @Post('details')
    @UseInterceptors(FilesInterceptor('details', 10))
    async detailsUpload(@Body('details') details: string[],
        @UploadedFiles() files: Express.Multer.File[],
        @Query('id') id: string) {
        const cv = files[0]
        let certificates = []
        for (let i = 1; i < files.length; i++) {
            certificates.push(files[i])
        }
        return this.trainerServices.detailsUpload(details, cv, certificates, id)
    }

    @Get('access/:id')
    async getAccess(@Param('id') id: string) {
        return this.trainerServices.getAccess(id)
    }

    @Get('fetch/:id')
    async fetchTrainers(@Param('id') id: string) {
        return this.trainerServices.fetchProfileDetails(id)
    }

    @Patch("image")
    @UseInterceptors(FileInterceptor("image"))
    async uplaodProfileImage(
        @Query() id: string,
        @UploadedFile() profile: Express.Multer.File
    ) {
        cropImage(profile, [400, 500])
        return this.trainerServices.uploadProfile(profile, id);
    }

    @Get('fetchAll')
    async fetchAllTrainers() {
        return this.trainerServices.fetchAllTrainers()
    }

    @Patch('approve')
    async approveTrainer(@Body() details: { id: string, approve: boolean }) {
        return this.trainerServices.approveTrainer(details)
    }

    @Get('/documents/:filename')
    async serveFile(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = join(process.cwd(), 'uploads', filename);
        res.sendFile(filePath);
    }

    @Patch('access')
    async updateTrainerAccess(@Body() details: { id: string, access: boolean }) {
        return this.trainerServices.updateTrainerAccess(details)
    }

    @Patch('service')
    async updateServices(@Body() details: { data: string },@Query('id') id:any) {
        return this.trainerServices.updateService(details.data,id)
    }

    @Patch('service_remove')
    async removeServices(@Body() details: { data: string },@Query('id') id:any) {
        return this.trainerServices.removeService(details.data,id)
    }

}
