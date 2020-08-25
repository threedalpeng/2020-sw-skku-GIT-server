<template>
  <div class="login">
    <h3>Login Page</h3>
    <img src= "../assets/login_mascot.png">
    <input type= "text" v-model="email" placeholder= "email"><br>
    <input type= "password" @keyup.enter= "Login" v-model="password" placeholder= "password"><br>
    <button v-on:click="login">Login</button><br>
    <router-link to= "/signup"><button>Sign up</button></router-link>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'login',
  data() {
    return{
      email: '',
      password: '',
    }
  },
  methods: {
    login() {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            console.log("####", this);
            return firebase
              .auth()
              .signInWithEmailAndPassword(this.email, this.password);
          })
          .then(() => {
            const user = firebase.auth().currentUser;
            console.log(user);
            alert(`Welcome! ${user.email}`);
            this.$router.push("/video");
          })
          .catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage + errorCode);
          });
    },
  },
};
</script>

<style scoped>
  .login{
    margin-top: 70px;
  }
  h3 {
    text-align: center;
    margin-bottom: 20px;
  }
  img {
    float: left;
    width: 480px;
    height: 400px;
  }
  input {
    margin: 10px 0;
    outline: 2px solid #0055d5;
    width: 20%;
    padding: 15px;
    margin-left: 120px
  }
  button {
    margin-top: 20px;
    width: 10%;
    margin-left: 200px;
    cursor: pointer;
  }
</style>