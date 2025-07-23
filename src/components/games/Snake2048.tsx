import { Unity, useUnityContext } from "react-unity-webgl";
import styles from './Snake2048.module.css';

const Snake2048Game = () => {
  const { unityProvider } = useUnityContext({
    loaderUrl: "/unity/Tanknarok/Build/Tanknarok.loader.js",
    dataUrl: "/unity/Tanknarok/Build/Tanknarok.data",
    frameworkUrl: "/unity/Tanknarok/Build/Tanknarok.framework.js",
    codeUrl: "/unity/Tanknarok/Build/Tanknarok.wasm",
  });

  return <Unity className={styles.container} unityProvider={unityProvider} />;
};

export default Snake2048Game;