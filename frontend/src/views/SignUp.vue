<template>
    <div class= "signup">
        <p>make an account</p>
        <input type= "text" v-model="email" placeholder="email"><br>
        <input type= "password" v-model="password" placeholder= "password"><br>
        <button v-on:click="signUp">Sign Up!</button>
        <router-link to= "/"><button> Go back to Login</button></router-link>
    </div>
</template>

<script>
import firebase from 'firebase'
import router from 'router'
export default {
    name: 'signup',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        signUp() {
            console.log('반갑다');
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(
                function(user) {
                    alert('your account created!' + user.message)
                    this.$router.replace('/')
                },
                function(err) {
                    alert('에러 :' + err.message)
                }
             );
        }
    }
}
</script>

<style scoped>
    .signup{
        text-align: center;
        margin-top: 40px;
    }
    input {
        outline: 2px solid #0055d5;
        margin: 10px 0;
        width: 20%;
        padding: 15px;
    }
    button {
        
        margin-top: 20px;
        width: 10%;
        cursor: pointer;
    }
    p {
        margin-top: 40px;
        font-size: 20px;
    }
    span {
        display: block;
        margin-top: 20px;
        font-size: 15px;
    }
</style>