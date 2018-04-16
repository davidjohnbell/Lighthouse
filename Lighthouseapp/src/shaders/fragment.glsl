precision mediump float;

const int MAX_POINT_LIGHTS = 4;
const int MAX_SPOT_LIGHTS = 4;

varying vec2 texCoord0;
varying vec3 normal0;
varying vec3 worldPos0;

struct BaseLight
{
    vec3 color;
    float intensity;
};

struct DirectionalLight
{
    BaseLight base;
    vec3 direction;
};

struct Attenuation
{
    float constant;
    float linear;
    float exponent;
};

struct PointLight
{
    BaseLight base;
    Attenuation atten;
    vec3 position;
    float range;
};

struct SpotLight
{
    PointLight pointLight;
    vec3 direction;
    float cutoff;
};

uniform vec3 baseColor;
uniform vec3 eyePos;
uniform vec3 ambientLight;
uniform sampler2D Sampler;

uniform float specularIntensity;
uniform float specularPower;

uniform DirectionalLight directionalLight;
uniform PointLight pointLight0;
uniform PointLight pointLight1;
uniform PointLight pointLight2;
uniform PointLight pointLight3;
uniform SpotLight spotLight0;
uniform SpotLight spotLight1;
uniform SpotLight spotLight2;
uniform SpotLight spotLight3;

vec4 calcLight(BaseLight base, vec3 direction, vec3 normal)
{
    float diffuseFactor = dot(normal, -direction);
    
    vec4 diffuseColor = vec4(0,0,0,0);
    vec4 specularColor = vec4(0,0,0,0);
    
    if(diffuseFactor > 0.0)
    {
        diffuseColor = vec4(base.color, 1.0) * base.intensity * diffuseFactor;
        
        vec3 directionToEye = normalize(eyePos - worldPos0);
        vec3 reflectDirection = normalize(reflect(direction, normal));
        
        float specularFactor = dot(directionToEye, reflectDirection);
        specularFactor = pow(specularFactor, specularPower);
        
        if(specularFactor > 0.0)
        {
            specularColor = vec4(base.color, 1.0) * specularIntensity * specularFactor;
        }
    }
    
    return diffuseColor + specularColor;
}

vec4 calcDirectionalLight(DirectionalLight directionalLight, vec3 normal)
{
    return calcLight(directionalLight.base, -directionalLight.direction, normal);
}

vec4 calcPointLight(PointLight pointLight, vec3 normal)
{
    vec3 lightDirection = worldPos0 - pointLight.position;
    float distanceToPoint = length(lightDirection);
    
    if(distanceToPoint > pointLight.range)
        return vec4(0,0,0,0);
    
    lightDirection = normalize(lightDirection);
    
    vec4 color = calcLight(pointLight.base, lightDirection, normal);
    
    float attenuation = pointLight.atten.constant +
                         pointLight.atten.linear * distanceToPoint +
                         pointLight.atten.exponent * distanceToPoint * distanceToPoint +
                         0.0001;
                         
    return color / attenuation;
}

vec4 calcSpotLight(SpotLight spotLight, vec3 normal)
{
    vec3 lightDirection = normalize(worldPos0 - spotLight.pointLight.position);
    float spotFactor = dot(lightDirection, spotLight.direction);
    
    vec4 color = vec4(0,0,0,0);
    
    if(spotFactor > spotLight.cutoff)
    {
        color = calcPointLight(spotLight.pointLight, normal) *
                (1.0 - (1.0 - spotFactor)/(1.0 - spotLight.cutoff));
    }
    
    return color;
}

void main()
{ 
    vec4 totalLight = vec4(ambientLight,1);
    vec4 color = vec4(baseColor, 1);
    vec4 textureColor = texture2D(Sampler, texCoord0.xy);
    
    if(textureColor != vec4(0,0,0,0))
        color *= textureColor;
    
    vec3 normal = normalize(normal0);
    
    totalLight += calcDirectionalLight(directionalLight, normal);
    
    if(pointLight0.base.intensity > 0.0)
        totalLight += calcPointLight(pointLight0, normal);
    if(pointLight1.base.intensity > 0.0)
        totalLight += calcPointLight(pointLight1, normal);
    if(pointLight2.base.intensity > 0.0)
        totalLight += calcPointLight(pointLight2, normal);
    if(pointLight3.base.intensity > 0.0)
        totalLight += calcPointLight(pointLight3, normal);

    if(spotLight0.pointLight.base.intensity > 0.0)
        totalLight += calcSpotLight(spotLight0, normal);
    if(spotLight1.pointLight.base.intensity > 0.0)
        totalLight += calcSpotLight(spotLight1, normal);
    if(spotLight2.pointLight.base.intensity > 0.0)
        totalLight += calcSpotLight(spotLight2, normal);
    if(spotLight3.pointLight.base.intensity > 0.0)
        totalLight += calcSpotLight(spotLight3, normal);
    
    gl_FragColor = color * totalLight;
}