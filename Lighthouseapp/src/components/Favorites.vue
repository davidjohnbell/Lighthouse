<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap >
            <v-flex xs12 md6 lg4 v-for="i in 3" :key="i">
                <market-card 
                    link="https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg"
                    title="Title" 
                    text="Primary text la la la"></market-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
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