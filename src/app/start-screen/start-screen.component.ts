import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, collectionData, addDoc, getDoc, doc } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { GameComponent } from '../game/game.component';


@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) {

  }

  async newGame() {
    // Start game
    let game = new Game();
    await addDoc(this.getGamesRef(), game.toJson()).then((gameInfo:any) => {
      this.router.navigateByUrl('/game/' + gameInfo['_key']['path']['segments'][1]);
    });

  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }
}
