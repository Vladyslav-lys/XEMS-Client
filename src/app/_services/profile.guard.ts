import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';

@Injectable({providedIn: 'root'})
export class ProfileGuard implements CanActivate {
  constructor(
    private access: AuthenticationService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
      if (this.access.getAccessProfile()) {
        return true;
      } else {
        this.router.navigate(['/'], {
          queryParams: {
            access: false
          }
        });
      }
  }
}