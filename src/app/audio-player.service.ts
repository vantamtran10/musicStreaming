import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import {BehaviorSubject, Observable} from 'rxjs';
import playerModel from './models/playerModel';
import musicModel from "./models/musicModel";
import {SongService} from "./song.service";


@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  isPlay = false;
  audioPlayer:any = null;

  musicObj = [{
    name: '',
    singer: '',
    album: '',
  }];

  private _isAudioPlay: BehaviorSubject<playerModel> = new BehaviorSubject<playerModel>({} as any);
  isAudioPlay$: Observable<playerModel> = this._isAudioPlay.asObservable();
  musicCurrentLive$ = new BehaviorSubject<any>(null);
  constructor() {
  }

  playMusic(link: string): void {
    if (this.audioPlayer != null){
      this.audioPlayer.stop();
      this.isPlay = false;
    }
    this.audioPlayer = new Howl({
      src: [link],
      html5: true,
      loop: true,
      preload: true,
      onplay: function() {
        console.log('Play...!');

      },
      onplayerror : function() {
        console.log('Error!');
      },
      onend: function() {
        console.log('Finished!');
      }
    });

    this.audioPlayer.play();
    this.isPlay = true;
    this._isAudioPlay.next({isPlay: this.isPlay, current: link});

  }


  playAllMusic(songLst: []): void{

    if (this.audioPlayer != null){
      this.audioPlayer.stop();
      this.isPlay = false;
    }
    this.audioPlayer = new Howl({
      src: songLst,
      html5: true,
    });
    this.audioPlayer.play();
    this.isPlay = true;
    this._isAudioPlay.next({isPlay: this.isPlay});
  }

  stopSong(): void{
    this.audioPlayer.stop();
  }

  playSong(): void{
    if (this.audioPlayer != null){
      this.audioPlayer.play();
    }
  }

  storeCurrentSongLive(songName: string, songSinger: string, songAlbum: string ){
    this.musicObj[0].name = songName;
    this.musicObj[0].singer = songSinger;
    this.musicObj[0].album = songAlbum;

    this.musicCurrentLive$.next(this.musicObj)
  }

  playNext(currentLink: string | undefined, listLink: musicModel[]): void{
    let arr: string[]=[];
    let nextLink : string = '';
    listLink.forEach(item => {
      arr.push(item.link);
      if (currentLink != undefined && arr.length > 0){
        let curr = arr.indexOf(currentLink);
        if (curr < arr.length-1){
          nextLink = arr[++curr];
          this.playMusic(nextLink);
        }

      }
    });
    listLink.forEach(item => {
      if (item.link == nextLink){
        this.musicObj[0].name = item.name;
        this.musicObj[0].singer = item.singer;
        this.musicObj[0].album = item.album;
        this.musicCurrentLive$.next(this.musicObj);
      }
    });
  }

  playPrev(currentLink: string | undefined, listLink: musicModel[]): void{
    let arr: string[]=[];
    let nextLink : string = '';
    listLink.forEach(item => {
      arr.push(item.link);
      if (currentLink != undefined && arr.length > 0){
        let curr = arr.indexOf(currentLink);
        if (curr > 0){
          nextLink = arr[--curr];
          this.playMusic(nextLink);
        }
      }
    });
    listLink.forEach(item => {
      if (item.link == nextLink){
        this.musicObj[0].name = item.name;
        this.musicObj[0].singer = item.singer;
        this.musicObj[0].album = item.album;
        this.musicCurrentLive$.next(this.musicObj);
      }
    });
  }
}
