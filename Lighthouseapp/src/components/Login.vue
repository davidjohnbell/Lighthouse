<template>
<v-container fill-height justify-center align-center >
    <v-flex xs12 sm3>
        <v-card>
            <v-card-title class="primary">
                <h4 style="color:white">Enter Your Credentials</h4>
            </v-card-title>
            <v-card-text>
                <v-layout row>
                    <v-flex xs8>
                        <v-text-field class="input-group--focused" v-model="userId" label="user name" value="Input text"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs8>
                        <v-text-field class="input-group--focused"  type="password" v-model="pass" label="password" value="Input text"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click.stop="dialog2 = !dialog2">Register</v-btn>
                    <v-btn color="primary" @click="login">login</v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
    <v-flex xs12 sm3>
        <v-dialog v-model="dialog2" max-width="500px">
            <v-card>
            <v-card-title class="primary">
                <h4 style="color:white">Register as a New User</h4>
            </v-card-title>
            <v-card-text>
                <v-layout row>
                    <v-flex xs8>
                        <v-text-field class="input-group--focused" v-model="userId" label="user name" value="Input text"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs8>
                        <v-text-field class="input-group--focused" type="password" v-model="pass" label="password" value="Input text"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs8>
                        <v-text-field class="input-group--focused" type="password" v-model="pass2" label="confirm password" value="Input text"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                    <v-btn block color="success"
                    :loading="loading"
                    @click.native="loader = 'loading'"
                    @click="register"
                    :disabled="loading">Register</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-flex>
</v-container>
</template>

<script>
import ServerApi from './ServerApi';

export default {
    data () {
        return {
            userId: 'David Bell',
            pass: 'Password',
            pass2: 'Password',
            error: false,
            text: '',
            dialog2: false,
            loader: null,
            loading: false
        }
    },
    watch: {
        loader() {
            const loader = this.loader;
            this[loader] = !this[loader];
            setTimeout(() => (this[loader] = false), 3000);
        }
    },
    methods: {
        async login () {
            let api = new ServerApi('https://lightengineapp.azurewebsites.net');
            let txt = await api.login(this.userId, this.pass);
            let response = JSON.parse(txt);
            console.log(response);
            localStorage.setItem("token", response.token);
            localStorage.setItem("expiry", Date.now());
        },

        getToken() {
            if ((Date.now() - localStorage.getItem("expiry")) > 1000*60*60*24) {
                this.$router.push(Login);
            } else {
                return localStorage.getItem("token");
            }
        },      
        async register() {
            let api = new ServerApi('https://lightengineapp.azurewebsites.net');
            let txt = await api.register(this.userId, this.pass);
            console.log(txt);
        }
    }
}
</script>
<style>

</style>

