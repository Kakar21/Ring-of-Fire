import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
  items$: Observable<any[]>;

  constructor(public dialog: MatDialog) {
    this.game = new Game();
    this.newGame();
    const aCollection = this.getGamesRef();
    this.items$ = collectionData(aCollection);
    this.items$.subscribe((game) => {
      console.log('Game update', game);
    });
  }

  async newGame() {
    console.log(this.game);
    await addDoc(this.getGamesRef(), this.game.toJson());
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
