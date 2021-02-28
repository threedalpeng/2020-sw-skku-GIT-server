<template>
<!-- this file manages signup page -->
    <div class= "signup">
        <p>Make an account</p>
        <input type= "text" v-model="email" placeholder="email"><br>
        <input type= "password" v-model="password" placeholder= "password"><br>
        <input type= "text" v-model="nickname" placeholder="nickname"><br>
        <button v-on:click="signUp">Sign Up!</button>
        <router-link to= "/"><button> Go back to Login</button></router-link>
    </div>
</template>

<script>
// import * as firebase from 'firebase/app';
// import 'firebase/auth';
import axios from 'axios';
import router from 'router'

export default {
    name: 'signup',
    data() {
        return {
            email: '',
            password: '',
            nickname: ''
        }
    },
    methods: {
        // signUp() {
        //     console.log('Login!');
        //     firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        //     .then(
        //         function(user) {
        //             alert('your account created!' + user.message)
        //             this.$router.replace('/')
        //         },
        //         function(err) {
        //             alert('에러 :' + err.message)
        //         }
        //      );
        // }
        signUp() {
            axios.post('api/auth/register', {
                email: this.email,
                password: this.password,
                nickname: this.nickname
            }).then((res)=>{
                this.$router.push("/");
            }).catch(function(err) {
                alert(`유저 등록에 실패하였습니다.`)
            });
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