import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorisationService implements HttpInterceptor{

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
   //get token 
    let token = localStorage.getItem("token")
   //if  token 
    if(token){
      const clonedReq= req.clone({
        headers: req.headers.set("Authorization","Bearer "+token)
      })
      //forwward to next api
      return next.handle(clonedReq)
    }
   
   //if no token found
   else{
     //forward req token as it is
     return next.handle(req)
   }
  }
}
