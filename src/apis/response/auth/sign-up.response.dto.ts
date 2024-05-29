import ResponseDto from "../Response.dto";

export default interface SignUpResponseDto extends ResponseDto {
  email: string;
  password: string;
  nickname: string;
  telNumber:string;
  address: string;
  addressDetail: string|null;
  agreedPersonal: boolean;
}