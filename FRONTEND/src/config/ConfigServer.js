export var gsUrlApi = "";
export var gsUrlApiS3 = "";
var sAmbiente = "dev";


switch (sAmbiente) {
    case "PRODUCCION":
      
        break;
    default:
        gsUrlApi = 'http://localhost:8090';
        break;
}

