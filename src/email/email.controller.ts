import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(private readonly email:EmailService){}
   
   
    @Post('sendemail')
   
    async sendWelcomemail(@Body() data:{email:string}){
        await this.email.sendWelcomeMail(data.email);
        console.log("mail")
        return{ message:'Welcome mail sent' }

        
        
    }
}
