import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private readonly httpClient: HttpClient) { }

  getTestAccounts() {
    return this.httpClient.get<Profile[]>('https://icherniakov.ru/yt-course/account/test_accounts')
  }

  getMe() {
    return this.httpClient.get<Profile>('https://icherniakov.ru/yt-course/account/me')

  }
}
