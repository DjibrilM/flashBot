import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chats/chat.module';


@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.DATA_URL), auth, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
