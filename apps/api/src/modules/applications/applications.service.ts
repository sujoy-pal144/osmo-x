import { Injectable } from '@nestjs/common';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApplicationInput } from './dto/create-application.input';
import { ServerApiKeysService } from '../server-api-keys/server-api-keys.service';
import { UsersService } from '../users/users.service';
import { Status, UserRoles } from 'src/common/constants/database';
import { ApplicationResponse } from './dto/application-response.dto';
import { QueryOptionsDto } from 'src/common/graphql/dtos/query-options.dto';
import { CoreService } from 'src/common/graphql/services/core.service';

@Injectable()
export class ApplicationsService extends CoreService<Application> {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    private readonly serverApiKeysService: ServerApiKeysService,
    private readonly usersService: UsersService,
  ) {
    super(applicationsRepository);
  }

  async findById(applicationId: number): Promise<Application | undefined> {
    return this.applicationsRepository.findOne({ where: { applicationId, status: Status.ACTIVE } });
  }

  async findByUserId(userId: number): Promise<Application | undefined> {
    return this.applicationsRepository.findOne({ where: { userId, status: Status.ACTIVE } });
  }

  async createApplication(
    applicationInput: CreateApplicationInput,
    authorizationHeader: Request,
  ): Promise<Application> {
    const isAdmin = await this.checkAdminUser(authorizationHeader);

    if (!isAdmin) {
      throw new Error('Access Denied. Not an ADMIN.');
    }

    const userExists = await this.usersService.findByUserId(applicationInput.userId);

    if (!userExists) {
      throw new Error('This user does not exist.');
    }

    const application = this.applicationsRepository.create(applicationInput);
    return this.applicationsRepository.save(application);
  }

  async checkAdminUser(authHeader: Request): Promise<boolean> {
    try {
      const bearerToken = authHeader.toString();
      let apiKeyToken = null;

      if (bearerToken.startsWith('Bearer ')) {
        apiKeyToken = bearerToken.substring(7);
      } else {
        throw new Error('Invalid bearer token format');
      }

      // Find the related server api key entry
      const apiKeyEntry = await this.serverApiKeysService.findByServerApiKey(apiKeyToken);
      // Find the related application entry
      const applicationEntry = await this.findById(apiKeyEntry.applicationId);
      // Find the related user entry
      const userEntry = await this.usersService.findByUserId(applicationEntry.userId);

      // Check if ADMIN
      if (userEntry.userRole === UserRoles.ADMIN) {
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    }
  }

  async getAllApplications(
    options: QueryOptionsDto,
    authorizationHeader: Request,
  ): Promise<ApplicationResponse> {
    const isAdmin = await this.checkAdminUser(authorizationHeader);

    if (!isAdmin) {
      throw new Error('Access Denied. Not an ADMIN.');
    }

    const baseConditions = [];
    const searchableFields = ['name'];

    const { items, total } = await super.findAll(
      options,
      'application',
      searchableFields,
      baseConditions,
    );
    return new ApplicationResponse(items, total, options.offset, options.limit);
  }
}
