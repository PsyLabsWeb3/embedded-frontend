
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from './Snake2048.module.css';
import loaderUrl from "../../assets/Unity/Snake2048/Build/PlatformerShooter.loader.js?url";
import dataUrl from "../../assets/Unity/Snake2048/Build/PlatformerShooter.data?url";
import frameworkUrl from "../../assets/Unity/Snake2048/Build/PlatformerShooter.framework.js?url";
import codeUrl from "../../assets/Unity/Snake2048/Build/PlatformerShooter.wasm?url";
const Snake2048Game = ()=> {




    const { unityProvider } = useUnityContext({
      loaderUrl,
      dataUrl,
      frameworkUrl,
      codeUrl,
    });

    return <Unity className={styles.container} unityProvider={unityProvider} />;
};

export default Snake2048Game;