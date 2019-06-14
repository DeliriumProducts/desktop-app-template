import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';

const config = {
  apiKey: 'AIzaSyBv3coYY3Irf3Yzmlfq5bf2GVGc1EUSD4I',
  authDomain: 'frontend-template-48f7f.firebaseapp.com',
  databaseURL: 'https://frontend-template-48f7f.firebaseio.com',
  projectId: 'frontend-template-48f7f',
  storageBucket: 'frontend-template-48f7f.appspot.com',
  messagingSenderId: '1084133495005',
  appId: '1:1084133495005:web:511af036f252e7de'
};

class Firebase {
  constructor() {
    // https://github.com/zeit/next.js/issues/1999
    if (!app.apps.length) {
      app.initializeApp(config);
      this.auth = app.auth();
      this.db = app.firestore();
      this.providers = {
        google: new app.auth.GoogleAuthProvider()
      };
    }
  }

  async register(name, email, password) {
    return this.auth.currentUser.updateProfile({
      displayName: name
    });
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  loginWithPopup(provider) {
    if (this.providers[provider]) {
      return this.auth.signInWithPopup(this.providers[provider]);
    }
  }

  logout() {
    return this.auth.signOut();
  }

  isInitialized() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  getCurrentUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName;
  }
}

export default new Firebase();
