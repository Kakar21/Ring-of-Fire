import { CommonModule } from '@angular/common';
import { Component, Injectable, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, collectionData, addDoc, getDoc, doc } from '@angular/fire/firestore';
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
  pickCardAnimation = false;
  currentCard = '';
  game: Game;
  firestore: Firestore = inject(Firestore);
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
      this.initCurrentGame(params['id']);
    });
  }

  async newGame() {
    console.log(this.game);

  }


  async initCurrentGame(id: string) {
    const docRef = doc(this.firestore, "games", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      this.game.currentPlayer = data['currentPlayer'];
      this.game.playedCards = data['playedCards'];
      this.game.players = data['players'];
      this.game.stack = data['stack'];
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() ?? '';
      this.pickCardAnimation = true;

      console.log('New card:', this.currentCard);
      console.log(this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    }

    setTimeout(() => {
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
