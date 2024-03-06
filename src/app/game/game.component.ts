import { CommonModule } from '@angular/common';
import { Component, Injectable, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, collectionData, onSnapshot, addDoc, getDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { StartScreenComponent } from '../start-screen/start-screen.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, GameInfoComponent, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  game: Game;
  firestore: Firestore = inject(Firestore);
  gameId = '';
  unsubGames: any;
  // items$: Observable<any[]>;
  // items;


  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.game = new Game();
    this.newGame();


    // this.items$ = collectionData(this.getGamesRef());
    // this.items = this.items$.subscribe((list) => {
    //   list.forEach(element => {
    //     console.log(element);
    //   });
    // });
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.unsubGames = onSnapshot(doc(this.firestore, "games", this.gameId), { includeMetadataChanges: true }, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          this.game.currentPlayer = data['currentPlayer'];
          this.game.playedCards = data['playedCards'];
          this.game.players = data['players'];
          this.game.stack = data['stack'];
          this.game.pickCardAnimation = data['pickCardAnimation'];
          this.game.currentCard = data['currentCard'];
        }
      });
    });
  }

  ngonDestroy() {
    this.unsubGames();
  }

  async newGame() {
    console.log(this.game);

  }

  async saveGame() {
    await updateDoc(this.getGamesDocRef(this.gameId), this.game.toJson());
  }

  getGamesDocRef(id: string) {
    return doc(this.firestore, 'games', id);
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() ?? '';
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
    }

    setTimeout(() => {
      this.game.playedCards.push(this.game.currentCard);
      this.game.pickCardAnimation = false;
      this.saveGame();
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }
}
