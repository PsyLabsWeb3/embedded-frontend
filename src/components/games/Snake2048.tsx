import { Unity, useUnityContext } from "react-unity-webgl";
import styles from './Snake2048.module.css';

const Snake2048Game = () => {
  const { unityProvider } = useUnityContext({
    loaderUrl: "/unity/Tanknarok/Tanknarok.loader.js",
    dataUrl: "/unity/Tanknarok/Tanknarok.data.unityweb",
    frameworkUrl: "/unity/Tanknarok/Tanknarok.framework.js.unityweb",
    codeUrl: "/unity/Tanknarok/Tanknarok.wasm.unityweb",
  });

  return <Unity className={styles.container} unityProvider={unityProvider} />;
};

export default Snake2048Game;