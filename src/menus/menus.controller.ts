import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, DefaultValuePipe, ParseFilePipeBuilder, Req, Res } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express"
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('menu')
export class MenusController {
  constructor(private readonly menusService: MenusService) { }

  @Post()
  @UseInterceptors(FileInterceptor('menuImage', {
    storage: diskStorage({
      destination: './files',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      },
    },
    )
  }))
  async create(@Body() createMenuDto: CreateMenuDto, @UploadedFile(new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: "jpg|jpeg|png",
    })
    .addMaxSizeValidator({ maxSize: 3145728 })
    .build({
      fileIsRequired: false,
    }),) menuImage?: Express.Multer.File) {
    try {
      return await this.menusService.create(createMenuDto, menuImage.filename)
    } catch (error) {
      throw error
    }
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('seacrhMenu') seacrhMenu?: string
  ) {
    try {
      return await this.menusService.findAll(page, limit, seacrhMenu);
    } catch (error) {
      throw error
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.menusService.findOne(id);
    } catch (error) {
      throw error
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('menuImage', {
    storage: diskStorage({
      destination: './files',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      },
    },
    )
  }))
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto, @UploadedFile(new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: "jpg|jpeg|png",
    })
    .addMaxSizeValidator({ maxSize: 3145728 })
    .build({
      fileIsRequired: false,
    }),) menuImage?: Express.Multer.File) {
    try {
      return await this.menusService.update(id, updateMenuDto);
    } catch (error) {
      throw error
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.menusService.remove(id);
    } catch (error) {
      throw error
    }
  }

  @Get('image/:imageName')
  invoke(@Req() req, @Res() res) {
    return res.sendFile(req.params['imageName'], { root: 'files' });
  }
}
