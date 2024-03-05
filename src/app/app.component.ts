import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from './dialog-add-player/dialog-add-player.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatCardModule, MatIconModule, MatDialogModule, DialogAddPlayerComponent, FormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Ring-of-Fire';
}
