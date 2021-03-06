import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile, ProfileDocument } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FilterParam } from '../base-repository/pagination.params';

describe('ProfileService', () => {
  let profileService: ProfileService;
  let profileRepository : ProfileRepository
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileService,
        {
          provide : ProfileRepository , useFactory : ()=>({
            save : jest.fn(()=>{}),
            findOne : jest.fn(()=>{}),
            findOneAndUpdate : jest.fn(()=>{}),
            remove : jest.fn(()=>{}),
            findOneAndExlcude : jest.fn(()=>{}),
            findOneAndUpdateExclude : jest.fn(()=>{}),
            find : jest.fn(()=>{})
          })
        }
      ],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    profileRepository = module.get<ProfileRepository>(ProfileRepository)
  });

  describe('it called profileService.create',()=>{
    it('should called profileRepository.save' ,async()=>{
      const createProfileDto : CreateProfileDto = new CreateProfileDto()
      createProfileDto.email = "mock email"
      createProfileDto.fullName = "mock fullname"
      createProfileDto.isVerified = true
      createProfileDto.password = "123"
      createProfileDto.phoneNumber = "password"
      const result = await profileService.create(createProfileDto)
      expect(profileRepository.save).toHaveBeenCalledWith({hashedPassword : createProfileDto.password ,...createProfileDto})
    })
  })

  describe('it called profileService.findOneByEmail' , ()=>{
    it('should called profileRepository.findOne' ,async()=>{
      const profile = new Profile()
      const email = "mock email"
      jest.spyOn(profileRepository , "findOne").mockResolvedValue(profile as ProfileDocument)
      const result = await profileService.findOneByEmail(email)
      expect(profileRepository.findOne).toHaveBeenCalledWith({email : email , isActive : true})
      expect(result).toEqual(profile)
    })
  })

  describe('it called profileService.update' , ()=>{
    it('should called profilerepository.findOneAndUpdateExlude' , async()=>{
      const id = ""
      const updateProfileDto = new UpdateProfileDto()
      updateProfileDto.password = "123"
      const result = await profileService.update(id , updateProfileDto)
      expect(profileRepository.findOneAndUpdateExclude).toHaveBeenCalledWith({_id : id} ,{hashedPassword:updateProfileDto.password ,...updateProfileDto})
    })
  })

  describe('it called profileService.findOne',()=>{
    it('should called profileRepository.findOneAndExclude',async ()=>{
      const id = ""
      const profile = new Profile()
      jest.spyOn(profileRepository , "findOneAndExlcude").mockResolvedValue(profile as ProfileDocument)
      const result = await profileService.findOne(id)
      expect(profileRepository.findOneAndExlcude).toHaveBeenCalledWith({_id : id , isActive : true})
      expect(result).toEqual(profile)
    })
  })


  describe('it called profileService.findAll',()=>{
    it('should called profileRepository.find',async ()=>{
      const filterParam = new FilterParam()
      const findProfile : Profile[] = []
      jest.spyOn(profileRepository , "find").mockResolvedValue(findProfile as ProfileDocument[])
      const result = await profileService.findAll(filterParam)
      expect(profileRepository.find).toHaveBeenCalledWith({isActive : true} , filterParam)
      expect(result).toEqual(findProfile)
    })
  })

 

});
