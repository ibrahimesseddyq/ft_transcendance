import Cookies from 'js-cookie';

export function SetToken(token:string){
    Cookies.set('accessToken', token, { 
    expires: 7, 
    secure: true, 
    sameSite: 'strict' 
  });
}