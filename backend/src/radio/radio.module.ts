import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RadioController } from './radio.controller';
import { RadioService } from './radio.service';
import { RadioBrowserService } from './radio-browser.service';
import { RadioStation } from './entities/radio-station.entity';
import { RadioSearchManager } from './radio-search.manager';
import { RadioProviderRegistry } from './radio-provider.registry';
import { RadioBrowserProvider } from './providers/radio-browser.provider';
import { RadioNetProvider } from './providers/radionet.provider';
import { ShoutcastProvider } from './providers/shoutcast.provider';
import radioConfig from '../config/radio.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([RadioStation]),
    ConfigModule.forFeature(radioConfig),
  ],
  controllers: [RadioController],
  providers: [
    RadioService,
    RadioBrowserService, // Keep for backward compatibility
    RadioSearchManager,
    RadioProviderRegistry,
    RadioBrowserProvider,
    RadioNetProvider,
    ShoutcastProvider,
  ],
  exports: [RadioService, RadioSearchManager], // Export for future modules
})
export class RadioModule {}
