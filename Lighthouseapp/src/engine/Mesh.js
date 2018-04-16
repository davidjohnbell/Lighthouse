export default class Mesh {
    gl;
    texture;

    texLoaded;
    vertexPositionBuffer;
    vertexNormalBuffer;
    vertexTextureBuffer;
    vertexIndexBuffer;

    vertexPositions;
    vertexNormals;
    vertexTextureCoords;
    indices;

    vertexPositionBufferData;
    vertexNormalBufferData;
    vertexTextureBufferData;
    vertexIndexBufferData;

    constructor(obj, img, pos, gl) {
        this.texLoaded = false;
        this.gl = gl;
        let result = this.doLoadObj(obj);

        this.vertexPositions = result.vertexPositions;
        this.vertexNormals = result.vertexNormals;
        this.vertexTextureCoords = result.vertexTextureCoords;
        this.indices = result.indices;

        this.convertToBufferData();

        this.initTexture(img);
        this.initMesh();
    }

    initTexture(img) {
        this.texture = this.gl.createTexture();
        this.texture.image = new Image();
        this.texture.image.onload = () => {this.handleLoadedTexture()};
        this.texture.image.src = img;
    }

    convertToBufferData() {
        this.vertexPositionBufferData = [];
        this.vertexTextureBufferData = [];
        this.vertexNormalBufferData = [];
        for(var i = 0; i < this.indices.length; i++) {
            var vertexFaceValue = this.indices[i];
            this.vertexPositionBufferData.push(this.vertexPositions[vertexFaceValue * 3]);
            this.vertexPositionBufferData.push(this.vertexPositions[vertexFaceValue * 3 + 1]);
            this.vertexPositionBufferData.push(this.vertexPositions[vertexFaceValue * 3 + 2]);
     
            this.vertexTextureBufferData.push(this.vertexTextureCoords[vertexFaceValue * 2]);
            this.vertexTextureBufferData.push(this.vertexTextureCoords[vertexFaceValue * 2 + 1]);
            
            this.vertexNormalBufferData.push(this.vertexNormals[vertexFaceValue * 3]);
            this.vertexNormalBufferData.push(this.vertexNormals[vertexFaceValue * 3 + 1]);
            this.vertexNormalBufferData.push(this.vertexNormals[vertexFaceValue * 3 + 2]);
        }
        this.vertexIndexBufferData = this.indices;     
    }

    initMesh() {
        this.vertexNormalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexNormalBufferData), this.gl.STATIC_DRAW);
        this.vertexNormalBuffer.itemSize = 3;
        this.vertexNormalBuffer.numItems = this.vertexNormalBufferData.length / 3;

        this.vertexTextureBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTextureBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexTextureBufferData), this.gl.STATIC_DRAW);
        this.vertexTextureBuffer.itemSize = 2;
        this.vertexTextureBuffer.numItems = this.vertexTextureBufferData.length / 2;

        this.vertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexPositionBufferData), this.gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = this.vertexPositionBufferData.length / 3;

        this.vertexIndexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndexBufferData), this.gl.STREAM_DRAW);
        this.vertexIndexBuffer.itemSize = 1;
        this.vertexIndexBuffer.numItems = this.vertexIndexBufferData.length;
    }

    handleLoadedTexture() {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.texture.image);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.texLoaded = true;
    }
    
    doLoadObj(text) {
    let vertexArray = [ ];
    let normalArray = [ ];
    let textureArray = [ ];
    let indexArray = [ ];

    var vertex = [ ];
    var normal = [ ];
    var texture = [ ];
    var facemap = { };
    var index = 0;

    var lines = text.split("\n");
    for (var lineIndex in lines) {
        var line = lines[lineIndex].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");

        // ignore comments
        if (line[0] == "#")
            continue;

        var array = line.split(" ");
        if (array[0] == "v") {
            // vertex
            vertex.push(parseFloat(array[1]));
            vertex.push(parseFloat(array[2]));
            vertex.push(parseFloat(array[3]));
        }
        else if (array[0] == "vt") {
            // normal
            texture.push(parseFloat(array[1]));
            texture.push(parseFloat(array[2]));
        }
        else if (array[0] == "vn") {
            // normal
            normal.push(parseFloat(array[1]));
            normal.push(parseFloat(array[2]));
            normal.push(parseFloat(array[3]));
        }
        else if (array[0] == "f") {
            // face
            if (array.length != 4) {
                //obj.ctx.console.log("*** Error: face '"+line+"' not handled");
                continue;
            }

            for (var i = 1; i < 4; ++i) {
                if (!(array[i] in facemap)) {
                    // add a new entry to the map and arrays
                    var f = array[i].split("/");
                    var vtx, nor, tex;

                    if (f.length == 1) {
                        vtx = parseInt(f[0]) - 1;
                        nor = vtx;
                        tex = vtx;
                    }
                    else if (f.length = 3) {
                        vtx = parseInt(f[0]) - 1;
                        tex = parseInt(f[1]) - 1;
                        nor = parseInt(f[2]) - 1;
                    }
                    else {
                        //obj.ctx.console.log("*** Error: did not understand face '"+array[i]+"'");
                        return null;
                    }

                    // do the vertices
                    var x = 0;
                    var y = 0;
                    var z = 0;
                    if (vtx * 3 + 2 < vertex.length) {
                        x = vertex[vtx*3];
                        y = vertex[vtx*3+1];
                        z = vertex[vtx*3+2];
                    }
                    vertexArray.push(x);
                    vertexArray.push(y);
                    vertexArray.push(z);

                    // do the textures
                    x = 0;
                    y = 0;
                    if (tex * 2 + 1 < texture.length) {
                        x = texture[tex*2];
                        y = texture[tex*2+1];
                    }
                    textureArray.push(x);
                    textureArray.push(y);

                    // do the normals
                    x = 0;
                    y = 0;
                    z = 1;
                    if (nor * 3 + 2 < normal.length) {
                        x = normal[nor*3];
                        y = normal[nor*3+1];
                        z = normal[nor*3+2];
                    }
                    normalArray.push(x);
                    normalArray.push(y);
                    normalArray.push(z);

                    facemap[array[i]] = index++;
                }

                indexArray.push(facemap[array[i]]);
            }
        }
    }

        let result = {};
        result["vertexPositions"] = vertexArray;
        result["vertexNormals"] = normalArray;
        result["vertexTextureCoords"] = textureArray;
        result["indices"] = indexArray;


        return result;
    }

    render(shaderProgram) {
        if (!this.texLoaded) {
            return;
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        this.gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTextureBuffer);
        this.gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(shaderProgram.Sampler, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexIndexBuffer.numItems);
    }
}