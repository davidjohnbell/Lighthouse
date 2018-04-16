<template>
    <v-list-group value="expand">
        <v-list-tile slot="activator">
            <v-list-tile-content>
                <v-list-tile-title>{{name}}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
            <v-text-field v-model="x" label="X"></v-text-field>
            <v-text-field v-model="y" label="Y"></v-text-field>
            <v-text-field v-model="z" label="Z"></v-text-field>
        </v-list-tile>
        <v-list-tile>
            <v-slider color="red" v-model="red" step="0"></v-slider>
            <v-slider color="green" v-model="green" step="0"></v-slider>
            <v-slider color="blue" v-model="blue" step="0"></v-slider>
        </v-list-tile>
        <v-list-tile>
            <v-slider prepend-icon="wb_sunny" color="yellow" v-model="intensity" step="0"></v-slider>
        </v-list-tile>
    </v-list-group>
</template>

<script>
export default {
    props: {
        name: '',
        GLObject: {},
        number: {}
    },
    data() {
        return {
            x: Math.pow(-1, this.number) * 2,
            y: 3,
            z: -2 + 4 * (this.number < 2),
            red: 100,
            green: 100,
            blue: 100,
            intensity: 10
        }
    },
    methods: {
        describeLight() {
            let light = {};
            light.number = this.number;
            light.x = this.x;
            light.y = this.y;
            light.z = this.z;
            light.red = this.red;
            light.green = this.green;
            light.blue = this.blue;
            light.intensity = this.intensity;
            return light;
        }
    },
    watch: {
        x(newVal) {
            this.GLObject.pointLights[this.number].x = newVal;
            let light = this.describeLight();
            this.$emit('lightChanged', light);
        },
        y(newVal) {
            this.GLObject.pointLights[this.number].y = newVal;
            let light = this.describeLight();
            this.$emit('lightChanged', light);
        },
        z(newVal) {
            this.GLObject.pointLights[this.number].z = newVal;
            let light = this.describeLight();
            this.$emit('lightChanged', light);
        },
        red(newVal) {
            this.GLObject.pointLights[this.number].r = newVal/100;
            let light = this.describeLight();
            this.$emit('lightChanged', light);
        },
        green(newVal) {
            this.GLObject.pointLights[this.number].g = newVal/100;
            let light = this.describeLight();
            this.$emit('lightChanged', light);
        },
        blue(newVal) {
            this.GLObject.pointLights[this.number].b = newVal/100;
            let light = this.describeLight();
            this.$emit('lightChanged', light);
        },
        intensity(newVal) {
            this.GLObject.pointLights[this.number].intensity = newVal;
            let light = this.describeLight();
            this.$emit('lightChanged', light);
        }
    }
}
</script>

<style>

</style>