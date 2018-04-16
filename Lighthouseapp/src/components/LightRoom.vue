<template>
    <v-container id="test" fill-height>
        <v-layout row>
            <v-flex xs3>
                <v-subheader>Lights</v-subheader>
                <v-list v-for="i in 4" :key="i">
                    <light-list-tile @lightChanged="lightChanged($event)" v-if="initObject !== undefined" :GLObject="initObject" :number="i-1" :name="'Light ' + i"></light-list-tile>
                </v-list>
            </v-flex>
            <v-flex xs9>
                <v-card>
                    <v-card-text>
                        <canvas ref="canvas" width="1280" height="720" id="lightCanvas"></canvas>
                        <v-speed-dial
                            v-model="fab"
                            right
                            fixed
                            direction="left"
                            transition="slide-x-reverse-transition">
                            <v-btn
                                slot="activator"
                                color="blue darken-2"
                                dark
                                fab
                                v-model="fab">
                                <v-icon>account_circle</v-icon>
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-btn
                                fab
                                dark
                                small
                                color="green"
                                @click="saveToServer">
                                <v-icon>save</v-icon>
                            </v-btn>
                            <v-btn
                                fab
                                dark
                                small
                                color="indigo"
                                @click="uploadOBJ">
                                <v-icon>3d_rotation</v-icon>
                            </v-btn>
                            <v-btn
                                fab
                                dark
                                small
                                color="red"
                                @click="uploadTexture">
                                <v-icon>perm_media</v-icon>
                            </v-btn>
                            <v-btn
                                fab
                                dark
                                small
                                color="red"
                                @click="downloadFiles">
                                <v-icon>file_download</v-icon>
                            </v-btn>
                        </v-speed-dial>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import GLinit from '../engine/GLinit'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import obj from '../engine/monkey.obj'
import objImg from '@/assets/stupidity2.gif'
import ServerApi from './ServerApi';

export default {
    data: () => ({
      direction: 'top',
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: 'slide-y-reverse-transition',
      initObject: {},
      objFile: {},
      texFile: {},
      lights: {}
    }),
    mounted() {
        this.objFile = obj;
        this.texFile = objImg;
        this.initObject = new GLinit(this.$refs.canvas, this.objFile, this.texFile);
    },
    computed: {
      activeFab () {
        switch (this.tabs) {
          case 'one': return { 'class': 'purple', icon: 'account_circle' }
          case 'two': return { 'class': 'red', icon: 'edit' }
          case 'three': return { 'class': 'green', icon: 'keyboard_arrow_up' }
          default: return {}
        }
      }
    },
    methods : {
        async saveToServer() {
            let URI = this.$refs.canvas.toDataURL('image/png');
            let serverApi = new ServerApi('https://lightengineapp.azurewebsites.net');
            console.log(localStorage.id);
            console.log(this.getToken());
            //localStorage.id = undefined;
            //if (localStorage.id !== undefined) {
            //    serverApi.updateLighthouse(this.getToken(), localStorage.id, null, this.texFile, URI, this.objFile);
            //} else {
                let txt = await serverApi.createLighthouse(this.getToken(), '{}', this.texFile, URI, this.objFile);
                let value = JSON.parse(txt);
                console.log(value);
                localStorage.id = value._id;
            //}
        },
        getToken() {
            console.log('Light room token check');
            if ((Date.now() - localStorage.expiry) > 1000*60*60*24) {
                this.$router.push(Login);
            } else {
                return localStorage.token;
            }
        },
        lightChanged(light) {
            this.lights['Light' + light.number.toString()] = light; //obj['a'] = 1 -> obj.a = 1
        },
        uploadOBJ() {
            let link = document.createElement("input");
            link.setAttribute("type", "file");
            document.body.appendChild(link);
            link.click();
            link.onchange = this.OBJUploaded
            document.body.removeChild(link);
        },
        OBJUploaded(evt) {
            let reader = new FileReader();
            if (evt.target !== null)
                reader.readAsText(evt.target.files[0], "UTF-8");
            else
                reader.readAsText(evt.path[0].files[0], "UTF-8");
            reader.onload = this.newModel;
        },
        newModel(evt) {
            this.objFile = evt.target.result;
            this.initObject = new GLinit(this.$refs.canvas, evt.target.result, this.texFile);
        },
        uploadTexture() {
            var link = document.createElement("input");
            link.setAttribute("type", "file");
            document.body.appendChild(link);
            link.click();
            link.onchange = this.textureUploader
            document.body.removeChild(link);
        },
        textureUploader(evt) {
            let reader = new FileReader();
            if (evt.target !== null)
                reader.readAsDataURL(evt.target.files[0]);
            else
                reader.readAsDataURL(evt.path[0].files[0]);
            reader.onload = this.newTexture
        },
        newTexture(evt) {
            this.texFile = evt.target.result;
            this.initObject = new GLinit(this.$refs.canvas, this.objFile, evt.target.result);
        },
        downloadFiles() {
            var zip = new JSZip();
            zip.file("model.obj", this.objFile);
            img.file("texture.gif", this.texFile);
            zip.generateAsync({type:"blob"}).then(function(content) {
                FileSaver.saveAs(content, "LighthouseModel.zip");
            });
        },
        getToken() {
            return localStorage.getItem("token");
        }
    }
}
</script>

<style>

</style>