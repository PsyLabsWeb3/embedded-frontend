
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from './Snake2048.module.css';
const Snake2048Game = ()=> {




    const { unityProvider } = useUnityContext({
      loaderUrl: "/Unity/Snake2048/Build/Snake2048webgl.loader.js",
      dataUrl: "/Unity/Snake2048/Build/Snake2048webgl.data.unityweb",
      frameworkUrl: "/Unity/Snake2048/Build/Snake2048webgl.framework.js.unityweb",
      codeUrl: "/Unity/Snake2048/Build/Snake2048webgl.wasm.unityweb",
    });

    return <Unity className={styles.container} unityProvider={unityProvider} />;
};

export default Snake2048Game;