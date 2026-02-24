import Cookies from 'js-cookie';

export function SetToken(token:string){
    Cookies.set('auth_token', token, { 
    expires: 7, 
    secure: true, 
    sameSite: 'strict' 
  });
}