import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('NestJS TypeORM Muutaa Mono API')
    .setContact(
      'Muutaa Inc.',
      'https://muutaa.com/contact-us/',
      'contact@muutaa.com',
    )
    // .setTermsOfService('https://muutaa.com/legal/')
    .setDescription(
      'Healthcare supply chain management and analytics platform.',
    )
    .setLicense('MUUTAA .INC', 'https://muutaa.com/legal/')
    .setVersion('1.1.0')
    // .addTag('Real-Time Analytics')
    .addTag('Authentication')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
}
