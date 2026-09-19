import { useGLTF } from "@react-three/drei";

// Par defaut drei charge le decodeur Draco depuis gstatic.com (Google). On le sert
// depuis /draco/ : aucun appel tiers, indispensable pour le miroir Tor.
// A importer AVANT tout appel a useGLTF / useGLTF.preload.
useGLTF.setDecoderPath("/draco/");
