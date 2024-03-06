import { Controller, Post, Get, Query } from '@nestjs/common';
import {
  //ApiBody,
  ApiOperation,
  ApiQuery,
  //ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private blockchainService: BlockchainService) {}

  @ApiTags('Deploy Contract')
  @ApiOperation({
    description: 'Deploy contrato padrão',
  })
  @Post('deploy-factory')
  async deployFactory() {
    return await this.blockchainService.deployToken();
  }

  @ApiTags('Dados do contrato')
  @ApiOperation({
    description: 'Consulta Supply Total do Contrato',
  })
  @ApiQuery({
    name: 'tokenAddress',
    description: 'Endereço do contrato',
    required: true,
  })
  @Get('total-supply')
  async getTotalSupply(@Query('tokenAddress') address: string) {
    return await this.blockchainService.getTotalSupply(address);
  }

  @ApiTags('Dados do contrato')
  @ApiOperation({
    description: 'Consulta o nome do Contrato',
  })
  @ApiQuery({
    name: 'tokenAddress',
    description: 'Endereço do contrato',
    required: true,
  })
  @Get('name')
  async getName(@Query('tokenAddress') address: string) {
    return await this.blockchainService.getContractName(address);
  }

  @ApiTags('Dados do contrato')
  @ApiOperation({
    description: 'Consulta o simbolo do Contrato',
  })
  @ApiQuery({
    name: 'tokenAddress',
    description: 'Endereço do contrato',
    required: true,
  })
  @Get('symbol')
  async getSymbol(@Query('tokenAddress') address: string) {
    return await this.blockchainService.getSymbol(address);
  }

  @ApiTags('Dados do contrato')
  @ApiOperation({
    description: 'Consulta o decimals do Contrato',
  })
  @ApiQuery({
    name: 'tokenAddress',
    description: 'Endereço do contrato',
    required: true,
  })
  @Get('decimals')
  async getDecimals(@Query('tokenAddress') address: string) {
    return await this.blockchainService.getDecimals(address);
  }

  @ApiTags('Saldo de Carteira')
  @ApiOperation({
    description: 'Consulta o saldo de uma carteira',
  })
  @ApiQuery({
    name: 'tokenAddress',
    description: 'Endereço do contrato',
    required: true,
  })
  @ApiQuery({
    name: 'userAddress',
    description: 'Endereço do usuário',
    required: true,
  })
  @Get('balance-of')
  async getBalance(
    @Query('tokenAddress') tokenAddress: string,
    @Query('userAddress') userAddress: string,
  ) {
    return await this.blockchainService.getBalanceOf(tokenAddress, userAddress);
  }

  @ApiTags('Criar tokens')
  @ApiOperation({
    description: 'Cria novos tokens na carteira de destino',
  })
  @ApiQuery({
    name: 'tokenAddress',
    description: 'Endereço do contrato',
    required: true,
  })
  @ApiQuery({
    name: 'qtd',
    description: 'Quantidade de tokens criados',
    required: true,
  })
  @Post('mint')
  async mint(
    @Query('tokenAddress') tokenAddress: string,
    @Query('qtd') qtd: string,
  ) {
    return await this.blockchainService.mintToken(tokenAddress, qtd);
  }

  @ApiTags('Destruir tokens')
  @ApiOperation({
    description: 'Destruir tokens na carteira de destino',
  })
  @ApiQuery({
    name: 'tokenAddress',
    description: 'Endereço do contrato',
    required: true,
  })
  @ApiQuery({
    name: 'qtd',
    description: 'Quantidade de tokens criados',
    required: true,
  })
  @Post('burn')
  async burn(
    @Query('tokenAddress') tokenAddress: string,
    @Query('qtd') qtd: string,
  ) {
    return await this.blockchainService.burnToken(tokenAddress, qtd);
  }

  @ApiTags('Transferência de tokens')
  @ApiOperation({
    description: 'Transferência de tokens para uma nova carteira',
  })
  @ApiQuery({
    name: 'tokenAddress',
    description: 'Endereço do contrato',
    required: true,
  })
  @ApiQuery({
    name: 'qtd',
    description: 'Quantidade de tokens transferidos',
    required: true,
  })
  @ApiQuery({
    name: 'userAddress',
    description: 'Endereço de destino',
    required: true,
  })
  @Post('transfer')
  async transfer(
    @Query('tokenAddress') tokenAddress: string,
    @Query('qtd') qtd: string,
    @Query('userAddress') userAddress: string,
  ) {
    return await this.blockchainService.transferToken(
      tokenAddress,
      userAddress,
      qtd,
    );
  }
}
