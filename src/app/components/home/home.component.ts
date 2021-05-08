import { Component, OnInit } from '@angular/core';
import {SongFavouriteService} from '../../song-favourite.service';
import {AudioPlayerService} from '../../audio-player.service';
import musicModel from "../../models/musicModel";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  favouriteSongList: any = [];
  songList: any = [];
  isshowPlayer: boolean = false;
  songs :musicModel[] = [];

  constructor(private favouriteSong: SongFavouriteService, private audioPlayerService : AudioPlayerService) {
    this.favouriteSong.getfavouriteSong().subscribe( response => {
      this.favouriteSongList = response;
      this.songs = response as musicModel[];
      for (let item of this.favouriteSongList){
        this.songList.push(item.link);
      }

    });

  }

  playMusic(link: string, songTitle: string, songSinger: string, songAlbum: string): void{
    this.audioPlayerService.playMusic(link);
    this.isshowPlayer = true;

    this.audioPlayerService.storeCurrentSongLive(songTitle, songSinger, songAlbum);
  }

  playAllMusic(): void{
    console.log(this.songList)
    this.audioPlayerService.playAllMusic(this.songList);
    this.isshowPlayer = true;
  }

  ngOnInit() {

  }
}
