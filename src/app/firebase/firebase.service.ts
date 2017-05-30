import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { SelectModel } from '../models';

@Injectable()
export class FirebaseService {

  firebaseApp: firebase.app.App;

  constructor() {
    this.firebaseApp = firebase.initializeApp({
      apiKey: 'AIzaSyDmUMBbuXgr4pwlpE3i02QKw2vIdOUcKu4',
      authDomain: 'ng-select2-wrapper-example.firebaseapp.com',
      databaseURL: 'https://ng-select2-wrapper-example.firebaseio.com',
      projectId: 'ng-select2-wrapper-example',
      storageBucket: 'ng-select2-wrapper-example.appspot.com',
      messagingSenderId: '918373600967'
    });
  }

  searchMedia(keyword?: string): Promise<SelectModel[]> {
    return this.searcher('media', keyword) as Promise<SelectModel[]>;
  }

  getMedia(ids?: string[] | string): Promise<SelectModel[]> {
    return this.getter('media', ids) as Promise<SelectModel[]>;
  }

  searchCategory(keyword?: string): Promise<SelectModel[]> {
    return this.searcher('category', keyword) as Promise<SelectModel[]>;
  }

  getCategory(ids?: string[] | string): Promise<SelectModel[]> {
    return this.getter('category', ids) as Promise<SelectModel[]>;
  }

  private searcher(path: string, keyword?: string): PromiseLike<SelectModel[]> {
    return this.firebaseApp.database().ref(path).once('value').then(snapshot => {
      if (snapshot) {
        const media = snapshot.val() as SelectModel[];
        if (keyword) {
          return media.filter(m => m.text.includes(keyword));
        } else {
          return media;
        }
      } else {
        return [];
      }
    });
  }

  private getter(path: string, ids?: string[] | string): PromiseLike<SelectModel[]> {
    return this.firebaseApp.database().ref(path).once('value').then(snapshot => {
      if (snapshot) {
        const media = snapshot.val() as SelectModel[];
        if (ids instanceof Array) {
          return media.filter(m => ids.some(id => id === m.id));
        } else if (typeof ids === 'string') {
          return media.filter(m => m.id === ids);
        } else {
          return [];
        }
      } else {
        return [];
      }
    });
  }

}
