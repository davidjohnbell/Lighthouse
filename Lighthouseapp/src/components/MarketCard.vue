<template>
    <v-card raised >
        <v-card-media :src="link" height="200"></v-card-media>
        <v-card-title class="grey--text">
            <div>
                <span class="headline black--text">{{title}}</span><br>
                <span>{{text}}</span><br>
            </div>
        </v-card-title>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>favorite</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>edit</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props:{
        title:'',
        text: '',
        link: ''
    },
    data() {
        return {
            path: require('../assets/stupidity2.gif')
        }
    },
    mounted() {
        getToken();
    },
    methods: {
        getToken() {
            if ((Date.now() - localStorage.expiry) > 1000*60*60*24) {
                this.$router.push(Login);
            } else {
                return localStorage.token;
            }
        }
    }
}
</script>

<style>

</style>
