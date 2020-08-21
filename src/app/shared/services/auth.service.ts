import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private currentUser: any;
  // userStatusChanges: Subject<string> = new Subject<string>();

  constructor(private afAuth: AngularFireAuth,
    private afFirestore: AngularFirestore,
    private router: Router) { }

  login(email: string, password: string): void {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(user => {
        this.afFirestore.collection('users').ref.where('id', '==', user.user.uid).onSnapshot(
          snap => {
            snap.forEach(userRef => {
              console.log('userRef', userRef.data());
              this.currentUser = userRef.data();
              if (this.currentUser.role === 'admin' && this.currentUser.access) {
                localStorage.setItem('admin', JSON.stringify(this.currentUser));
                this.router.navigateByUrl('/admin');
              }
              else if (this.currentUser.role === 'user') {
                localStorage.setItem('user', JSON.stringify(this.currentUser));
                this.router.navigateByUrl('/profile');
              }
            });
          }
        );
        // this.afFirestore.collection('users').doc(user.user.uid);
      })
      .catch(err => console.log(err));
  }
  SignOut(): void {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('admin');
      localStorage.removeItem('user');
      this.router.navigateByUrl('home');
    });
  }

  signUp(email: string, password: string, firstName: string, lastName: string): void {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userResponse => {
        const user = {
          id: userResponse.user.uid,
          userEmail: userResponse.user.email,
          userFirstName: firstName,
          userLastName: lastName,
          role: 'user'
        };
        this.afFirestore.collection('users').add(user)
          .then(() => {
            alert('Good register');
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }



}
