
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from './Snake2048.module.css';

import loaderUrl from '../../assets/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.loader.js?url';
import dataUrl from '../../assets/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.data?url';
import frameworkUrl from '../../assets/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.framework.js?url';
import codeUrl from '../../assets/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.wasm?url';
const EmbeddedGame = ()=> {

  //New wayof loading game
  const { unityProvider } = useUnityContext({
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
  });

//Normalmente se usa el siguiente codigo para cargar el juego desde public
    // const { unityProvider } = useUnityContext({
    //   loaderUrl: "/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.loader.js",
    //   dataUrl: "/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.data",
    //   frameworkUrl: "/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.framework.js",
    //   codeUrl: "/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.wasm",
    // });

    return <Unity className={styles.container} unityProvider={unityProvider} />;
};

export default EmbeddedGame;