import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth';   // ← .service ajouté (souvent la cause)
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-auth-left',
  imports: [],
  templateUrl: './auth-left.html',
  styleUrls: ['./auth-left.scss']
})
export class AuthLeft {

}
