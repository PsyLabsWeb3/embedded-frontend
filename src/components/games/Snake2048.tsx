
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from './Snake2048.module.css';
const Snake2048Game = ()=> {




    const { unityProvider } = useUnityContext({
      loaderUrl: "/Snake2048/Build/GITFUSIONTUTNC.loader.js",
      dataUrl: "/Snake2048/Build/GITFUSIONTUTNC.data",
      frameworkUrl: "/Snake2048/Build/GITFUSIONTUTNC.framework.js",
      codeUrl: "/Snake2048/Build/GITFUSIONTUTNC.wasm",
    });
  
    return <Unity className={styles.container} unityProvider={unityProvider} />;
};

export default Snake2048Game;