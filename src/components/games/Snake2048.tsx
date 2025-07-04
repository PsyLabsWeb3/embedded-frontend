
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from './Snake2048.module.css';
const Snake2048Game = ()=> {




    const { unityProvider } = useUnityContext({
      loaderUrl: "/Snake2048/Build/GITFUSIONTUT.loader.js",
      dataUrl: "/Snake2048/Build/GITFUSIONTUT.data.br",
      frameworkUrl: "/Snake2048/Build/GITFUSIONTUT.framework.js.br",
      codeUrl: "/Snake2048/Build/GITFUSIONTUT.wasm.br",
    });
  
    return <Unity className={styles.container} unityProvider={unityProvider} />;
};

export default Snake2048Game;