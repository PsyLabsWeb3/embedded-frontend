
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from './Snake2048.module.css';
const EmbeddedGame = ()=> {




    const { unityProvider } = useUnityContext({
      loaderUrl: "src/assets/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.loader.js",
      dataUrl: "src/assets/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.data",
      frameworkUrl: "src/assets/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.framework.js",
      codeUrl: "src/assets/Unity/EmbeddedTemplate/Build/EM-12-BackendDLL.wasm",
    });

    return <Unity className={styles.container} unityProvider={unityProvider} />;
};

export default EmbeddedGame;