import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [EventModule, SyncModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
